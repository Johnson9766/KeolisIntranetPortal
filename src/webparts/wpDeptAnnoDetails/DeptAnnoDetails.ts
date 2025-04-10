export default class deptAnnoDetails{

    public static singleElementHtml:string=`  
    <div class="w-100 float-start inner-page-title mb-4">
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

                          <div class="d-flex align-items-center gap-2">
                            <img class="flex-shrink-0" src="__KEY_URL_RESOURCE__/images/icons/time.png"/>
                            <span class="text-sm keolis-text-color-1">__KEY_READINGTIME_TIME__ min</span>
                        </div>
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
  <div class="main-wrapper min-h-screen-container" id="divDeptAnnoDetails">
    
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