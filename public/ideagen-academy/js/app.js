let lastScrollY = window.scrollY;
const navbar = document.querySelector('.nav');
// const mobile_navbar = document.querySelector('.mobile-navbar');
// const topMenuHeight = document.querySelector('#top-nav').offsetHeight;
let isNavbarVisible = true;


window.addEventListener('scroll', () => {
	const currentScrollY = window.scrollY;
  
	// If the scroll position is more than 50px
	if (currentScrollY > 50) {

		navbar.style.position = `fixed`;
    // mobile_navbar.style.position = 'fixed'
	  // Hide navbar if scrolling down by more than 30px and navbar is visible
	  if (currentScrollY - lastScrollY > 40 && isNavbarVisible) {
		navbar.style.top = `-100px`; // Hide the navbar, accounting for the small menu height
    // mobile_navbar.style.top = `-35px`;
		isNavbarVisible = false;
	  }else if(currentScrollY==0 || currentScrollY<0) {
		navbar.style.top = `0`;
    // mobile_navbar.style.top= `0`;
	  }
	  // Show navbar if scrolling up by more than 30px and navbar is hidden
	  else if (lastScrollY - currentScrollY > 30 && !isNavbarVisible) {
		navbar.style.top = `0`; // Show the navbar below the small top menu
    // mobile_navbar.style.top = `0`;
		isNavbarVisible = true;
	  }
	}else {
		navbar.style.position = `relative`;	
    // mobile_navbar.style.position = `relative`;
	}
  
	lastScrollY = currentScrollY;
  });




// Open the mobile menu
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.add('open');
});

closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
});

// Toggle Submenu
const submenuItems = document.querySelectorAll('.has-submenu > a, .has-submenu-child > a');

submenuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();  // Prevent page reload
        const parent = item.parentElement;

        // Toggle 'open' class to show/hide the submenu
        parent.classList.toggle('open');
        
        // Toggle "+" to "-" for parent or submenu
        const span = item.querySelector('span');
        if (parent.classList.contains('open')) {
            span.textContent = '-';  // Change "+" to "-"
        } else {
            span.textContent = '+';  // Change back to "+"
        }
    });
});

// Get all the tab buttons and panels
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

// Add click event to each button
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove the active class from all buttons and panels
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));

        // Add the active class to the clicked button and the corresponding panel
        button.classList.add('active');
        const targetPanel = document.getElementById(button.getAttribute('data-target'));
        targetPanel.classList.add('active');
    });
});

// Get all the tab buttons and panels
const tabButtonsGuide = document.querySelectorAll('.tab-btn-guide');
const tabPanelsGuide = document.querySelectorAll('.tab-panel-guide');

// Add click event to each button
tabButtonsGuide.forEach(button => {
    button.addEventListener('click', () => {
        // Remove the active class from all buttons and panels
        tabButtonsGuide.forEach(btn => btn.classList.remove('active'));
        tabPanelsGuide.forEach(panel => panel.classList.remove('active'));

        // Add the active class to the clicked button and the corresponding panel
        button.classList.add('active');
        const targetPanelGuide = document.getElementById(button.getAttribute('data-target'));
        targetPanelGuide.classList.add('active');
    });
});

$(document).ready(function() {
    // Initialize the first carousel (slider-section)
    $(".slider-section").owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: false,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        nav: false,
        dots: false,
        mouseDrag: false,
        touchDrag: false
    });

    // Initialize the second carousel (team-carousel)
    $(".team-carousel").owlCarousel({
        loop: true,
        margin: 10,
        nav: false,
        dots: true,
        autoplay: true,
        autoplayHoverPause: true,
        autoplayTimeout: 5000,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2
            },
            1000: {
                items: 3
            }
        }
    });

    $(".test-carousel").owlCarousel({
        loop: true,
        margin: 10,
        nav: false,
        dots: false,
        autoplay: true,
        autoplayTimeout: 5000,
        responsive: {
          0: {
            items: 1
          },
          600: {
            items: 1
          },
          1000: {
            items: 1
          }
        }
      });
});

if(AOS != "null"){
    // Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 1000,  // Animation duration
        once: true       // Only animate once
      });
}


