var GetCameraInfoMethodname = "getCameraInfo";
var GetVideosOfReqCamerasMethodname = "GetVideosOfReqCameras";
var UI_relatedCameraInfoObjectsList = [];
var RequestCameraObjectsList = {};
var ResponseCameraObjectsList = {};
var VideosList = [];
var Prev_td = null;
var my_VideoPlayer = null;
var overheadheight = 23;
var Carouselimgheigth = null;
var thumbnailheight = null;
var IsProcessingClickedThumbnail = false;
$(window).resize(function () {
    
});
$(document).ready(function () {
    /* Set UI related stuff */
    var windowwidth = $(window).width();
    var windowheight= $(window).height();
    if (windowwidth >= 991) // So It is for Big Monitors only */
    {
        var headerheight = $('#header_row').height();
        var selectionrow_height = $('.filter_row').height();
        var marginsheight = overheadheight;
        var camdetails_hight = $('.Camera_details').height();
        var heighttobeset = windowheight - (headerheight + selectionrow_height + marginsheight);
        thumbnailheight = heighttobeset;
        Carouselimgheigth = heighttobeset - camdetails_hight - 15;

    }


    /* Start of Sending Request to the Server to get CameraInformation*/
    console.log('Document.ready() ');
    console.log('Started at');
    $('#_container').hide();
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
});

function ajax_request(request_obj, Methodname) {
    $('#LoadingModal').modal('show');
    var Online = navigator.onLine;
    if (Online === true) {
        var requestedurl = 'default.aspx/' + Methodname;
        $.ajax({
            url: requestedurl,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "POST",
            data: request_obj,
            success: function (data) {
                if (Methodname === GetCameraInfoMethodname) /* Based on the requested method calling appropriate DOM updating Method */ {
                    SaveCamerasInfo(data.d);

                    /* Start of framing from datetime and to datetime */
                    var from_datetime_str;

                    var to_datetime_str;

                    var from_datetime = new Date();

                    var to_datetime = new Date();

                    var month_fromdate, day_fromdate;

                    var month_todate, day_todate;

                    from_datetime.setDate(from_datetime.getDate() - 1);

                    from_datetime_str = '';
                    to_datetime_str = '';
                    month_fromdate = from_datetime.getMonth() + 1;
                    day_fromdate = from_datetime.getDate();
                    if (month_fromdate < 10)
                        month_fromdate = "0" + month_fromdate;

                    if (day_fromdate < 10)
                        day_fromdate = "0" + day_fromdate;

                    from_date_timestr = '' + from_datetime.getFullYear() + month_fromdate + day_fromdate;

                    month_todate = to_datetime.getMonth() + 1;
                    day_todate = to_datetime.getDate();
                    if (month_todate < 10)
                        month_todate = "0" + month_todate;

                    if (day_todate < 10)
                        day_todate = "0" + day_todate;

                    to_datetime_str = '' + to_datetime.getFullYear() + month_todate + day_todate;
                    /* End of frmaing from date time,to datetime */
                    request_obj = {};
                    request_obj.fromdate = from_date_timestr;
                    request_obj.todate = to_datetime_str;

                    var CameraObjarr = [];

                    var tmpObj = {};
                    if (UI_relatedCameraInfoObjectsList.length > 0)
                    {
                        $('#_container').show();
                        tmpObj.CameraID = UI_relatedCameraInfoObjectsList[0].CameraID;  /* 0 i.e First Camera */
                        tmpObj.IMSI = UI_relatedCameraInfoObjectsList[0].CameraIMSI;
                        CameraObjarr.push(tmpObj);

                        request_obj.CamIMSI_arr = CameraObjarr;
                        request_obj = '{RequestObjectForAllCameras: ' + JSON.stringify(request_obj) + '}';
                        ajax_request(request_obj, GetVideosOfReqCamerasMethodname);
                    }
                  

                }
                else if (Methodname === GetVideosOfReqCamerasMethodname) {
                    updateDOMwithFetchedVideos(data.d);
                }
                $('#LoadingModal').modal('hide');
            },
            error: function () {
                /* Error Occured while trying to connect with the Server */
            }
        });
    }
    else {
        /* No Internet Connection available */
    }

}

function updateDOMwithFetchedVideos(CameraObjwithVideos) {
    var Camera_number, Cam_Online_Sts, Cam_LastSyncTime, tmp_Videopath_mp4, Main_VideoPath_mp4, Camname;
    VideosList = [];
    if (CameraObjwithVideos != null && CameraObjwithVideos.length > 0) {
        $('.Vedio_div').empty();
        $('.video-list-thumbs').empty();
        for (var Camitr = 0; Camitr < CameraObjwithVideos.length; Camitr++) {

            Camera_number = CameraObjwithVideos[Camitr].CameraID;
            Cam_Online_Sts = CameraObjwithVideos[Camitr].Online_Sts;
            Cam_LastSyncTime = CameraObjwithVideos[Camitr].LastSyncTime;
            for (var tmpItr = 0; tmpItr < UI_relatedCameraInfoObjectsList.length; tmpItr++) {
                if (UI_relatedCameraInfoObjectsList[tmpItr].CameraID === Camera_number) {
                    Camname = UI_relatedCameraInfoObjectsList[tmpItr].CameraName;
                    break;
                }
            }

            $('.Camera_div .camera  .Camera_details .Cam_name').html('<i class="Cam_sts Idle_sts fa fa-circle"></i>' + Camname);
            if (Cam_Online_Sts === "1") /* Camera is Working & Posting Images */ {
                $('.Camera_div .camera  .Camera_details .Cam_name i').attr("class", "Cam_sts active_sts fa fa-circle");
            }
            else {   /* Camera is not Working & not posting images */
                $('.Camera_div .camera  .Camera_details .Cam_name i').attr("class", "Cam_sts Inactive_sts fa fa-circle");
            }
            if (Cam_LastSyncTime != "")
            {
                $('.Camera_div .camera  .Camera_details .Cam_updated_time').text('Updated time:'+Cam_LastSyncTime);
            }
            else {
                $('.Camera_div .camera  .Camera_details .Cam_updated_time').text(Cam_LastSyncTime);
            }
           

            if (CameraObjwithVideos[Camitr].Videos !== null && CameraObjwithVideos[Camitr].Videos.length > 0) {

                for (var VidItr = 0; VidItr < CameraObjwithVideos[Camitr].Videos.length; VidItr++) /* To Iterate through All Videos of that Camera*/ {
                    var tmpVideoObj = {};
                    tmpVideoObj.Video_name = CameraObjwithVideos[Camitr].Videos[VidItr].Video_name;
                    tmpVideoObj.Video_path = CameraObjwithVideos[Camitr].Videos[VidItr].Video_path;
                    tmpVideoObj.Videothumbnail_img_path = CameraObjwithVideos[Camitr].Videos[VidItr].Videothumbnail_img_path;
                    if (my_VideoPlayer != null)
                    {
                        my_VideoPlayer.dispose();
                    }
                    if (VidItr === 0)
                    {
                        tmp_Videopath_mp4 = CameraObjwithVideos[Camitr].Videos[VidItr].Video_path; /* As there is only one video fro that day it will be at 0 index */

                        tmp_Videopath_mp4 = tmp_Videopath_mp4.substring(0, tmp_Videopath_mp4.length-3); // Video_path after removing ogg from the file name 
                
                        Main_VideoPath_mp4=tmp_Videopath_mp4+'mp4'; // To locate MP4 file in the server 

                        $('.Vedio_div').append('<video id="Video_player" class="vjs-matrix video-js" controls preload="none" data-setup="{}" download><source src="' + tmpVideoObj.Video_path + '" type="video/ogg"><source src="' + Main_VideoPath_mp4 + '" type="video/mp4"><p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that<a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p></video>');
                        videojs('#Video_player', {}, function () {
                            // You can grab an element by class if you'd like, just make sure
                            // if it's an array that you pick one (here we chose the first).
                        });

                        videojs('#Video_player').ready(function () {
                         //   $('#Video_player').removeClass("Video_player-dimensions");
                            my_VideoPlayer = this;
                            my_VideoPlayer.play();
                            IsProcessingClickedThumbnail = false;
                        });
                    }
                    $('.video-list-thumbs').append(' <li><a href="#" title="'+tmpVideoObj.Video_name+'"><img src="'+tmpVideoObj.Videothumbnail_img_path+'" alt="Thumbnail-not available" class="img-responsive" /><h6><p class="Video_name">'+tmpVideoObj.Video_name+'</p></h6><span class="glyphicon glyphicon-play-circle"></span></a></li>');
                    VideosList.push(tmpVideoObj);
                    $('.thumbnail_container').show();
                    Prev_td = $('.thumbnail_container li').first();
                    $('.thumbnail_container li').first().addClass('td_active');
                    $(".Vedio_div").removeClass("empty_no_videos");
                }
                $("#Video_player").css('height', Carouselimgheigth + 'px');
                $('.thumbnail_container').css('min-height', thumbnailheight + 'px');
                $('.thumbnail_container').css('max-height', thumbnailheight + 'px');
            }
            else
            {
                /* No Videos exitst */
                $('.Vedio_div').append('<img class="carousel_img_normal" src="Images/no-data-available-3.png" alt="Image">');
                $('.Vedio_div img').css('height', Carouselimgheigth + 'px');
                $('.thumbnail_container').css('min-height', thumbnailheight + 'px');
                $('.thumbnail_container').css('max-height', thumbnailheight + 'px');
                $('.thumbnail_container').hide();
                $(".Vedio_div").addClass("empty_no_videos");
            }
        }
    }
}

function SaveCamerasInfo(CameraInfoObjectsList) {
    if (CameraInfoObjectsList != null && CameraInfoObjectsList.length > 0) /* Configuration.XML file has configured with some cameras */ {
        /* Clearing the DOM Start*/

        $('.CamSel_div .dropdown-menu').empty();
        $('.CamSel_div .btn-default').text('');
        /* Clearing DOM End */
        for (var CameraItr = 0; CameraItr < CameraInfoObjectsList.length; CameraItr++) {
            if (CameraItr === 0) {
                $('.CamSel_div .btn-group .btn-default').html(CameraInfoObjectsList[CameraItr].CameraName + '<span class="caret"></span>');
                //  $('.CamSel_div .dropdown-toggle').html($(this).html() + '<span class="caret"></span>');
            }
            $('.CamSel_div .btn-group .dropdown-menu').append('<li><a href="#">' + CameraInfoObjectsList[CameraItr].CameraName + '</a></li>');
            var tmp_UIObject = {};
            tmp_UIObject.CameraID = CameraInfoObjectsList[CameraItr].CameraID;
            tmp_UIObject.CameraName = CameraInfoObjectsList[CameraItr].CameraName;
            tmp_UIObject.CameraIMSI = CameraInfoObjectsList[CameraItr].CameraIMSI;
            UI_relatedCameraInfoObjectsList.push(tmp_UIObject);
        }
    }
    else {
        /* Even Single Camera is not configured yet */

    }

}


$(function(){
	/* Carousel UI Functions*/
	 $('.carousel').carousel({
        interval: false
    });
	
	 $('.CamSel_div .btn-group .dropdown-menu').on('click', 'a', function (e) {
	     $('.CamSel_div .dropdown-toggle').html($(this).html() + '<span class="caret"></span>');
	 });

    /* datetime pickers initialization start */

	 $('#fromDatePicker').datetimepicker({
	                format: 'DD/MM/YYYY',
                  ignoreReadonly: true,
                  icons: {
                      date: "fa fa-calendar"
                  },
                  defaultDate: moment().subtract(1,'days'),
                  maxDate: moment()
                });

     $('#toDatePicker').datetimepicker({
                         ignoreReadonly: true,
                         format: 'DD/MM/YYYY',
                        icons: {
                            date: "fa fa-calendar"
                        },
                        defaultDate: moment()
                      });
     $("#fromDatePicker").on("dp.change", function (e) {
                          $('#toDatePicker').data("DateTimePicker").minDate(e.date);
                      });
     $("#toDatePicker").on("dp.change", function (e) {
                          $('#fromDatePicker').data("DateTimePicker").maxDate(e.date);
                      });
    /* datetime pickers initialization End */

     $('.thumbnail_container').on('click', 'li', function (e) {
         e.stopPropagation();
         if (!IsProcessingClickedThumbnail)
         {
             IsProcessingClickedThumbnail = true;
             if (Prev_td === null) {
                 Prev_td = $(this);
             }
             else {

                 Prev_td.attr('class', 'td_transparent');
                 Prev_td = $(this);
             }


             var td_index = $(this).index();

             var video_name = $(this).find('a').attr("title");



             for (var itr = 0; itr < VideosList.length; itr++) {
                 if (VideosList[itr].Video_name === video_name) {
                     var Videopath = VideosList[itr].Video_path;
                     var Videothumbnail_img_path = VideosList[itr].Videothumbnail_img_path;
                     var tmp_Videopath_mp4 = Videopath; /* As there is only one video fro that day it will be at 0 index */

                     tmp_Videopath_mp4 = tmp_Videopath_mp4.substring(0, tmp_Videopath_mp4.length - 3); // Video_path after removing ogg from the file name 

                     var Main_VideoPath_mp4 = tmp_Videopath_mp4 + 'mp4'; // To locate MP4 file in the server 

                     if (my_VideoPlayer != null) {
                         my_VideoPlayer.dispose();
                     }
                     $('.Vedio_div').append('<video id="Video_player" class="vjs-matrix video-js" controls preload="none" data-setup="{}" download><source src="' + Videopath + '" type="video/ogg"><source src="' + Main_VideoPath_mp4 + '" type="video/mp4"><p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that<a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p></video>');
                     videojs('#Video_player', {}, function () {
                         // You can grab an element by class if you'd like, just make sure
                         // if it's an array that you pick one (here we chose the first).
                     });

                     videojs('#Video_player').ready(function () {
                         //   $('#Video_player').removeClass("Video_player-dimensions");
                         my_VideoPlayer = this;
                         my_VideoPlayer.play();
                         IsProcessingClickedThumbnail = false;
                     });
                 }

             }
             $("#Video_player").css('height', Carouselimgheigth + 'px');
             $(this).attr('class', 'td_active');
         }
     });


    /* Table realted script start */
     $('.video-list-thumb').on('mouseenter', 'li', function (e) {
         e.stopPropagation();
         var td_class = $(this).attr('class');
         if (td_class === "td_active") {

         }
         else {
             $(this).attr('class', 'td_hover');
         }

     });


     $('.video-list-thumb').on('mouseleave', 'li', function (e) {
         var td_class = $(this).attr('class');
         if (td_class === "td_active") {

         }
         else {
             $(this).attr('class', 'td_transparent');
         }
     });

     $('#getRprtBtn').click(function (e) {
         var from_date_timestr;
         var to_datetime_str;

         var from_datetime_temp = $("#fromDatePicker").find("input").val();
         var to_datetime_temp = $("#toDatePicker").find("input").val();
      
         var results = from_datetime_temp.split("/");


         var month_fromdate, day_fromdate,year_fromdate;

         var month_todate, day_todate, year_todate;

         year_fromdate = results[2];
         month_fromdate = results[1];
         day_fromdate = results[0];

         from_date_timestr = year_fromdate + month_fromdate + day_fromdate;

         var results = to_datetime_temp.split("/");

         year_todate = results[2];
         month_todate = results[1];
         day_todate = results[0];


         to_datetime_str = year_todate + month_todate + day_todate;
         /* End of frmaing from date time,to datetime */
         request_obj = {};
         request_obj.fromdate = from_date_timestr;
         request_obj.todate = to_datetime_str;
         var selectedcamera_name = $('.CamSel_div .btn-group .btn-default').text();
         var CameraObjarr = [];

         var tmpObj = {};
         for (var CamItr = 0; CamItr < UI_relatedCameraInfoObjectsList.length; CamItr++) {
             if (UI_relatedCameraInfoObjectsList[CamItr].CameraName === selectedcamera_name) {
                 tmpObj.CameraID = UI_relatedCameraInfoObjectsList[CamItr].CameraID;  /* 0 i.e First Camera */
                 tmpObj.IMSI = UI_relatedCameraInfoObjectsList[CamItr].CameraIMSI;
                 break;
             }
         }

         CameraObjarr.push(tmpObj);
         request_obj.CamIMSI_arr = CameraObjarr;
         request_obj = '{RequestObjectForAllCameras: ' + JSON.stringify(request_obj) + '}';

         ajax_request(request_obj, GetVideosOfReqCamerasMethodname);

     });

});
