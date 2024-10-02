$('.menu-bars').click(()=>{
    $('.sidebar').addClass("active-sidebar");
});

$('.cross').click(()=>{
    $('.sidebar').removeClass("active-sidebar");
})

let lastScrollY = window.scrollY;
const navbar = document.querySelector('.navbar');
const mobile_navbar = document.querySelector('.mobile-navbar');
const topMenuHeight = document.querySelector('#top-nav').offsetHeight;
let isNavbarVisible = true;


window.addEventListener('scroll', () => {
	const currentScrollY = window.scrollY;
  
	// If the scroll position is more than 50px
	if (currentScrollY > 50) {
		navbar.style.position = `fixed`;
    mobile_navbar.style.position = 'fixed'
	  // Hide navbar if scrolling down by more than 30px and navbar is visible
	  if (currentScrollY - lastScrollY > 30 && isNavbarVisible) {
		navbar.style.top = `-${navbar.offsetHeight}px`; // Hide the navbar, accounting for the small menu height
    mobile_navbar.style.top = `-35px`;
		isNavbarVisible = false;
	  }else if(currentScrollY==topMenuHeight || currentScrollY<topMenuHeight) {
		navbar.style.top = `27px`;
    mobile_navbar.style.top= `0px`;
	  }
	  // Show navbar if scrolling up by more than 30px and navbar is hidden
	  else if (lastScrollY - currentScrollY > 30 && !isNavbarVisible) {
		navbar.style.top = `0`; // Show the navbar below the small top menu
    mobile_navbar.style.top = `0`;
		isNavbarVisible = true;
	  }
	}else {
		navbar.style.position = `relative`;	
    mobile_navbar.style.position = `relative`;
	}
  
	lastScrollY = currentScrollY;
  });


  $(document).ready(function(){
    $('.owl-carousel').owlCarousel({
      loop: true,             // Enable looping
      margin: 10,             // Add margin between items
      nav: false,              // Show navigation arrows
      dots: true,             // Show pagination dots
      autoplay: true,         // Enable autoplay
      autoplayTimeout: 3000,  // Time between slides in milliseconds
      responsive: {
        0: {
          items: 1            // Show 1 item on small screens
        },
        600: {
          items: 1            // Show 1 item on medium screens
        },
        1000: {
          items: 3            // Show 2 items on large screens
        }
      }
    });
  });


  document.addEventListener('DOMContentLoaded', function() {

    if(AOS != "null"){
        // Initialize AOS (Animate on Scroll)
        AOS.init({
            duration: 1000,  // Animation duration
            once: true       // Only animate once
          });

          
    var swiper = new Swiper('.swiper-container', {
      loop: true, // Enable infinite looping
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      autoplay: {
        delay: 3000, // Autoplay with a 3-second delay
        disableOnInteraction: false,
      },
      on: {
        // Refresh AOS on slide change to retrigger animations
        slideChange: function() {
            setTimeout(() => {
                AOS.refresh();
              }, 100); // Slight delay to allow transition
        },
    }
    });
  }


  });
