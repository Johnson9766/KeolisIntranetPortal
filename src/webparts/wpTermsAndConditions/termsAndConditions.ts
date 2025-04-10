export default class KeolisEventsListing{

    public static singleElementHtml:string=`   
    <div class="d-flex flex-column">
                <h4 class="font-bold text-base">__KEY_DATA_TITLE__</h4>
                __KEY_DATA_CONTENTPTAG__
                </div>        
            `;
    
    public static contentsHtml: string = `
    <p>By accessing or using this Website, you agree to comply with and be bound by the following terms and conditions. Please read them carefully. If you do not agree with these terms, please refrain from using the Website.</p>
            __KEY_HTML_CONTENT__
    <p>By using this Website, you acknowledge that you have read, understood, and agree to these Terms and Conditions.</p>
    <p>This is a general framework and will need legal review to ensure compliance with local regulations and business needs. Let me know if you'd like further assistance customizing it!</p>
       

    `;

    public static allElementsHtml:string=` 
<div class="main-wrapper min-h-screen-container">
    <div class="w-100 float-start inner-page-title">
      <div class="container container-keolis px-3 px-lg-4 clearfix">
        <div class="w-100 float-start my-5">
            <h2 class="section-title">Terms and Conditions</h2>
        </div>
      </div>
    </div>
    <div class="w-100 float-start inner-page-wrapper">
      <div class="container container-keolis px-3 px-lg-4 clearfix">
        <div class="terms-conditions-wrapper w-100 float-start my-4 keolis-text-secondary text-base d-flex flex-column gap-3" id="divTermsAndConditions">
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