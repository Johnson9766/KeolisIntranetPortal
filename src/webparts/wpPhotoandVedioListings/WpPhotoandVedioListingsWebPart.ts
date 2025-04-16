import { Version } from '@microsoft/sp-core-library';
import { SPComponentLoader } from '@microsoft/sp-loader';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
// import type { IReadonlyTheme } from '@microsoft/sp-component-base';
// import { escape } from '@microsoft/sp-lodash-subset';

// import styles from './WpPhotoandVedioListingsWebPart.module.scss';
import * as strings from 'WpPhotoandVedioListingsWebPartStrings';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import photoVideoListings from './KeolisPhotoandVedioListings';
import { _DivMessage, _ResourceUrl } from '../GlobalVariable';
// import GlobalImageExtensions from '../GlobalImageExtensions';
import GlobalVideoExtensions from '../GlobalVideoExtensions';

export interface IWpPhotoandVedioListingsWebPartProps {
  description: string;
}
export interface ISPList {
  FileLeafRef: string;
  ServerRelativeUrl: string;
}


export default class WpPhotoandVedioListingsWebPart extends BaseClientSideWebPart<IWpPhotoandVedioListingsWebPartProps> {

  private _ResourceUrl: string = '/sites/IntranetPortal-Dev/SiteAssets/resources';
  public listName = "PhotosAndVideosGallery";
  public ImgList: HTMLDivElement;
  public allElementsHtml:any=""

   
  public render(): void {
    this.loadCSS(); 
    try {

      photoVideoListings.html = photoVideoListings.html.replace(
        new RegExp("__KEY_URL_RESOURCE__", 'g'),
        this._ResourceUrl
      );
      
      this.domElement.innerHTML = photoVideoListings.html;  
      this.ImgList = this.domElement.querySelector("#photoVideoListings") as HTMLDivElement;

      this._renderListItems();    
      setTimeout(() => this._bindMediaClickHandlers(), 500);
    } catch (error) {
      console.log(error);
    }
    const workbenchContent = document.getElementById('workbenchPageContent'); 

  if (workbenchContent) { 

    workbenchContent.style.maxWidth = 'none'; 

  } 


  }
  // private _bindMediaClickHandlers(): void {
  //   const mediaElements = this.domElement.querySelectorAll('.photo-listing-img');
  
  //   mediaElements.forEach(el => {
  //     el.addEventListener('click', (e) => {
  //       const target = e.currentTarget as HTMLElement;
  //       let src = target.getAttribute('src') || '';
  
  //       let mediaHtml = '';
  
  //       if (target.tagName.toLowerCase() === 'img') {
  //         mediaHtml = `<img src="${src}" class="img-fluid" />`;
  //       } else if (target.tagName.toLowerCase() === 'video') {
  //         const source = target.querySelector('source');
  //         if (source) {
  //           src = source.getAttribute('src') || '';
  //         }
  //         mediaHtml = `
  //           <video class="w-100" controls autoplay loop muted style="max-height: 80vh;">
  //             <source src="${src}" type="video/mp4">
  //             Your browser does not support the video tag.
  //           </video>
  //         `;
  //       }
  
  //       const container = document.getElementById('modal-media-container');
  //       if (container) {
  //         container.innerHTML = mediaHtml;
  //       }
  
  //       // Native Bootstrap trigger using data attributes
  //       const modalEl = document.getElementById('photo-video-modal');
  //       if (modalEl) {
  //         modalEl.classList.add('show');
  //         modalEl.style.display = 'block';
  //         modalEl.removeAttribute('aria-hidden');
  //         modalEl.setAttribute('aria-modal', 'true');
  //         document.body.classList.add('modal-open');
  //         document.body.insertAdjacentHTML('beforeend', '<div class="modal-backdrop fade show"></div>');
  //       }
  //     });
  //   });
  
  //   // Optional: close modal cleanup if not using Bootstrap JS
  //   document.querySelectorAll('[data-bs-dismiss="modal"]').forEach(closeBtn => {
  //     closeBtn.addEventListener('click', () => {
  //       const modalEl = document.getElementById('photo-video-modal');
  //       const backdrop = document.querySelector('.modal-backdrop');
  //       if (modalEl) {
  //         modalEl.classList.remove('show');
  //         modalEl.style.display = 'none';
  //         modalEl.setAttribute('aria-hidden', 'true');
  //         modalEl.removeAttribute('aria-modal');
  //         document.body.classList.remove('modal-open');
  //       }
  //       if (backdrop) backdrop.remove();
  //     });
  //   });
  // }

  
  private _bindMediaClickHandlers(): void {
    const mediaElements = this.domElement.querySelectorAll('.photo-listing-img');
  
    const swiperSlides: string[] = [];
    mediaElements.forEach(el => {
      const src = el.getAttribute('src') || '';
      if (el.tagName.toLowerCase() === 'img') {
        swiperSlides.push(`<div class="swiper-slide"><img src="${src}" class="img-fluid swiper-media" /></div>`);
      } else if (el.tagName.toLowerCase() === 'video') {
        const source = el.querySelector('source');
        const videoSrc = source ? source.getAttribute('src') : '';
        swiperSlides.push(`
          <div class="swiper-slide">
            <video class="swiper-media" controls autoplay loop muted style="max-height: 80vh; width: 100%;">
              <source src="${videoSrc}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
        `);
      }
    });
  
    mediaElements.forEach((el, index) => {
      el.addEventListener('click', () => {
        const swiperContainerHtml = `
          <div class="swiper mySwiper position-relative">
            <style>
              .swiper-button-next::after,
              .swiper-button-prev::after {
                display: none !important;
              }
              .swiper-slide {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 80vh; /* Ensure the slide takes the full viewport height */
              }
              .swiper-media {
                max-width: 90%; /* Adjust for responsiveness */
                max-height: 80vh;
                object-fit: contain; /* Ensures the image/video maintains its aspect ratio */
              }
            </style>
            <div class="swiper-wrapper">
              ${swiperSlides.join('')}
            </div>
            <div class="swiper-button-prev" style="top: 50%; transform: translateY(-50%); width: auto; height: auto; background: none;">
              <img src="${this._ResourceUrl}/images/icons/readmore.png" alt="Prev" style=" cursor: pointer; transform: rotate(180deg); opacity: 0.7;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'" />
            </div>
            <div class="swiper-button-next" style="top: 50%; transform: translateY(-50%); width: auto; height: auto; background: none;">
              <img src="${this._ResourceUrl}/images/icons/readmore.png" alt="Next" style=" cursor: pointer; opacity: 0.7;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'" />
            </div>
          </div>
        `;
  
        const container = document.getElementById('modal-media-container');
        if (container) {
          container.innerHTML = swiperContainerHtml;
        }
  
        const modalEl = document.getElementById('photo-video-modal');
        if (modalEl) {
          modalEl.classList.add('show');
          modalEl.style.display = 'block';
          modalEl.removeAttribute('aria-hidden');
          modalEl.setAttribute('aria-modal', 'true');
          document.body.classList.add('modal-open');
          document.body.insertAdjacentHTML('beforeend', '<div class="modal-backdrop fade show"></div>');
        }
  
        // Init Swiper inside the modal
        // setTimeout(() => {
        //   new (window as any).Swiper('.mySwiper', {
        //     loop: true,
        //     initialSlide: index,
        //     navigation: {
        //       nextEl: '.swiper-button-next',
        //       prevEl: '.swiper-button-prev',
        //     }
        //   });
        // }, 100);
        setTimeout(() => {
          new (window as any).Swiper('.mySwiper', {
            loop: false,
            initialSlide: index,
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
            on: {
              init: function () {
                toggleNavButtons(this);
              },
              slideChange: function () {
                toggleNavButtons(this);
              }
            }
          });
          
        
          function toggleNavButtons(swiperInstance: any) {
            const prevBtn = document.querySelector('.swiper-button-prev') as HTMLElement;
            const nextBtn = document.querySelector('.swiper-button-next') as HTMLElement;
        
            if (!prevBtn || !nextBtn) return;
        
            const isFirst = swiperInstance.activeIndex === 0;
            const isLast = swiperInstance.activeIndex === swiperInstance.slides.length - 1;
        
            prevBtn.style.display = isFirst ? 'none' : 'block';
            nextBtn.style.display = isLast ? 'none' : 'block';
          }
        }, 100);
        
      });
    });
  
    // Handle modal close
    document.querySelectorAll('[data-bs-dismiss="modal"]').forEach(closeBtn => {
      closeBtn.addEventListener('click', () => {
        const modalEl = document.getElementById('photo-video-modal');
        const backdrop = document.querySelector('.modal-backdrop');
        if (modalEl) {
          modalEl.classList.remove('show');
          modalEl.style.display = 'none';
          modalEl.setAttribute('aria-hidden', 'true');
          modalEl.removeAttribute('aria-modal');
          document.body.classList.remove('modal-open');
        }
        if (backdrop) backdrop.remove();
      });
    });
  }
  
  
  
  
  
  private loadHome():void{

    SPComponentLoader.loadScript(`/sites/IntranetPortal-Dev/SiteAssets/resources/js/common.js`);
    SPComponentLoader.loadScript(`/sites/IntranetPortal-Dev/SiteAssets/resources/js/home.js`);        
  }

    private loadCSS(): void {
    
        SPComponentLoader.loadCss(`${this._ResourceUrl}/css/sp-custom.css`);
        SPComponentLoader.loadScript(`${this._ResourceUrl}/js/jquery-3.6.0.js`);
        SPComponentLoader.loadScript(`${this._ResourceUrl}/js/jquery-ui.js`);
        SPComponentLoader.loadScript(`${this._ResourceUrl}/js/swiper-bundle.min.js`);
        SPComponentLoader.loadCss(`${this._ResourceUrl}/css/bootstrap.min.css`);
        SPComponentLoader.loadScript(`${this._ResourceUrl}/js/bootstrap.bundle.min.js`);

        SPComponentLoader.loadCss(`${this._ResourceUrl}/css/swiper-bundle.min.css`);  
        SPComponentLoader.loadCss(`${this._ResourceUrl}/css/jquery-ui.css`);
        SPComponentLoader.loadCss(`${this._ResourceUrl}/css/variable.css`);
        SPComponentLoader.loadCss(`${this._ResourceUrl}/css/news.css`);
        SPComponentLoader.loadCss(`${this._ResourceUrl}/css/custom.css`);
        SPComponentLoader.loadCss(`${this._ResourceUrl}/css/home.css`);
        SPComponentLoader.loadCss(`${this._ResourceUrl}/css/photo-listing.css`);
      

            setTimeout(this.loadHome,1000);

    }

  private async _renderListItems(): Promise<void> {
    try {
      const libraryItems: any[] = await this._getLibraryFiles();
      this._renderFilesToHTML(libraryItems);
    } catch (error) {
      console.error('Error rendering library files:', error);
    }
  }

  private async _getLibraryFiles(): Promise<ISPList[]> {
    const items: ISPList[] = [];
  
    try {
      const apiUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${this.listName}')/items?$select=FileLeafRef,File/ServerRelativeUrl&$expand=File`;
  
      const response: SPHttpClientResponse = await this.context.spHttpClient.get(
        apiUrl,
        SPHttpClient.configurations.v1
      );
  
      if (response.ok) {
        const data = await response.json();
        for (const item of data.value) {
          if (item.File && item.File.ServerRelativeUrl) {
            items.push({
              FileLeafRef: item.FileLeafRef,
              ServerRelativeUrl: item.File.ServerRelativeUrl
            });
          }
        }
      } else {
        console.error('Failed to fetch library items:', response.statusText);
      }
    } catch (error) {
      console.error('Error getting library files:', error);
    }
  
    return items;
  }

  private _renderFilesToHTML(files: ISPList[]): void {
    this.allElementsHtml = "";
    const container: HTMLElement | null = this.domElement.querySelector('#photoVideoListings');
  
    if (!container) {
      console.error("photoVideoListings element not found in DOM.");
      return;
    }
  
    if (files.length === 0) {
      container.innerHTML = photoVideoListings.noRecord;
      return;
    }
  
    const allVideoExtensions = GlobalVideoExtensions.AllVideoExtensions;
  
    files.forEach(file => {
      const fileUrl = file.ServerRelativeUrl;
      // const absoluteFileUrl = this.context.pageContext.web.absoluteUrl + fileUrl;

      const extension = fileUrl.split('.').pop()?.toLowerCase();
      let isVideo = false;
      let mediaHtml = "";
    
      for (const vid of allVideoExtensions) {
        if (extension === vid.VideoExtension.toLowerCase()) {
          mediaHtml = photoVideoListings.videoElementHtml.replace(
            "__KEY_URL_VIDEOGALLERY__", `${window.location.origin}${fileUrl}`);
          isVideo = true;
          break;
        }
      }
  
      if (!isVideo) {
        mediaHtml = photoVideoListings.imageElementHtml.replace(
          "_KEY_IMAGE_URL", `${window.location.origin}${fileUrl}`);
      }
  
      mediaHtml = mediaHtml.replace("_KEY_IMAGE_TITLE", file.FileLeafRef);
      // mediaHtml = mediaHtml.replace("__KEY_IMG_FOLDERNAME__", file.FileLeafRef.split('.')[0] || "");
  
      this.allElementsHtml += mediaHtml;
    });
  
    this.allElementsHtml = this.allElementsHtml.replace(
      new RegExp("__KEY_URL_RESOURCE__", 'g'),
      this._ResourceUrl
    );
    
  
    this.ImgList.innerHTML = this.allElementsHtml;
  }

  protected onInit(): Promise<void> {
    return super.onInit();   

  } 
  
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
