var UI_relatedCameraInfoObjectsList = [];
var RequestCameraObjectsList = {};
var ResponseCameraObjectsList = {};

var GetCameraInfoMethodname = "getCameraInfo";
var GetVideosOfReqCamerasMethodname = "GetVideosOfReqCameras";
var MaxImagesShouldBuffer = 2;
var LeftDirection = "left"; /* Carousel- Directions */
var RightDirection = "right";

var VideoExtenstionLength = 3;
var VideoExtension_ogg = "ogg";
var VideoExtension_mp4 = "mp4";

$(document).ready(function () {

    $('#Cameras-row').empty(); /* To Empty all the Camera Div which are created for Layout Testing */

    /* Start of Sending Request to the Server to get CameraInformation*/
    console.log('Document.ready() ');
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

});

/* Core method which will talk with the Server & Fetches data from the server & posts data to the server */
function ajax_request(request_obj, Methodname) {
    var Online = navigator.onLine;
    if (Online === true) {
        $('#LoadingModal').modal('show');
        var requestedurl = 'default.aspx/' + Methodname;
        $.ajax({
            url: requestedurl,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "POST",
            data: request_obj,
            success: function (data) {
                if (Methodname === GetCameraInfoMethodname) /* Based on the requested method calling appropriate DOM updating Method */ {
                    CreateDOMOnDocumentReady(data.d);

                    /* Start of framing from datetime and to datetime */
                    var from_datetime_str;

                    var to_datetime_str;

                    var from_datetime = new Date();

                    var to_datetime = new Date();

                    var month_fromdate, day_fromdate;

                    var month_todate, day_todate;

                    from_datetime_str = '';
                    to_datetime_str = '';
                    month_fromdate = from_datetime.getMonth() + 1;
                    day_fromdate = from_datetime.getDate();
                    if (month_fromdate < 10)
                        month_fromdate = "0" + month_fromdate;

                    if (day_fromdate < 10)
                        day_fromdate = "0" + day_fromdate;

                    from_date_timestr = '' + from_datetime.getFullYear() + month_fromdate + day_fromdate ;

                    month_todate = to_datetime.getMonth() + 1;
                    day_todate = to_datetime.getDate();
                    if (month_todate < 10)
                        month_todate = "0" + month_todate;

                    if (day_todate < 10)
                        day_todate = "0" + day_todate;

                    to_datetime_str = '' + to_datetime.getFullYear() + month_todate + day_todate ;
                    /* End of frmaing from date time,to datetime */
                    request_obj = {};
                    request_obj.fromdate = from_date_timestr;
                    request_obj.todate = to_datetime_str;

                    var CameraObjarr = [];
                    if (UI_relatedCameraInfoObjectsList.length > 0)
                    {
                        for (var camitr = 0; camitr < UI_relatedCameraInfoObjectsList.length; camitr++) {
                            var tmpObj = {};
                            tmpObj.CameraID = UI_relatedCameraInfoObjectsList[camitr].CameraID;
                            tmpObj.IMSI = UI_relatedCameraInfoObjectsList[camitr].CameraIMSI;
                            CameraObjarr.push(tmpObj);
                        }
                        request_obj.CamIMSI_arr = CameraObjarr;
                        request_obj = '{RequestObjectForAllCameras: ' + JSON.stringify(request_obj) + '}';
                        ajax_request(request_obj, GetVideosOfReqCamerasMethodname);
                    }

                }
                else if (Methodname === GetVideosOfReqCamerasMethodname) {
                    updateDOMwithLatestVideos(data.d);
                 //   setPosterImages(data.d);
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


function CreateDOMOnDocumentReady(CameraInfoObjectsList) {
    if (CameraInfoObjectsList != null && CameraInfoObjectsList.length > 0) /* Configuration.XML file has configured with some cameras */ {
        for (var CameraItr = 0; CameraItr < CameraInfoObjectsList.length; CameraItr++) {
            var tmp_UIObject = {};
            tmp_UIObject.CameraID = CameraInfoObjectsList[CameraItr].CameraID;
            tmp_UIObject.CameraName = CameraInfoObjectsList[CameraItr].CameraName;
            tmp_UIObject.CameraIMSI = CameraInfoObjectsList[CameraItr].CameraIMSI;
            tmp_UIObject.CameraCarouselID = CameraInfoObjectsList[CameraItr].CameraID + '_Carousel';
            tmp_UIObject.VideoPlayerID = CameraInfoObjectsList[CameraItr].CameraID + '_VPlayer';
            $('#Cameras-row').append('<div id="' + tmp_UIObject.CameraID + '" class="Camera_div col-lg-6 col-md-6 col-sm-12 col-xs-12"></div>'); // Added Camera Div
            $('#' + tmp_UIObject.CameraID).append('<div class="Camera"></div>');
            /* Camera deatils append Start */
            $('#' + tmp_UIObject.CameraID + " .Camera").append(' <div class="Camera_details"><p class="Cam_updated_time">Updated time:2017/08/09 04:30:22</p><p class="Cam_name"><i class="Cam_sts Idle_sts fa fa-circle"></i>' + tmp_UIObject.CameraName + '</p></div>');
            /* Camera details append End */
            /* Carousel appending for Camera Div Start */
            var href_Carousel_ID = '#' + tmp_UIObject.CameraCarouselID;
            var href_ThumbnailID = '#' + tmp_UIObject.CameraThumbnailID;
            $('#' + tmp_UIObject.CameraID + " .Camera").append(' <div class="Carousel_div myclass"><div id="' + tmp_UIObject.CameraCarouselID + '" class="carousel slide" data-ride="carousel"><ol class="carousel-indicators"><li data-target="' + href_Carousel_ID + '" data-slide-to="0" class="active"></li></ol><div class="carousel-inner"><div class="item active"><img src="Images/test.gif" alt="Los Angeles"></div></div><a class="left carousel-control" href="' + href_Carousel_ID + '" data-slide="prev"><span class="glyphicon glyphicon-chevron-left"></span><span class="sr-only">Previous</span></a><a class="right carousel-control" href="' + href_Carousel_ID + '" data-slide="next"><span class="glyphicon glyphicon-chevron-right"></span><span class="sr-only">Next</span></a></div></div></div>');
            /* Carousel appending for Camera Div End */

            UI_relatedCameraInfoObjectsList.push(tmp_UIObject);

        }
    }
    else {
        /* Even Single Camera is not configured yet */
    }

}

function updateDOMwithLatestVideos(LatestVideosOfRequestedCameras) {
    var Camera_number, Carousel_Id, Thumbnail_ID, Cam_Online_Sts, Cam_LastSyncTime, Video_player_ID;
    var PLayerIndex = null;
    for (var Camitr = 0; Camitr < LatestVideosOfRequestedCameras.length; Camitr++) {
        Camera_number = LatestVideosOfRequestedCameras[Camitr].CameraID;
        Cam_Online_Sts = LatestVideosOfRequestedCameras[Camitr].Online_Sts;
        Cam_LastSyncTime = LatestVideosOfRequestedCameras[Camitr].LastSyncTime;
        for (var tmpItr = 0; tmpItr < UI_relatedCameraInfoObjectsList.length; tmpItr++) {
            if (Camera_number === UI_relatedCameraInfoObjectsList[tmpItr].CameraID) {
                Carousel_Id = UI_relatedCameraInfoObjectsList[tmpItr].CameraCarouselID;
                Video_player_ID = UI_relatedCameraInfoObjectsList[tmpItr].VideoPlayerID;
                break;
            }
        }
        if (Cam_Online_Sts === "1") /* Camera is Working & Posting Images */ {
            $('#' + Camera_number + ' .Camera  .Camera_details .Cam_name i').attr("class", "Cam_sts active_sts fa fa-circle");
        }
        else {   /* Camera is not Working & not posting images */
            $('#' + Camera_number + ' .Camera  .Camera_details .Cam_name i').attr("class", "Cam_sts Inactive_sts fa fa-circle");
        }
        if (Cam_LastSyncTime != "")
        {
            $('#' + Camera_number + ' .Camera  .Camera_details .Cam_updated_time').text('Updated time:' + Cam_LastSyncTime);
        }
        else {
            $('#' + Camera_number + ' .Camera  .Camera_details .Cam_updated_time').text(Cam_LastSyncTime);
        }

        Carousel_Id = '#' + Carousel_Id;
        $(Carousel_Id + " .carousel-indicators").empty();
        $(Carousel_Id + " .carousel-inner").empty();
        
        if (LatestVideosOfRequestedCameras[Camitr].Videos !== null && LatestVideosOfRequestedCameras[Camitr].Videos.length > 0) {
            var tmp_Videopath_mp4, Main_VideoPath_mp4, tmp_posterimg_path;

                tmp_Videopath_mp4 = LatestVideosOfRequestedCameras[Camitr].Videos[0].Video_path; /* As there is only one video fro that day it will be at 0 index */

                tmp_posterimg_path=LatestVideosOfRequestedCameras[Camitr].Videos[0].Videothumbnail_img_path;

                tmp_Videopath_mp4 = tmp_Videopath_mp4.substring(0, tmp_Videopath_mp4.length-3); // Video_path after removing ogg from the file name 
                
                Main_VideoPath_mp4=tmp_Videopath_mp4+VideoExtension_mp4; // To locate MP4 file in the server 
                
                $(Carousel_Id + " .carousel-inner").append(' <div class="item active"><video id="' + Video_player_ID + '" class="vjs-matrix video-js my-video`" controls preload="none" download><source src="' + LatestVideosOfRequestedCameras[Camitr].Videos[0].Video_path + '" type="video/ogg"><source src="' + Main_VideoPath_mp4 + '" type="video/mp4"><p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that<a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p></video><div class="carousel-caption"> <h5>' + LatestVideosOfRequestedCameras[Camitr].Videos[0].Video_name + '</h5> </div></div>');
                var PlayerID = '#' + Video_player_ID;
                if (PLayerIndex === null)
                {
                    PLayerIndex = Camitr;
                }
                videojs(PlayerID, {}, function () {
                    // You can grab an element by class if you'd like, just make sure
                    // if it's an array that you pick one (here we chose the first).
                });

            var PlayerID = UI_relatedCameraInfoObjectsList[PLayerIndex].VideoPlayerID; // FIrst Player
            PlayerID = '#' + PlayerID;
            videojs(PlayerID).ready(function () {
                var myPlayer = this;
                myPlayer.play();
            });

            hidebothindicators(Carousel_Id);
        }
        else {
            /* No Data Available */
            $(Carousel_Id + " .carousel-indicators").append('<li data-target="#myCarousel" data-slide-to="' + 0 + '" > </li>');
            $(Carousel_Id + " .carousel-inner").append('<div class="item"><img class="carousel_img_normal" src="Images/no-data-available-3.png" alt="Image"></div>');
            hidebothindicators(Carousel_Id);  // No data available so hiding both Indicators
        }
        $(Carousel_Id + ' .item').first().addClass('active');
        $(Carousel_Id + " .carousel-indicators").last().addClass('active');
        $(Carousel_Id).carousel({
            interval: false
        });
    }

    /* To Initialize the Video js for dynamically loaded content */
   
}
/*
function setPosterImages(LatestVideosOfRequestedCameras)
{
    var Camera_number, Carousel_Id, Thumbnail_ID, Cam_Online_Sts, Cam_LastSyncTime,Video_player_ID;
    for (var Camitr = 0; Camitr < LatestVideosOfRequestedCameras.length; Camitr++) {
        var PlayerID = UI_relatedCameraInfoObjectsList[Camitr].VideoPlayerID;
        PlayerID = '#' + PlayerID;
        var Video = $(PlayerID);
        Video.attr('poster', LatestVideosOfRequestedCameras[Camitr].Videos[0].Videothumbnail_img_path)
    }
}*/
function hidebothindicators(CarouselId) {
    var $this = $(CarouselId);
    $this.children('.left.carousel-control').hide();
    $this.children('.right.carousel-control').hide();
}

$(function(){
	/* Carousel UI Functions*/
	 $('.carousel').carousel({
        interval: false
    });
   

});
