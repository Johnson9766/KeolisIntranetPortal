export default class KeolisNewsListing{

    public static singleElementHtml:string=`   
    <div class="col-12 col-md-6 col-lg-4">
            <a href="__KEY_URL_DETAILSPAGE__" class="w-100 float-start news-centre-box d-flex flex-column">
              <img class="news-centre-img" src="__KEY_URL_IMG__" />
              <div class="d-flex flex-column gap-2 news-centre-details text-color-primary-300">
                <span class="text-sm font-normal">__KEY_PUBLISHED_DATE__</span>
                <p class="font-semibold text-size-22">__KEY_DATA_TITLE__</p>
              </div>
            </a>
          </div>
            
            `;

    public static allElementsHtml:string=` 


    <div class="main-wrapper min-h-screen-container">
    <div class="w-100 float-start inner-page-title">
    <div class="container container-keolis px-3 px-lg-4 clearfix">
        <div class="w-100 float-start my-5">
            <h2 class="section-title">Newsroom</h2>
        </div>
    </div>
    </div>
    <div class="w-100 float-start inner-page-wrapper">
    <div class="container container-keolis px-3 px-lg-4 clearfix">
        <div class="w-100 float-start my-4">
            <div class="row gy-4" id="divNewsListing">
            
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