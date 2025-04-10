import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';
import NewsDetails from './DepartmentNewsDetails';

import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import {SPComponentLoader} from '@microsoft/sp-loader';
import * as strings from 'WpDepartmentNewsDetailsWebPartStrings';

export interface IWpDepartmentNewsDetailsWebPartProps {
  description: string;
}
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

export default class WpDepartmentNewsDetailsWebPart extends BaseClientSideWebPart<IWpDepartmentNewsDetailsWebPartProps> {

  private _ResourceUrl: string = '/sites/IntranetPortal-Dev/SiteAssets/resources';

  private listName:string='DepartmentNews'


  // private _isDarkTheme: boolean = false;
  // private _environmentMessage: string = '';
  public async render(): Promise<void> {

    NewsDetails.deptallElementsHtml = NewsDetails.deptallElementsHtml.replace(/__KEY_URL_RESOURCE__/g,this._ResourceUrl); 
      this.domElement.innerHTML = NewsDetails.deptallElementsHtml;
      console.log(this.domElement.innerHTML);
        this.loadCSS();
        

    // function call to extract query string parameters
    const queryStringParams: any = this.getQueryStringParameters();
    // Access specific query string parameters
    let ID: string = queryStringParams['NewsID'];
    console.log(ID);
    this._renderSuggestedNewsDetails(ID);

    // If the ID parameter is null or "0", set it to "1" as a default value
    if (ID == null || ID == "0") ID = "1";

    // Api for retrieve the items from the "News" list
    let apiUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${this.listName}')/items(${ID})?$select=*,ID,Title,MainContent,Created,Author/Title,Author/Department&$expand=Author`;
    await this._renderListAsync(apiUrl); 
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
  
    
    private _getFormattedText(text: string): string {
 
      const tempElement = document.createElement("div");
   
      // Set the innerHTML to the provided HTML content
      tempElement.innerHTML = text || "";
   
      // Remove unnecessary elements like <div>, <span> with id attributes
      const cleanContent = tempElement.innerHTML
          .replace(/<div[^>]*>/g, '')  // Remove all <div> tags
          .replace(/<\/div>/g, '')     // Remove closing </div> tags
          .replace(/id="[^"]*"/g, '')  // Remove all "id" attributes
          .replace(/<\/?span[^>]*>/g, ''); // Remove <span> tags but keep content
   
      console.log(cleanContent.trim());
   
      return cleanContent.trim();  // Return the cleaned content
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

  // render list asynchronously
 private async _renderListAsync(apiUrl: string): Promise<void> { 
  await this._getListData(apiUrl) 
    .then((response) => { 
        console.log(response);
        this._renderNewsDetails(response);    
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
  private async  _renderNewsDetails(item: ISPList): Promise<void> {
    let allElementsNewsHtml = '';
    let allElementDesc = '';
     let newsElementHtml = '';
     let newsDescriptionHtml = '';

    try {
            // console.log(item.Image);
    
          const siteUrl = this.context.pageContext.site.absoluteUrl; // Get this dynamically if needed
     
          
          const itemId = item.ID; // Ensure you have the correct item ID
     
          const attachmentBaseUrl = `${siteUrl}/Lists/DepartmentNews/Attachments/${itemId}/`;
          // console.log(attachmentBaseUrl);
     
          // Parse the JSON string to extract the filename
          const pictureData = JSON.parse(item.NewsImage);
          const fileName = attachmentBaseUrl+pictureData.fileName; // Extract the actual filename
          console.log(fileName);
           
    
            let createdDateString = item.Created;
            // console.log(item.Created); 
    
            // Convert the approved date string to a Date object
            let createdDate = new Date(createdDateString);
            let date = this.formatDate(createdDate)
            // let time = this.formatTime(createdDate);

            // Reading Time Calculation
            const eventDetailsText = item.MainContent || '';
            const wordCount = eventDetailsText.trim().split(/\s+/).length;
            const readingSpeedWPM = 200;
            const estimatedReadingTimeMin:any = Math.ceil(wordCount / readingSpeedWPM);
    
            // console.log(time)
            // // Replace placeholder with actual data for main Section image
            newsElementHtml = NewsDetails.deptsingleElementHtml
            
              
              .replace("__KEY_DATA_TITLE__", item.Title)
              .replace("__KEY_URL_IMG__",fileName)
              .replace("__KEY_PUBLISHED_DATE__", date)
              .replace("__KEY_READINGTIME_TIME__",estimatedReadingTimeMin)
              .replace(/__KEY_URL_RESOURCE__/g,this._ResourceUrl);

              let content = this._getFormattedText(item.MainContent);

              newsDescriptionHtml = NewsDetails.deptsingleElementNewsDescription
              .replace("__KEY_DATA_NEWSDECRIPTION__", content)
    
            allElementsNewsHtml += newsElementHtml; 
            allElementDesc += newsDescriptionHtml; 
        
        } catch (error) {
          // Handle error gracefully
          console.error('Error rendering Announcement:', error); 
        }
        // if no announcements, then display no record msg
        if (allElementsNewsHtml == "") { allElementsNewsHtml = NewsDetails.noRecord; }
    
        // update the html content of the main section in webpart

        const divactiveNews: Element = this.domElement.querySelector('#deptActiveNews')!;
        divactiveNews.innerHTML = allElementsNewsHtml;

        const divactiveNewsDesc: Element = this.domElement.querySelector('#deptNewsDescription')!;
        divactiveNewsDesc.innerHTML = allElementDesc;

    
      }

        // render News Details asynchronously
  private async  _renderSuggestedNewsDetails(currentNewsID: string): Promise<void> {
    let allElementsRemainingNewsHtml = '';
     let singleElementRemainingNewsHtml = '';
     try {
     const apiUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${this.listName}')/items?$select=ID,Title,NewsImage,Created,Author/FirstName,Author/LastName,MainContent,FileLeafRef,FileRef&$expand=AttachmentFiles,Author&$filter=ID ne ${currentNewsID}&$orderby=ID desc&$top=4`;
     await this._getListData(apiUrl) 
     .then((response) => { 
         console.log(response);
         var items :ISPList[] = response.value;
        //  console.log(items);
        
        
         items.forEach((item, index) => {
           // Get the current item
        
          const siteUrl = this.context.pageContext.site.absoluteUrl; // Get this dynamically if needed
          const itemId = item.ID; // Ensure you have the correct item ID
        
          const attachmentBaseUrl = `${siteUrl}/Lists/DepartmentNews/Attachments/${itemId}/`;
          // console.log(attachmentBaseUrl);
        
        // alert(4);

          // Parse the JSON string to extract the filename
          const pictureData = JSON.parse(item.NewsImage);
          const fileName = attachmentBaseUrl + pictureData.fileName; // Extract the actual filename
          // console.log(fileName);
        // alert(5);
          singleElementRemainingNewsHtml = NewsDetails.deptremainingNewsHtml;
        
          let createdDateString = item.Created;
        
          // Convert the approved date string to a Date object
          let createdDate = new Date(createdDateString);
          let date = this.formatDate(createdDate)
          // let time = this.formatTime(createdDate);
        
          // console.log(time)
        
          singleElementRemainingNewsHtml = singleElementRemainingNewsHtml
            .replace("__KEY_DATA_TITLE__", item.Title)
            .replace("__KEY_URL_IMG__", fileName)
            .replace("__KEY_PUBLISHED_DATE__", date)
        
          allElementsRemainingNewsHtml += singleElementRemainingNewsHtml;
        })
        
     }); 
        } catch (error) {
          // Handle error gracefully
          console.error('Error rendering Announcement:', error); 
        }
        // if no announcements, then display no record msg
        if (allElementsRemainingNewsHtml == "") { allElementsRemainingNewsHtml = NewsDetails.noRecord; }
    
        // update the html content of the main section in webpart

        const divRemainingNewsCenter: Element = this.domElement.querySelector('#deptRemainingNewsElements')!;
        divRemainingNewsCenter.innerHTML = allElementsRemainingNewsHtml;
        console.log(divRemainingNewsCenter);

      }
    
    

  // function to get publishing image for News Details 
  

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

    // Load home.js after CSS files are loaded
        setTimeout(this.loadHome,1000);

}




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
