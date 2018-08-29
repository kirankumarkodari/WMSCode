<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="WMS.Default" %>

<!DOCTYPE html>
<html lang="en">
<head>
  <title>Work Monitoring System</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  
  <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
  <link href="css/rwms.css" rel="stylesheet" type="text/css">
  <link href="css/wms.css" rel="stylesheet" type="text/css">

  
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<link href="css/bootstrap-datetimepicker.css" rel="stylesheet" type="text/css">
	
  <script type="text/javascript" src="js/jquery.min.js"></script>
  <script type="text/javascript" src="js/bootstrap.min.js"></script>
  <script type="text/javascript" src="js/jquery.sumoselect.min.js"></script>
  <script src="js/moment.min.js"></script>
  <script src="js/bootstrap-datetimepicker.min.js"></script>
  
  <script>
      var jsonobj = {};
$( document ).ready(function() {

   /*

  jsonobj=[{
    "img_name":"20170909393939",
    "img_path":"Images\\test.jpg"
},
{
    "img_name":"two",
    "img_path":"\\192.168.1.20\\Projects\\Images\\test1.jpg"
},
{
    "img_name":"three",
    "img_path":"D:\\Projects\\Images\\test2.jpg"
},
{
    "img_name":"three",
    "img_path":"D:\\Projects\\Images\\test3.jpg"
},
{
    "img_name":"three",
    "img_path":"D:\\Projects\\Images\\test4.jpg"
},
{
    "img_name":"three",
    "img_path":"D:\\Projects\\Images\\test5.jpg"
},
{
    "img_name":"three",
    "img_path":"D:\\Projects\\Images\\test6.jpg"
},
{
    "img_name":"three",
    "img_path":"D:\\Projects\\Images\\test7.jpg"
}
];*/
/*
        var month_fromdate;
		 var month_to_date;
	     var from_datetime_temp=$("#fromDatePicker").find("input").val();
		 var to_datetime_temp=$("#toDatePicker").find("input").val();
		 
	 // var from_datetime=$("#datetimepicker1").data("datetimepicker").getDate();
	     var from_datetime=new Date(from_datetime_temp);
		 var to_datetime=new Date(to_datetime_temp);
		 month_fromdate=from_datetime.getMonth()+1;
		 month_todate=to_datetime.getMonth()+1;
		 var from_date_timestr='';
		 from_date_timestr=from_date_timestr+from_datetime.getFullYear()+month_fromdate+from_datetime.getDate()+from_datetime.getHours()+from_datetime.getMinutes()+from_datetime.getSeconds();
	    alert(from_date_timestr);
		var to_datetime_str=to_datetime.getFullYear()+month_todate+to_datetime.getDate()+to_datetime.getHours()+to_datetime.getMinutes()+to_datetime.getSeconds();
	     var request_obj={ 
                          fromdate: from_date_timestr ,
		                  todate: to_datetime_str 
                        };*/

 
    // Making Empty the carousals and table images 

var rowcontent;
rowcontent='';
var column_calc;
column_calc=0;
$(".carousel-indicators").empty();
$(".carousel-inner").empty();
$(".image_table tbody").empty();

  var from_datetime_str;
	  
	  var to_datetime_str;
	 
	  var from_datetime=new Date();
	
	  var to_datetime=new Date();
	  
	  var month_fromdate,day_fromdate,hours_fromdate,min_fromdate,sec_fromdate;
	  var month_todate;
	  
	  from_datetime.setHours(from_datetime.getHours() - 4);

	  from_datetime_str='';
	  to_datetime_str='';
	  month_fromdate=from_datetime.getMonth()+1;
	   
	  
	  from_date_timestr=''+from_datetime.getFullYear()+month_fromdate+from_datetime.getDate()+from_datetime.getHours()+from_datetime.getMinutes()+from_datetime.getSeconds();
	    
	  month_todate = to_datetime.getMonth() + 1;
	  if (month_todate < 10)
	      month_todate = "0" + month_todate;

	  alert(month_todate)
	  
	  to_datetime_str=''+to_datetime.getFullYear()+month_todate+to_datetime.getDate()+to_datetime.getHours()+to_datetime.getMinutes()+to_datetime.getSeconds();
	  
	  var request_obj={};
	  request_obj.fromdate = from_date_timestr;
	  request_obj.todate = to_datetime_str;

	  $.ajax(
                      {
                          url: "default.aspx/getdata",
                          contentType: "application/json; charset=utf-8",
                          dataType: "json",
                          type: "POST",
                          data: '{times: ' + JSON.stringify(request_obj) + '}',
                          success: function (data) {
                              if (data.d.length > 0) {
                                  
                                  jsonobj = data.d;
                                  for (var i = 0; i < jsonobj.length; i++) {

                                      $(".carousel-indicators").append('<li data-target="#myCarousel" data-slide-to="' + i + '" > </li>');
                                      $(".carousel-inner").append('<div class="item"> <img src="' + jsonobj[i].img_path + '" alt="Image"></div>');
                                      rowcontent = rowcontent + '<td><img src="' + jsonobj[i].img_path + '" class="img-thumbnail td_image"><p>' + jsonobj[i].img_name + '</p></td>';
                                      column_calc = column_calc + 1;
                                      if (column_calc != 0) {
                                          if (column_calc % 4 === 0) {

                                              // Creating one row for four td columns. 
                                              $(".image_table tbody").append('<tr class="clickable-row">' + rowcontent + '</tr>');
                                              rowcontent = '';
                                              column_calc = 0;
                                          }
                                      }
                                      /*else
                                      {
                                      /* alert('Failed');*/
                                      /*}
                                     // $(".image_table tbody").append();
                                      //alert(jsonobj[i]['img_name']);*/
                                  }
                                  if (rowcontent != '') {
                                      // Add to the table row if there is any td's
                                      var columns_tobeadded;
                                      columns_tobeadded = 4 - column_calc;
                                      for (var itr = 1; itr <= columns_tobeadded; itr++) {
                                          rowcontent = rowcontent + '<td><img  class="img-thumbnail td_image"><p></p></td>';
                                      }
                                      $(".image_table tbody").append('<tr class="clickable-row">' + rowcontent + '</tr>');

                                  }

                                  $('.item').first().addClass('active');
                                  //$('.td').first().addClass('active');
                                  $('.carousel-indicators > li').last().addClass('active');
                              }
                          }
                      });
     
});

























   //DatePicker
   $(function () {
     //to stop auto sliding in carousal
    $('.carousel').carousel({
       interval: false
    }); 
	$("#getRprtBtn").click(function()
	{
	    //get the data with in selected time period
	    alert(jsonobj[0].img_name);
	  
	 // var from_datetime=$("#fromDatePicker").data("datetimepicker").getDate();
	     var month_fromdate;
		 var month_to_date;
	     var from_datetime_temp=$("#fromDatePicker").find("input").val();
		 var to_datetime_temp=$("#toDatePicker").find("input").val();
		 
	 // var from_datetime=$("#datetimepicker1").data("datetimepicker").getDate();
	     var from_datetime=new Date(from_datetime_temp);
		 var to_datetime=new Date(to_datetime_temp);
		 month_fromdate=from_datetime.getMonth()+1;
		 month_todate=to_datetime.getMonth()+1;
		 var from_date_timestr=''+from_datetime.getFullYear()+month_fromdate+from_datetime.getDate()+from_datetime.getHours()+from_datetime.getMinutes()+from_datetime.getSeconds();
	     var to_datetime_str=''+to_datetime.getFullYear()+month_todate+to_datetime.getDate()+to_datetime.getHours()+to_datetime.getMinutes()+to_datetime.getSeconds();
	     request_obj = {};
	     request_obj.fromdate = from_date_timestr;
	     request_obj.todate = to_datetime_str;
 $.ajax(
                    {
                        url: 'default.aspx/getdata',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        type: "POST",
                        data: '{times: ' + JSON.stringify(request_obj) + '}',
                        success: function (data) {
                            if (data.d.length > 0) {
                                jsonobj = data.d;
                                var rowcontent;
                                rowcontent = '';
                                var column_calc;
                                column_calc = 0;
                                $(".carousel-indicators").empty();
                                $(".carousel-inner").empty();
                                $(".image_table tbody").empty();

                                for (var i = 0; i < jsonobj.length; i++) {

                                    $(".carousel-indicators").append('<li data-target="#myCarousel" data-slide-to="' + i + '" > </li>');
                                    $(".carousel-inner").append('<div class="item"> <img src="' + jsonobj[i].img_path + '" alt="Image"></div>');
                                    rowcontent = rowcontent + '<td><img src="' + jsonobj[i].img_path + '" class="img-thumbnail td_image"><p>' + jsonobj[i].img_name + '</p></td>';
                                    column_calc = column_calc + 1;
                                    if (column_calc != 0) {
                                        if (column_calc % 4 === 0) {

                                            // Creating one row for four td columns. 
                                            $(".image_table tbody").append('<tr class="clickable-row">' + rowcontent + '</tr>');
                                            rowcontent = '';
                                            column_calc = 0;
                                        }
                                    }
                                    /*else
                                    {
                                    /* alert('Failed');*/
                                    /*}
                                   // $(".image_table tbody").append();
                                    //alert(jsonobj[i]['img_name']);*/
                                }
                                if (rowcontent != '') {
                                    // Add to the table row if there is any td's
                                    var columns_tobeadded;
                                    columns_tobeadded = 4 - column_calc;
                                    for (var itr = 1; itr <= columns_tobeadded; itr++) {
                                        rowcontent = rowcontent + '<td><img  class="img-thumbnail td_image"><p></p></td>';
                                    }
                                    $(".image_table tbody").append('<tr class="clickable-row">' + rowcontent + '</tr>');

                                }

                                $('.item').first().addClass('active');
                                $('.carousel-indicators > li').last().addClass('active');
                            }
                        }
                    });

		 
	  });
	
	$("#getRprtBtn2").click(function()
	{
	  /*var d = new Date();
	  var month = d.getMonth()+1;
	  var day = d.getDate();
	  var hour = d.getHours();*/
	 
	  var from_datetime_str;
	  
	  var to_datetime_str;
	 
	  var from_datetime=new Date();
	
	  var to_datetime=new Date();
	  
	  var month_fromdate;
	  var month_todate;
	  
	  from_datetime.setHours(from_datetime.getHours() - 4);

	  from_datetime_str='';
	  to_datetime_str='';
	  month_fromdate=from_datetime.getMonth()+1;
	   
	  
	  from_date_timestr=''+from_datetime.getFullYear()+month_fromdate+from_datetime.getDate()+from_datetime.getHours()+from_datetime.getMinutes()+from_datetime.getSeconds();
	    
	  month_todate=to_datetime.getMonth()+1;
	  
	  to_datetime_str=''+to_datetime.getFullYear()+month_todate+to_datetime.getDate()+to_datetime.getHours()+to_datetime.getMinutes()+to_datetime.getSeconds();
	  
	  request_obj = {};
	  request_obj.fromdate = from_date_timestr;
	  request_obj.todate = to_datetime_str;

	  // from_datetime is for 4 hours back time & to_datetime is for present date time
	  
	  
	  /*$.ajax({
       type: "POST",
       url: "@Url.Action("refresh", "group")",
       contentType: "application/json; charset=utf-8",
       data: JSON.stringify({ 
        fromdate: from_datetime_str ,
		todate: to_datetime_str
       }),
    success: function (result) {
        //do something
    },
    error: function (req, status, error) {
        //error                        
    }
});*/

 $.ajax(
                    {
                        url: 'default.aspx/getdata',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        type: "POST",
                        data: '{times: ' + JSON.stringify(request_obj) + '}',
                        success: function (data) {
                            if (data.d.length > 0) {
                                jsonobj= data.d;
                                var rowcontent;
                                rowcontent = '';
                                var column_calc;
                                column_calc = 0;
                                $(".carousel-indicators").empty();
                                $(".carousel-inner").empty();
                                $(".image_table tbody").empty();

                                for (var i = 0; i < jsonobj.length; i++) {

                                    $(".carousel-indicators").append('<li data-target="#myCarousel" data-slide-to="' + i + '" > </li>');
                                    $(".carousel-inner").append('<div class="item"> <img src="' + jsonobj[i].img_path + '" alt="Image"></div>');
                                    rowcontent = rowcontent + '<td><img src="' + jsonobj[i].img_path + '" class="img-thumbnail td_image"><p>' + jsonobj[i].img_name + '</p></td>';
                                    column_calc = column_calc + 1;
                                    if (column_calc != 0) {
                                        if (column_calc % 4 === 0) {

                                            // Creating one row for four td columns. 
                                            $(".image_table tbody").append('<tr class="clickable-row">' + rowcontent + '</tr>');
                                            rowcontent = '';
                                            column_calc = 0;
                                        }
                                    }
                                    /*else
                                    {
                                    /* alert('Failed');*/
                                    /*}
                                   // $(".image_table tbody").append();
                                    //alert(jsonobj[i]['img_name']);*/
                                }
                                if (rowcontent != '') {
                                    // Add to the table row if there is any td's
                                    var columns_tobeadded;
                                    columns_tobeadded = 4 - column_calc;
                                    for (var itr = 1; itr <= columns_tobeadded; itr++) {
                                        rowcontent = rowcontent + '<td><img  class="img-thumbnail td_image"><p></p></td>';
                                    }
                                    $(".image_table tbody").append('<tr class="clickable-row">' + rowcontent + '</tr>');

                                }

                                $('.item').first().addClass('active');
                                $('.td').first().addClass('active');
                                $('.carousel-indicators > li').last().addClass('active');
                            }
                        }
                    });
					
					


	  
	});
	$( "td" ).click(function() {

      // Code to change carousal slide 
	 
	  var imgpath=$(this).find("img").attr("src"); //getting clicked image path 
	  var carousal_idx;
	  for(var i=0;i<jsonobj.length;i++)
	  {
	    if(jsonobj[i].img_path==imgpath)
	    {
	     carousal_idx=i;
	    
	    }
	    
	  }
	  
	  
	  var totalItems = $('.item').length;
	  
	  var currentIndex = $('div.active').index() ;// getting the carousal index 
	  
	  
	  
	 // $('#myCarousel').carousal(carousal_idx);//to move the image to particular  slide
	 
	 // Remove active for all the carousel slides
	   $('.carousel-inner').children('div').each(function () {
           
		  $(this).removeClass("active");
		  
       });
	   
	  
	  var iterator;
	  iterator=0;
	 // alert(carousal_idx);// to identify the index of the carousal.
	 // Add active for Clicked  carousel slides
	   $('.carousel-inner').children('div').each(function () {
	      if(iterator==carousal_idx) 
		  {
		   $(this).addClass("active");
		  }
          iterator=iterator+1; 
       });

    });
	
  /*Linked From & To DatePickers */
                $('#fromDatePicker').datetimepicker({
                  ignoreReadonly: true,
                  //format: 'DD/MM/YYYY',
                  icons: {
                      date: "fa fa-calendar"
                  },
                  defaultDate: moment(new Date())
                });

                      $('#toDatePicker').datetimepicker({
                        ignoreReadonly: true,
                        //format: 'DD/MM/YYYY',
                        icons: {
                            date: "fa fa-calendar"
                        },
                        defaultDate: moment(new Date()),
                        useCurrent: false //Important! See issue #1075
                      });
                      $("#fromDatePicker").on("dp.change", function (e) {
                          $('#toDatePicker').data("DateTimePicker").minDate(e.date);
                      });
                      $("#toDatePicker").on("dp.change", function (e) {
                          $('#fromDatePicker').data("DateTimePicker").maxDate(e.date);
                      });
          });
  </script>
  
</head>
<body>


  
<div class="container-fluid">
<div class="row header-content hidden-xs hidden-sm" style="border-bottom: 2px solid #e0f7fa;padding-top:5px;padding-bottom:4px">
<div class="col-lg-3 col-md-3 col-xs-3 col-sm-3">
</div>
  <div class="col-lg-2 col-md-2 col-sm-3 col-xs-4">
   <img style="text-align:right"class="img-responsive img-circle" src="Images/camera.png" alt="Image not available">
   </div>
  <div class="col-lg-7 col-md-7 col-sm-6 col-xs-6"><h1  style="border:none;padding:none;text-align:left;margin-left:-10px;padding-top:4px;color:#00b8d4">Work Monitoring System</h1></div>
</div>

<div class="row header-content hidden-md hidden-lg" style="border-bottom: 2px solid #e0f7fa">
  <div class="col-sm-12 col-xs-12"><h2  style="border:none;padding:none;text-align:center;padding-top:20px;color:#00b8d4">Work Monitoring System</h2 	></div>
</div>

    <div class="row filter_row">
        <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12 col-lg-offset-1 col-md-offset-1">
          <!-- From Date Picker -->
          <div class="form-group">
                    <p style="font-weight:bold">From Time</p>
                    <div class="input-group date" id="fromDatePicker">
				
                        <input id="frmDatepickerInpt" type="text" class="form-control" readonly style="background:white">
                        <span class="input-group-addon">
                            <span class="fa fa-calendar"></span>
                        </span>
                    </div>
                </div>
        </div>
        <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
          <!--To Date Picker -->
          <div class="form-group">
                    <p style="font-weight:bold">To Time</p>
                    <div class="input-group date" id="toDatePicker">
					
                        <input id="toDatepickerInpt" type="text" class="form-control" readonly style="background:white">
                        <span class="input-group-addon">
                            <span class="fa fa-calendar"></span>
                        </span>
                    </div>
                </div>
        </div>
        <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
          <!--get Image button -->
          <button id="getRprtBtn" type="button" class="button" onclick="">Get Images</button>
        </div>
		
		 <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
          <!--get Image button -->
          <button id="getRprtBtn2" type="button" class="button" >Get Latest Images</button>
        </div>
      </div>
	  
  <div class="row carousal_row">
    <div class="col-md-12 col-lg-12 col-xs-12 col-sm-12">
       
	  <!-- Carousal Display -->
	  
<div id="myCarousel" class="carousel slide" data-ride="carousel">
  <!-- Indicators -->
  <ol class="carousel-indicators">
    <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
    <li data-target="#myCarousel" data-slide-to="1"></li>
    <li data-target="#myCarousel" data-slide-to="2"></li>
  </ol>

  <!-- Wrapper for slides -->
  <div class="carousel-inner">
    <div class="item active">
      <img src="Images/test2.jpg" alt="Los Angeles">
    </div>

    <div class="item">
      <img src="Images/test2.jpg" alt="Chicago">
    </div>

    <div class="item">
      <img src="Images/test2.jpg" alt="New York">
    </div>
  </div>

  <!-- Left and right controls -->
  <a class="left carousel-control" href="#myCarousel" data-slide="prev">
    <span class="glyphicon glyphicon-chevron-left"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a class="right carousel-control" href="#myCarousel" data-slide="next">
    <span class="glyphicon glyphicon-chevron-right"></span>
    <span class="sr-only">Next</span>
  </a>
</div>
    </div>
	
  </div>
<div class="row table_row">
   <h3 id="tableTilte" style="padding:0px;padding-top:10px">Images List</h3>
    <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12 table_container">
    
      <div class="table-responsive">
	  <table class="table table-striped image_table">
 <thead>
     <!-- <tr>
        <th></th>
        <th></th>
        <th></th>
      </tr>-->
    </thead>
    <tbody>
      <tr class="clickable-row">
        
        <td class=""><img src="images/1.jpg" class="img-thumbnail td_image">
		<p>20170608 </p></td>
        
		   <td><img src="images/1.jpg" class="img-thumbnail td_image">
		<p>20170608 </p></td>
		 
		   <td><img src="images/1.jpg" class="img-thumbnail td_image">
		<p>20170608 </p></td>
		
		<td><img src="images/1.jpg" class="img-thumbnail td_image">
		<p>20170608 </p></td>
		   
      </tr>
	  <tr class="clickable-row">
        
        <td class=""><img src="images/1.jpg" class="img-thumbnail td_image">
		<p>20170608 </p></td>
        
		   <td><img src="images/1.jpg" class="img-thumbnail td_image">
		<p>20170608 </p></td>
		 
		   <td><img src="images/1.jpg" class="img-thumbnail td_image">
		<p>20170608 </p></td>
		
		<td><img src="images/1.jpg" class="img-thumbnail td_image">
		<p>20170608 </p></td>
		   
      </tr>
	  <tr class="clickable-row">
        
        <td class=""><img src="images/1.jpg" class="img-thumbnail td_image">
		<p>20170608 </p></td>
        
		   <td><img src="images/1.jpg" class="img-thumbnail td_image">
		<p>20170608 </p></td>
		 
		   <td><img src="images/1.jpg" class="img-thumbnail td_image">
		<p>20170608 </p></td>
		
		<td><img src="images/1.jpg" class="img-thumbnail td_image">
		<p>20170608 </p></td>
		   
      </tr>
	  </tbody>
  </table>
  </div>
    </div>
  </div>
  <div class="row" style="padding:15px">
   <img src="http://192.168.1.189:8581/ImageViewr/Online_images/2017091411144400020000110404071616613148.jpg" runat="server"/>
  </div>
</div>

</body>
</html>
