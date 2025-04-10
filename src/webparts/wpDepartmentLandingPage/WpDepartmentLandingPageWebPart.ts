import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'WpDepartmentLandingPageWebPartStrings';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http'; 
import DepartmentLandingPage from './DepartmentLandingpage' ;
import { _DivMessage, _ResourceUrl } from '../GlobalVariable';
 import GlobalImageExtensions from '../GlobalImageExtensions';
import GlobalVideoExtensions from '../GlobalVideoExtensions';
import { SPComponentLoader } from '@microsoft/sp-loader';


export interface IWpDepartmentLandingPageWebPartProps {
  description: string;
}
export interface ISPLists { 

  value: ISPList[]; 

} 

 

export interface ISPList {
  NewsImage: string;
  Id: number; 
  Title: string; 
  AttachmentFiles: { ServerRelativeUrl: string }[]; 
  ShortDescription : string; 
  MainContent : string; 
  StartDate : string; 
  EndDate: string; 
  ListName: string; 
  FileLeafRef: any;  
  FileDirRef: string;
  FileRef:any; 
  FSObjType: number;
  Created: string;
  Description:string; 
  SortOrder:number; 
 ActiveStatus: any; 
 Image:any;//News
  AnnouncementImage:any;
  
 


}


export default class WpDepartmentLandingPageWebPart extends BaseClientSideWebPart<IWpDepartmentLandingPageWebPartProps> {

  private NewslistName: string = "DepartmentNews"; 
  private AnnolistName: string = "DepartmentAnnouncement"; 
  private PhotoAndVideolistName: string = "DepartmentPhotosAndVideosGallery"; 
  private _ResourceUrl: string = '/sites/IntranetPortal-Dev/SiteAssets/resources';
  private siteName: string = 'IntranetPortal-Dev';
  
  

  public async render(): Promise<void> {
    this.loadCSS(); 
    // this.domElement.innerHTML = DepartmentLandingPage.allElementsHtml; 
    const finalHtml = DepartmentLandingPage.allElementsHtml
    .replace(/__KEY_SITE_NAME__/g, this.siteName)
    .replace(/__KEY_URL_RESOURCE__/g, this._ResourceUrl);
this.domElement.innerHTML = finalHtml;

    const workbenchContent = document.getElementById('workbenchPageContent'); 

    if (workbenchContent) { 
  
      workbenchContent.style.maxWidth = 'none'; 
  
    } 

    const NewsapiUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${this.NewslistName}')/items?$select=*,Created,Author/Title&$expand=Author/Id&$orderby=Created desc&$top=3`; 
    const AnnoapiUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${this.AnnolistName}')/items?$select=*,Created,Author/Title&$expand=Author/Id&$orderby=SortOrder asc,Created desc&$filter=ActiveStatus eq 1&$top=3`; 
    const PhotoAndVideoapiUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${this.PhotoAndVideolistName}')/items?$select=*,FileLeafRef,FileDirRef,File/ServerRelativeUrl&$orderby=Created desc&$top=6`; 



    await this._renderListAsync(NewsapiUrl,this.NewslistName); 
    await this._renderListAsync(AnnoapiUrl,this.AnnolistName); 
    await this._renderListAsync(PhotoAndVideoapiUrl,this.PhotoAndVideolistName);
    
    
  }
  private async _renderListAsync(apiUrl: string,listName:string): Promise<void> { 

    try { 
      const response = await this._getListData(apiUrl); 
      switch(listName){ 
        case "DepartmentAnnouncement": 
          this._renderAnnoList(response.value); 
          break; 
        case "DepartmentNews": 
          this._renderNewsList(response.value); 
          break; 
        case "DepartmentPhotosAndVideosGallery":
          this._renderPhotoAndVideo(response.value);
          break; 
          
      } 
  
  
  
    } catch (error) { 
      console.error("Error fetching API:", error); 
      // const listContainer = this.domElement.querySelector("#listItems"); 
      // if (listContainer) { 
      //   listContainer.innerHTML = `<li>API Error</li>`; 
      // } 
  
    } 
  
  } 
  private async _getListData(apiUrl: string): Promise<ISPLists> { 

    return this.context.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1) 

      .then((response: SPHttpClientResponse) => response.json()); 

  }
  private async _renderAnnoList(items: ISPList[]): Promise<void> {
    console.log("announcementitems", items);
  
    let listItemsHtml = "";
    const siteUrl = this.context.pageContext.site.absoluteUrl;
  
    try {
      for (const item of items) {
        const title = item.Title || "No Title";
  
        // Format created date to something like "08 Apr 2025"
        const createdDate = item.Created ? new Date(item.Created) : null;
        const formattedDate = createdDate
          ? createdDate.toLocaleDateString("en-GB", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "";
  
        let imageUrl = `${this._ResourceUrl}/images/department/dept-avatar.png`;
  
        try {
          const itemId = item.Id;
          const attachmentBaseUrl = `${siteUrl}/Lists/DepartmentAnnouncement/Attachments/${itemId}/`;
  
          const pictureData = JSON.parse(item.AnnouncementImage);
          if (pictureData?.fileName) {
            imageUrl = `${attachmentBaseUrl}${pictureData.fileName}`; // ✅ No trailing underscore
          }
        } catch (err) {
          console.warn(`Error parsing image for announcement ${item.Id}:`, err);
        }
  
        
        // Insert values into template
        const announcementHtml = DepartmentLandingPage.AnnouncementHtml
          .replace("__KEY_ANNO_IMG__", imageUrl)
          .replace("__KEY_DATE_TIME__", formattedDate)
          .replace("__KEY_TITLE__", title)
          .replace("__KEY_ID_ANNO__",item.Id.toString())
          .replace("__KEY_SITE_NAME__",this.siteName)


  
        listItemsHtml += announcementHtml;
      }
    } catch (error) {
      console.error("Error rendering announcements:", error);
      listItemsHtml = "<div>Error loading announcements</div>";
    }
  
    const listContainer = this.domElement.querySelector("#AnnouncementID");
    if (listContainer) {
      listContainer.innerHTML = listItemsHtml || "<div>No announcements found</div>";
    }
  }
   



  private async _renderNewsList(items: ISPList[]): Promise<void> {
    let listItemsHtml = "";

    try {
      const siteUrl = this.context.pageContext.site.absoluteUrl;
  
      for (const item of items) {
        const title = item.Title || "No Title";
        let imageUrl = `${this._ResourceUrl}/images/department/dept-avatar.png`; 
        try {
          const itemId = item.Id;
          const attachmentBaseUrl = `${siteUrl}/Lists/DepartmentNews/Attachments/${itemId}/`;
          const pictureData = JSON.parse(item.NewsImage);
          
          if (pictureData?.fileName) {
            imageUrl = `${attachmentBaseUrl}${pictureData.fileName}`;
          }
        } catch (err) {
          console.warn(`Error parsing image for news item ${item.Id}:`, err);
        }
    
        
        // Format date and time
        const createdDate = new Date(item.Created);
        const date = this.formatDate(createdDate); 
        const fullDateTime = `${date} `;
       

        // Replace placeholders in HTML template
        const newsHtml = DepartmentLandingPage.NewsHtml
          .replace("__KEY_NEWSIMG_URL__", imageUrl)
          .replace("__KEY_NEWS_DATEANDTIME__", fullDateTime)
          .replace("__KEY__NEWS_TITLE__", title)
          .replace("__KEY_ID_NEWS__",item.Id.toString())
          .replace("__KEY_SITE_NAME__", this.siteName)
  
        listItemsHtml += newsHtml;
      }
    } catch (error) {
      console.error("Error rendering News Center items:", error);
      listItemsHtml = "<li>Error loading news items</li>";
    }

    const newsListContainer = this.domElement.querySelector("#NewsID");
    if (newsListContainer) {
      newsListContainer.innerHTML = listItemsHtml || "<li>No items found</li>";
    }
  }
  

  

  

  private async _renderPhotoAndVideo(items: ISPList[]): Promise<void> {
    let listItemsHtml = '';
  
    try {
      const rootUrl = this.context.pageContext.web.absoluteUrl.replace(
        this.context.pageContext.web.serverRelativeUrl,
        ''
      );
  
      for (const item of items) {
        const fileName = item.FileLeafRef || '';
        const fileExtension = fileName.split('.').pop()?.toLowerCase();
        const serverRelativeUrl = `${rootUrl}${item.FileDirRef}/${fileName}`;
        const title = item.Title || 'No Title';
  
        let mediaHtml = '';
  
        // Determine if it's an image or video
        if (
          GlobalImageExtensions.AllImageExtensions.some(
            (ext) => ext.ImageExtension.toLowerCase() === fileExtension
          )
        ) {
          mediaHtml = DepartmentLandingPage.PhotoHtml
            .replace('__KEY_PHOTOIMG_URL_', serverRelativeUrl)
            .replace('__KEY__PHOTOTITLE__', title);
        } else if (
          GlobalVideoExtensions.AllVideoExtensions.some(
            (ext) => ext.VideoExtension.toLowerCase() === fileExtension
          )
        ) {
          mediaHtml = DepartmentLandingPage.Videohtml
            .replace('__KEY_URL_VIDEOGALLERY__', serverRelativeUrl)
            .replace('__KEY__PHOTOTITLE__', title);
        } else {
          
        }
  
        listItemsHtml += mediaHtml;
      }
    } catch (error) {
      console.error('Error rendering photo/video gallery:', error);
      listItemsHtml = `<div>Error loading items</div>`;
    }
  
    // Render the result
    const listContainer = this.domElement.querySelector('#PhotoVideoGalleryID');
    if (listContainer) {
      listContainer.innerHTML = listItemsHtml || '<div>No media found</div>';
    }
  }

  private loadHome():void{

    SPComponentLoader.loadScript(`/sites/IntranetPortal-Dev/SiteAssets/resources/js/common.js`);
    SPComponentLoader.loadScript(`/sites/IntranetPortal-Dev/SiteAssets/resources/js/home.js`);        
  }


private loadCSS(): void {
 
    // this._ResourceUrl = this.context.pageContext.web.absoluteUrl + "/SiteAssets/resources";
    SPComponentLoader.loadCss(`${this._ResourceUrl}/css/sp-custom.css`);
    SPComponentLoader.loadScript(`${this._ResourceUrl}/js/jquery-3.6.0.js`);
    SPComponentLoader.loadScript(`${this._ResourceUrl}/js/jquery-ui.js`);
    SPComponentLoader.loadScript(`${this._ResourceUrl}/js/swiper-bundle.min.js`);
    SPComponentLoader.loadScript(`${this._ResourceUrl}/js/department.js`);
    SPComponentLoader.loadCss(`${this._ResourceUrl}/css/bootstrap.min.css`);
    SPComponentLoader.loadScript(`${this._ResourceUrl}/js/bootstrap.bundle.min.js`);

    SPComponentLoader.loadCss(`${this._ResourceUrl}/css/swiper-bundle.min.css`);  
    SPComponentLoader.loadCss(`${this._ResourceUrl}/css/jquery-ui.css`);
    SPComponentLoader.loadCss(`${this._ResourceUrl}/css/variable.css`);
    SPComponentLoader.loadCss(`${this._ResourceUrl}/css/news.css`);
    SPComponentLoader.loadCss(`${this._ResourceUrl}/css/custom.css`);
    SPComponentLoader.loadCss(`${this._ResourceUrl}/css/department.css`);
    SPComponentLoader.loadCss(`${this._ResourceUrl}/css/home.css`);

   

    // Load home.js after CSS files are loaded
        setTimeout(this.loadHome,1000);

}
  

  private formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long', // 'short' gives the 3-letter month abbreviation
      year: 'numeric',
    };
    // Get the day from the Date object
    const day = date.getDate();

    // Determine the suffix for the day
    let suffix = 'th';  // Default suffix
    if (day % 10 === 1 && day !== 11) {
        suffix = 'st';
    } else if (day % 10 === 2 && day !== 12) {
        suffix = 'nd';
    } else if (day % 10 === 3 && day !== 13) {
        suffix = 'rd';
    }

    // Format the date to get the day, month, and year
    let formattedDate = date.toLocaleDateString('en-GB', options);

    // Replace the day with day + suffix
    formattedDate = formattedDate.replace(/\d{2}/, (match) => match + suffix);

    return formattedDate;
  }


// @ts-ignore
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
