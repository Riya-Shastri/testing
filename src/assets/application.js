// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require $
//= require $_ujs
//= require turbolinks
//= require_tree .

$(window).scroll(function () 
{
  if ($(this).scrollTop() > 200) 
  {
    $('.navbar-collapse').css({
      height: '80px'
    }, {
        duration: 1000  // 2 seconds
    });

    $('.sticky').css({
      height: '80px'
    }, {
        duration: 1000  // 2 seconds
    });

    $(".nav__submenu").css("z-index","99999999999999999999999999999999999999999999999 !important");
  }
  else 
  {
    $('.navbar-collapse').css({
      height: '60px'
    }, {
        duration: 1000  // 2 seconds
    });

    $('.sticky').css({
      height: '60px'
    }, {
        duration: 1000  // 2 seconds
    });

    $(".nav__submenu").css("z-index","99999999999999999999999999999999999999999999999 !important");
  }
});

    // $(document).ready(function(){
    //   numberMenus = $('#toplist').children().length;
    //   menuWidth = parseFloat($('#toplist').width())/numberMenus;
    //   $('#toplist li').css('width',menuWidth+'px !important');
    // });

  //   $(document).ready(function(){
  //     // cache the window object
  //     $window = $(window);

      $('section[data-type="background"]').each(function(){
        // declare the variable to affect the defined data-type
        var $scroll = $(this);

         $(window).scroll(function() {
           // HTML5 proves useful for helping with creating JS functions!
           // also, negative value because we're scrolling upwards
           var yPos = -($window.scrollTop() / $scroll.data('speed'));

           // background position
           var coords = '50% '+ yPos + 'px';

           // move the background
           $scroll.css({ backgroundPosition: coords });
         }); // end window scroll
      });  // end section function
   //}); // close out script

// $(document).ready(function() {
//     $('a[href*=\\#]').on('click', function(e){
//         e.preventDefault();
//         $('html, body').animate({
//             scrollTop : $(this.hash).offset().top
//         }, 500);
//     });
// });