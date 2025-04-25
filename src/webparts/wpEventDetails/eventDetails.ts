export default class KeolisEventDetails{

    public static singleElementHtml:string=`  
    <div class="w-100 float-start inner-page-title mb-4">
    <div class="w-100 float-start font-semibold py-3 d-flex justify-content-center px-3 px-lg-4">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item">
            <a href="/sites/__KEY_SITE_NAME__/SitePages/home.aspx">
              <svg width="10" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.5 7.31164H2.346V4.77314C2.346 4.65881 2.38483 4.56297 2.4625 4.48564C2.53983 4.40797 2.63567 4.36914 2.75 4.36914H4.25C4.36433 4.36914 4.46033 4.40797 4.538 4.48564C4.61533 4.56297 4.654 4.65881 4.654 4.77314V7.31164H6.5V2.96564C6.5 2.91431 6.48883 2.86764 6.4665 2.82564C6.44417 2.78364 6.41367 2.74697 6.375 2.71564L3.683 0.686641C3.63167 0.641974 3.57067 0.619641 3.5 0.619641C3.42933 0.619641 3.3685 0.641974 3.3175 0.686641L0.625 2.71564C0.586667 2.74764 0.556167 2.78431 0.5335 2.82564C0.510833 2.86697 0.499667 2.91364 0.5 2.96564V7.31164ZM0 7.31164V2.96564C0 2.83764 0.0286666 2.71647 0.086 2.60214C0.143333 2.48781 0.222333 2.39364 0.323 2.31964L3.0155 0.280641C3.1565 0.172974 3.3175 0.119141 3.4985 0.119141C3.6795 0.119141 3.8415 0.172974 3.9845 0.280641L6.677 2.31914C6.778 2.39314 6.857 2.48747 6.914 2.60214C6.97133 2.71647 7 2.83764 7 2.96564V7.31164C7 7.44564 6.95017 7.56247 6.8505 7.66214C6.75083 7.76181 6.634 7.81164 6.5 7.81164H4.558C4.44333 7.81164 4.34733 7.77297 4.27 7.69564C4.19267 7.61797 4.154 7.52197 4.154 7.40764V4.86964H2.846V7.40764C2.846 7.52231 2.80733 7.61831 2.73 7.69564C2.65267 7.77297 2.55683 7.81164 2.4425 7.81164H0.5C0.366 7.81164 0.249167 7.76181 0.1495 7.66214C0.0498332 7.56247 0 7.44564 0 7.31164Z" fill="#1D1D1B"></path>
              </svg>
              Home
          </a>
          </li>
          <li class="breadcrumb-item"><a href="/sites/__KEY_SITE_NAME__/SitePages/EventsListing.aspx">Events</a></li>
          <li class="breadcrumb-item"><a aria-disabled="true" class="disabled-link">Event Details</a></li>
        </ol>
      </nav>
    </div>
      <div class="container container-keolis px-3 px-lg-4 clearfix">
        <div class="w-100 float-start my-4 py-1">
            <div class="row d-flex align-items-center gy-4">
                <div class="col-12 col-lg-6">
                  <div class="w-100 float-start d-flex flex-column">
                      <p class="event-details-para-title mb-2 text-size-32 font-semibold text-color-primary-300">__KEY_DATA_TITLE__</p>
                      <div class="d-flex align-items-center flex-wrap gap-3">
                          <div class="d-flex flex-column gap-1">
                            <div class="d-flex align-items-center gap-2">
                                <img class="flex-shrink-0" src="__KEY_URL_RESOURCE__/images/icons/edit.png">
                                <span class="text-sm keolis-text-color-1">StartDate - __KEY_FULL_START_DATE__</span>
                            </div>
                            <div class="d-flex align-items-center gap-2 ms-4">
                                <span class="text-sm keolis-text-color-1" style="padding-left: 3px;">EndDate - __KEY_FULL_END_DATE__</span>
                            </div>
                            </div>

                         <!-- <div class="d-flex align-items-center gap-2">
                            <img class="flex-shrink-0" src="__KEY_URL_RESOURCE__/images/icons/time.png"/>
                            <span class="text-sm keolis-text-color-1">__KEY_READINGTIME_TIME__ min</span>
                        </div> -->
                      </div>
                  </div>
                </div>
                <div class="col-12 col-lg-6 d-flex justify-content-center justify-content-lg-end">
                  <div class="w-100 float-start event-details-img">
                      <img src="__KEY_URL_IMG__" alt="" />
                  </div>
                </div>
            </div>
        </div>
      </div>
    </div>
    <div class="w-100 float-start inner-page-wrapper">
      <div class="container container-keolis px-3 px-lg-4 clearfix">
        <div class="w-100 float-start mb-4 text-base font-normal news-details-para keolis-text-secondary">
          <p>__KEY_DATA_EVENTDETAILS__ </p>
        </div>
      </div>
    </div>
            `;



public static allElementsHtml:string=`
  <div class="main-wrapper min-h-screen-container" id="divEventDetails">
    
  </div>
`;


   // HTML template for no records
   public static noRecord: string = `
   <div class="col-12 py-3 col-list-row col-news-list news-details-page">
     <div class="news-details-info">
       <p>No News details to display</p>
     </div>
   </div> `;
}