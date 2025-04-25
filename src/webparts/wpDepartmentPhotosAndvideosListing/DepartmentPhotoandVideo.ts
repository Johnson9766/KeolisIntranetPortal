export default class DepatmentPhotoandVideo{

    public static _SiteUrl:string = window.location.origin;

         public static deptImageElementHtml:string=` 
          
                      <div class="col-12 col-md-6 col-lg-4">
                  <div class="w-100 float-start photo-listing-box d-flex flex-column">
                    <img class="photo-listing-img" src="_KEY_DEPTIMAGE_URL"  />
                       <div class="d-flex flex-column gap-2 photo-listing-desc text-color-primary-300">
                      <p class="font-normal keolis-text-secondary text-base mb-0">_KEY_IMAGE_TITLE</p>
                    </div>
                  </div>
                </div>
        `; 
      
        // HTML template for a single video element
        public static deptVideoElementHtml: string=`
     
     <div class="col-12 col-md-6 col-lg-4">
                <div class="w-100 float-start photo-listing-box d-flex flex-column">
                  <video class="photo-listing-img" autoplay="" loop="" muted="" poster="">
                    <source src="__KEY_URL_DEPTVIDEOGALLERY__" type="video/mp4">
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

      <div class="w-100 float-start font-semibold py-3 d-flex justify-content-center px-3 px-lg-4">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item">
            <a href="/sites/__KEY_SITE_NAME__/SitePages/DepartmentHomepage.aspx?dept=__KEY_DEPT_NAME__">
              <svg width="10" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.5 7.31164H2.346V4.77314C2.346 4.65881 2.38483 4.56297 2.4625 4.48564C2.53983 4.40797 2.63567 4.36914 2.75 4.36914H4.25C4.36433 4.36914 4.46033 4.40797 4.538 4.48564C4.61533 4.56297 4.654 4.65881 4.654 4.77314V7.31164H6.5V2.96564C6.5 2.91431 6.48883 2.86764 6.4665 2.82564C6.44417 2.78364 6.41367 2.74697 6.375 2.71564L3.683 0.686641C3.63167 0.641974 3.57067 0.619641 3.5 0.619641C3.42933 0.619641 3.3685 0.641974 3.3175 0.686641L0.625 2.71564C0.586667 2.74764 0.556167 2.78431 0.5335 2.82564C0.510833 2.86697 0.499667 2.91364 0.5 2.96564V7.31164ZM0 7.31164V2.96564C0 2.83764 0.0286666 2.71647 0.086 2.60214C0.143333 2.48781 0.222333 2.39364 0.323 2.31964L3.0155 0.280641C3.1565 0.172974 3.3175 0.119141 3.4985 0.119141C3.6795 0.119141 3.8415 0.172974 3.9845 0.280641L6.677 2.31914C6.778 2.39314 6.857 2.48747 6.914 2.60214C6.97133 2.71647 7 2.83764 7 2.96564V7.31164C7 7.44564 6.95017 7.56247 6.8505 7.66214C6.75083 7.76181 6.634 7.81164 6.5 7.81164H4.558C4.44333 7.81164 4.34733 7.77297 4.27 7.69564C4.19267 7.61797 4.154 7.52197 4.154 7.40764V4.86964H2.846V7.40764C2.846 7.52231 2.80733 7.61831 2.73 7.69564C2.65267 7.77297 2.55683 7.81164 2.4425 7.81164H0.5C0.366 7.81164 0.249167 7.76181 0.1495 7.66214C0.0498332 7.56247 0 7.44564 0 7.31164Z" fill="#1D1D1B"></path>
              </svg>
              Department Home
          </a>
          </li>
          <li class="breadcrumb-item"><a class="disabled-link" aria-disabled="true">Photos and Videos</a></li>
        </ol>
      </nav>
    </div>


      <div class="container container-keolis px-3 px-lg-4 clearfix">
        <div class="w-100 float-start my-5">
            <h2 class="section-title">Photos and Videos</h2>
        </div>
      </div>
    </div>
    <div class="w-100 float-start inner-page-wrapper">
      <div class="container container-keolis px-3 px-lg-4 clearfix">
        <div class="w-100 float-start my-4">
            <div class="row gy-3 gx-3" id ="deptPhotoVideoListings">

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
   <div class="modal-body text-center" id="modal-media-container">
        <!-- Media will be injected here -->

      </div>
      <!-- <div class="w-100 float-start text-center pb-4">
      <img src="__KEY_URL_RESOURCE__/images/icons/readmore.png" alt="Read More" class="modal-read-more-img cursor-pointer" />
    </div>-->
    
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