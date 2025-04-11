export default class announcementHtml{


  public static singleAnnouncementSliderElementHtml = `<div class="swiper-slide announcement-swiper-slide d-flex flex-column-reverse flex-sm-row">
                      <div
                        class="announcement-swiper-details flex-grow-1 overflow-hidden d-flex flex-column gap-2 pe-4 align-self-end">
                        <p class="font-semibold text-lg keolis-text-secondary">__KEY_DATA_TITLE__</p>
                        <p class="font-normal text-sm keolis-text-secondary">__KEY_DATA_DESC__</p>
                        <a href="__KEY_URL_DETAILSPAGE__"
                          class="keolis-btn keolis-btn-primary learn-more-btn text-white align-self-start mt-1">Learn
                          More</a>
                      </div>
                      <div class="announcement-img-box d-flex mx-auto mx-sm-0 align-items-sm-end flex-shrink-0">
                        <img src="__KEY_URL_IMG__" />
                      </div>
                    </div>
                 `;


                public static singleAnnouncementListElementHtml =`   
                     <div class="w-100 float-start d-flex align-items-center announcement-list-row gap-3">
                  <div class="d-flex flex-column gap-1 flex-grow-1 overflow-hidden">
                    <p class="text-sm font-semibold keolis-text-secondary">__KEY_DATA_TITLE__</p>
                    <p class="text-sm font-normal text-color-disabled line-clamp-3">__KEY_DATA_DESC__</p>
                  </div>
                  <img class="flex-shrink-0" src="__KEY_URL_IMG__" />
                </div>`;


                public static singleQuickLinkElement=`
                <div class="swiper-slide quick-link-box d-flex flex-column align-items-center justify-content-center gap-2" onclick="window.open('__KEY_URL_LINK__', '_blank');" style="cursor: pointer;">
                <img class="mw-px-64" src="__KEY_URL_IMGICON__" alt="Help Desk" />
                <p class="w-100 text-center text-truncate text-lg font-semibold text-white m-0">__KEY_DATA_TITLE__</p>
              </div>
             `;

              public static singleNewsCentreElement=`
              <a href="/sites/IntranetPortal-Dev/SitePages/NewsDetails.aspx?&NewsID=__KEY_ID_NEWS__" class="swiper-slide news-centre-box d-flex flex-column">
                <img class="w-100 news-centre-img" src="__KEY_URL_IMG__" />
                <div class="d-flex flex-column gap-2 news-centre-details text-color-primary-300">
                  <span class="text-sm font-normal">__KEY_PUBLISHED_DATE__</span>
                  <p class="font-semibold text-size-22">__KEY_DATA_TITLE__</p>
                </div>
              </a>`;

              public static imageGallerySingleElement=`<div class="w-100 float-start gallery-grid-img __KEY_CLASS_LARGEIMG__">
                    <img src="__KEY_URL_IMGVID__" />
                  </div>
              `;
              public static defaultImageGallerySingleElement=`<div class="w-100 float-start gallery-grid-img __KEY_CLASS_LARGEIMG__">
              <img src="__KEY_URL_RESOURCE__/images/gallery/gallery-1.png" />
            </div>
        `;


             public static videoGallerySingleElement = `
        <div class="w-100 float-start gallery-grid-img __KEY_CLASS_LARGEIMG__ d-flex align-items-center justify-content-center overflow-hidden">
          <video controls autoplay loop muted poster="" playsinline class="w-100 h-100" style="object-fit: cover;">
            <source src="__KEY_URL_VIDGallery__" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      `;


              public static singleUpcomingEventElement=` <div class="event-list-row d-flex" onclick="window.location.href='__KEY_URL_EVENTDETAILS__'" style="cursor: pointer;">
                  <div
                    class="event-list-date d-flex flex-column align-items-center justify-content-center flex-shrink-0">
                    <span class="keolis-text-secondary font-semibold text-size-32">__KEY_DATA_DAY__</span>
                    <p class="text-sm keolis-text-secondary">__KEY_DATA_MONTH__</p>
                  </div>
                  <div
                    class="event-list-info flex-grow-1 d-flex flex-column gap-2 justify-content-center overflow-hidden keolis-text-secondary">
                    <p class="font-semibold text-lg">__KEY_DATA_TITLE__</p>
                    <span class="font-normal text-lg">__KEY_DATA_STARTTIME__ - __KEY_DATA_ENDTIME__</span>
                  </div>
                </div>`;



            public static allElementsHtml = 
 `          
  <div class="main-wrapper min-h-screen-container">
    <div class="w-100 float-start home-page">
      <div class="container container-keolis px-3 px-lg-4 clearfix">
        <div class="w-100 float-start my-5">
          <p class="section-title w-100 float-start">Welcome User!</p>
          <div class="announcement-wrapper w-100 float-start mt-4 bg-white p-4">
            <div class="row gy-5">
              <div class="col-12 col-lg-7">
                <div class="w-100 float-start position-relative">
                  <p class="text-color-primary text-xs font-semibold announcement-title">ANNOUNCEMENTS</p>
                  <div class="w-100 float-start announcement-swiper swiper">
                    <div class="swiper-wrapper" id="announcementSlider">
                    
                  
                    </div>
                  </div>
                  <div class="announcement-slide-controls d-flex gap-3">
                    <div class="announcement-slide-control-btn announcement-slide-prev"></div>
                    <div class="announcement-slide-control-btn announcement-slide-next"></div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-lg-5 d-flex flex-column gap-4">
                <div class="w-100 float-start d-flex flex-column gap-3" id="announcementElement">
                  
                  
                  

                </div>
                <a href="__KEY_URL_ANNOLISTING__"
                  class="view-all-link text-sm font-normal text-color-primary-300 text-decoration-none align-self-center">View
                  All</a>
              </div>
            </div>
          </div>
          <div class="w-100 float-start mt-4">
            <p class="section-title w-100 float-start">Quick Links</p>
            <div class="quick-links-swiper swiper mt-4">
              <div class="swiper-wrapper" id="quickLinks">
              
              </div>
            </div>
          </div>

         <div class="w-100 float-start mt-5">
          <div class="w-100 float-start d-flex justify-content-between gap-2 align-items-center">
            <p class="section-title float-start">News Centre</p>
            <a href="__KEY_URL_NEWSLISTING__" class="view-all-link text-sm font-normal text-color-primary-300 text-decoration-none">View
              All</a>
          </div>
          <div class="w-100 float-start news-centre-swiper swiper mt-4">
            <div class="swiper-wrapper" id="newsCenter">
             
            
            </div>
          </div>
        </div>


        <div class="w-100 float-start mt-5">
          <div class="row gy-5">
            <div class="col-12 col-lg-7">
              <div class="w-100 float-start d-flex justify-content-between gap-2 align-items-center">
                <p class="section-title float-start">Video & Photo Gallery</p>
                <a href="__KEY_URL_PHOTOVDOLISTING__" class="view-all-link text-sm font-normal text-color-primary-300 text-decoration-none">View
                  All</a>
              </div>
              <div class="w-100 float-start mt-4">
                <div class="w-100 float-start gallery-grid" id="photosAndVideos">
                  
                </div>
              </div>
            </div>
            <!---gallery-grid-img-lg---!>


            <div class="col-12 col-lg-5">
              <div class="w-100 float-start d-flex justify-content-between gap-2 align-items-center">
                <p class="section-title float-start">Upcoming Event List</p>
                <a href="__KEY_URL_EVENTSLISTING__" class="view-all-link text-sm font-normal text-color-primary-300 text-decoration-none">View
                  All</a>
              </div>
              <div class="w-100 float-start mt-4 d-flex flex-column gap-3 event-list-wrapper" id="upcomingEvents">
             
                
              
                
               
              </div>
            </div>
          </div>
        </div>

        <div class="w-100 float-start mt-5">
            <p class="section-title w-100 float-start">Yammer feeds</p>
            <div class="w-100 float-start mt-4">
            </div>
          </div>

      </div>

    </div>

  </div>

</div>




        
   `;

      // HTML template when there is no records to show
  public static noRecord: string = 
  `<div class="col-12 px-4 col-list-row col-list-offers">
      <div class="w-100 d-flex align-items-center uab-border-primary py-3">
      <p class="m-0 text-sm text-truncate">
      No Records Found
      </p>
      </div>
  </div>
  `; 

}