var UI_relatedCameraInfoObjectsList = [];
var RequestCameraObjectsList = {};
var ResponseCameraObjectsList = {};
var AddCamearrequest_obj = {};
var DeleteCameraRequest_obj = {};
var updateCameraRequest_obj = {};
var GetCameraInfoMethodname = "getCameraInfo";
var AddCameraMethodname = "AddCamera";
var ModifyCameraMethodname = "UpdateCamera";
var DeleteCameraMethodname = "DeleteCamera";

var CameraIMSIAlreadyExists = "303";
var FailedToAddCamera = "505";
var FailedToUpdateCamera = "606";
var FailedToDeleteCamera = "707";
var SuccessCode = "200";


$(document).ready(function () {

  // $('.camIMSI_err').hide();  // to hide error messages 
  
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
    /* End of Geeting Camera Information */


   

});


function ajax_request(request_obj, Methodname) {
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
                    CreateDOMOnDocumentReady(data.d);
                }
                else if (Methodname === AddCameraMethodname) {
                    var camname = AddCamearrequest_obj.CameraName;
                    CheckAndAddCardtoExistedCamera_row(data.d, AddCamearrequest_obj);
                }
                else if (Methodname === ModifyCameraMethodname)
                {
                    CheckAndModifyCameraCard(data.d, updateCameraRequest_obj);
                }
                else if (Methodname === DeleteCameraMethodname)
                {
                    CheckAndDeleteCamera(data.d, DeleteCameraRequest_obj);
                }
            },
            error: function () {
                /* Error Occured while trying to connect with the Server */
            }
        });
    }
    else
    {
        /* No Internet */
    }
}
function CreateDOMOnDocumentReady(CameraInfoObjectsList) {
    if (CameraInfoObjectsList != null && CameraInfoObjectsList.length > 0) /* Configuration.XML file has configured with some cameras */ {
        $('#Cameras-row').empty();  // to empty the default camera cards */
        for (var CameraItr = 0; CameraItr < CameraInfoObjectsList.length; CameraItr++) {
            var tmp_UIObject = {};
            tmp_UIObject.CameraID = CameraInfoObjectsList[CameraItr].CameraID;
            tmp_UIObject.CameraName = CameraInfoObjectsList[CameraItr].CameraName;
            tmp_UIObject.CameraIMSI = CameraInfoObjectsList[CameraItr].CameraIMSI;
            $('#Cameras-row').append('<div id=' + tmp_UIObject.CameraID + ' class="col-lg-6  col-md-5   col-sm-12   col-xs-12"><div class="Camera_div"><div class="Camera_title_bar"><p class="Camera_id"> ' + tmp_UIObject.CameraID + ' </p><div class="delete_icon"><i class="fa fa-trash" aria-hidden="true" style="font-size:2.0em; color: #b70e0e;"></i></div></div><div id="form" class="Camera_form"><form><fieldset><div class="form-group"><label for="Camname">Camera Name</label><input type="text" onkeypress="return checkSpcialChar(event)" name="Camname" class="field Cam_name" required  title="Camera Name should have numbers and alphabets only" value=' + tmp_UIObject.CameraName + ' /><p class="camName_minlen"> Camera Name should have minimum of 3 characters  </p></div><div class="form-group"><label class="CamIMSI_lbl" for="CamIMSI">Camera IMSI</label><input type="text" onkeypress="return checkIsNumber(event)" class="field IMSI_number" name="CamIMSI" maxlength="16" required title="IMSI should have numbers only" value=' + tmp_UIObject.CameraIMSI + ' /><p class="camIMSI_err"> Camera IMSI already Exists </p><p class="camIMSI_minlen"> Camera IMSI should have minimum of 16 digits </p></div></fieldset><input type="submit" name="submit_btn" class="submit_btn_class" value="Save"></form></div></div></div>');
            UI_relatedCameraInfoObjectsList.push(tmp_UIObject);
        }
    }
    else
    {
        /* even single camera is not configured yet */
    }
}



function CheckAndAddCardtoExistedCamera_row(RespeonseObj, CameraObj)
{
    if(RespeonseObj.responsecode===SuccessCode)
    {
        $('#Cameras-row').append('<div id=' + RespeonseObj.CameraID + ' class="col-lg-6  col-md-5   col-sm-12   col-xs-12"><div class="Camera_div"><div class="Camera_title_bar"><p class="Camera_id"> ' + RespeonseObj.CameraID + ' </p><div class="delete_icon"><i class="fa fa-trash" aria-hidden="true" style="font-size:2.0em; color: #b70e0e;"></i></div></div><div id="form" class="Camera_form"><form><fieldset><div class="form-group"><label for="Camname">Camera Name</label><input type="text" onkeypress="return checkSpcialChar(event)" name="Camname" class="field Cam_name" required  title="Camera Name should have numbers and alphabets only" value=' + CameraObj.CameraName + ' /><p class="camName_minlen"> Camera Name should have minimum of 3 characters  </p> </div><div class="form-group"><label class="CamIMSI_lbl" for="CamIMSI">Camera IMSI</label><input type="text" onkeypress="return checkIsNumber(event)" class="field IMSI_number" id="placePhone" name="CamIMSI" maxlength="16" required title="IMSI should have numbers only" value=' + CameraObj.CameraIMSI + '><p class="camIMSI_err"> Camera IMSI already Exists </p><p class="camIMSI_minlen"> Camera IMSI should have minimum of 16 digits </p></div></fieldset><input type="submit" name="submit_btn" class="submit_btn_class" value="Save"></form></div></div></div>');
        $('#addcamerapopup_modal').modal('hide');
        $('#Sucess_feedback_modal .feedback_msg').text('Camera added successfully ..!!');
        $('#Sucess_feedback_modal').modal('show');
      
    }
    else if(RespeonseObj.responsecode===CameraIMSIAlreadyExists)
    {
        $('#addcamerapopup_modal .camIMSI_err').show();
        $('#addcamerapopup_modal .camIMSI_err').effect("shake");
    }
    else {
        $('#Fail_feedback_modal').modal('show');
    }

}
function CheckAndModifyCameraCard(ResponseObj,CameraObj)
{
    $('#save_confirm_modal').modal('hide');
    if (ResponseObj.responsecode === SuccessCode) {
        var Cam_id = CameraObj.CameraID;
        $('#' + Cam_id + ' .IMSI_number').val(CameraObj.CameraIMSI);
        $('#' + Cam_id + ' .Cam_name').val(CameraObj.CameraName);

        $('#Sucess_feedback_modal .feedback_msg').text('Camera Modified successfully ..!!');
        $('#Sucess_feedback_modal').modal('show');
    }
    else
    {
        $('#Fail_feedback_modal').modal('show');
    }
}
function CheckAndDeleteCamera(ResponseObj,CameraObj)
{
    if(ResponseObj.responsecode===SuccessCode)
    {
        $('#' + CameraObj.CameraID).remove();  // Removing the Camera with that ID from DOM...
        $('#delete_confirm_modal').modal('hide');
        $('#Sucess_feedback_modal .feedback_msg').text('Camera deleted successfully ..!!');
        
        $('#Sucess_feedback_modal').modal('show');
    }
    else
    {
        $('#Fail_feedback_modal').modal('show');
    }
}
$(function(){
	
    /* To Open the Modal in Animated way code Start */
    // add the animation to the modal(Velocity.Js)
       $(".modal").each(function (index) {
           $(this).on('show.bs.modal', function (e) {
                    var open = $(this).attr('data-easein');
                    if (open == 'shake') {
                                 $('.modal-dialog').velocity('callout.' + open);
                              } else if (open == 'pulse') {
                                  $('.modal-dialog').velocity('callout.' + open);
                              } else if (open == 'tada') {
                                  $('.modal-dialog').velocity('callout.' + open);
                              } else if (open == 'flash') {
                                  $('.modal-dialog').velocity('callout.' + open);
                              } else if (open == 'bounce') {
                                  $('.modal-dialog').velocity('callout.' + open);
                              } else if (open == 'swing') {
                                  $('.modal-dialog').velocity('callout.' + open);
                              } else {
                                  $('.modal-dialog').velocity('transition.' + open);
                              }

              });
     });
    /* To Open the Modal in Animated way code End */

       $('.Group_add_row').click(function (e) {
         $('#addcamerapopup_modal .camIMSI_err').hide();
         $('#addcamerapopup_modal .camName_minlen').hide();
         $('#addcamerapopup_modal .camIMSI_minlen').hide();
         $('#addcamerapopup_modal .IMSI_number').val('');
         $('#addcamerapopup_modal .Cam_name').val('');
    	$('#addcamerapopup_modal').modal('show');
    });


    /* Adding Camera */
     $('#addcamerapopup_modal #add_btn').click(function (e) {
         var IsValidINputs = true;
        AddCamearrequest_obj = {};
        var request_obj = {};
        var cameraname = $('#addcamerapopup_modal .Cam_name').val();
        var CamIMSI = $('#addcamerapopup_modal .IMSI_number').val();
        cameraname = cameraname.trim();
        CamIMSI = CamIMSI.trim();
        if (cameraname.length < 3)
        {
            $('#addcamerapopup_modal .camName_minlen').show();
            IsValidINputs = false;
        }
        else {
            $('#addcamerapopup_modal .camName_minlen').hide();
        }
        if (CamIMSI.length < 16)
        {
            $('#addcamerapopup_modal .camIMSI_minlen').show();
            IsValidINputs = false;
        }
        else {
            $('#addcamerapopup_modal .camIMSI_minlen').hide();
        }
        if (IsValidINputs)
        {
            AddCamearrequest_obj.CameraName = cameraname;
            AddCamearrequest_obj.CameraIMSI = CamIMSI;
            request_obj = '{Camera: ' + JSON.stringify(AddCamearrequest_obj) + '}';
            ajax_request(request_obj, AddCameraMethodname);
        }
       
    });
    /* Delete Camera */
    $("div").on("click", ".delete_icon", function (e) {
        e.stopPropagation();
        var Camera_node = $(this).parent().parent().parent();
        var Cam_Id = Camera_node.attr("id");
        DeleteCameraRequest_obj = {};
        DeleteCameraRequest_obj.CameraID = Cam_Id;
        $('#delete_confirm_modal').modal('show');
    });
    $('#delete_confirm_modal #YES_btn').click(function (e) {
        var request_obj = '{Camera: ' + JSON.stringify(DeleteCameraRequest_obj) + '}';
        ajax_request(request_obj, DeleteCameraMethodname);
    });
    /* Update Camera */
    $("body").on("submit", '.Camera_form form', function (e) {
       
        e.preventDefault();
        var form_id = $(this).attr("id");
        var IsValidINputs = true;
        if (form_id == "addForm")
        {

        }
        else
        {
           
            var Camera_node = $(this).parent().parent().parent();
            var Cam_Id = Camera_node.attr("id");
            var cameraname = $('#' + Cam_Id + ' .Cam_name').val();
            var CamIMSI = $('#' + Cam_Id + ' .IMSI_number').val();
            cameraname = cameraname.trim();
            CamIMSI = CamIMSI.trim();
            if (cameraname.length < 3) {
                $('#' + Cam_Id + ' .camName_minlen').show();
                IsValidINputs = false;
            }
            else {
                $('#' + Cam_Id + ' .camName_minlen').hide();
            }
            if (CamIMSI.length < 16) {
                $('#' + Cam_Id + ' .camIMSI_minlen').show();
                IsValidINputs = false;
            }
            else {
                $('#' + Cam_Id + ' .camIMSI_minlen').hide();
            }
            if(IsValidINputs)
            {
                updateCameraRequest_obj = {};
                updateCameraRequest_obj.CameraID = Cam_Id;
                updateCameraRequest_obj.CameraName = cameraname;
                updateCameraRequest_obj.CameraIMSI = CamIMSI;
                $('#save_confirm_modal').modal('show');
            }
           
        }
      
    });
    $('#save_confirm_modal #YES_btn').click(function (e) {
        var request_obj = '{Camera: ' + JSON.stringify(updateCameraRequest_obj) + '}';
        ajax_request(request_obj, ModifyCameraMethodname);
    });
    $('#save_confirm_modal #NO_btn').click(function (e) {
        $('#save_confirm_modal').modal('hide');
    });
    $('#delete_confirm_modal #NO_btn').click(function (e) {
        $('#delete_confirm_modal').modal('hide');
    });
    $('#Fail_feedback_modal .ok_btn').click(function (e) {
        $('#Fail_feedback_modal').modal('hide');
    });
    $('#Sucess_feedback_modal .ok_btn').click(function (e) {
        $('#Sucess_feedback_modal').modal('hide');
    });
    
});
