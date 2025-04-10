export default class DepartmentLandingPage{

    public static _SiteUrl:string = window.location.origin;

         public static AnnouncementHtml:string=` 
        <a href="/sites/__KEY_SITE_NAME__/SitePages/DeptAnnoDetails.aspx?&AnnoID=__KEY_ID_ANNO__" class="swiper-slide announcement-dept-box d-flex flex-column">
        <img class="w-100 announcement-dept-img" src="__KEY_ANNO_IMG__" />
        <div class="d-flex flex-column gap-2 announcement-dept-details text-color-primary-300">
        <span class="text-sm font-normal">__KEY_DATE_TIME__</span>
        <p class="font-semibold text-size-22">__KEY_TITLE__</p>
        </div>
    </a>
        `; 
      

            public static NewsHtml:string=` 
            
          <a href="/sites/__KEY_SITE_NAME__/SitePages/DeptNewsDetails.aspx?&NewsID=__KEY_ID_NEWS__" class="swiper-slide news-dept-box d-flex flex-column">
                  <img class="w-100 news-dept-img" src="__KEY_NEWSIMG_URL__" />
                  <div class="d-flex flex-column gap-2 news-dept-details text-color-primary-300">
                    <span class="text-sm font-normal">__KEY_NEWS_DATEANDTIME__</span>
                    <p class="font-semibold text-size-22">__KEY__NEWS_TITLE__</p>
                  </div>
                </a>
    `; 
        public static PhotoHtml:string=` 
                
     <div class="w-100 float-start gallery-grid-dept-img">
                      <img src="__KEY_PHOTOIMG_URL_" />
                      <p class="p-3 text-truncate">__KEY__PHOTOTITLE__</p>
                    </div>
        `; 

        public static Videohtml:string=` 
                
         <div class="w-100 float-start gallery-grid-dept-img">
                       <video class="photo-listing-img" autoplay="" loop="" muted="" poster="">
                    <source src="__KEY_URL_VIDEOGALLERY__" type="video/mp4">
                    Your browser does not support the video tag.
                  </video>
                      <p class="p-3 text-truncate">__KEY__PHOTOTITLE__</p>
                    </div>
        `; 

    public static allElementsHtml:string = `
     <div class="main-wrapper min-h-screen-container">
    <div class="w-100 float-start">
      <div class="container container-keolis px-3 px-lg-4 clearfix">
        <div class="w-100 float-start my-5 department-page">
          <div class="w-100 float-start d-flex flex-column flex-md-row align-items-center gap-4">
              <div class="dept-profile-wrapper flex-shrink-0">
                <img class="w-100 dept-profile-img" src="/sites/IntranetPortal-Dev/SiteAssets/resources/images/department/dept-avatar.png">
                <div class="d-flex flex-column text-center gap-2 dept-profile-details text-color-primary-300">
                  <span class="font-semibold text-size-22 text-uppercase text-color-primary-300 lh-1">Abdullah Khan</span>
                  <p class="font-normal text-sm text-color-disabled lh-1">Head of Department</p>
                </div>
              </div>
              <div class="flex-grow-1 overflow-hidden d-flex flex-column gap-3">
                  <p class="font-semibold text-size-22 text-uppercase text-color-primary-300">About Department</p>
                  <div class="d-flex flex-column gap-3 font-normal text-color-disabled text-base">
                    <p>Pellentesque varius, est vel lacinia hendrerit, orci orci varius odio, at pretium elit ligula eget diam. Nullam at eros sed magna egestas tempus. Aenean sit amet libero at dui aliquam sollicitudin. Sed a placerat risus. Aenean a lorem eu leo venenatis mattis vel eget velit. Aenean nec mauris velit. Phasellus lacinia, tellus ac pharetra.</p>
                    <p>Ut at leo hendrerit, condimentum arcu sit amet, rhoncus massa. Nunc libero odio, dictum nec turpis vel, ultrices bibendum eros. Integer semper at elit at egestas. Fusce vitae ante purus. Etiam et facilisis lorem, pulvinar tristique ante. Nullam ex enim, blandit id hendrerit vitae, auctor et nulla. Morbi tempor tortor non leo maximus, quis rhoncus ante facilisis.</p>
                  </div>
              </div>
          </div>
          <div class="w-100 float-start mt-5">
            <div class="w-100 float-start d-flex justify-content-between gap-2 align-items-center">
              <p class="section-title float-start">Announcemnts</p>
              <a href="/sites/__KEY_SITE_NAME__/SitePages/DeptAnnoListing.aspx" class="view-all-link text-sm font-normal text-color-primary-300 text-decoration-none">View
                All</a>
            </div>
            <div class="w-100 float-start announcement-dept-swiper swiper mt-4">
              <div class="swiper-wrapper" id="AnnouncementID">


              </div>
            </div>
          </div>
          
          <div class="w-100 float-start mt-5">
            <div class="row gy-5">
              <div class="col-12 col-lg-6">
                <div class="w-100 float-start d-flex justify-content-between gap-2 align-items-center">
                  <p class="section-title float-start">Photo Gallery</p>
                  <a href="/sites/__KEY_SITE_NAME__/SitePages/DeptGallery.aspx" class="view-all-link text-sm font-normal text-color-primary-300 text-decoration-none">View
                    All</a>
                </div>
                <div class="w-100 float-start mt-4">
                  <div class="w-100 float-start gallery-grid-dept" id="PhotoVideoGalleryID">

  

                  </div>
                </div>
              </div>
              <div class="col-12 col-lg-6">
                <div class="w-100 float-start d-flex justify-content-between gap-2 align-items-center">
                  <p class="section-title float-start">Document Library</p>
                  <a href="#" class="view-all-link text-sm font-normal text-color-primary-300 text-decoration-none">View
                    All</a>
                </div>
                <div class="w-100 float-start mt-4 d-flex flex-column gap-3 doc-list-wrapper">
                  <div class="doc-list-row d-flex align-items-center gap-3">
                    <img src="__KEY_URL_RESOURCE__/images/icons/doc-icon.png" class="flex-shrink-0" />
                    <p class="font-semibold text-lg text-white">Internal Documents</p>
                  </div>
                  <div class="doc-list-row d-flex align-items-center gap-3">
                    <img src="__KEY_URL_RESOURCE__/images/icons/doc-icon.png" class="flex-shrink-0" />
                    <p class="font-semibold text-lg text-white">Policies and Procedures</p>
                  </div>
                  <div class="doc-list-row d-flex align-items-center gap-3">
                    <img src="__KEY_URL_RESOURCE__/images/icons/doc-icon.png" class="flex-shrink-0" />
                    <p class="font-semibold text-lg text-white">Knowledge Base</p>
                  </div>
                  <div class="doc-list-row d-flex align-items-center gap-3">
                    <img src="__KEY_URL_RESOURCE__/images/icons/doc-icon.png" class="flex-shrink-0" />
                    <p class="font-semibold text-lg text-white">Other</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="w-100 float-start mt-5">
            <div class="w-100 float-start d-flex justify-content-between gap-2 align-items-center">
              <p class="section-title float-start">News</p>
              <a href="/sites/__KEY_SITE_NAME__/SitePages/DeptNewsListing.aspx" class="view-all-link text-sm font-normal text-color-primary-300 text-decoration-none">View
                All</a>
            </div>
            <div class="w-100 float-start news-dept-swiper swiper mt-4">
              <div class="swiper-wrapper" id="NewsID">

              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>

         
    `; 

    // HTML template for no records
    public static noRecord: string = `
    <div class="col-12 col-list-row col-news-list bg-white border uab-border-primary mt-3">
      <div class="w-100 float-start d-flex flex-column align-items-center p-4">
        <p class="text-sm uab-text-primary pt-3 m-0">
            No Records Found
        </p>
      </div>
    </div>
    `;

}