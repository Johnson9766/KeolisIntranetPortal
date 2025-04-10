import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';
// import { escape } from '@microsoft/sp-lodash-subset';

// import styles from './WpTermsAndConditionsWebPart.module.scss';
import * as strings from 'WpTermsAndConditionsWebPartStrings';
import {SPComponentLoader} from '@microsoft/sp-loader';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

import TermsAndConditions from './termsAndConditions'

export interface IWpTermsAndConditionsWebPartProps {
  description: string;
}

export interface ISPLists {
  value: ISPList[];
}
export interface ISPList {
  Id: string;
  Title: string;
  Content:any;
} 

export default class WpTermsAndConditionsWebPart extends BaseClientSideWebPart<IWpTermsAndConditionsWebPartProps> {
  private _ResourceUrl: string = '/sites/IntranetPortal-Dev/SiteAssets/resources';
  private listName:string='TermsAndConditions';
  public async render(): Promise<void> {
    this.domElement.innerHTML = TermsAndConditions.allElementsHtml;
    this.loadCSS();

    let apiUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${this.listName}')/items`;
    await this._renderListAsync(apiUrl);
  }

  // render list asynchronously
  private async _renderListAsync(apiUrl: string): Promise<void> { 
  await this._getListData(apiUrl) 
    .then((response) => { 
        console.log(response);
        this._renderTermsAndConditions(response.value);    
    }); 
  } 

  // render News Details asynchronously
  private async  _renderTermsAndConditions(items: ISPList[]): Promise<void> {
    let allElementsHtml: string = '';
    let contentHtml:string='';
    try {
          //const siteUrl = this.context.pageContext.site.absoluteUrl; // Get this dynamically if needed
      
          items.forEach((item, index) => {
            let sectionNumber = index + 1;
            let title = `${sectionNumber}. ${item.Title}`;
            let singleElementHtml = TermsAndConditions.singleElementHtml;
            let contentLines = item.Content.split('\n');
            let numberedContent = '';
            contentLines.forEach((line:any, subIndex:any) => {
              if (line.trim() !== '') {
                let subNumber = `${sectionNumber}.${subIndex + 1}`;
                numberedContent += `<p>${subNumber} ${line.trim()}</p>`;
              }
            });
            
            singleElementHtml = singleElementHtml.replace("__KEY_DATA_TITLE__", title)
              .replace("__KEY_DATA_CONTENTPTAG__", numberedContent);
            allElementsHtml += singleElementHtml;
          });
        } catch (error) {
          // Handle error 
          console.error('Error rendering News List:', error); 
        }

    // update the content if there is no records
    if (allElementsHtml == "") { allElementsHtml = TermsAndConditions.noRecord; }
    contentHtml += TermsAndConditions.contentsHtml.replace("__KEY_HTML_CONTENT__",allElementsHtml)
    console.log(contentHtml);
    // update the html content of the webpart
    const divNewsListing: Element | null = this.domElement.querySelector('#divTermsAndConditions');
    if (divNewsListing !== null) divNewsListing.innerHTML = contentHtml;
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
