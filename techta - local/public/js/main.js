jQuery(document).ready(function(){


  jQuery(".owl-carousel2").owlCarousel({
    loop:true,
    center: false,
    margin:20,
    responsiveClass:true,
    nav:true,
    responsive:{
      0:{
        items:2,
        nav:false,
      },
      600:{
        items:2,
        nav:false
      },
      1000:{
        items:4,
        nav:true,
        loop:true
      }
    }
  }
  );

  jQuery(".owl-carousel3").owlCarousel({
    loop:true,
    center: false,
    margin:20,
    responsiveClass:true,
    nav:true,
    responsive:{
      0:{
        items:1,
        nav:false,
      },
      600:{
        items:2,
        nav:false
      },
      1000:{
        items:3,
        nav:true,
        loop:true
      }
    }
  }
  );

  jQuery(".owl-carousel4").owlCarousel({
    loop:true,
    center: false,
    margin:20,
    responsiveClass:true,
    nav:true,
    responsive:{
      0:{
        items:1,
        nav:false,
      },
      600:{
        items:2,
        nav:false
      },
      1000:{
        items:2,
        nav:true,
        loop:true
      }
    }
  }
  );



});

// JS code to detect the scroll event
$(function () {
  // when there is a scroll event to this document
  $(document).scroll(function () {
      // find the nav bar using the nav bar id
      var $nav = $("#mainNavbar");
      // once we scroll the page top more than the navbar height, we will detect the scroll and change the nav bar scc properties using toggleClass method on .scrolled class
      $nav.toggleClass("scrolled", $(this).scrollTop() > $nav.height());
  });
});



function redirectToSignUp(){
  location.replace("signUp.html")
}

function concatPhoneNumbers(){
  let code = document.getElementById("countryCode").value
  let phoneNo = document.getElementById("hp-number").value
  let ret = "+" + code + phoneNo 
  return ret 
}

function myFunction(x) {
  x.classList.toggle("change");
}