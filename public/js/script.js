const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i=> {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});




// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})







const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
	if(window.innerWidth < 576) {
		e.preventDefault();
		searchForm.classList.toggle('show');
		if(searchForm.classList.contains('show')) {
			searchButtonIcon.classList.replace('bx-search', 'bx-x');
		} else {
			searchButtonIcon.classList.replace('bx-x', 'bx-search');
		}
	}
})





if(window.innerWidth < 768) {
	sidebar.classList.add('hide');
} else if(window.innerWidth > 576) {
	searchButtonIcon.classList.replace('bx-x', 'bx-search');
	searchForm.classList.remove('show');
}


window.addEventListener('resize', function () {
	if(this.innerWidth > 576) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})



const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
	if(this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})

document.addEventListener("DOMContentLoaded", function() {
    const dropdowns = document.querySelectorAll('.dropdown');
	let clickcount = 0;
	let dropdownmenuHeight;

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function() {
            dropdown.classList.toggle('active');
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');
            dropdownMenu.classList.toggle('show');
			dropdownMenu.style.top =  dropdown.clientHeight + 'px';
			if(clickcount <= 0){
				dropdownmenuHeight = dropdownMenu.clientHeight;
				dropdown.querySelector('a').style.height = (dropdown.clientHeight-10)+'px';
				dropdown.style.height = (dropdownMenu.clientHeight + dropdown.clientHeight)+'px';
				clickcount = 1;
			}else{
				dropdown.style.height =  (dropdown.clientHeight - dropdownmenuHeight)+'px';
				clickcount = 0;
			}
        });
    });

    window.addEventListener('click', function(e) {
        dropdowns.forEach(dropdown => {
			
				// clickcount = 0;
            if (!dropdown.contains(e.target)) {
				dropdown.classList.remove('active');
                dropdownMenu.classList.remove('show');
				const dropdownMenu = dropdown.querySelector('.dropdown-menu');
				dropdown.style.height =  (dropdown.clientHeight - dropdownMenu.clientHeight)+'px';
			
            }
        });
    });
});