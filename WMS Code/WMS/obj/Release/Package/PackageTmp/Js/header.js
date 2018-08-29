$(function(){
  //Toggling sidebar
  $("#sidebar-toggler").click(function(){
    $(this).toggleClass("navbar-toggle custom-fa-close");
    $("#side-bar").toggleClass("bar-collapsed bar-active");
  });
  var hasScroll=$("body").attr("data-spy");
  if (typeof hasScroll === typeof undefined && hasScroll !== false){
    $("#main-menu-xs").addClass("navbar-fixed-top");
    $("#main-menu").addClass("navbar-fixed-top");
  }
  $("#side-bar").on("wheel",function(e){
    e.preventDefault();
  });
  //Closing side-bar if screen size greater than sm
  $(window).resize(function(){
    var wt=$(this).width();
    if($("#sidebar-toggler").hasClass("custom-fa-close") && $("#side-bar").hasClass("bar-active") && wt > 991)
    {
      $("#sidebar-toggler").toggleClass("custom-fa-close navbar-toggle");
      $("#side-bar").toggleClass("bar-active bar-collapsed");
    }
  });
});