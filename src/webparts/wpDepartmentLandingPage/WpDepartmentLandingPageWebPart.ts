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
  HOD: string;
  AboutDepartment: string;
  SubDepartments: string;
  HODImage:any;
 


}


export default class WpDepartmentLandingPageWebPart extends BaseClientSideWebPart<IWpDepartmentLandingPageWebPartProps> {

  private NewslistName: string = "DepartmentNews"; 
  private AnnolistName: string = "DepartmentAnnouncement"; 
  private PhotoAndVideolistName: string = "DepartmentPhotosAndVideosGallery"; 
  private _ResourceUrl: string = '/sites/IntranetPortal-Dev/SiteAssets/resources';
  private siteName: string = 'IntranetPortal-Dev';
  private DeptDetailslistName: string = "DepartmentDetails"; 
  private deptName : string = "";
  
  //new
  private activeSubDepartment: string | null = null;

  public async render(): Promise<void> {
    this.loadCSS(); 

    const queryStringParams: any = this.getQueryStringParameters();
    // Access specific query string parameters
    let dept: string = queryStringParams['dept'];
    this.deptName = dept;
    // this.domElement.innerHTML = DepartmentLandingPage.allElementsHtml; 
    const finalHtml = DepartmentLandingPage.allElementsHtml
    .replace(/__KEY_SITE_NAME__/g, this.siteName)
    .replace(/__KEY_URL_RESOURCE__/g, this._ResourceUrl)
    .replace(/__KEY_DATA_DEPT__/g,dept)
    .replace("__KEY_DECODED_DEPT__",decodeURIComponent(dept));
this.domElement.innerHTML = finalHtml;

    const workbenchContent = document.getElementById('workbenchPageContent'); 

    if (workbenchContent) { 
  
      workbenchContent.style.maxWidth = 'none'; 
  
    } 

    const NewsapiUrl = `${this.context.pageContext.web.absoluteUrl}/${dept}/_api/web/lists/getbytitle('${this.NewslistName}')/items?$select=*,Created,Author/Title&$expand=Author/Id&$orderby=Created desc&$top=3`; 
    const AnnoapiUrl = `${this.context.pageContext.web.absoluteUrl}/${dept}/_api/web/lists/getbytitle('${this.AnnolistName}')/items?$select=*,Created,Author/Title&$expand=Author/Id&$orderby=SortOrder asc,Created desc&$filter=ActiveStatus eq 1&$top=3`; 
    const PhotoAndVideoapiUrl = `${this.context.pageContext.web.absoluteUrl}/${dept}/_api/web/lists/getbytitle('${this.PhotoAndVideolistName}')/items?$select=*,FileLeafRef,FileDirRef,File/ServerRelativeUrl&$orderby=Created desc&$top=4`; 
    const DepartmentDetailsapiUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${this.DeptDetailslistName}')/items?$filter=Title eq '${encodeURIComponent(dept)}'`;

    await this._renderListAsync(NewsapiUrl,this.NewslistName); 
    await this._renderListAsync(AnnoapiUrl,this.AnnolistName); 
    await this._renderListAsync(PhotoAndVideoapiUrl,this.PhotoAndVideolistName);
    await this._renderListAsync(DepartmentDetailsapiUrl,this.DeptDetailslistName);
    
    this.loadDepartmentJS();
    this.loadHomeJS();
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
        case "DepartmentDetails":
          this._renderAboutDepartment(response.value);
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
  private async _getCurrentUserGroups(): Promise<string[]> {
    try {
      const apiUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/currentuser/groups`;
      const response = await this.context.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1);
      const data = await response.json();
      return data.value.map((group: any) => group.Title);
    } catch (error) {
      console.error("Error fetching user groups:", error);
      return [];
    }
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
  
        let imageUrl = `${this._ResourceUrl}/images/department/default/announcement.png`;
  
        try {
          const itemId = item.Id;
          const attachmentBaseUrl = `${siteUrl}/${this.deptName}/Lists/DepartmentAnnouncement/Attachments/${itemId}/`;
  
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
          .replace("__KEY_DATA_DEPT__",this.deptName)


  
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

  private async _renderAboutDepartment(items: ISPList[]): Promise<void> {
    const queryParams = this.getQueryStringParameters();
    const encodedDept = queryParams['dept']; // Get the encoded value (E%26M)
    const dept = decodeURIComponent(encodedDept); // Decode to get "E&M"
    
    if (!dept) return;

    let deptItem: ISPList | null = null;

    // First try to find exact match in Title from the filtered results
    if (items.length > 0) {
        deptItem = items[0]; // First item should be our match
    } else {
        // If no exact match, fetch all items and check SubDepartments
        const allItemsUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${this.DeptDetailslistName}')/items`;
        const response = await this._getListData(allItemsUrl);
        const allItems = response.value;
        
        // Search through all items
        for (let i = 0; i < allItems.length; i++) {
            const item = allItems[i];
            
            // Check Title (direct match)
            if (item.Title && item.Title === dept) {
                deptItem = item;
                break;
            }
            
            // Check SubDepartments
            if (item.SubDepartments) {
                const subDepartments = item.SubDepartments.split(',');
                for (let j = 0; j < subDepartments.length; j++) {
                    if (subDepartments[j].trim() === dept) {
                        deptItem = item;
                        break;
                    }
                }
                if (deptItem) break;
            }
        }
    }

    if (!deptItem) {
        console.warn(`No department found matching ${dept}`);
        return;
    }

    const siteUrl = this.context.pageContext.site.absoluteUrl; // Get this dynamically if needed
    const attachmentBaseUrl = `${siteUrl}/Lists/DepartmentDetails/Attachments/${deptItem.Id}/`;
    let hodImageUrl = `${this._ResourceUrl}/images/department/dept-avatar.png`;
    if (deptItem.HODImage) {
    
        const hodImageData = JSON.parse(deptItem.HODImage);
        if (hodImageData?.fileName) {
          hodImageUrl = `${attachmentBaseUrl}${hodImageData.fileName}`;
        }
     
    }

    const hodImg = this.domElement.querySelector('#hodImg') as HTMLImageElement;
    if (hodImg) {
      hodImg.src = hodImageUrl;
    }


    // Update UI elements
    const HODName = this.domElement.querySelector('#HODName');
    if (HODName) {
      HODName.textContent = deptItem.HOD || 'No data found';
    }

    const aboutSection = this.domElement.querySelector('#aboutDept');
    if (aboutSection) {
        aboutSection.innerHTML = deptItem.AboutDepartment || 'No data found';
    }

// Get ALL sub-departments
const subDepartments = deptItem.SubDepartments 
? deptItem.SubDepartments.split(',').map(s => s.trim()).filter(s => s)
: [];

// Get user's accessible sub-departments
const userGroups = await this._getCurrentUserGroups();
const userSubDepartments = this._getUserSubDepartments(userGroups, subDepartments);
console.log("userSubDepartments", userSubDepartments)

// Set initial active sub-department (first accessible one if any)
this.activeSubDepartment = userSubDepartments.length > 0 ? userSubDepartments[0] : null;

// Render sub-departments
this._renderSubDepartments(subDepartments, userSubDepartments);

// Update internal documents link
this._updateInternalDocumentsLink();
}

private _getUserSubDepartments(userGroups: string[], subDepartments: string[]): string[] {
  const accessibleSubDepartments: string[] = [];
  
  // Check each user group against sub-departments
  for (let i = 0; i < userGroups.length; i++) {
      const group = userGroups[i];
      // Remove common suffixes
      // const baseGroupName = group.replace(/(Members|Owners|Visitors|Team|Group)$/i, '').trim();
      const baseGroupName = group.replace(/(SubDept)$/i, '').trim();
      
      // Compare with each sub-department
      for (let j = 0; j < subDepartments.length; j++) {
          const subDept = subDepartments[j];
          if (subDept.toLowerCase() === baseGroupName.toLowerCase()) {
              // Check if already added
              let alreadyExists = false;
              for (let k = 0; k < accessibleSubDepartments.length; k++) {
                  if (accessibleSubDepartments[k] === subDept) {
                      alreadyExists = true;
                      break;
                  }
              }
              if (!alreadyExists) {
                  accessibleSubDepartments.push(subDept);
              }
              break;
          }
      }
  }
  
  return accessibleSubDepartments;
}


private _renderSubDepartments(allSubDepartments: string[], userSubDepartments: string[]): void {
  const container = this.domElement.querySelector('#divSubDepartments');
  if (!container) return;

  let html = '';
  for (let i = 0; i < allSubDepartments.length; i++) {
      const subDept = allSubDepartments[i];
      let isAccessible = false;
      
      // Check if user has access
      for (let j = 0; j < userSubDepartments.length; j++) {
          if (userSubDepartments[j] === subDept) {
              isAccessible = true;
              break;
          }
      }

      const isActive = this.activeSubDepartment === subDept;
      const activeClass = isActive ? 'active-subdept' : '';
      const accessibleClass = isAccessible ? 'accessible-subdept' : '';
      const iconUrl = `${this._ResourceUrl}/images/department/subdepts-icon.png`;

      html += `
          <div class="swiper-slide quick-link-box d-flex flex-column align-items-center justify-content-center gap-2 ${accessibleClass} ${activeClass}" 
               style="cursor: ${isAccessible ? 'pointer' : 'default'}; width: 195.333px; margin-right: 12px;"
               data-subdept="${encodeURIComponent(subDept)}">
              <img class="mw-px-64" src="${iconUrl}" alt="${subDept}">
              <p class="w-100 text-center text-lg font-semibold text-white m-0">${subDept}</p>
          </div>
      `;
  }

  container.innerHTML = html || '<div class="swiper-slide">No sub-departments defined</div>';
  this._addSubDeptClickHandlers(userSubDepartments);
  this._initializeSwiper();
}



private _addSubDeptClickHandlers(userSubDepartments: string[]): void {
  // const elements = document.querySelectorAll('#divSubDepartments .accessible-subdept');
  const elements = document.querySelectorAll('#divSubDepartments .quick-link-box');
  for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', () => {
          const subDept = decodeURIComponent(elements[i].getAttribute('data-subdept') || '');
          
          // Only proceed if user has access
          let hasAccess = false;
          for (let j = 0; j < userSubDepartments.length; j++) {
              if (userSubDepartments[j] === subDept) {
                  hasAccess = true;
                  break;
              }
          }
          
          if (hasAccess) {
              // Update active sub-department
              this.activeSubDepartment = subDept;
              
              // Update UI
              const activeElements = document.querySelectorAll('#divSubDepartments .active-subdept');
              for (let j = 0; j < activeElements.length; j++) {
                  activeElements[j].classList.remove('active-subdept');
              }
              elements[i].classList.add('active-subdept');
              
              // Update internal documents link
              this._updateInternalDocumentsLink();
          } else {
            // User doesn't have access - show alert
            alert(`You don't have access to ${subDept}`);
          }
      });
  }
}

private _updateInternalDocumentsLink(): void {
  // Get department from query string
  const queryParams = this.getQueryStringParameters();
  const dept = queryParams['dept'] || '';
  if (!dept) return;

  // Get current active sub-department or empty string
  const activeSubDept = this.activeSubDepartment || '';

  // List of document types and their selectors
  const docTypes = [
      {
          selector: '.internal-doc',
          path: 'Internal Documents'
      },
      {
          selector: '.policies-procedures',
          path: 'Policies and Procedures'
      },
      {
          selector: '.knowledge-base',
          path: 'Knowledge Base'
      }
  ];

    // If user has no sub-departments, set all links to show alert
    if (!this.activeSubDepartment) {
      for (let i = 0; i < docTypes.length; i++) {
          const linkElement = this.domElement.querySelector(docTypes[i].selector);
          if (linkElement) {
              linkElement.setAttribute('onclick', `alert('Access denied: You are not associated with any sub-departments.'); return false;`);
          }
      }
      return;
  }

  // Update each document link
  for (let i = 0; i < docTypes.length; i++) {
      const docType = docTypes[i];
      const linkElement = this.domElement.querySelector(docType.selector);
      
      if (linkElement) {
        const encodeSharePoint = (str: string) => {
          return str.replace(/ /g, '%20')  // Convert spaces to %20
                   .replace(/&/g, '')   // Convert & to %20 (specific to your case)
                   .replace(/'/g, '%27')   // Single quotes
                   .replace(/"/g, '%22');  // Double quotes
        };

          // Encode each path component separately
          //const encodedDept = encodeURIComponent(dept);
          const encodedDept = dept;

          const encodedPath = encodeURIComponent(docType.path);
          // const encodedSubDept = encodeURIComponent(activeSubDept);
          const encodedSubDept = encodeSharePoint(activeSubDept);

          // Build the URL
          const newUrl = `/sites/IntranetPortal-Dev/${encodedDept}/${encodedSubDept}/${encodedPath}`;
          
          // Update the onclick attribute
          linkElement.setAttribute('onclick', `window.open('${newUrl}', '_blank');`);
      }
  }
}


private _initializeSwiper(): void {
  // Initialize swiper if the library is available
  if ((window as any).Swiper) {
      new (window as any).Swiper('.quick-links-swiper', {
          slidesPerView: 'auto',
          spaceBetween: 12,
          freeMode: true,
          watchOverflow: true,
          // Add any other swiper configuration you need
      });
  } else {
      console.warn('Swiper library not loaded');
      // Optionally load Swiper dynamically if needed
      // SPComponentLoader.loadScript('https://unpkg.com/swiper/swiper-bundle.min.js');
  }
}



  private async _renderNewsList(items: ISPList[]): Promise<void> {
    let listItemsHtml = "";

    try {
      const siteUrl = this.context.pageContext.site.absoluteUrl;
  
      for (const item of items) {
        const title = item.Title || "No Title";
        let imageUrl = `${this._ResourceUrl}/images/department/default/news.png`; 
        try {
          const itemId = item.Id;
          const attachmentBaseUrl = `${siteUrl}/${this.deptName}/Lists/DepartmentNews/Attachments/${itemId}/`;
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
          .replace("__KEY_DATA_DEPT__",this.deptName)
  
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
        const title = item.FileLeafRef || 'No Title';
  
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

  private loadDepartmentJS(): void {
    // Remove existing instance if it exists
    const existingScript = document.querySelector('script[src*="department.js"]');
    if (existingScript) {
        existingScript.remove();
    }
  
    // Create new script element with cache busting
    const script = document.createElement('script');
    script.src = `${this.context.pageContext.site.absoluteUrl}/SiteAssets/resources/js/department.js?t=${new Date().getTime()}`;
    script.async = true;
    
    // Add to head
    document.head.appendChild(script);
  }

  private loadHomeJS(): void {
    // Remove existing instance if it exists
    const existingScript = document.querySelector('script[src*="home.js"]');
    if (existingScript) {
        existingScript.remove();
    }
  
    // Create new script element with cache busting
    const script = document.createElement('script');
    script.src = `${this.context.pageContext.site.absoluteUrl}/SiteAssets/resources/js/home.js?t=${new Date().getTime()}`;
    script.async = true;
    
    // Add to head
    document.head.appendChild(script);
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
