import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';
// import { escape } from '@microsoft/sp-lodash-subset';

// import styles from './WpAnnouncementWidgetWebPart.module.scss';
import * as strings from 'WpAnnouncementWidgetWebPartStrings';

import announcementHtml from './announcementWidgetHtml';

import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
// import {SPComponentLoader} from '@microsoft/sp-loader'

import GlobalImageExtensions from '../GlobalImageExtensions';
import GlobalVideoExtensions from '../GlobalVideoExtensions';

export interface IWpAnnouncementWidgetWebPartProps {
  description: string;
}


export interface ISPLists {
  value: ISPList[];
}
export interface ISPList {
  Id: string;
  Title: string;
  Description : string;
  LinkIcon:any;//QuickLink
  NewsImage:any;//News
  AnnouncementImage:any;
  LinkURL:{
    Url:any;
  }
  FileLeafRef:any;
  FileDirRef:any;
  ServerRelativeUrl:any;
  
  Author:
  {
    FirstName: string;
    LastName: string;
    Title:string;
  }
  Created:any;


  EventPhoto:any;
  EventLocation:string;
  EventDetails:string;
  StartDate:any;
  EndDate:any;
} 

export default class WpAnnouncementWidgetWebPart extends BaseClientSideWebPart<IWpAnnouncementWidgetWebPartProps> {

  // private _isDarkTheme: boolean = false;
  // private _environmentMessage: string = '';

  // private _ResourceUrl: string = '/sites/KeolisIntranetDev/SiteAssets/resources';
  private _ResourceUrl: string = '/sites/IntranetPortal-Dev/SiteAssets/resources';

  

  // private listname: string = 'Announcements';


  public async render(): Promise <void>  {
    const siteUrl = this.context.pageContext.site.absoluteUrl; 
    announcementHtml.allElementsHtml = announcementHtml.allElementsHtml.replace(/__KEY_URL_RESOURCE__/g,this._ResourceUrl)
    .replace("__KEY_URL_ANNOLISTING__",`${siteUrl}/SitePages/AnnoListing.aspx`)
    .replace("__KEY_URL_NEWSLISTING__",`${siteUrl}/SitePages/NewsListing.aspx`)
    .replace("__KEY_URL_EVENTSLISTING__",`${siteUrl}/SitePages/EventsListing.aspx`)
    .replace("__KEY_URL_PHOTOVDOLISTING__",`${siteUrl}/SitePages/PhotoVideoListing.aspx`); 
    this.domElement.innerHTML = announcementHtml.allElementsHtml;
    //this.loadCSS();

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to 00:00:00.000
    const formattedDate = currentDate.toISOString();
    console.log(formattedDate);
    // API URL to retrieve the items from the "Announcement" list
    const apiUrls = [
      `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Announcements')/items?$select=*,Created,Author/Title&$expand=Author/Id&$orderby=SortOrder asc,Created desc&$filter=ActiveStatus eq 1&$top=3`,
      `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('QuickLinks')/items?$select=*&$orderby=Created desc`,
      `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('NewsCenter')/items?$select=*,Created,Author/Title&$expand=Author/Id&$orderby=Created desc&$top=3`,
      `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('PhotosAndVideosGallery')/items?$select=*,FileLeafRef,FileDirRef,File/ServerRelativeUrl&$orderby=Created desc&$top=6`,
      `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('UpcomingEvents')/items?$select=*&$orderby=Created desc&$filter=StartDate ge '${formattedDate}'&$top=5`,



    ];
    await this._renderListAsync(apiUrls);

  }


  //  // Function to format the date as dd mon yyyy
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

   // Function to format time in hh:mm AM/PM format
   private  formatTime(date: Date): string {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
    
    // Pad minutes with leading zero if needed
    let minutesStr = minutes < 10 ? '0' + minutes.toString() : minutes.toString();  // Ensure minutes is a string
    
    return `${hours}:${minutesStr} ${ampm}`;
  }

  // Function to get data from the picture library
  private async _getListData(apiUrl: string): Promise<ISPLists> {
    try{
      return this.context.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        if(response.ok){
          return response.json();
        } else {
          console.error(`Request failed with status ${response.status}: ${response.statusText}`);
          throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
        }
      });
    } catch(error){
      console.log("Error occured:", error);
      throw error;
    }
  }
    
  // Render list asynchronously
  private async _renderListAsync(apiUrls: string[]): Promise<void> {
    try {
      //  fetch data from all API URLs concurrently   
      const responses = await Promise.all(apiUrls.map(url => this._getListData(url)));
      console.log(responses[4].value);
      this._renderAnnoList(responses[0].value)
      this._renderQuickLinks(responses[1].value)
      this._renderNewsList(responses[2].value);
      this._renderPhotosVideosList(responses[3].value)
      this._renderUpcomingEventsList(responses[4].value)

  // //     // Handle the responses
  //     responses.forEach((response, index) => {
  //       console.log(`Response from API ${index + 1}:`, response);
  //       this._renderAnnoList(response.value);  // Render list for each response
  //     });
  
    } catch (error) {
      console.error("Error fetching data from APIs:", error);
    }
  }

  
  // Render Announcement list asynchronously
  private _renderAnnoList(items: ISPList[]): void {
    let allElementsSliderHtml: string = "";
    let allElementsAnnHtml: string = "";
    console.log(items);
    try {
      items.forEach((item, index) => {  

        // let rootUrl = this.context.pageContext.web.absoluteUrl.replace(this.context.pageContext.web.serverRelativeUrl, '');
        // const serverRelativeUrl = `${rootUrl}${item.FileDirRef}/${item.FileLeafRef}`;
        // console.log(item.FileDirRef)
        // console.log(item.FileLeafRef)

        // console.log(serverRelativeUrl);

        const siteUrl = this.context.pageContext.site.absoluteUrl; // Get this dynamically if needed
 
      
      const itemId = item.Id; // Ensure you have the correct item ID
 
      const attachmentBaseUrl = `${siteUrl}/Lists/Announcements/Attachments/${itemId}/`;
      console.log(attachmentBaseUrl);
 
      // Parse the JSON string to extract the filename
      const pictureData = JSON.parse(item.AnnouncementImage);
      const fileName = attachmentBaseUrl+pictureData.fileName; // Extract the actual filename
      console.log(fileName);

        // Get the file extension
        // let fileName: string = item.FileLeafRef;
        // let fileExtension: any = fileName.split('.').pop();

        let singleSliderHTMLElement = '';
        let singleAnnouncementHTMLElement = '';

        // Check if the file is an image or video based on its extension
        // if (GlobalImageExtensions.AllImageExtensions.some(imageExt => imageExt.ImageExtension === fileExtension)) {
          
        
          singleSliderHTMLElement = announcementHtml.singleAnnouncementSliderElementHtml;
        // } else if (GlobalVideoExtensions.AllVideoExtensions.some(videoExt => videoExt.VideoExtension === fileExtension)) {
      
        //   singleHTMLElement = announcementHtml.singleAnnouncementVideoDesc;
        // }

        // Replace placeholder with actual data for main Section image
          console.log(singleSliderHTMLElement);

          singleSliderHTMLElement = singleSliderHTMLElement
          .replace("__KEY_DATA_DESC__", item.Description)
          .replace("__KEY_DATA_TITLE__", item.Title)
          .replace("__KEY_URL_IMG__",fileName)
          .replace("__KEY_URL_DETAILSPAGE__",`${siteUrl}/SitePages/AnnoDetails.aspx?&AnnoID=${item.Id}`)
          // .replace("__KEY_DATA_PUBLISHEDBY__", item.Author.Title)
          // .replace(/__KEY_URL_RESOURCE__/g,this._ResourceUrl);

          
       

      allElementsSliderHtml += singleSliderHTMLElement; 

      singleAnnouncementHTMLElement = announcementHtml.singleAnnouncementListElementHtml;

      singleAnnouncementHTMLElement = singleAnnouncementHTMLElement
      .replace("__KEY_DATA_TITLE__",item.Title)
      .replace("__KEY_DATA_DESC__",item.Description)
      .replace("__KEY_URL_IMG__",fileName);

      allElementsAnnHtml += singleAnnouncementHTMLElement;
      
      // }
    });
    } catch (error) {
      // Handle error gracefully
      console.error('Error rendering Announcement:', error); 
    }
    // if no announcements, then display no record msg
    if (allElementsSliderHtml == "") {
      allElementsSliderHtml = announcementHtml.noRecord; }

      if(allElementsAnnHtml == ""){
        allElementsAnnHtml = announcementHtml.noRecord;
      }

    // update the html content of the main section in webpart
    const divAnnouncementSlider: Element = this.domElement.querySelector('#announcementSlider')!;
    divAnnouncementSlider.innerHTML = allElementsSliderHtml;

    const divAnnouncementElement: Element = this.domElement.querySelector('#announcementElement')!;
    divAnnouncementElement.innerHTML = allElementsAnnHtml;
  }


   // Render QuickLink list asynchronously
   private _renderQuickLinks(items: ISPList[]): void {
    let allElementsQuickLinksHtml: string = "";
    
    try {
      items.forEach((item, index) => {

        console.log(item.LinkIcon);

        const siteUrl = this.context.pageContext.site.absoluteUrl; // Get this dynamically if needed
 
      
      const itemId = item.Id; // Ensure you have the correct item ID
 
      const attachmentBaseUrl = `${siteUrl}/Lists/QuickLinks/Attachments/${itemId}/`;
      console.log(attachmentBaseUrl);
 
      // Parse the JSON string to extract the filename
      const pictureData = JSON.parse(item.LinkIcon);
      const fileName = attachmentBaseUrl+pictureData.fileName; // Extract the actual filename
      console.log(fileName);

        let singleQuickLinkHTMLElement = '';

        singleQuickLinkHTMLElement = announcementHtml.singleQuickLinkElement;


        // // Replace placeholder with actual data for main Section image
        singleQuickLinkHTMLElement = singleQuickLinkHTMLElement
        //   .replace("__KEY_DATA_DESC__", item.Description)
          .replace("__KEY_DATA_TITLE__", item.Title)
          .replace("__KEY_URL_IMGICON__",fileName)
          .replace("__KEY_URL_LINK__", item.LinkURL.Url || "#")
        //   .replace("__KEY_DATA_PUBLISHEDBY__", item.Author.Title)
        //   .replace(/__KEY_URL_RESOURCE__/g,this._ResourceUrl);

          
       

        allElementsQuickLinksHtml += singleQuickLinkHTMLElement; 
      // console.log(allElementsQuickLinksHtml);
      
      // }
    });
    } catch (error) {
      // Handle error gracefully
      console.error('Error rendering Announcement:', error); 
    }
    // if no announcements, then display no record msg
    if (allElementsQuickLinksHtml == "") { allElementsQuickLinksHtml = announcementHtml.noRecord; }

    // update the html content of the main section in webpart
    const divQuickLink: Element = this.domElement.querySelector('#quickLinks')!;
    divQuickLink.innerHTML = allElementsQuickLinksHtml;

  }





  // Render News list asynchronously
  private _renderNewsList(items: ISPList[]): void {
    let allElementsNewsCenterHtml: string = "";
    console.log(items);
    try {
      items.forEach((item, index) => {

        console.log(item.NewsImage);

        const siteUrl = this.context.pageContext.site.absoluteUrl; // Get this dynamically if needed
 
      
      const itemId = item.Id; // Ensure you have the correct item ID
 
      const attachmentBaseUrl = `${siteUrl}/Lists/NewsCenter/Attachments/${itemId}/`;
      console.log(attachmentBaseUrl);
 
      // Parse the JSON string to extract the filename
      const pictureData = JSON.parse(item.NewsImage);
      const fileName = attachmentBaseUrl+pictureData.fileName; // Extract the actual filename
      console.log(fileName);

        let singleNewsCentreElement = '';

        singleNewsCentreElement = announcementHtml.singleNewsCentreElement;

        let createdDateString = item.Created;
        console.log(item.Created); 

        // Convert the approved date string to a Date object
        let createdDate = new Date(createdDateString);
        let date = this.formatDate(createdDate)
        let time = this.formatTime(createdDate);

        console.log(time)



        // // Replace placeholder with actual data for main Section image
        singleNewsCentreElement = singleNewsCentreElement
        //   .replace("__KEY_DATA_DESC__", item.Description)
          .replace("__KEY_DATA_TITLE__", item.Title)
          .replace("__KEY_URL_IMG__",fileName)
          .replace("__KEY_ID_NEWS__", item.Id)
          .replace("__KEY_PUBLISHED_DATE__", date)
          

        //   .replace(/__KEY_URL_RESOURCE__/g,this._ResourceUrl);

          
       

        allElementsNewsCenterHtml += singleNewsCentreElement; 
      // console.log(allElementsNewsCenterHtml);
      
      // }
    });
    } catch (error) {
      // Handle error gracefully
      console.error('Error rendering Announcement:', error); 
    }
    // if no announcements, then display no record msg
    if (allElementsNewsCenterHtml == "") { allElementsNewsCenterHtml = announcementHtml.noRecord; }

    // update the html content of the main section in webpart
    

    const divNewsCenter: Element = this.domElement.querySelector('#newsCenter')!;
    divNewsCenter.innerHTML = allElementsNewsCenterHtml;

  }

  //render PhotosAndVideosGallery list asynchronously
  
  private _renderPhotosVideosList(items: ISPList[]): void {
   let allPhotosVideosElements = '';
    try {
      items.forEach((item, index) => {
        let rootUrl = this.context.pageContext.web.absoluteUrl.replace(this.context.pageContext.web.serverRelativeUrl, '');
        const serverRelativeUrl = `${rootUrl}${item.FileDirRef}/${item.FileLeafRef}`;

        // Get the file extension
        let fileName: string = item.FileLeafRef;
        let fileExtension: any = fileName.split('.').pop();

        let singlePhotosVideosHTMLElement:any = '';

        // // Check if the file is an image or video based on its extension
        // if (GlobalImageExtensions.AllImageExtensions.some(imageExt => imageExt.ImageExtension === fileExtension)) {
                           
        //   singlePhotosVideosHTMLElement = homeWidgetsHtml.imageGallerySingleElement;
        // } else if (GlobalVideoExtensions.AllVideoExtensions.some(videoExt => videoExt.VideoExtension === fileExtension)) {
      
        //   singlePhotosVideosHTMLElement = homeWidgetsHtml.videoGallerySingleElement;
        // }else  singlePhotosVideosHTMLElement = homeWidgetsHtml.defaultImageGallerySingleElement

        // // Replace placeholder with actual data for main Section image
        // singlePhotosVideosHTMLElement = singlePhotosVideosHTMLElement
        //   .replace("__KEY_URL_IMGVID__",serverRelativeUrl)
        //   // .replace("__KEY_DATA_PUBLISHEDBY__", item.Author.Title)
        //   .replace(/__KEY_URL_RESOURCE__/g,this._ResourceUrl);
        const isImage = GlobalImageExtensions.AllImageExtensions.some(imageExt => imageExt.ImageExtension.toLowerCase() === fileExtension);
        const isVideo = GlobalVideoExtensions.AllVideoExtensions.some(videoExt => videoExt.VideoExtension.toLowerCase() === fileExtension);
      
        if (isImage) {
          singlePhotosVideosHTMLElement = announcementHtml.imageGallerySingleElement
            .replace("__KEY_URL_IMGVID__", serverRelativeUrl);
        } else if (isVideo) {
          singlePhotosVideosHTMLElement = announcementHtml.videoGallerySingleElement
            .replace("__KEY_URL_VIDGallery__", serverRelativeUrl);
        } else {
          singlePhotosVideosHTMLElement = announcementHtml.defaultImageGallerySingleElement
            .replace("__KEY_URL_RESOURCE__", this._ResourceUrl);
        }
          
          if (index === 0) {
            singlePhotosVideosHTMLElement = singlePhotosVideosHTMLElement.replace("__KEY_CLASS_LARGEIMG__", "gallery-grid-img-lg");
          } else {
            singlePhotosVideosHTMLElement = singlePhotosVideosHTMLElement.replace("__KEY_CLASS_LARGEIMG__", "");
          }
    
          allPhotosVideosElements += singlePhotosVideosHTMLElement;
        });
    } catch (error) {
      // Handle error gracefully
      console.error('Error rendering Photos and Videos:', error); 
    }
    // if no announcements, then display no record msg
    if (allPhotosVideosElements == "") { allPhotosVideosElements = announcementHtml.noRecord; }

    // update the html content of the main section in webpart
    const divPhotosAndVideos: Element = this.domElement.querySelector('#photosAndVideos')!;
    divPhotosAndVideos.innerHTML = allPhotosVideosElements;

   
  }

  // Function to get the day in dd format
private getDay(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
      // Gives a two-digit day
  };
  return date.toLocaleDateString('en-GB', options);
}

// Function to get the month in short format (e.g., 'Feb')
private getMonth(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',  // Gives the three-letter month abbreviation
  };
  return date.toLocaleDateString('en-GB', options);
}





  // Render News list asynchronously
  private _renderUpcomingEventsList(items: ISPList[]): void {
    let allElementsUpcomingEventsHtml: string = "";
    console.log(items);
    try {
      items.forEach((item, index) => {

        console.log(item);

        const siteUrl = this.context.pageContext.site.absoluteUrl; // Get this dynamically if needed
 
      
      const itemId = item.Id; // Ensure you have the correct item ID
 
      const attachmentBaseUrl = `${siteUrl}/Lists/UpcomingEvents/Attachments/${itemId}/`;
      console.log(attachmentBaseUrl);
 
      // Parse the JSON string to extract the filename
      // const pictureData = JSON.parse(item.Image);
      // const fileName = attachmentBaseUrl+pictureData.fileName; // Extract the actual filename
      // console.log(fileName);

        let singleUpcomingEventElement = '';

        singleUpcomingEventElement = announcementHtml.singleUpcomingEventElement;

        let startDateString = item.StartDate; 
        let endDateString = item.EndDate; 

        console.log(startDateString);
        console.log(endDateString);

        // Convert the approved date string to a Date object
        let startDate = new Date(startDateString);
        let endDate = new Date(endDateString);
        // const date = new Date(Date.UTC(2025, 1, 19));
        console.log(startDate)
        let day = this.getDay(startDate)
        console.log(day)
        let month = this.getMonth(startDate);
        let startTime = this.formatTime(startDate);
        let endTime = this.formatTime(endDate);

        console.log(startTime)
        console.log(endTime)

       



        // // Replace placeholder with actual data for main Section image
        singleUpcomingEventElement = singleUpcomingEventElement
        //   .replace("__KEY_DATA_DESC__", item.Description)
          .replace("__KEY_DATA_TITLE__", item.Title)
          // .replace("__KEY_URL_IMG__",fileName)
          .replace("__KEY_DATA_MONTH__", month)
          .replace("__KEY_DATA_DAY__", day)
          .replace("__KEY_ID_NEWS__",item.Id)
          .replace("__KEY_DATA_STARTTIME__", startTime)
          .replace("__KEY_DATA_ENDTIME__", endTime)
          .replace("__KEY_URL_EVENTDETAILS__",`${siteUrl}/SitePages/EventDetails.aspx?&EventID=${item.Id}`)
          .replace(/__KEY_URL_RESOURCE__/g,this._ResourceUrl);

          
       

        allElementsUpcomingEventsHtml += singleUpcomingEventElement; 
      console.log(allElementsUpcomingEventsHtml);
      
      // }
    });
    } catch (error) {
      // Handle error gracefully
      console.error('Error rendering Announcement:', error); 
    }
    // if no announcements, then display no record msg
    if (allElementsUpcomingEventsHtml == "") { allElementsUpcomingEventsHtml = announcementHtml.noRecord; }

    // update the html content of the main section in webpart
  

    const divUpcomingEvents: Element = this.domElement.querySelector('#upcomingEvents')!;
    divUpcomingEvents.innerHTML = allElementsUpcomingEventsHtml;

  }






//   private loadHome():void{

//     SPComponentLoader.loadScript(`/sites/IntranetPortal-Dev/SiteAssets/resources/js/common.js`);
//     SPComponentLoader.loadScript(`/sites/IntranetPortal-Dev/SiteAssets/resources/js/home.js`);        
//   }
 

// private loadCSS(): void {
//     // Load CSS files
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

//     // Load home.js after CSS files are loaded
//         setTimeout(this.loadHome,1000);

// }




  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      // this._environmentMessage = message;
    });
  }



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    // this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

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