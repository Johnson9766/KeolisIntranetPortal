import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';

import {SPComponentLoader} from '@microsoft/sp-loader'

import * as strings from 'WpDeptAnnoListingWebPartStrings';
import deptAnnoListing from './DeptAnnoListing';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export interface IWpDeptAnnoListingWebPartProps {
  description: string;
}
export interface ISPLists {
  value: ISPList[];
}
export interface ISPList {
  Id: string;
  Title: string;
  AnnouncementImage:any;
  Created:any;

} 
export default class WpDeptAnnoListingWebPart extends BaseClientSideWebPart<IWpDeptAnnoListingWebPartProps> {

  private _ResourceUrl: string = '/sites/IntranetPortal-Dev/SiteAssets/resources';
  private listName:string='DepartmentAnnouncement';


  
  public async render(): Promise<void> {
    this.domElement.innerHTML = deptAnnoListing .deptAllElementsHtml;
    this.loadCSS();
    const workbenchContent = document.getElementById('workbenchPageContent'); 

    if (workbenchContent) { 
  
      workbenchContent.style.maxWidth = 'none'; 
  
    } 
  
    let apiUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${this.listName}')/items?$select=*,Created,Author/Title&$expand=Author/Id&$orderby=SortOrder asc,Created desc&$filter=ActiveStatus eq 1`;
    await this._renderListAsync(apiUrl);   
  }

  // render list asynchronously
  private async _renderListAsync(apiUrl: string): Promise<void> { 
  await this._getListData(apiUrl) 
    .then((response) => { 
        console.log(response);
        this._renderAnnoListing(response.value);    
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
  private async  _renderAnnoListing(items: ISPList[]): Promise<void> {
    let allElementsHtml: string = '';
    try {
          const siteUrl = this.context.pageContext.site.absoluteUrl; // Get this dynamically if needed
      
          items.forEach((item, index) => {
            let singleElementHtml = deptAnnoListing .deptSingleElementHtml;
            const itemId = item.Id; // Ensure you have the correct item ID
            const attachmentBaseUrl = `${siteUrl}/Lists/DepartmentAnnouncement/Attachments/${itemId}/`;
            const pictureData = JSON.parse(item.AnnouncementImage);// Parse the JSON string to extract the filename
            const fileName = attachmentBaseUrl+pictureData.fileName; // Extract the actual filename
            let createdDateString = item.Created;
            let createdDate = new Date(createdDateString); // Convert the approved date string to a Date object
            let formattedCreatedDate = this.formatDate(createdDate);

            singleElementHtml = singleElementHtml.replace("__KEY_DATA_TITLE__", item.Title)
              .replace("__KEY_START_DATE__", formattedCreatedDate)
              .replace("__KEY_URL_IMG__",fileName)
              .replace("__KEY_URL_DEPTDETAILSPAGE__", `${siteUrl}/SitePages/DeptAnnoDetails.aspx?&AnnoID=${item.Id}`);
            allElementsHtml += singleElementHtml;
          });
        } catch (error) {
          // Handle error 
          console.error('Error rendering News List:', error); 
        }

    // update the content if there is no records
    if (allElementsHtml == "") { allElementsHtml = deptAnnoListing .noRecord; }
    // update the html content of the webpart
    const divNewsListing: Element | null = this.domElement.querySelector('#divDeptAnnoListing');
    if (divNewsListing !== null) divNewsListing.innerHTML = allElementsHtml;
  }
    
  //helper functions

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


  private loadHome():void{

    SPComponentLoader.loadScript(`/sites/IntranetPortal-Dev/SiteAssets/resources/js/common.js`);
    SPComponentLoader.loadScript(`/sites/IntranetPortal-Dev/SiteAssets/resources/js/home.js`);        
  }
 

private loadCSS(): void {
    // Load CSS files
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
    SPComponentLoader.loadCss(`${this._ResourceUrl}/css/event.css`);

    // Load home.js after CSS files are loaded
        setTimeout(this.loadHome,1000);

}



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
