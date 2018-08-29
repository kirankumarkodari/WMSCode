
var GetCameraInfoMethodname = "getCameraInfo";
var GetImagesOfReqCamerasMethodname = "GetImagesOfReqCameras";
var MaxImagesShouldBuffer = 2;
var LeftDirection = "left"; /* Carousel- Directions */
var RightDirection = "right";
var UI_relatedCameraInfoObjectsList = [];
var RequestCameraObjectsList = {};
var ResponseCameraObjectsList = {};
/* Thumbnails_related variables */
var Prev_td = null;
var Globalfullscreenobj = null;
var IsescapeValid = false;
var FullscreenStatus = false;
var overheadheight = 23;
var Carouselimgheigth = null;
/*$(document).keyup(function (e) {
    if (e.keyCode === 27) {
        toggleFullScreen($('.Carousel_div'));
    }
}); */
$(document).ready(function () {
    /*  set UI related stuff Start */
    var windowwidth = $(window).width();
    var windowheight= $(window).height();
    if (windowwidth >= 991) // So It is for Big Monitors only */
    {
        var headerheight = $('#header_row').height();
        var selectionrow_height = $('.filter_row').height();
        var marginsheight = overheadheight;
        var camdetails_hight = $('.Camera_details').height();
        var heighttobeset = windowheight - (headerheight + selectionrow_height + marginsheight);

        Carouselimgheigth = heighttobeset - camdetails_hight-10;

        $('#common_camera').css('min-height', heighttobeset + 'px');
        $('#common_camera').css('max-height', heighttobeset + 'px');

        $('#Camera_carousel .carousel-inner .item img').css('height', Carouselimgheigth + 'px');
        $('#Camera_carousel .carousel-inner .item img').css('min-height', Carouselimgheigth + 'px');
        $('#Camera_carousel .carousel-inner .item img').css('max-height', Carouselimgheigth + 'px');

        $('#camera_thumbnail').css('min-height', heighttobeset + 'px');
        $('#camera_thumbnail').css('max-height', heighttobeset + 'px');
    }
     

    /* set UI related stuff End */



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

});
document.addEventListener('fullscreenchange', exitHandler);
document.addEventListener('webkitfullscreenchange', exitHandler);
document.addEventListener('mozfullscreenchange', exitHandler);
document.addEventListener('MSFullscreenChange', exitHandler);
function exitHandler()
{
    if (FullscreenStatus) {
        if (Globalfullscreenobj != null) {
            var Carousel_id = Globalfullscreenobj.find('.carousel').attr("id");
            Carousel_id = '#' + Carousel_id;
            var elem = Globalfullscreenobj[0];
            //   $(Carousel_id + " .carousel-inner img").addClass('carousel_img_normal').removeClass('carousel_img_fullscreen');
            $(Carousel_id + ' .carousel-inner .item img').css('height', Carouselimgheigth + 'px');
            $("#fullscreen_icon_div").addClass('fullscreen_icon_normal').removeClass('fullscreen_icon_full');
            $("#fullscreen_icon_div i").addClass('fullscreen_i_normal').removeClass('fullscreen_i_full');
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
/*$(document).keyup(function (e) {
    if (e.keyCode == 27) { // escape key maps to keycode `27`
        // <DO YOUR WORK HERE>
        if (IsescapeValid)
        {
            if(Globalfullscreenobj!=null)
            {
                toggleFullScreen(Globalfullscreenobj);
            }
        }
        
    }
});*/


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
                   
                    var tmpObj = {};
                    tmpObj.CameraID = UI_relatedCameraInfoObjectsList[0].CameraID;  /* 0 i.e First Camera */
                    tmpObj.IMSI = UI_relatedCameraInfoObjectsList[0].CameraIMSI;
                    CameraObjarr.push(tmpObj);
                    
                    request_obj.CamIMSI_arr = CameraObjarr;
                    request_obj = '{RequestObjectForAllCameras: ' + JSON.stringify(request_obj) + '}';
                    ajax_request(request_obj, GetImagesOfReqCamerasMethodname);

                }
                else if (Methodname === GetImagesOfReqCamerasMethodname) {
                   updateDOMwithFetchedImages(data.d);
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

function SaveCamerasInfo(CameraInfoObjectsList) {
    if (CameraInfoObjectsList != null && CameraInfoObjectsList.length > 0) /* Configuration.XML file has configured with some cameras */ {
        /* Clearing the DOM Start*/
       
        $('.CamSel_div .dropdown-menu').empty();
        $('.CamSel_div .btn-default').text('');
        /* Clearing DOM End */
        for (var CameraItr = 0; CameraItr < CameraInfoObjectsList.length; CameraItr++) {
            if (CameraItr ===0)
            {
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

function updateDOMwithFetchedImages(CameraObjwithImages)
{
    var Camera_number, Cam_Online_Sts, Cam_LastSyncTime,Camname;
    if(CameraObjwithImages != null && CameraObjwithImages.length > 0)
    {
        for (var Camitr = 0; Camitr < CameraObjwithImages.length; Camitr++) {
            Camera_number = CameraObjwithImages[Camitr].CameraID;
            Cam_Online_Sts = CameraObjwithImages[Camitr].Online_Sts;
            Cam_LastSyncTime = CameraObjwithImages[Camitr].LastSyncTime;
            for (var tmpItr = 0; tmpItr < UI_relatedCameraInfoObjectsList.length; tmpItr++)
            {
                if (UI_relatedCameraInfoObjectsList[tmpItr].CameraID === Camera_number)
                {
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
           
            
            $('#Camera_carousel .carousel-indicators').empty();
            $('#Camera_carousel .carousel-inner').empty();
            $('#thumbnails_table tbody').empty();
            if (CameraObjwithImages[Camitr].Images !== null && CameraObjwithImages[Camitr].Images.length > 0) {
                var td_counter = 2;
                var rowcontent = '';
                for (var ImgItr = 0; ImgItr < CameraObjwithImages[Camitr].Images.length; ImgItr++) /* To Iterate through All Images of that Camera*/ {
                    if (ImgItr === 0) /* To set Src attribute to the image of the carousel */ {
                        $('#Camera_carousel .carousel-inner').append('<div class="item"><img class="carousel_img_normal" src="' + CameraObjwithImages[Camitr].Images[ImgItr].img_path + '" alt="Image"><div class="carousel-caption"> <h4>' + CameraObjwithImages[Camitr].Images[ImgItr].img_name + '</h4> </div> </div>');
                    }
                    else {
                        $('#Camera_carousel .carousel-inner').append('<div class="item"><img class="carousel_img_normal" data-src="' + CameraObjwithImages[Camitr].Images[ImgItr].img_path + '" alt="Image"><div class="carousel-caption"> <h4>' + CameraObjwithImages[Camitr].Images[ImgItr].img_name + '</h4> </div> </div>');
                    }
                    $('#Camera_carousel   .carousel-indicators').append('<li data-target="#Camera_carousel" data-slide-to="' + ImgItr + '" > </li>');
                    if (ImgItr < 8) {
                        rowcontent = rowcontent + '<td><img loaded=true src="' + CameraObjwithImages[Camitr].Images[ImgItr].img_path + '"  class="img-thumbnail"><p class="thumbnail_datetime">' + CameraObjwithImages[Camitr].Images[ImgItr].img_name + '</p></td>';
                        td_counter = td_counter - 1;
                        if (td_counter === 0)
                        {
                            $('#thumbnails_table tbody').append('<tr class="img_row">'+rowcontent+'</tr>');
                            rowcontent = '';
                            td_counter = 2;
                        }
                     }
                    else {
                        rowcontent=rowcontent+'<td><img loaded=false data-original="' + CameraObjwithImages[Camitr].Images[ImgItr].img_path + '" src="Images/img_loading.gif" class="img-thumbnail"><p class="thumbnail_datetime">' + CameraObjwithImages[Camitr].Images[ImgItr].img_name + '</p></td>';
                        td_counter = td_counter - 1;
                        if (td_counter === 0) {
                            $('#thumbnails_table tbody').append('<tr class="img_row">' + rowcontent + '</tr>');
                            rowcontent = '';
                            td_counter = 2;
                        }
                    }
                }
                if (rowcontent != '')
                {
                    $('#thumbnails_table tbody').append('<tr class="img_row">' + rowcontent + '</tr>');
                }
                Showbothindicators('#Camera_carousel');
                if (CameraObjwithImages[Camitr].Images.length === 1) // Only one image is there
                {
                    hidebothindicators('#Camera_carousel');
                }
                else /* Many Images are there */ {
                    hideLeftindicator('#Camera_carousel');// To See prev image 
                }
                $('.thumbnail_container').show();
            }
            else {
                /* No Data Available */
                $('#Camera_carousel .carousel-indicators').append('<li data-target="#myCarousel" data-slide-to="' + 0 + '" > </li>');
                $('#Camera_carousel .carousel-inner').append('<div class="item"><img class="carousel_img_normal" src="Images/no-data-available-3.png" alt="Image"></div>');
                hidebothindicators('#Camera_carousel');  // No data available so hiding both Indicators
                $('.thumbnail_container').hide();
            }
        }
        $('#Camera_carousel .item').first().addClass('active');
        $('#Camera_carousel .carousel-indicators').last().addClass('active');
        $('#thumbnails_table tbody td').first().addClass('td_active');
        Prev_td = $('#thumbnails_table tbody td').first();

       
        
        $('#Camera_carousel').carousel({
            interval: false
        });
        listenForScrollEvent($('#camera_thumbnail'));
    }
    $('#Camera_carousel .carousel-inner .item img').css('height', Carouselimgheigth + 'px');
}

function SetFullscreenStaustoTure()
{
    FullscreenStatus = true;
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

    if ($(Carousel_id + ' .carousel-inner .item:first').hasClass('active')) {
        $this.children('.left.carousel-control').hide();
        $this.children('.right.carousel-control').show();
    } else if ($(Carousel_id + ' .carousel-inner .item:last').hasClass('active')) {
        $this.children('.left.carousel-control').show();
        $this.children('.right.carousel-control').hide();
    } else {
        $this.children('.carousel-control').show();
    }

}


function ToggleFullScreen(elemJqueryObj) {
    var Carousel_id = elemJqueryObj.find('.carousel').attr("id");
    Carousel_id = '#' + Carousel_id;
    var elem = elemJqueryObj[0];
    // ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
       // $(Carousel_id + " .carousel-inner img").addClass('carousel_img_fullscreen').removeClass('carousel_img_normal');
        $(Carousel_id+' .carousel-inner .item img').css('height', 'auto');
        $("#fullscreen_icon_div i").addClass('fullscreen_i_full').removeClass('fullscreen_i_normal');

        $("#fullscreen_icon_div").addClass('fullscreen_icon_full').removeClass('fullscreen_icon_normal');
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
    }
    else {
        //  $(Carousel_id + " .carousel-inner img").addClass('carousel_img_normal').removeClass('carousel_img_fullscreen');
        $(Carousel_id + ' .carousel-inner .item img').css('height', Carouselimgheigth+'px');
        $("#fullscreen_icon_div i").addClass('fullscreen_i_normal').removeClass('fullscreen_i_full');
        $("#fullscreen_icon_div").addClass('fullscreen_icon_normal').removeClass('fullscreen_icon_full');
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


$(function () {
   

    /* Carousel UI Functions*/
	 $('.carousel').carousel({
        interval: false
    });

	 $('.CamSel_div .btn-group .dropdown-menu').on('click', 'a', function (e) {
	     $('.CamSel_div .dropdown-toggle').html($(this).html() + '<span class="caret"></span>');
	 });
/* datetime pickers initialization start */
    $('#fromDatePicker').datetimepicker({
                  ignoreReadonly: true,
                  icons: {
                      date: "fa fa-calendar"
                  },
                  defaultDate: moment().subtract(2,'hours'),
                  maxDate: moment()
                });

     $('#toDatePicker').datetimepicker({
                        ignoreReadonly: true,
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
    /* Carousel_function start */
    /* After slide happened this Event will Fire */
     $("div").on('slid.bs.carousel', '.carousel', function (e) {
         e.stopPropagation();
         var Carousel_Id = e.target.id;
         Carousel_Id = "#" + Carousel_Id;
         var $this = $(Carousel_Id);       // Carousel Object 
         if ($(Carousel_Id + ' .carousel-inner .item:first').hasClass('active')) {
             $this.children('.left.carousel-control').hide();
             $this.children('.right.carousel-control').show();
         } else if ($(Carousel_Id + ' .carousel-inner .item:last').hasClass('active')) {
             $this.children('.left.carousel-control').show();
             $this.children('.right.carousel-control').hide();
         } else {
             $this.children('.carousel-control').show();
         }
         var CarouselIndex = $(e.relatedTarget).index();
         var presenttd = $("td[class='td_active']");
         presenttd.removeClass('td_active'); // to remove the td_active for this TD.
         presenttd.attr('class', 'td_transparent'); // to make it as normal td 
         var left_str = "left";
         var right_str = "right";
         var presenttd_index = presenttd.index();
         if (e.direction == left_str)// it is opposite so reverse i have to active right TD
         {
             if (presenttd_index == 1) {
                 var next_tr = presenttd.parent().next();// I.e You need to go for next row when he clicks on carousel right. 
                 next_tr.children('td:first').removeClass('td_transparent');
                 next_tr.children('td:first').addClass('td_active');
             }
             else
             {
                 var right_td = presenttd.next('td');
                 right_td.removeClass('td_transparent');
                 right_td.addClass('td_active');
             }
         }
         else
         {
             if (presenttd_index == 0) {
                 var prev_tr = presenttd.parent().prev();// I.e You need to go for next row when he clicks on carousel right. 
                 prev_tr.children('td:last').removeClass('td_transparent');
                 prev_tr.children('td:last').addClass('td_active');
             }
             else {
                 var left_td = presenttd.prev('td');
                 left_td.removeClass('td_transparent');
                 left_td.addClass('td_active');
             }
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
         else if ((e.direction === RightDirection)) {
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
    /* Carousel functions end */


     $("#fullscreen_icon_div").on("click", function (e) {
         e.stopPropagation();
         var Camera_node = $(this).parent();
         var elem_JqueryObj = Camera_node;
         Globalfullscreenobj = elem_JqueryObj;
         ToggleFullScreen(elem_JqueryObj);
         
     });



    /* Table realted script start */
     $('table').on('mouseenter', 'td', function (e) {
         e.stopPropagation();
         var td_class = $(this).attr('class');
         if (td_class === "td_active") {

         }
         else {
             $(this).attr('class', 'td_hover');
         }

     });


     $('table').on('mouseleave', 'td', function (e) {
         var td_class = $(this).attr('class');
         if (td_class === "td_active") {

         }
         else {
             $(this).attr('class', 'td_transparent');
         }
     });

     $('table').on('click', 'td', function (e) {
         Prev_td = $("td[class='td_active']");
         e.stopPropagation();
         Prev_td.attr('class', 'td_transparent');
         Prev_td = $(this);

         var tr_index = $(this).parent().index();
         var td_index = $(this).index();
         var index = (tr_index * 2) + td_index;
         var Camnode = $(this).parent().parent().parent().parent().parent().parent();
         var Carousel_id = Camnode.find(".carousel").attr("id");
         Carousel_id = '#' + Carousel_id;
         var iterator = 0;
         $(Carousel_id + ' .carousel-inner').children('div').each(function () {
             $(this).removeClass("active");

         });
         $(Carousel_id + ' .carousel-inner').children('div').each(function () {
             if (iterator == index) {
                 var lazy = $(this);
                 lazy = lazy.find("img[data-src]");
                 lazy.attr("src", lazy.data('src'));
                 lazy.removeAttr("data-src");
                 $(this).addClass("active");
                 checkfirst_or_last_carousel(Carousel_id);
                 return false;
             }
             iterator = iterator + 1;
         });
         $(this).attr('class', 'td_active');
     });

    /* Table related script end */

    /* Scoll script start */
     $("body").on("custom-scroll", ".thumbnail_container", function (e) {
         e.stopPropagation();

         var wt = $(this).scrollTop();    //* top of the window
         var wb = wt + $(window).height();  //* bottom of the window
         var thumbnail_id = $(this).attr("id");
         thumbnail_id = '#' + thumbnail_id;
         $(thumbnail_id + ' .table_container #thumbnails_table tbody img').each(function () {
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
    /* Scroll script end */

    /* get Reports script start */

     $('#getRprtBtn').click(function (e) {
         var month_fromdate, day_fromdate, hours_fromdate, min_fromdate, sec_fromdate;
         var month_to_date, day_todate, hours_todate, min_todate, sec_todate;

         var from_datetime_temp = $("#fromDatePicker").find("input").val();
         var to_datetime_temp = $("#toDatePicker").find("input").val();

         var from_datetime = new Date(from_datetime_temp);
         var to_datetime = new Date(to_datetime_temp);
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

         var from_date_timestr = '' + from_datetime.getFullYear() + month_fromdate + day_fromdate + hours_fromdate + min_fromdate + sec_fromdate;
         var to_datetime_str = '' + to_datetime.getFullYear() + month_todate + day_todate + hours_todate + min_todate + sec_todate;

         var selectedcamera_name = $('.CamSel_div .btn-group .btn-default').text();
         var request_obj = {};
         request_obj.fromdate = from_date_timestr;
         request_obj.todate = to_datetime_str;

         var CameraObjarr = [];

         var tmpObj = {};
         for (var CamItr = 0; CamItr < UI_relatedCameraInfoObjectsList.length; CamItr++)
         {
             if(UI_relatedCameraInfoObjectsList[CamItr].CameraName===selectedcamera_name)
             {
                 tmpObj.CameraID = UI_relatedCameraInfoObjectsList[CamItr].CameraID;  /* 0 i.e First Camera */
                 tmpObj.IMSI = UI_relatedCameraInfoObjectsList[CamItr].CameraIMSI;
                 break;
             }
         }
         
         CameraObjarr.push(tmpObj);
         request_obj.CamIMSI_arr = CameraObjarr;
         request_obj = '{RequestObjectForAllCameras: ' + JSON.stringify(request_obj) + '}';

         ajax_request(request_obj, GetImagesOfReqCamerasMethodname);
     });
    /* get Reporrts script end */
});
