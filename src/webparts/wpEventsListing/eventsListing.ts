export default class KeolisEventsListing{

    public static singleElementHtml:string=`   
    <div class="col-12 col-md-6">
                <a href="__KEY_URL_DETAILSPAGE__" class="w-100 float-start event-list-link d-flex flex-column flex-sm-row align-items-center">
                  <img class="event-list-img" src="__KEY_URL_IMG__" />
                  <div class="d-flex flex-column gap-2 event-list-details text-color-primary-300 p-4 align-self-start align-self-sm-center">
                    <span class="text-sm font-normal">__KEY_START_DATE__</span>
                    <p class="font-semibold text-size-22 text-color-primary-300">__KEY_DATA_TITLE__</p>
                  </div>
                </a>
              </div>
            
            `;

    public static allElementsHtml:string=` 
<div class="main-wrapper min-h-screen-container">
    <div class="w-100 float-start inner-page-title">
      <div class="container container-keolis px-3 px-lg-4 clearfix">
        <div class="w-100 float-start my-5">
            <h2 class="section-title">Events</h2>
        </div>
      </div>
    </div>
    <div class="w-100 float-start inner-page-wrapper">
      <div class="container container-keolis px-3 px-lg-4 clearfix">
        <div class="w-100 float-start my-4 py-1">
            <div class="row gy-4" id="divEventsListing">
              
            </div>
        </div>
      </div>
    </div>
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