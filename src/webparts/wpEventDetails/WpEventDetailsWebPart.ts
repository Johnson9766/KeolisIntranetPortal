import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';
// import { escape } from '@microsoft/sp-lodash-subset';

// import styles from './WpEventDetailsWebPart.module.scss';
import * as strings from 'WpEventDetailsWebPartStrings';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
// import {SPComponentLoader} from '@microsoft/sp-loader'
import { ResourceUrl, SiteName } from '../GlobalVariable';

import EventDetails from './eventDetails';

export interface IWpEventDetailsWebPartProps {
  description: string;
}

export interface ISPLists {
  value: ISPList[];
}
export interface ISPList {
  ID: string;
  Title: string;
  EventPhoto:any;
  EventLocation:string;
  EventDetails:string;
  StartDate:any;
  EndDate:any;
} 

export default class WpEventDetailsWebPart extends BaseClientSideWebPart<IWpEventDetailsWebPartProps> {
  private _ResourceUrl: string = ResourceUrl;
  private listName:string='UpcomingEvents';
  private siteName: string = SiteName;

  public async render(): Promise<void> {
    this.domElement.innerHTML = EventDetails.allElementsHtml;
    // this.loadCSS();
    const queryStringParams: any = this.getQueryStringParameters();
    // Access specific query string parameters
    let ID: string = queryStringParams['EventID'];

    // Api for retrieve the items from the "News" list
    let apiUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${this.listName}')/items(${ID})?$select=*`;
    await this._renderListAsync(apiUrl); 
  }

  // render list asynchronously
  private async _renderListAsync(apiUrl: string): Promise<void> { 
  await this._getListData(apiUrl) 
    .then((response) => { 
        this._renderEventDetails(response);    
    }); 
  } 

  // render News Details asynchronously
  private async  _renderEventDetails(item: ISPList): Promise<void> {
    let allElementsHtml = '';
  
    try {
          const siteUrl = this.context.pageContext.site.absoluteUrl; // Get this dynamically if needed
          let singleElementHtml = EventDetails.singleElementHtml;
          const itemId = item.ID; // Ensure you have the correct item ID
          const attachmentBaseUrl = `${siteUrl}/Lists/UpcomingEvents/Attachments/${itemId}/`;
          const pictureData = JSON.parse(item.EventPhoto);// Parse the JSON string to extract the filename
          const fileName = attachmentBaseUrl+pictureData.fileName; // Extract the actual filename
          let startDateString = item.StartDate;
          let endDateString = item.EndDate; 
          let startDate = new Date(startDateString); // Convert the approved date string to a Date object
          let endDate = new Date(endDateString);
          let formattedStartDate = this.formatDate(startDate);
          let formattedEndDate = this.formatDate(endDate);
          let startTime = this.formatTime(startDate);
          let endTime = this.formatTime(endDate);

          // Reading Time Calculation
          const eventDetailsText = item.EventDetails || '';
          const wordCount = eventDetailsText.trim().split(/\s+/).length;
          const readingSpeedWPM = 200;
          const estimatedReadingTimeMin:any = Math.ceil(wordCount / readingSpeedWPM);

          singleElementHtml = singleElementHtml.replace("__KEY_DATA_TITLE__", item.Title)
            .replace("__KEY_START_DATE__", formattedStartDate)
            .replace("__KEY_URL_IMG__",fileName)
            .replace("__KEY_DATA_EVENTDETAILS__",item.EventDetails)
            .replace("__KEY_READINGTIME_TIME__",estimatedReadingTimeMin)
            .replace("__KEY_FULL_START_DATE__",formattedStartDate + ", " + startTime)
            .replace("__KEY_FULL_END_DATE__",formattedEndDate + ", " + endTime)
            .replace(/__KEY_URL_RESOURCE__/g,this._ResourceUrl)
            .replace(/__KEY_SITE_NAME__/g,this.siteName)
            .replace("__KEY_DATA_EVENTLOCATION__",item.EventLocation?item.EventLocation:"No Location");
          allElementsHtml += singleElementHtml;
        } catch (error) {
          // Handle error gracefully
          console.error('Error rendering Announcement:', error); 
        }
    // update the content if there is no records
    if (allElementsHtml == "") { allElementsHtml = EventDetails.noRecord; }
    // update the html content of the webpart
    const divNewsListing: Element | null = this.domElement.querySelector('#divEventDetails');
    if (divNewsListing !== null) divNewsListing.innerHTML = allElementsHtml;
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
