
var UI_relatedCameraInfoObjectsList=[];
var RequestCameraObjectsList={};
var ResponseCameraObjectsList={};

var GetCameraInfoMethodname="getCameraInfo";
var GetImagesOfReqCamerasMethodname = "GetImagesOfReqCameras";
var MaxImagesShouldBuffer = 2;
var LeftDirection = "left"; /* Carousel- Directions */
var RightDirection = "right";
var ActualImagesOfRequestedCameras;
var periodical_responseobj = [];
var FullscreenStatus = false;
/* Thumbnails_related variables */
var Prev_td = null;
var Globalfullscreenobj = null;

$(document).ready(function(){

    $('.thumbnail_container').hide(); /* To Hide Thumbnail div hide by default */
  
    $('#Cameras-row').empty(); /* To Empty all the Camera Div which are created for Layout Testing */

  /* Start of Sending Request to the Server to get CameraInformation*/
    console.log('Document.ready()');
    console.log('Started at');
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds() + " "
        + currentdate.getMilliseconds();
    console.log(datetime);

    var request_obj = {};
    request_obj.tmp_data_str = "JustCausual";
    request_obj = '{tmpinfo: ' + JSON.stringify(request_obj) + '}';
    ajax_request(request_obj, GetCameraInfoMethodname);  // Calling Ajax Method for creating Grids based on the configuration..

    console.log(' After processing of AjaxRequest');
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds() + " "
        + currentdate.getMilliseconds();

    console.log(datetime);
    

    /* To Enalble Lazyloading functionality */
    // $(window).scroll(lazyload);
});

document.addEventListener('fullscreenchange', exitHandler);
document.addEventListener('webkitfullscreenchange', exitHandler);
document.addEventListener('mozfullscreenchange', exitHandler);
document.addEventListener('MSFullscreenChange', exitHandler);

function exitHandler() {
    if (FullscreenStatus) {
        if (Globalfullscreenobj != null) {
            var Carousel_id = Globalfullscreenobj.find('.carousel').attr("id");
            Carousel_id = '#' + Carousel_id;
            var elem = Globalfullscreenobj[0];
            $(Carousel_id + " .carousel-inner img").addClass('carousel_img_normal').removeClass('carousel_img_fullscreen');
            $("#fullscreen_icon_div").addClass('fullscreen_i_normal').removeClass('fullscreen_i_full');
            $("#fullscreen_icon_div i").addClass('fullscreen_icon_normal').removeClass('fullscreen_icon_full');

            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }

            FullscreenStatus = false;
        }
    }
}
/* Core method which will talk with the Server & Fetches data from the server & posts data to the server */
function ajax_request(request_obj,Methodname)
{
	 var Online = navigator.onLine;
	 if (Online === true) {
	     $('#LoadingModal').modal('show');
      	var requestedurl='default.aspx/'+Methodname;
      	$.ajax({
      	    url: requestedurl,
      	    contentType: "application/json; charset=utf-8",
      	    dataType: "json",
      	    type: "POST",
      	    data: request_obj,
      	    success: function (data) {
      	        if (Methodname === GetCameraInfoMethodname) /* Based on the requested method calling appropriate DOM updating Method */
      	        {
      	            CreateDOMOnDocumentReady(data.d);

      	            /* Start of framing from datetime and to datetime */
      	            var from_datetime_str;

      	            var to_datetime_str;

      	            var from_datetime = new Date();

      	            var to_datetime = new Date();

      	            var month_fromdate, day_fromdate, hours_fromdate, min_fromdate, sec_fromdate;

      	            var month_todate, day_todate, hours_todate, min_todate, sec_todate;

      	            from_datetime.setHours(from_datetime.getHours() - 2); // To get the Images of Last 2 Hours... (Latest Images )

      	            from_datetime_str = '';
      	            to_datetime_str = '';
      	            month_fromdate = from_datetime.getMonth() + 1;
      	            day_fromdate = from_datetime.getDate();
      	            hours_fromdate = from_datetime.getHours();
      	            min_fromdate = from_datetime.getMinutes();
      	            sec_fromdate = from_datetime.getSeconds();
      	            if (month_fromdate < 10)
      	                month_fromdate = "0" + month_fromdate;

      	            if (day_fromdate < 10)
      	                day_fromdate = "0" + day_fromdate;

      	            if (hours_fromdate < 10)
      	                hours_fromdate = "0" + hours_fromdate;

      	            if (min_fromdate < 10)
      	                min_fromdate = "0" + min_fromdate;
      	            if (sec_fromdate < 10)
      	                sec_fromdate = "0" + sec_fromdate;


      	            from_date_timestr = '' + from_datetime.getFullYear() + month_fromdate + day_fromdate + hours_fromdate + min_fromdate + sec_fromdate;

      	            month_todate = to_datetime.getMonth() + 1;
      	            day_todate = to_datetime.getDate();
      	            hours_todate = to_datetime.getHours();
      	            min_todate = to_datetime.getMinutes();
      	            sec_todate = to_datetime.getSeconds();
      	            if (month_todate < 10)
      	                month_todate = "0" + month_todate;

      	            if (day_todate < 10)
      	                day_todate = "0" + day_todate;

      	            if (hours_todate < 10)
      	                hours_todate = "0" + hours_todate;

      	            if (min_todate < 10)
      	                min_todate = "0" + min_todate;
      	            if (sec_todate < 10)
      	                sec_todate = "0" + sec_todate;

      	            to_datetime_str = '' + to_datetime.getFullYear() + month_todate + day_todate + hours_todate + min_todate + sec_todate;
      	            /* End of frmaing from date time,to datetime */
      	            request_obj = {};
      	            request_obj.fromdate = from_date_timestr;
      	            request_obj.todate = to_datetime_str;

      	            var CameraObjarr = [];
      	            for (var camitr = 0; camitr < UI_relatedCameraInfoObjectsList.length; camitr++) {
      	                var tmpObj = {};
      	                tmpObj.CameraID = UI_relatedCameraInfoObjectsList[camitr].CameraID;
      	                tmpObj.IMSI = UI_relatedCameraInfoObjectsList[camitr].CameraIMSI;
      	                CameraObjarr.push(tmpObj);
      	            }
      	            request_obj.CamIMSI_arr = CameraObjarr;
      	            request_obj = '{RequestObjectForAllCameras: ' + JSON.stringify(request_obj) + '}';
      	            ajax_request(request_obj, GetImagesOfReqCamerasMethodname);
                    
      	        }
      	        else if(Methodname===GetImagesOfReqCamerasMethodname)
      	        {
      	            ActualImagesOfRequestedCameras = data.d;
      	            updateDOMwithLatestImages(data.d);
      	            periodical_ajax_request();
      	        }
      	        $('#LoadingModal').modal('hide');
      	    },
      	    error: function () {
      	        /* Error Occured while trying to connect with the Server */
      	    }
      	});
      }
      else
      {
      	/* No Internet Connection available */
      }

}
function CreateDOMOnDocumentReady(CameraInfoObjectsList)
{
    if (CameraInfoObjectsList != null && CameraInfoObjectsList.length > 0) /* Configuration.XML file has configured with some cameras */ {
        for (var CameraItr = 0; CameraItr < CameraInfoObjectsList.length; CameraItr++) {
            var tmp_UIObject = {};
            tmp_UIObject.CameraID = CameraInfoObjectsList[CameraItr].CameraID;
            tmp_UIObject.CameraName = CameraInfoObjectsList[CameraItr].CameraName;
            tmp_UIObject.CameraIMSI = CameraInfoObjectsList[CameraItr].CameraIMSI;
            tmp_UIObject.CameraCarouselID = CameraInfoObjectsList[CameraItr].CameraID + '_Carousel';
            tmp_UIObject.CameraThumbnailID = CameraInfoObjectsList[CameraItr].CameraID + '_Thumbnail';
            $('#Cameras-row').append('<div id="' + tmp_UIObject.CameraID + '" class="Camera_div col-lg-4 col-md-4 col-sm-6 col-xs-12"></div>'); // Added Camera Div
            $('#' + tmp_UIObject.CameraID).append('<div class="Camera"></div>');
            /* Camera deatils append Start */
            $('#' + tmp_UIObject.CameraID + " .Camera").append(' <div class="Camera_details"><p class="Cam_updated_time">2017/08/09 04:30:22</p><p class="Cam_name"><i class="Cam_sts Idle_sts fa fa-circle"></i>' + tmp_UIObject.CameraName + '</p><div class="Goto_live_btn"><button class="GotoLive_button"> Go to Live</button></div><div class="Thumbnail_toggler"> <button class="btn_toggler"><i class="fa fa-picture-o"></i></button></div>');
            /* Camera details append End */
            /* Carousel appending for Camera Div Start */
            var href_Carousel_ID = '#' + tmp_UIObject.CameraCarouselID;
            var href_ThumbnailID = '#' + tmp_UIObject.CameraThumbnailID;
            $('#' + tmp_UIObject.CameraID + " .Camera").append(' <div class="Carousel_div myclass"><div id="' + tmp_UIObject.CameraCarouselID + '" class="carousel slide" data-interval="false"><ol class="carousel-indicators"><li data-target="' + href_Carousel_ID + '" data-slide-to="0" class="active"></li></ol><div class="carousel-inner"><div class="item active"><img class="carousel_img_normal" src="Images/test.gif" alt="Los Angeles"></div></div><a class="left carousel-control" href="' + href_Carousel_ID + '" data-slide="prev"><span class="glyphicon glyphicon-chevron-left"></span><span class="sr-only">Previous</span></a><a class="right carousel-control" href="' + href_Carousel_ID + '" data-slide="next"><span class="glyphicon glyphicon-chevron-right"></span><span class="sr-only">Next</span></a></div><div class="fullscreen_icon"><i class="fa fa-arrows-alt" style="cursor:pointer;font-size: 1.8em;color: #c1e2e2;z-index: 200;"></i></div></div></div>');
            /* Carousel appending for Camera Div End */
            /* Thumbnails_div Start */
            $('#' + tmp_UIObject.CameraID).append('<div class="thumbnail_container" id="' + tmp_UIObject.CameraThumbnailID + '"><div class="table_container"><table class="thumbnails_table"><tbody> <tr class="img_row"><td><img src="images/test.gif" class="img-thumbnail"><p class="thumbnail_datetime">2017/06/08 04:30:22</p></td></tr></tbody></table></div></div></div>');
            /* Thumbnails_div End */
            UI_relatedCameraInfoObjectsList.push(tmp_UIObject);

        }
        $('.thumbnail_container').hide(); /* To Hide Thumbnail div hide by default */
    }
    else {
        /* Even Single Camera is not configured yet */
    }

}

function periodical_ajax_request() {

    var Online = navigator.onLine;
    if (Online == true) {
        /* Request Object Preperation */

            /* Start of framing from datetime and to datetime */
            var from_datetime_str;

            var to_datetime_str;

            var from_datetime = new Date();

            var to_datetime = new Date();

            var month_fromdate, day_fromdate, hours_fromdate, min_fromdate, sec_fromdate;

            var month_todate, day_todate, hours_todate, min_todate, sec_todate;

            from_datetime.setMinutes(from_datetime.getMinutes() - 3);// To get the Images of Last 3  Minutes Latest Images ...


            from_datetime_str = '';
            to_datetime_str = '';
            month_fromdate = from_datetime.getMonth() + 1;
            day_fromdate = from_datetime.getDate();
            hours_fromdate = from_datetime.getHours();
            min_fromdate = from_datetime.getMinutes();
            sec_fromdate = from_datetime.getSeconds();
            if (month_fromdate < 10)
                month_fromdate = "0" + month_fromdate;

            if (day_fromdate < 10)
                day_fromdate = "0" + day_fromdate;

            if (hours_fromdate < 10)
                hours_fromdate = "0" + hours_fromdate;

            if (min_fromdate < 10)
                min_fromdate = "0" + min_fromdate;
            if (sec_fromdate < 10)
                sec_fromdate = "0" + sec_fromdate;


            from_date_timestr = '' + from_datetime.getFullYear() + month_fromdate + day_fromdate + hours_fromdate + min_fromdate + sec_fromdate;

            month_todate = to_datetime.getMonth() + 1;
            day_todate = to_datetime.getDate();
            hours_todate = to_datetime.getHours();
            min_todate = to_datetime.getMinutes();
            sec_todate = to_datetime.getSeconds();
            if (month_todate < 10)
                month_todate = "0" + month_todate;

            if (day_todate < 10)
                day_todate = "0" + day_todate;

            if (hours_todate < 10)
                hours_todate = "0" + hours_todate;

            if (min_todate < 10)
                min_todate = "0" + min_todate;
            if (sec_todate < 10)
                sec_todate = "0" + sec_todate;

            to_datetime_str = '' + to_datetime.getFullYear() + month_todate + day_todate + hours_todate + min_todate + sec_todate;
            /* End of frmaing from date time,to datetime */
            request_obj = {};
            request_obj.fromdate = from_date_timestr;
            request_obj.todate = to_datetime_str;

            var CameraObjarr = [];
            for (var camitr = 0; camitr < UI_relatedCameraInfoObjectsList.length; camitr++) {
                var tmpObj = {};
                tmpObj.CameraID = UI_relatedCameraInfoObjectsList[camitr].CameraID;
                tmpObj.IMSI = UI_relatedCameraInfoObjectsList[camitr].CameraIMSI;
                CameraObjarr.push(tmpObj);
            }
            request_obj.CamIMSI_arr = CameraObjarr;
            request_obj = '{RequestObjectForAllCameras: ' + JSON.stringify(request_obj) + '}';

            $.ajax(
                   {
                       url: 'default.aspx/GetImagesOfReqCameras',
                       contentType: "application/json; charset=utf-8",
                       dataType: "json",
                       type: "POST",
                       data: request_obj,
                       success: function (data) {
                           if (data.d != null) {
                               if (data.d.length > 0) {
                                   periodical_responseobj = data.d;
                                   var Carousel_Id = "";
                                   var Thumbnail_ID = "";
                                   for (var Camitr = 0; Camitr < ActualImagesOfRequestedCameras.length; Camitr++) {
                                       var no_of_useful_imgs_latestreq = 0;
                                       var Is_nodataavailable_prev = false;
                                       var IsFirstSlideActiveBefore = false;
                                       var FullscreenCarouselID = null;
                                       if (Globalfullscreenobj != null)
                                       {
                                            FullscreenCarouselID ='#'+ Globalfullscreenobj.find('.carousel').attr("id");
                                       }
                                      
                                       if (periodical_responseobj[Camitr].Images.length > 0)
                                       {
                                           var Camera_number = ActualImagesOfRequestedCameras[Camitr].CameraID;

                                           Carousel_Id = "";
                                           Thumbnail_ID = "";

                                           for (var tmpItr = 0; tmpItr < UI_relatedCameraInfoObjectsList.length; tmpItr++) {
                                               if (Camera_number === UI_relatedCameraInfoObjectsList[tmpItr].CameraID) {
                                                   Carousel_Id = UI_relatedCameraInfoObjectsList[tmpItr].CameraCarouselID;
                                                   Thumbnail_ID = UI_relatedCameraInfoObjectsList[tmpItr].CameraThumbnailID;
                                                   break;
                                               }
                                           }

                                           Carousel_Id = '#' + Carousel_Id;
                                           Thumbnail_ID = '#' + Thumbnail_ID;

                                           if ($(Carousel_Id + ' .carousel-inner .item:first').hasClass('active')) /* User is at First Slide then you can update it */ {
                                               IsFirstSlideActiveBefore = true;
                                           }
                                           
                                           if (ActualImagesOfRequestedCameras[Camitr].Images.length > 0) {

                                               var firstimg_in_inthatCamera = ActualImagesOfRequestedCameras[Camitr].Images[0].img_path; // Getting the first or latest image of last Response.

                                               firstimg_in_inthatCamera = firstimg_in_inthatCamera.substring(13, 27);//from 12 to 29 ( 29 will be excluded ). YYYYMMDDHHMMSS

                                               var firstimg_time_int = parseInt(firstimg_in_inthatCamera);

                                               var img_in_periodical_responseobj; // to store substring of img_path in periodical response object
                                               var img_time_int_ofperiodical_responseobj;                  // to store the parsed value of substring.

                                              
                                               if (periodical_responseobj[Camitr].LastSyncTime != "")
                                               {
                                                   $('#' + Camera_number + ' .Camera  .Camera_details .Cam_updated_time').text('Updated time:' + periodical_responseobj[Camitr].LastSyncTime);
                                               }
                                               else {
                                                   $('#' + Camera_number + ' .Camera  .Camera_details .Cam_updated_time').text(periodical_responseobj[Camitr].LastSyncTime);
                                               }
                                               


                                               for (var i = 0; i < periodical_responseobj[Camitr].Images.length; i++) {

                                                   img_in_periodical_responseobj = periodical_responseobj[Camitr].Images[i].img_path;

                                                   img_in_periodical_responseobj = img_in_periodical_responseobj.substring(13, 27);

                                                   var img_time_int_ofperiodical_responseobj = parseInt(img_in_periodical_responseobj);

                                                   if (img_time_int_ofperiodical_responseobj > firstimg_time_int) {

                                                       no_of_useful_imgs_latestreq = no_of_useful_imgs_latestreq + 1;
                                                      
                                                   } // End of if img_time comparision

                                                   else {
                                                       break;
                                                   }

                                               }// End of for loop in 

                                               for (var i = no_of_useful_imgs_latestreq - 1; i >= 0; i--) // to add latest images to Jsonobj
                                               {
                                                   // Need to Set Src attribute for first image of carousel
                                                   if (FullscreenCarouselID === Carousel_Id && FullscreenStatus)
                                                   {
                                                       $(Carousel_Id + " .carousel-inner").prepend('<div class="item"><img class="carousel_img_fullscreen" src="' + periodical_responseobj[Camitr].Images[i].img_path + '" alt="Image"> <div class="carousel-caption"> <h5>' + periodical_responseobj[Camitr].Images[i].img_name + '</h5> </div> </div>');
                                                   }
                                                   else {
                                                       $(Carousel_Id + " .carousel-inner").prepend('<div class="item"><img class="carousel_img_normal" src="' + periodical_responseobj[Camitr].Images[i].img_path + '" alt="Image"> <div class="carousel-caption"> <h5>' + periodical_responseobj[Camitr].Images[i].img_name + '</h5> </div> </div>');
                                                   }
                                                   $(Thumbnail_ID + ' .table_container .thumbnails_table tbody').prepend('<tr class="img_row"><td><img loaded=true src="' + periodical_responseobj[Camitr].Images[i].img_path + '"  class="img-thumbnail"><p class="thumbnail_datetime">' + periodical_responseobj[Camitr].Images[i].img_name + '</p></td></tr>');
                                                   ActualImagesOfRequestedCameras[Camitr].Images.unshift(periodical_responseobj[Camitr].Images[i]); // to add the latest img objects to jsonobj
                                               }
                                                
                                           }  // End of If there are already images of that camera 
                                           else { // No images are there till now for that camera 
                                               ActualImagesOfRequestedCameras[Camitr].Images = periodical_responseobj[Camitr].Images;
                                                Is_nodataavailable_prev = true;
                                           }
                                       }  
                                       var nodatavailableprev_but_newimages_count = 0;
                                       if (no_of_useful_imgs_latestreq > 0 || Is_nodataavailable_prev) {  // Check if there are any latest images for that camera or isthere data fro that camera previously 
                                          
                                        
                                           $(Carousel_Id+" .carousel-indicators").empty();  // to clear carousel indicators as those are need to start from 0
                                           if (Is_nodataavailable_prev) {
                                               $(Carousel_Id+" .carousel-inner").empty();  // to empty the carousel which has nodataavailable.jpg 
                                           }
                                           for (var i = 0; i < ActualImagesOfRequestedCameras[Camitr].Images.length; i++) {

                                               $(Carousel_Id + " .carousel-indicators").append('<li data-target="#myCarousel" data-slide-to="' + i + '" > </li>');

                                               if (Is_nodataavailable_prev) {
                                                   nodatavailableprev_but_newimages_count = nodatavailableprev_but_newimages_count + 1;

                                                   if (FullscreenCarouselID === Carousel_Id && FullscreenStatus) {
                                                           $(Carousel_Id + " .carousel-inner").append('<div class="item"> <img class="carousel_img_fullscreen" src="' + ActualImagesOfRequestedCameras[Camitr].Images[i].img_path + '" alt="Image"><div class="carousel-caption"> <h5>' + ActualImagesOfRequestedCameras[Camitr].Images[i].img_name + '</h5> </div> </div>');
                                                       }
                                                       else {
                                                           $(Carousel_Id + " .carousel-inner").append('<div class="item"> <img class="carousel_img_normal" src="' + ActualImagesOfRequestedCameras[Camitr].Images[i].img_path + '" alt="Image"><div class="carousel-caption"> <h5>' + ActualImagesOfRequestedCameras[Camitr].Images[i].img_name + '</h5> </div> </div>');
                                                       }
                                                   
                                                    $(Thumbnail_ID + ' .table_container .thumbnails_table tbody').append('<tr class="img_row"><td><img loaded=true src="' + ActualImagesOfRequestedCameras[Camitr].Images[i].img_path + '"  class="img-thumbnail"><p class="thumbnail_datetime">' + ActualImagesOfRequestedCameras[Camitr].Images[i].img_name + '</p></td></tr>');
                                               }

                                           } // End of JsonObj iteration

                                           if (Is_nodataavailable_prev) {
                                               $(Carousel_Id + ' .item').first().addClass('active');
                                               $(Carousel_Id + ' .carousel-indicators > li').last().addClass('active');
                                               $(Thumbnail_ID + ' .table_container .thumbnails_table tbody tr:first').addClass('td_active');
                                               Prev_td = $(Thumbnail_ID + ' .table_container .thumbnails_table tbody tr:first');
                                               // to highlight the first td in the table 
                                               $('#' + Camera_number + ' .fullscreen_icon').show();
                                               $('#' + Camera_number + ' .Thumbnail_toggler').show();
                                               if (nodatavailableprev_but_newimages_count > 1) {
                                                   checkfirst_or_last_carousel(Carousel_Id); // To Maintain Carousel indicators properly.

                                               }
                                               else {
                                                   hidebothindicators(Carousel_Id);
                                               }
                                           }
                                           else { /*If some images are there */
                                               if (IsFirstSlideActiveBefore) /* User is at First Slide then you can update it */
                                               {
                                                   $(Carousel_Id + ' .carousel-inner').children('div').each(function () {
                                                       $(this).removeClass("active");

                                                   });

                                                   $(Carousel_Id + ' .item').first().addClass('active');
                                               }
                                               checkfirst_or_last_carousel(Carousel_Id); // To Maintain Carousel indicators properly.
                                           }
                                               
                                          

                                       } // End of Condition is Is_nodataavailable_prev || no-ofusefulimages_lastreq

                                   }  // End of Iteration for all cameras  
                               }// End of if data.d.length >0 
                           }
                           

                       },// End od Success


                       complete: function () {
                           // Schedule the next request when the current one's complete
                           setTimeout(periodical_ajax_request, 6000); /* Requests for every 1 Minute */
                       } // Function again will be called whenever one Ajax Request completed successfully.


                   });  // End of Ajax Request


        }
    else {
        /* No Internet Connection Available */


    }
}

function updateDOMwithLatestImages(LatestImagesOfRequestedCameras)
{
    var Camera_number, Carousel_Id, Thumbnail_ID, Cam_Online_Sts, Cam_LastSyncTime;


    for(var Camitr=0;Camitr<LatestImagesOfRequestedCameras.length;Camitr++)
    {
        
        Camera_number = LatestImagesOfRequestedCameras[Camitr].CameraID;
        Cam_Online_Sts = LatestImagesOfRequestedCameras[Camitr].Online_Sts;
        Cam_LastSyncTime = LatestImagesOfRequestedCameras[Camitr].LastSyncTime;


        for (var tmpItr = 0; tmpItr < UI_relatedCameraInfoObjectsList.length; tmpItr++) {
            if (Camera_number === UI_relatedCameraInfoObjectsList[tmpItr].CameraID) {
                Carousel_Id = UI_relatedCameraInfoObjectsList[tmpItr].CameraCarouselID;
                Thumbnail_ID = UI_relatedCameraInfoObjectsList[tmpItr].CameraThumbnailID;
                break;
            }
        }
        if (Cam_Online_Sts === "1") /* Camera is Working & Posting Images */
        {
            $('#' + Camera_number + ' .Camera  .Camera_details .Cam_name i').attr("class", "Cam_sts active_sts fa fa-circle");
        }
        else {   /* Camera is not Working & not posting images */
            $('#' + Camera_number + ' .Camera  .Camera_details .Cam_name i').attr("class", "Cam_sts Inactive_sts fa fa-circle");
        }
        if (Cam_LastSyncTime != "")
        {
            $('#' + Camera_number + ' .Camera  .Camera_details .Cam_updated_time').text('Updated time: ' + Cam_LastSyncTime);
        }
        else {
            $('#' + Camera_number + ' .Camera  .Camera_details .Cam_updated_time').text(Cam_LastSyncTime);
        }
        $('#' + Camera_number + ' .Camera  .Camera_details .Goto_live_btn').hide();
        Carousel_Id = '#' + Carousel_Id;
        $(Carousel_Id + " .carousel-indicators").empty();
        $(Carousel_Id + " .carousel-inner").empty();

        Thumbnail_ID = '#' + Thumbnail_ID;
        $(Thumbnail_ID + ' .table_container .thumbnails_table tbody').empty(); // to clear all existed thumbnail images 


        if (LatestImagesOfRequestedCameras[Camitr].Images !== null && LatestImagesOfRequestedCameras[Camitr].Images.length>0)
        {
         
            for (var ImgItr = 0; ImgItr < LatestImagesOfRequestedCameras[Camitr].Images.length; ImgItr++) /* To Iterate through All Images of that Camera*/ {

                if (ImgItr === 0) /* To set Src attribute to the image of the carousel */ {
                    $(Carousel_Id + " .carousel-inner").append('<div class="item"><img class="carousel_img_normal" src="' + LatestImagesOfRequestedCameras[Camitr].Images[ImgItr].img_path + '" alt="Image"><div class="carousel-caption"> <h5>' + LatestImagesOfRequestedCameras[Camitr].Images[ImgItr].img_name + '</h5> </div> </div>');
                }
                else {
                    $(Carousel_Id + " .carousel-inner").append('<div class="item"><img class="carousel_img_normal" data-src="' + LatestImagesOfRequestedCameras[Camitr].Images[ImgItr].img_path + '" alt="Image"><div class="carousel-caption"> <h5>' + LatestImagesOfRequestedCameras[Camitr].Images[ImgItr].img_name + '</h5> </div> </div>');
                }
                $(Carousel_Id + " .carousel-indicators").append('<li data-target="' + Carousel_Id + '" data-slide-to="' + ImgItr + '" > </li>');
                if (ImgItr < 3)
                {
                    $(Thumbnail_ID + ' .table_container .thumbnails_table tbody').append('<tr class="img_row"><td><img loaded=true src="' + LatestImagesOfRequestedCameras[Camitr].Images[ImgItr].img_path + '"  class="img-thumbnail"><p class="thumbnail_datetime">' + LatestImagesOfRequestedCameras[Camitr].Images[ImgItr].img_name + '</p></td></tr>');
                }
                else {
                    $(Thumbnail_ID + ' .table_container .thumbnails_table tbody').append('<tr class="img_row"><td><img loaded=false data-original="' + LatestImagesOfRequestedCameras[Camitr].Images[ImgItr].img_path + '" src="Images/img_loading.gif" class="img-thumbnail"><p class="thumbnail_datetime">' + LatestImagesOfRequestedCameras[Camitr].Images[ImgItr].img_name + '</p></td></tr>');
                }
                
            }
            Showbothindicators(Carousel_Id);
            if (LatestImagesOfRequestedCameras[Camitr].Images.length === 1) // Only one image is there
            {
                hidebothindicators(Carousel_Id);
            }
            else /* Many Images are there */ {
                hideLeftindicator(Carousel_Id);// To See prev image 
            }
            /* Need to do handle lazy loading of thumbnails_container */
           // $(Thumbnail_ID + ' .table_container .thumbnails_table tbody img.lazy').lazyload();
        }
        else {
            /* No Data Available */
            $('#' + Camera_number + ' .Thumbnail_toggler').hide();
            $('#' + Camera_number + ' .fullscreen_icon').hide();

            $(Carousel_Id + " .carousel-indicators").append('<li data-target="#myCarousel" data-slide-to="' + 0 + '" > </li>');
            $(Carousel_Id + " .carousel-inner").append('<div class="item"><img class="carousel_img_normal" src="Images/no-data-available-3.png" alt="Image"></div>');
            hidebothindicators(Carousel_Id);  // No data available so hiding both Indicators
        }
        $(Carousel_Id + ' .item').first().addClass('active');
        $(Carousel_Id + " .carousel-indicators").last().addClass('active');

        listenForScrollEvent($(Thumbnail_ID));

    }
    
   // listenForScrollEvent($(".thumbnail_container"));
    
}

function listenForScrollEvent(el) {
    el.on("scroll", function () {
        el.trigger("custom-scroll");
    })
}
function Showbothindicators(CarouselId) {
    var $this = $(CarouselId);
    $this.children('.left.carousel-control').show();
    $this.children('.right.carousel-control').show();
}
function hidebothindicators(CarouselId) {
    var $this = $(CarouselId);
    $this.children('.left.carousel-control').hide();
    $this.children('.right.carousel-control').hide();
}
function hideLeftindicator(CarouselId) {
    var $this = $(CarouselId);
    $this.children('.left.carousel-control').hide();
}
function hideRightindicator(CarouselId) {
    var $this = $(CarouselId);
    $this.children('.right.carousel-control').hide();
}
function checkfirst_or_last_carousel(Carousel_id) {
    var $this = $(Carousel_id);
    var Camnode = $this.parent().parent().parent();
    var CamId = Camnode.attr("id");
    CamId = '#' + CamId;
    if ($(Carousel_id+' .carousel-inner .item:first').hasClass('active')) {
        $this.children('.left.carousel-control').hide();
        $this.children('.right.carousel-control').show();
        $(CamId + ' .Camera  .Camera_details .Goto_live_btn').hide();
    } else if ($(Carousel_id+' .carousel-inner .item:last').hasClass('active')) {
        $this.children('.left.carousel-control').show();
        $this.children('.right.carousel-control').hide();
        $(CamId + ' .Camera  .Camera_details .Goto_live_btn').show();
    } else {
        $this.children('.carousel-control').show();
        $(CamId + ' .Camera  .Camera_details .Goto_live_btn').show();
    }

}
function SetFullscreenStaustoTure() {
    FullscreenStatus = true;
}

function ToggleFullScreen(elemJqueryObj) {
    
    var Carousel_id = elemJqueryObj.find(".carousel").attr("id");
    Carousel_id = '#' + Carousel_id;
    var elem = elemJqueryObj[0];
    // ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
        $(Carousel_id + " .carousel-inner img").addClass('carousel_img_fullscreen').removeClass('carousel_img_normal');
        if (elem.requestFullScreen) {
            elem.requestFullScreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
        setTimeout(function () { SetFullscreenStaustoTure() }, 50);

    } else {
        $(Carousel_id + " .carousel-inner img").addClass('carousel_img_normal').removeClass('carousel_img_fullscreen');
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        FullscreenStatus = false;
    }
}

$(function(){
	
    /* After slide happened this Event will Fire */
    $("div").on('slid.bs.carousel', '.carousel', function (e) {
          e.stopPropagation();
          var Carousel_Id = e.target.id;
          Carousel_Id = "#" + Carousel_Id;
          var Camnode = $(Carousel_Id).parent().parent().parent();
          var CamId = Camnode.attr("id");
          CamId = '#' + CamId;
	     var $this = $(Carousel_Id);       // Carousel Object 

	     if ($(Carousel_Id + ' .carousel-inner .item:first').hasClass('active')) {
	         $this.children('.left.carousel-control').hide();
	         $this.children('.right.carousel-control').show();
	         $(CamId + ' .Camera  .Camera_details .Goto_live_btn').hide();
	     } else if ($(Carousel_Id + ' .carousel-inner .item:last').hasClass('active')) {
	         $this.children('.left.carousel-control').show();
	         $this.children('.right.carousel-control').hide();
	         $(CamId + ' .Camera  .Camera_details .Goto_live_btn').show();
	     } else {
	         $this.children('.carousel-control').show();
	         $(CamId + ' .Camera  .Camera_details .Goto_live_btn').show();
	     }
	 });
     /* Mobile Swipes Handing code start */
    $('.carousel').bcSwipe({
        threshold: 50
    });
    /* Mobile Swipes Handling code End */
    /* Lazy Loading Images of Carousel  start (Before SLide happned)*/
    $("div").on('slide.bs.carousel', '.carousel', function (e) {
        e.stopPropagation();
        /* e.relatedTarget means next div item */
        if (e.direction === LeftDirection) {
            var lazy;
            lazy = $(e.relatedTarget); // div item 
            for (var BufferItr = 1; BufferItr <= MaxImagesShouldBuffer; BufferItr++) { /* Loading Next 3 Images */

                lazy = lazy.find("img[data-src]");
                lazy.attr("src", lazy.data('src'));
                lazy.removeAttr("data-src");
                lazy = lazy.parent().next();
            }
        }
        else if ((e.direction === RightDirection))
        {
            var lazy;
            lazy = $(e.relatedTarget); // div item 
            for (var BufferItr = 1; BufferItr <= MaxImagesShouldBuffer; BufferItr++) { /* Loading Next 3 Images */

                lazy = lazy.find("img[data-src]");
                lazy.attr("src", lazy.data('src'));
                lazy.removeAttr("data-src");
                lazy = lazy.parent().prev();
            }
        }
    });

	/* Carousel UI Functions End */
    /* Camera Thumbnails_conatiner UI Funstions */
  /*  $("div").on("mouseenter", ".Thumbnail_toggler", function (e) {
         e.stopPropagation();
	     var Camera_node = $(this).parent().parent().parent();
	     var Cam_Id = Camera_node.attr("id");
	     $('#' + Cam_Id + " .thumbnail_container").show('slide', { direction: 'right' }, 700);
    });*/

    $("div").on("click", ".Thumbnail_toggler", function (e) {
        e.stopPropagation();
        var Camera_node = $(this).parent().parent().parent();
        var Cam_Id = Camera_node.attr("id");
        $('#' + Cam_Id + " .thumbnail_container").show('slide', { direction: 'right' }, 700);
    });
    $("div").on("click", ".fullscreen_icon", function (e) {
        e.stopPropagation();
        e.stopPropagation();
        var Camera_node = $(this).parent();
        var elem_JqueryObj = Camera_node;
        Globalfullscreenobj = elem_JqueryObj;
        ToggleFullScreen(elem_JqueryObj);
    });
    $("div").on("click", ".Goto_live_btn", function (e) {
        e.stopPropagation();
        var Cameraclass_div = $(this).parent().parent();
        var Carouselnode_id = Cameraclass_div.find(".carousel").attr("id");
        Carouselnode_id = '#' + Carouselnode_id;
        $(Carouselnode_id + ' .carousel-inner').children('div').each(function () {
            $(this).removeClass("active");

        });
        $(Carouselnode_id + ' .item').first().addClass('active');
        $(Carouselnode_id + " .carousel-indicators").last().addClass('active');
        checkfirst_or_last_carousel(Carouselnode_id);
        hideLeftindicator(Carouselnode_id);
        $(this).hide();
    });
 /*   $("div").on("mouseleave", ".thumbail_container", function (e) {
        e.stopPropagation();
        var Camera_node = $(this).parent().parent().parent();
        var Cam_Id = Camera_node.attr("id");
        $('#' + Cam_Id + " .thumbnail_container").hide('slide', { direction: 'right' }, 700);
    });*/

        $(document).mouseup(function(e) 
        {
            var container = $(".thumbnail_container");
            // if the target of the click isn't the container nor a descendant of the container
            if (!container.is(e.target) && container.has(e.target).length === 0) 
            {
                container.hide();
            }
        });
    /* Thumbnails Conatiner functions start */
        $('div').on('click', 'table td', function (e) {
            e.stopPropagation();
            if (Prev_td === null)
            {
                Prev_td = $(this);
            }
            else {
                
                Prev_td.attr('class', 'td_transparent');
                Prev_td = $(this);
            }
            
            var td_index = $(this).parent().index();
            var Camnode = $(this).parent().parent().parent().parent().parent().parent();
            var Carousel_id = Camnode.find(".carousel").attr("id");
            Carousel_id = '#' + Carousel_id;
            var iterator = 0;
            $(Carousel_id + ' .carousel-inner').children('div').each(function ()
            {
                $(this).removeClass("active");
               
            });
            $(Carousel_id+' .carousel-inner').children('div').each(function () {
                if (iterator == td_index) {
                    var lazy = $(this);
                    lazy = lazy.find("img[data-src]");
                    lazy.attr("src", lazy.data('src'));
                    lazy.removeAttr("data-src");
                    $(this).addClass("active");
                    
                    checkfirst_or_last_carousel(Carousel_id);
                    return false;  // breaking out from each loop
                }
                iterator = iterator + 1;
            });
            $(this).attr('class', 'td_active');
        });


        $('div').on('mouseenter', 'table td', function (e) {
            var td_class = $(this).attr('class');
            if (td_class === "td_active")
            {

            }
            else {
                $(this).attr('class','td_hover');
            }
            
        });


        $('div').on('mouseleave', 'table td', function (e) {
            var td_class = $(this).attr('class');
            if (td_class === "td_active") {

            }
            else {
                $(this).attr('class', 'td_transparent');
            }
        });
        $("body").on("custom-scroll", ".thumbnail_container", function (e) {
            e.stopPropagation();
            
            var wt = $(this).scrollTop();    //* top of the window
            var wb = wt + $(window).height();  //* bottom of the window
            var thumbnail_id = $(this).attr("id");
            thumbnail_id = '#' + thumbnail_id;
            $(thumbnail_id + ' .table_container .thumbnails_table tbody img').each(function () {
                var ot = $(this).offset().top;  //* top of object (i.e. advertising div)
                var ob = ot + $(this).height(); //* bottom of object
                
                if (($(this).attr("loaded") === "false") && (wt <= ob && wb >= ot)) {
                    var org_path = $(this).attr("data-original");
                    $(this).attr("src", org_path);
                    $(this).removeAttr("data-original");
                    $(this).attr("loaded", true);
                }
            });
        });

});
