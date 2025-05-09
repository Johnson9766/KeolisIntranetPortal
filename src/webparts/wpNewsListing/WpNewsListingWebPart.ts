import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';

//import { escape } from '@microsoft/sp-lodash-subset';
//import styles from './WpNewsListingWebPart.module.scss';\

import * as strings from 'WpNewsListingWebPartStrings';

import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
// import {SPComponentLoader} from '@microsoft/sp-loader';
import NewsListing from './newsListing';
import { ResourceUrl } from '../GlobalVariable'; 

export interface IWpNewsListingWebPartProps {
  description: string;
}

// interfaces for sharepoint list items
export interface ISPLists {
  value: ISPList[];
}

export interface ISPList { 
  ID : any;
  Title : string;
  NewsImage : any;
  Created : any;
  MainContent : string;
  Author:
  {
    FirstName: string;
    LastName: string;
    Title:string;
  }
}

export default class WpNewsListingWebPart extends BaseClientSideWebPart<IWpNewsListingWebPartProps> {

  private _ResourceUrl: string =ResourceUrl;
  private listName:string='NewsCenter';

  public async render(): Promise<void> {
    // this.loadCSS();
    this.domElement.innerHTML = NewsListing.allElementsHtml;

    const workbenchContent = document.getElementById('workbenchPageContent');
    if (workbenchContent) {
      workbenchContent.style.maxWidth = 'none';
    }

    // Api for retrieve the items from the "News" list
    let apiUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${this.listName}')/items?$select=*,ID,Title,MainContent,Created,Author/Title,Author/Department&$expand=Author&$orderby=Created desc`;
    await this._renderListAsync(apiUrl); 
  }

  // render list asynchronously
  private async _renderListAsync(apiUrl: string): Promise<void> { 
  await this._getListData(apiUrl) 
    .then((response) => { 
        this._renderNewsListing(response.value);    
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

  // render News Details asynchronously
  private async  _renderNewsListing(items: ISPList[]): Promise<void> {
    let allElementsHtml: string = '';
    try {
          const siteUrl = this.context.pageContext.site.absoluteUrl; // Get this dynamically if needed
          items.forEach((item, index) => {
            let singleElementHtml = NewsListing.singleElementHtml;
            const itemId = item.ID; // Ensure you have the correct item ID
            const attachmentBaseUrl = `${siteUrl}/Lists/NewsCenter/Attachments/${itemId}/`;
            const pictureData = JSON.parse(item.NewsImage);// Parse the JSON string to extract the filename
            let imageUrl = `${this._ResourceUrl}/images/default_home/news.png`; 

            if (pictureData?.fileName) {
              imageUrl = `${attachmentBaseUrl}${pictureData.fileName}`;
            }
            let createdDateString = item.Created;
            let createdDate = new Date(createdDateString); // Convert the approved date string to a Date object
            let date = this.formatDate(createdDate);

            singleElementHtml = singleElementHtml.replace("__KEY_DATA_TITLE__", item.Title)
              .replace("__KEY_URL_IMG__",imageUrl)
              .replace("__KEY_PUBLISHED_DATE__", date)
              .replace("__KEY_URL_DETAILSPAGE__", `${siteUrl}/SitePages/NewsDetails.aspx?&NewsID=${item.ID}`)
            allElementsHtml += singleElementHtml;
          });
        } catch (error) {
          // Handle error 
          console.error('Error rendering News List:', error); 
        }

    // update the content if there is no records
    if (allElementsHtml == "") { allElementsHtml = NewsListing.noRecord; }
    // update the html content of the webpart
    const divNewsListing: Element | null = this.domElement.querySelector('#divNewsListing');
    if (divNewsListing !== null) divNewsListing.innerHTML = allElementsHtml;
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
