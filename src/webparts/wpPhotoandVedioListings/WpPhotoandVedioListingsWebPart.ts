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
      
    } catch (error) {
      console.log(error);
    }
    const workbenchContent = document.getElementById('workbenchPageContent'); 

  if (workbenchContent) { 

    workbenchContent.style.maxWidth = 'none'; 

  } 

  // -----------------------------------------------MODAL-----------------------------------------------

  document.addEventListener("click", function (event) {
    const target = event.target as HTMLElement;
    if (!target || !target.classList.contains("photo-listing-img")) return;
  
    const modal = document.getElementById("photo-video-modal");
    const modalImg = document.getElementById("modal-image-preview") as HTMLImageElement;
    const modalVideo = document.getElementById("modal-video-preview") as HTMLVideoElement;
  
    const tag = target.tagName.toLowerCase();
    if (tag === "img" && modalImg) {
      const imageUrl = (target as HTMLImageElement).src;
      modalImg.src = imageUrl;
      modalImg.style.display = "block";
      modalImg.style.margin = "0 auto";
      modalImg.style.maxWidth = "100%";
      modalImg.style.maxHeight = "80vh";
      modalImg.style.display = "block";
  
      if (modalVideo) {
        modalVideo.pause();
        modalVideo.style.display = "none";
      }
    }
  
    if (tag === "video" && modalVideo) {
      const videoSource = (target as HTMLVideoElement).querySelector("source");
      const videoUrl = videoSource?.getAttribute("src") || "";
      modalVideo.src = videoUrl;
      modalVideo.style.display = "block";
      modalVideo.style.margin = "0 auto";
      modalVideo.style.maxWidth = "100%";
      modalVideo.style.maxHeight = "80vh";
      modalVideo.play();
  
      if (modalImg) {
        modalImg.style.display = "none";
      }
    }
  
    if (modal) {
      modal.classList.add("show");
      modal.style.display = "block";
      modal.removeAttribute("aria-hidden");
      modal.setAttribute("aria-modal", "true");
  
      // Add backdrop manually
      let backdrop = document.createElement("div");
      backdrop.className = "modal-backdrop fade show";
      backdrop.id = "custom-modal-backdrop";
      document.body.appendChild(backdrop);
  
      document.body.classList.add("modal-open");
    }
  });
  
  // Handle modal close (clicking the close icon)
  document.addEventListener("click", function (event) {
    const target = event.target as HTMLElement;
    if (target && target.classList.contains("modal-close-icon")) {
      const modal = document.getElementById("photo-video-modal");
      const backdrop = document.getElementById("custom-modal-backdrop");
  
      if (modal) {
        modal.classList.remove("show");
        modal.style.display = "none";
        modal.removeAttribute("aria-modal");
        modal.setAttribute("aria-hidden", "true");
      }
  
      if (backdrop) {
        backdrop.remove();
      }
  
      // Restore scroll
      document.body.classList.remove("modal-open");
    }
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
