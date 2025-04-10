export default class WpPhotoAndVideoListingsWebPart{

    public static _SiteUrl:string = window.location.origin;

         public static imageElementHtml:string=` 
          
                      <div class="col-12 col-md-6 col-lg-4">
                  <div class="w-100 float-start photo-listing-box d-flex flex-column">
                    <img class="photo-listing-img" src="_KEY_IMAGE_URL"  />
                       <div class="d-flex flex-column gap-2 photo-listing-desc text-color-primary-300">
                      <p class="font-normal keolis-text-secondary text-base mb-0">_KEY_IMAGE_TITLE</p>
                    </div>
                  </div>
                </div>
        `; 
      
        // HTML template for a single video element
        public static videoElementHtml: string=`
     
     <div class="col-12 col-md-6 col-lg-4">
                <div class="w-100 float-start photo-listing-box d-flex flex-column">
                  <video class="photo-listing-img" autoplay="" loop="" muted="" poster="">
                    <source src="__KEY_URL_VIDEOGALLERY__" type="video/mp4">
                    Your browser does not support the video tag.
                  </video>
                  <div class="d-flex flex-column gap-2 photo-listing-desc text-color-primary-300">
                    <p class="font-normal keolis-text-secondary text-base">_KEY_IMAGE_TITLE</p>
                  </div>
                </div>
              </div>
    
        `;

  

    public static html:string = `
   <div class="main-wrapper min-h-screen-container">
    <div class="w-100 float-start inner-page-title">
      <div class="container container-keolis px-3 px-lg-4 clearfix">
        <div class="w-100 float-start my-5">
            <h2 class="section-title">Photos and Videos</h2>
        </div>
      </div>
    </div>
    <div class="w-100 float-start inner-page-wrapper">
      <div class="container container-keolis px-3 px-lg-4 clearfix">
        <div class="w-100 float-start my-4">
            <div class="row gy-3 gx-3" id ="photoVideoListings">

            </div>
             <div class="w-100 float-start mb-4 px-4 d-flex justify-content-center">
              <div id='divMessage'></div>              
           
                 </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal HTML -->
<div class="modal fade" id="photo-video-modal">
  <div class="modal-dialog modal-xl modal-dialog-centered">
    <div class="modal-content relative">
      <div class="modal-header border-top-0 d-flex justify-content-end border-bottom-0">
        <img src="__KEY_URL_RESOURCE__/images/icons/close-modal.png" data-bs-dismiss="modal" class="float-start cursor-pointer modal-close-icon" />
      </div>
      <div class="modal-body text-center">
        <!-- Add ID here -->
        <img id="modal-image-preview" src="" />


         <video id="modal-video-preview" class="photo-listing-img" autoplay="" loop="" muted="" poster="">
   <source src="" type="video/mp4">
    Your browser does not support the video tag.
   </video>
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