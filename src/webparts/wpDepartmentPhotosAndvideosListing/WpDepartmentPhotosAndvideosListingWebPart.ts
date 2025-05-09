import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'WpDepartmentPhotosAndvideosListingWebPartStrings';
// import { SPComponentLoader } from '@microsoft/sp-loader';
import DepatmentPhotoandVideo from './DepartmentPhotoandVideo'
import { ResourceUrl, SiteName } from '../GlobalVariable';
import GlobalVideoExtensions from '../GlobalVideoExtensions';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http-base';
export interface IWpDepartmentPhotosAndvideosListingWebPartProps {
  description: string;
}
export interface ISPList {
  FileLeafRef: string;
  ServerRelativeUrl: string;
}
export default class WpDepartmentPhotosAndvideosListingWebPart extends BaseClientSideWebPart<IWpDepartmentPhotosAndvideosListingWebPartProps> {

  private _ResourceUrl: string = ResourceUrl;
  public listName = "DepartmentPhotosAndVideosGallery";
  public ImgList: HTMLDivElement;
  public allElementsHtml:any=""
  private siteName: string = SiteName;
  
  protected onInit(): Promise<void> {
    return super.onInit();   
  }  

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
                display: none; /* Hide all slides by default */
                justify-content: center;
                align-items: center;
                height: 80vh;
              }
              .swiper-slide:nth-child(${index + 1}) {
                display: flex !important; /* Show only the clicked slide initially */
              }
              .swiper-media {
                max-width: 90%;
                max-height: 80vh;
                object-fit: contain;
              }
              /* This style will be removed once Swiper initializes */
              .swiper-initialized .swiper-slide {
                display: flex !important;
              }
            </style>
            <div class="swiper-wrapper">
              ${swiperSlides.join('')}
            </div>
            <div class="swiper-button-prev" style="top: 50%; transform: translateY(-50%); width: auto; height: auto; background: none;">
              <img src="${this._ResourceUrl}/images/icons/readmore.png" alt="Prev" style="cursor: pointer; transform: rotate(180deg); opacity: 0.7;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'" />
            </div>
            <div class="swiper-button-next" style="top: 50%; transform: translateY(-50%); width: auto; height: auto; background: none;">
              <img src="${this._ResourceUrl}/images/icons/readmore.png" alt="Next" style="cursor: pointer; opacity: 0.7;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'" />
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
  
        // Initialize Swiper
        setTimeout(() => {
          const swiperInstance = new (window as any).Swiper('.mySwiper', {
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
  
          // Add keyboard event listener
          document.addEventListener('keydown', handleKeyDown);
  
          function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'ArrowLeft') {
              swiperInstance.slidePrev();
            } else if (e.key === 'ArrowRight') {
              swiperInstance.slideNext();
            } else if (e.key === 'Escape') {
              closeModal();
            }
          }
  
          // Clean up event listener when modal is closed
          const closeModal = () => {
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
            document.removeEventListener('keydown', handleKeyDown);
          };
  
          // Update close button to also remove the keydown listener
          document.querySelectorAll('[data-bs-dismiss="modal"]').forEach(closeBtn => {
            closeBtn.addEventListener('click', closeModal);
          });
        }, 100);
      });
    });
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
    const queryStringParams: any = this.getQueryStringParameters();
    // Access specific query string parameters
    let dept: string = queryStringParams['dept'];

    try {
      const apiUrl =` ${this.context.pageContext.web.absoluteUrl}/${dept}/_api/web/lists/getbytitle('${this.listName}')/items?$select=FileLeafRef,File/ServerRelativeUrl&$expand=File&$orderby=Created desc`;
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
    const container: HTMLElement | null = this.domElement.querySelector('#deptPhotoVideoListings');
  
    if (!container) {
      console.error("DepatmentPhotoandVideo element not found in DOM.");
      return;
    }
  
    if (files.length === 0) {
      container.innerHTML = DepatmentPhotoandVideo.noRecord;
      return;
    }
  
    const allVideoExtensions = GlobalVideoExtensions.AllVideoExtensions;
  
    files.forEach(file => {
      const fileUrl = file.ServerRelativeUrl;
      const extension = fileUrl.split('.').pop()?.toLowerCase();
      let isVideo = false;
      let mediaHtml = "";
  
      for (const vid of allVideoExtensions) {
        if (extension === vid.VideoExtension.toLowerCase()) {
          mediaHtml = DepatmentPhotoandVideo.deptVideoElementHtml.replace(
            "__KEY_URL_DEPTVIDEOGALLERY__",  `${window.location.origin}${fileUrl}`
          );
          isVideo = true;
          break;
        }
      }
  
      if (!isVideo) {
        mediaHtml = DepatmentPhotoandVideo.deptImageElementHtml.replace(
          "_KEY_DEPTIMAGE_URL",`${window.location.origin}${fileUrl}`
        );
      }
  
      mediaHtml = mediaHtml.replace("_KEY_IMAGE_TITLE", file.FileLeafRef);
      mediaHtml = mediaHtml.replace("__KEY_IMG_FOLDERNAME__", file.FileLeafRef.split('.')[0] || "");
  
      this.allElementsHtml += mediaHtml;
    });
  
    this.allElementsHtml = this.allElementsHtml.replace(
      new RegExp("__KEY_URL_RESOURCE__", 'g'),
      this._ResourceUrl
    );
  
    this.ImgList.innerHTML = this.allElementsHtml;
  }

  public render(): void {
    //this.loadCSS(); 
    const queryStringParams: any = this.getQueryStringParameters();
    // Access specific query string parameters
    let dept: string = queryStringParams['dept'];

    try {

      DepatmentPhotoandVideo.html = DepatmentPhotoandVideo.html.replace(    new RegExp("__KEY_URL_RESOURCE__", 'g'),this._ResourceUrl)
      .replace("__KEY_DEPT_NAME__",dept).replace("__KEY_SITE_NAME__",this.siteName);
      this.domElement.innerHTML = DepatmentPhotoandVideo.html;  
      this.ImgList = this.domElement.querySelector("#deptPhotoVideoListings") as HTMLDivElement;

      this._renderListItems();    
      setTimeout(() => this._bindMediaClickHandlers(), 500);
      
    } catch (error) {
      console.log(error);
    }
    const workbenchContent = document.getElementById('workbenchPageContent'); 

  if (workbenchContent) { 

    workbenchContent.style.maxWidth = 'none'; 

  } 

  // -----------------------------------------------MODAL-----------------------------------------------
  // document.addEventListener("click", function (event) {
  //   const target = event.target as HTMLElement;
  
  //   if (target && target.classList.contains("photo-listing-img")) {
  //     const imageUrl = target.getAttribute("src"); // or use data attribute if needed
  //     const modalImg = document.getElementById("modal-image-preview") as HTMLImageElement;
  
  //     if (modalImg && imageUrl) {
  //       modalImg.src = imageUrl;
  //     }

  //     const videoUrl = target.getAttribute("src"); // or use data attribute if needed
  //     const modalvideo = document.getElementById("modal-video-preview") as HTMLImageElement;
  
  //     if (modalvideo && videoUrl) {
  //       modalvideo.src = videoUrl;
  //     }
  
  //     const modal = document.getElementById("photo-video-modal");
  //     if (modal) {
  //       // Manually add Bootstrap modal classes to simulate showing
  //       modal.classList.add("show");
  //       modal.style.display = "block";
  //       modal.removeAttribute("aria-hidden");
  //       modal.setAttribute("aria-modal", "true");
  
  //       // Add backdrop manually
  //       let backdrop = document.createElement("div");
  //       backdrop.className = "modal-backdrop fade show";
  //       backdrop.id = "custom-modal-backdrop";
  //       document.body.appendChild(backdrop);
  
  //       // Disable scroll
  //       document.body.classList.add("modal-open");
  //     }
  //   }
  // });
  // document.addEventListener("click", function (event) {
  //   const target = event.target as HTMLElement;
  //   if (!target || !target.classList.contains("photo-listing-img")) return;
  
  //   const modal = document.getElementById("photo-video-modal");
  //   const modalImg = document.getElementById("modal-image-preview") as HTMLImageElement;
  //   const modalVideo = document.getElementById("modal-video-preview") as HTMLVideoElement;
  
  //   const tag = target.tagName.toLowerCase();
  //   if (tag === "img" && modalImg) {
  //     const imageUrl = (target as HTMLImageElement).src;
  //     modalImg.src = imageUrl;
  //     modalImg.style.display = "block";
  //     modalImg.style.margin = "0 auto";
  //     modalImg.style.maxWidth = "100%";
  //     modalImg.style.maxHeight = "80vh";
  //     modalImg.style.display = "block";
  
  //     if (modalVideo) {
  //       modalVideo.pause();
  //       modalVideo.style.display = "none";
  //     }
  //   }
  
  //   if (tag === "video" && modalVideo) {
  //     const videoSource = (target as HTMLVideoElement).querySelector("source");
  //     const videoUrl = videoSource?.getAttribute("src") || "";
  //     modalVideo.src = videoUrl;
  //     modalVideo.style.display = "block";
  //     modalVideo.style.margin = "0 auto";
  //     modalVideo.style.maxWidth = "100%";
  //     modalVideo.style.maxHeight = "80vh";
  //     modalVideo.play();
  
  //     if (modalImg) {
  //       modalImg.style.display = "none";
  //     }
  //   }
  
  //   if (modal) {
  //     modal.classList.add("show");
  //     modal.style.display = "block";
  //     modal.removeAttribute("aria-hidden");
  //     modal.setAttribute("aria-modal", "true");
  
  //     // Add backdrop manually
  //     let backdrop = document.createElement("div");
  //     backdrop.className = "modal-backdrop fade show";
  //     backdrop.id = "custom-modal-backdrop";
  //     document.body.appendChild(backdrop);
  
  //     document.body.classList.add("modal-open");
  //   }
  // });
  
  // Handle modal close (clicking the close icon)
  // document.addEventListener("click", function (event) {
  //   const target = event.target as HTMLElement;
  //   if (target && target.classList.contains("modal-close-icon")) {
  //     const modal = document.getElementById("photo-video-modal");
  //     const backdrop = document.getElementById("custom-modal-backdrop");
  
  //     if (modal) {
  //       modal.classList.remove("show");
  //       modal.style.display = "none";
  //       modal.removeAttribute("aria-modal");
  //       modal.setAttribute("aria-hidden", "true");
  //     }
  
  //     if (backdrop) {
  //       backdrop.remove();
  //     }
  
  //     // Restore scroll
  //     document.body.classList.remove("modal-open");
  //   }
  // });
  
  
  }

  // private method extracts query string parameters from the current URL and returns as an object.
  private getQueryStringParameters(): any {
    const queryStringParams: any = {};
    const queryString = window.location.search;

    if (queryString) {
        const queryParams = queryString.substring(1).split('&');
        // Iterate through each parameter and extract its key-value pair
        queryParams.forEach(param => {
            const [key, value] = param.split('=');
            queryStringParams[key] = value;
        });
    }
    return queryStringParams;
  }

  // private loadHome():void{
  //   SPComponentLoader.loadScript(`/sites/IntranetPortal-Dev/SiteAssets/resources/js/common.js`);
  //   SPComponentLoader.loadScript(`/sites/IntranetPortal-Dev/SiteAssets/resources/js/home.js`);        
  // }

  // private loadCSS(): void {
  
  //     SPComponentLoader.loadCss(`${this._ResourceUrl}/css/sp-custom.css`);
  //     SPComponentLoader.loadScript(`${this._ResourceUrl}/js/jquery-3.6.0.js`);
  //     SPComponentLoader.loadScript(`${this._ResourceUrl}/js/jquery-ui.js`);
  //     SPComponentLoader.loadScript(`${this._ResourceUrl}/js/swiper-bundle.min.js`);
  //     SPComponentLoader.loadCss(`${this._ResourceUrl}/css/bootstrap.min.css`);
  //     SPComponentLoader.loadScript(`${this._ResourceUrl}/js/bootstrap.bundle.min.js`);

  //     SPComponentLoader.loadCss(`${this._ResourceUrl}/css/swiper-bundle.min.css`);  
  //     SPComponentLoader.loadCss(`${this._ResourceUrl}/css/jquery-ui.css`);
  //     SPComponentLoader.loadCss(`${this._ResourceUrl}/css/variable.css`);
  //     SPComponentLoader.loadCss(`${this._ResourceUrl}/css/news.css`);
  //     SPComponentLoader.loadCss(`${this._ResourceUrl}/css/custom.css`);
  //     SPComponentLoader.loadCss(`${this._ResourceUrl}/css/home.css`);
  //     SPComponentLoader.loadCss(`${this._ResourceUrl}/css/photo-listing.css`);
    

  //         setTimeout(this.loadHome,1000);

  // }
  
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
