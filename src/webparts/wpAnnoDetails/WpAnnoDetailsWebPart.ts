import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';
// import { escape } from '@microsoft/sp-lodash-subset';

// import styles from './WpAnnoDetailsWebPart.module.scss';
import * as strings from 'WpAnnoDetailsWebPartStrings';

import AnnoDetails from './annoDetails';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
// import {SPComponentLoader} from '@microsoft/sp-loader'
import { ResourceUrl, SiteName } from '../GlobalVariable'; 


export interface IWpAnnoDetailsWebPartProps {
  description: string;
}
export interface ISPLists {
  value: ISPList[];
}
export interface ISPList {
  Id: string;
  Title: string;
  AnnouncementImage:any;
  Description:string;
  Created:any;
} 

export default class WpAnnoDetailsWebPart extends BaseClientSideWebPart<IWpAnnoDetailsWebPartProps> {

  private _ResourceUrl: string = ResourceUrl;
  private listName:string='Announcements';
  private siteName: string = SiteName;

  public async render(): Promise<void> {
    this.domElement.innerHTML = AnnoDetails.allElementsHtml.replace(/__KEY_SITE_NAME__/g,this.siteName);
    //this.loadCSS();
 
    const queryStringParams: any = this.getQueryStringParameters();
    // Access specific query string parameters
    let ID: string = queryStringParams['AnnoID'];
    this._renderSuggestedAnnoDetails(ID);

    let apiUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${this.listName}')/items(${ID})?$select=*`;
    await this._renderListAsync(apiUrl);
  }

  // render News Details asynchronously
  private async  _renderSuggestedAnnoDetails(currentNewsID: string): Promise<void> {
    let allElementsRemainingNewsHtml = '';
      let singleElementRemainingNewsHtml = '';
      try {
        const apiUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${this.listName}')/items?$select=ID,Title,AnnouncementImage,Created,Author/FirstName,Author/LastName,Description,FileLeafRef,FileRef&$expand=AttachmentFiles,Author&$filter=ID ne ${currentNewsID}&$orderby=ID desc&$top=4&$orderby=Created desc`;
        await this._getListData(apiUrl) 
        .then((response) => { 
            var items :ISPList[] = response.value;
            items.forEach((item, index) => {
              // Get the current item
              const siteUrl = this.context.pageContext.site.absoluteUrl; // Get this dynamically if needed
              const itemId = item.Id; // Ensure you have the correct item ID
              const attachmentBaseUrl = `${siteUrl}/Lists/Announcements/Attachments/${itemId}/`;
    
              // Parse the JSON string to extract the filename
              const pictureData = JSON.parse(item.AnnouncementImage);
              let imageUrl = `${this._ResourceUrl}/images/default_home/news.png`; 
    
              if (pictureData?.fileName) {
                imageUrl = `${attachmentBaseUrl}${pictureData.fileName}`;
              }

              singleElementRemainingNewsHtml = AnnoDetails.remainingNewsHtml;
            
              let createdDateString = item.Created;
            
              // Convert the approved date string to a Date object
              let createdDate = new Date(createdDateString);
              let date = this.formatDate(createdDate)
            
              singleElementRemainingNewsHtml = singleElementRemainingNewsHtml
                .replace("__KEY_DATA_TITLE__", item.Title)
                .replace("__KEY_URL_IMG__", imageUrl)
                .replace("__KEY_PUBLISHED_DATE__", date)
                .replace("__KEY_URL_NEWSDETAILS__",`${siteUrl}/SitePages/AnnoDetails.aspx?&AnnoID=${item.Id}`);
            
              allElementsRemainingNewsHtml += singleElementRemainingNewsHtml;
            }) 
          }); 
        } catch (error) {
          // Handle error gracefully
          console.error('Error rendering Announcement:', error); 
        }
    // if no announcements, then display no record msg
    if (allElementsRemainingNewsHtml == "") { allElementsRemainingNewsHtml = AnnoDetails.noRecord; }

    // update the html content of the main section in webpart

    const divRemainingNewsCenter: Element = this.domElement.querySelector('#remainingAnnoElements')!;
    divRemainingNewsCenter.innerHTML = allElementsRemainingNewsHtml;

  }

  // render list asynchronously
  private async _renderListAsync(apiUrl: string): Promise<void> { 
    await this._getListData(apiUrl) 
      .then((response) => { 
          this._renderAnnoDetails(response);    
     }); 
  } 
  
  // function to get data from the sharepoint list
  private async _getListData(apiUrl: string): Promise<any> {
    try {
      const response: SPHttpClientResponse = await this.context.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1);
      if (response.ok) {
        return await response.json();
      } else {
        console.error(`Request failed with status ${response.status}: ${response.statusText}`);
        throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.log("Error occurred", error);
      throw error;
    }
  }

  // render Anno Details asynchronously
  private async  _renderAnnoDetails(item: ISPList): Promise<void> {
    let allElementsHtml = '';

    try {
        const siteUrl = this.context.pageContext.site.absoluteUrl; // Get this dynamically if needed
        let singleElementHtml = AnnoDetails.singleElementHtml;
        const itemId = item.Id; // Ensure you have the correct item ID
        const attachmentBaseUrl = `${siteUrl}/Lists/Announcements/Attachments/${itemId}/`;
        const pictureData = JSON.parse(item.AnnouncementImage);// Parse the JSON string to extract the filename
        const fileName = attachmentBaseUrl+pictureData.fileName; // Extract the actual filename
        let createdDateString = item.Created;
        let createdDate = new Date(createdDateString); // Convert the approved date string to a Date object
        let formattedCreatedDate = this.formatDate(createdDate);

        // Reading Time Calculation
        const eventDetailsText = item.Description || '';
        const wordCount = eventDetailsText.trim().split(/\s+/).length;
        const readingSpeedWPM = 200;
        const estimatedReadingTimeMin:any = Math.ceil(wordCount / readingSpeedWPM);

        singleElementHtml = singleElementHtml.replace("__KEY_DATA_TITLE__", item.Title)
          .replace("__KEY_PUBLISHED_DATE__", formattedCreatedDate)
          .replace("__KEY_URL_IMG__",fileName)
          .replace("__KEY_DATA_EVENTDETAILS__",item.Description)
          .replace("__KEY_READINGTIME_TIME__",estimatedReadingTimeMin)
          .replace(/__KEY_URL_RESOURCE__/g,this._ResourceUrl)
          .replace(/__KEY_SITE_NAME__/g,this.siteName);
        allElementsHtml += singleElementHtml;
        const divactiveNewsDesc: Element = this.domElement.querySelector('#annoDescription')!;
        divactiveNewsDesc.innerHTML = item.Description;
          
        } catch (error) {
          // Handle error gracefully
          console.error('Error rendering Announcement:', error); 
        }
    // update the content if there is no records
    if (allElementsHtml == "") { allElementsHtml = AnnoDetails.noRecord; }
    // update the html content of the webpart
    const divactiveNews: Element = this.domElement.querySelector('#activeAnno')!;
    divactiveNews.innerHTML = allElementsHtml;

    const divNewsListing: Element | null = this.domElement.querySelector('#divEventDetails');
    if (divNewsListing !== null) divNewsListing.innerHTML = allElementsHtml;
  }

  //helper functions
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

  // private loadHome():void{
  //   SPComponentLoader.loadScript(`/sites/IntranetPortal-Dev/SiteAssets/resources/js/common.js`);
  //   SPComponentLoader.loadScript(`/sites/IntranetPortal-Dev/SiteAssets/resources/js/home.js`);        
  // }

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
  //     SPComponentLoader.loadCss(`${this._ResourceUrl}/css/event.css`);

  //     // Load home.js after CSS files are loaded
  //         setTimeout(this.loadHome,1000);

  // }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      //this._environmentMessage = message;
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

    //this._isDarkTheme = !!currentTheme.isInverted;
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
