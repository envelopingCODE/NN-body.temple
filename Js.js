    "use strict"

// DOM Declarations 

const openMenuButtonEl = document.getElementById("open-menu");
const closeMenuButtonEl = document.getElementById("close-menu");


    // Progress bar

    document.addEventListener('DOMContentLoaded', function () {
        const progressBar = document.getElementById("progress-bar");

        function updateProgressBar() {
            const scrollPosition = window.scrollY;
            const documentHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;
            const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;

            progressBar.style.width = `${scrollPercentage}%`;
        }

        window.addEventListener('scroll', updateProgressBar);
    });

    // Event Listener for Menu toggle 
openMenuButtonEl.addEventListener('click', ToggleMenu);
closeMenuButtonEl.addEventListener('click', ToggleMenu);

function ToggleMenu () {
    let navMenuEl = document.getElementById("nav-menu");
    let style = window.getComputedStyle(navMenuEl);
    
    if(style.display === "none" ) {
        navMenuEl.style.display = 'block';

    } else {
        navMenuEl.style.display ='none';
    }
 };



// Event Listener for Return to Top button
document.addEventListener("DOMContentLoaded", function() {
    const returnToTopButton = document.getElementById('return-to-top');

    // Show or hide the button based on the scroll position
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;

        if (scrollPercentage >= 90) {
            returnToTopButton.style.display = 'block';
        } else {
            returnToTopButton.style.display = 'none';
        }
    });
});

