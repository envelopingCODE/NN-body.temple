"use strict"; // Use strict mode for better error checking and debugging

// ===== EASY CONFIGURATION SECTION =====
// Supports multiple formats:
// - Time range: "15-18" (creates hourly slots from 15:00 to 18:00)
// - Individual times: "15, 16:30, 17"
// - Mix both: "15-17, 18:30"
const AVAILABLE_SLOTS = [
  "16.04 15-19",            // One specific time + range
  "18.04 15-19",
  "0.02 14-18"             // Range + specific time
];

// ===== END OF CONFIGURATION =====


// DOM Declarations
const openMenuButtonEl = document.getElementById("open-menu");
const closeMenuButtonEl = document.getElementById("close-menu");
const navMenuEl = document.getElementById("nav-menu");
const submitButton = document.getElementById("submit-review");
const reviewerName = document.getElementById("reviewer-name");
const reviewText = document.getElementById("review-text");
const starRatingContainer = document.getElementById("star-rating");
const returnToTopButton = document.getElementById("return-to-top");
let selectedSlot = null; // Add this at the top with your other variables
let selectedRating = 0;



// fade in anim. with observer

document.addEventListener("DOMContentLoaded", () => {
  const observerOptions = {
    root: null, // Use the viewport as the root
    threshold: 0.3, // Trigger when 30% of the section is visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Trigger fade-in animation only if it hasn't already triggered this time
        entry.target.classList.add("visible");

        // For cascading items (if they exist within the section)
        if (entry.target.classList.contains("cascade")) {
          const items = entry.target.querySelectorAll(".cascade-item");
          items.forEach((item, index) => {
            setTimeout(() => {
              item.style.opacity = 1;
              item.style.transform = "translateY(0)";
            }, index * 200); // Add delay for cascading effect
          });
        }
      } else {
        // Optionally, remove the "visible" class when section leaves the viewport,
        // so the animation can trigger again the next time the section is scrolled into view.
        entry.target.classList.remove("visible");

        // Reset cascade items if needed
        if (entry.target.classList.contains("cascade")) {
          const items = entry.target.querySelectorAll(".cascade-item");
          items.forEach((item) => {
            item.style.opacity = 0;
            item.style.transform = "translateY(50px)"; // Reset position if necessary
          });
        }
      }
    });
  }, observerOptions);

  // Attach observer to all sections or elements
  document.querySelectorAll(".fade-in, .cascade").forEach((section) => {
    observer.observe(section);
  });
});



document.addEventListener("DOMContentLoaded", () => {
  // **Progress Bar**
  const progressBar = document.getElementById("progress-bar");

  function updateProgressBar() {
    const scrollPosition = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollPercentage =
      (scrollPosition / (documentHeight - windowHeight)) * 100;
    progressBar.style.width = `${scrollPercentage}%`;
  }

  window.addEventListener("scroll", updateProgressBar);

  // **Menu Toggle**
  
// Our opening sequence
openMenuButtonEl.addEventListener('click', () => {
  // First, ensure the menu is visible
  navMenuEl.style.display = 'block';

  // Reset animations and trigger them again
  navMenuEl.classList.remove('active'); // Remove the active class to reset animation
  void navMenuEl.offsetHeight; // Trigger reflow (this forces the reset of animation)
  
  // Then trigger our animations
  requestAnimationFrame(() => {
    navMenuEl.classList.add('active');
  });
});




// Our closing sequence
closeMenuButtonEl.addEventListener('click', () => {
  navMenuEl.classList.remove('active');
  
  // Wait for animation to complete before hiding
  setTimeout(() => {
    navMenuEl.style.display = 'none';

    
    
    // Reset our menu items to their initial state
    // This is like resetting our actors to their starting positions
    const menuItems = navMenuEl.querySelectorAll('ul li');
    menuItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(30px)';
    });
    
    // Force a reflow to ensure our reset takes effect
    void navMenuEl.offsetHeight;
    
    // Reset our menu items to be controlled by CSS again
    menuItems.forEach(item => {
        item.style.opacity = '';
        item.style.transform = '';
    });
  }, 500); // Adjust timeout if needed
});

function closeNavMenu() {
  navMenuEl.classList.remove('active');
  
  setTimeout(() => {
      navMenuEl.style.display = 'none';
      const menuItems = navMenuEl.querySelectorAll('ul li');
      menuItems.forEach(item => {
          item.style.opacity = '0';
          item.style.transform = 'translateX(30px)';
      });
      
      void navMenuEl.offsetHeight;
      
      menuItems.forEach(item => {
          item.style.opacity = '';
          item.style.transform = '';
      });
  }, 500);

  showSocialButtons();
}

// Then use it in both places:
closeMenuButtonEl.addEventListener('click', closeNavMenu);

document.addEventListener('click', (event) => {
  if (navMenuEl.style.display === 'block') {
      if (!navMenuEl.contains(event.target) && !openMenuButtonEl.contains(event.target)) {
          closeNavMenu();
      }
  }
});





  // **Event Delegation for Navigation Links**
  navMenuEl?.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
      navMenuEl.style.display = "none";
    }
  });

  // **Return to Top Button**
  if (returnToTopButton) {
    window.addEventListener("scroll", function () {
      const scrollPosition = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollPercentage =
        (scrollPosition / (documentHeight - windowHeight)) * 100;

      returnToTopButton.style.display =
        scrollPercentage >= 90 ? "block" : "none";
    });

    returnToTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    
      // Optional: Add a slight delay to avoid any page jumps caused by layout changes
      setTimeout(() => {
        // Additional actions can be placed here if needed
      }, 500); // Adjust delay time if necessary
    });
  };    

  // **Star Rating**
  function updateStarSelection() {
    const stars = starRatingContainer?.querySelectorAll(".star");
    stars?.forEach((star) => {
      if (parseInt(star.getAttribute("data-value")) <= selectedRating) {
        star.classList.add("selected");
      } else {
        star.classList.remove("selected");
      }
    });
  }

  starRatingContainer?.addEventListener("click", (event) => {
    if (event.target.classList.contains("star")) {
      selectedRating = parseInt(event.target.getAttribute("data-value"));
      updateStarSelection();
    }
  });

  // SoME / book 


const dropbtn = document.querySelector(".dropbtn");
const dropdownContent = document.querySelector(".dropdown-content");

dropbtn.addEventListener("click", function() {
  dropdownContent.style.display = "block";
});

document.addEventListener("click", function(event) {
  if (!event.target.matches(".dropbtn")) {
    dropdownContent.style.display = "none";
  }
});

  // **Submit Review**
  submitButton?.addEventListener("click", async () => {
    const name = reviewerName.value.trim();
    const review = reviewText.value.trim();

    if (name && review && selectedRating) {
      try {
        const response = await fetch("https://body-temple-reviews-production.up.railway.app/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, review, rating: selectedRating }),
        });

        if (response.ok) {
          window.location.href = "thanks.html";
        } else {
          alert("Failed to submit review. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting review:", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      alert("Please fill in all fields and select a rating!");
    }
  });

  // **Check if reviews-list exists**
  const reviewsList = document.getElementById("reviews-list");

  if (reviewsList) {
    // **Display Reviews Dynamically**
    function displayReviews(reviews) {
      reviewsList.innerHTML = ""; // Clear current reviews

      // Check if reviews is an array and has at least one review
      if (Array.isArray(reviews) && reviews.length === 0) {
        reviewsList.innerHTML = "<p>You can be the first to submit a review!</p>";
      } else if (Array.isArray(reviews) && reviews.length > 0) {
        // Loop through reviews and display each one
        reviews.forEach((review) => {
          const reviewItem = document.createElement("div");
          reviewItem.classList.add("review-item");

          const clubMemberLabel = review.subscribe
            ? '<p id="club">(Club Member)</p>'
            : "";

          reviewItem.innerHTML = `
            <div class="star-rating-display">${renderStars(review.rating)}</div>
            <p>${review.review}</p>
            <h4>${review.name}</h4>
            ${clubMemberLabel}
          `;
          reviewsList.appendChild(reviewItem);
        });
      }
    }

    // **Render Stars**
    function renderStars(rating) {
      let starsHTML = "";
      for (let i = 1; i <= 5; i++) {
        starsHTML += i <= rating ? "&#9733;" : "&#9734;"; // Filled or empty star
      }
      return starsHTML;
    }

    // **Fetch Reviews**
    async function fetchReviews() {
      try {
        const response = await fetch("https://body-temple-reviews-production.up.railway.app/reviews");
        const data = await response.json();

        // Check if 'reviews' exists and is an array before passing it to displayReviews
        if (data && Array.isArray(data.reviews)) {
          displayReviews(data.reviews);
        } else {
          console.error("Invalid reviews data:", data);
          displayReviews([]); // Display no reviews if the data is not valid
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        displayReviews([]); // Handle the case when there's an error fetching reviews
      }
    }

    // Fetch and Display Reviews
    fetchReviews();
  } else {
    console.log("Reviews list not found in the DOM.");
  }

  // Additional functionality for the carousel (if required)
  const upArrow = document.querySelector('.arrow-up'); // Adjust selector if needed
  const downArrow = document.querySelector('.arrow-down'); // Adjust selector if needed
  const reviewContainer = document.querySelector('.carousel-track-container');

  // Scroll up
  if (upArrow) {
    upArrow.addEventListener('click', () => {
      if (reviewContainer) {
        reviewContainer.scrollBy({
          top: -400, // Adjust the scroll amount
          behavior: 'smooth',
        });
      }
    });
  }

  // Scroll down
  if (downArrow) {
    downArrow.addEventListener('click', () => {
      if (reviewContainer) {
        reviewContainer.scrollBy({
          top: 400, // Adjust the scroll amount
          behavior: 'smooth',
        });
      }
    });
  }

  document.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('focus', (event) => {
      setTimeout(() => {
        event.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300); // Delay to ensure keyboard is fully open
    });
  });
});

/*
document.querySelectorAll('.star').forEach(star => {
  star.addEventListener('click', () => {
      document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
      star.classList.add('active');
  });
});
*/


// Want to book button 

document.getElementById('booking-button').addEventListener('click', function(e) {
  e.preventDefault();
  
  window.location.href = "index.html#finisher";
  });

// Guide Initialization  #1



document.addEventListener("DOMContentLoaded", () => {
  // Cache DOM elements
  const guideIntro = document.getElementById("guide-intro");
  const decisionTree = document.querySelector(".guide-journey");  // Updated selector
  const resultsSection = document.getElementById("results");
  const startGuideButton = document.getElementById("start-guide");
  const questionElement = document.getElementById("question");
  const optionsContainer = document.querySelector(".options");  // Updated selector
  const recommendationElement = document.getElementById("massage-recommendation");

  

    // Add progress tracking
    const progressSteps = document.querySelectorAll('.progress-step');
    let currentStepIndex = 0;

    function updateProgress(stepName) {
        // Map step names to indices
        const stepIndices = {
            'start': 0,
            'intensity': 1,
            'duration': 2,
            'aromatherapy': 3,
            'final': 4
        };

        // Update progress visualization
        progressSteps.forEach((step, index) => {
            if (index <= stepIndices[stepName]) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
  

    // 🌟 Here's our missing steps definition #2
    const steps = {
      start: {
          question: "Which areas would you like to focus on?",
          options: {
              "🙇🏼‍♂️ Back": { next: "intensity", focus: "back" },
              "🦵 Legs": { next: "intensity", focus: "legs" },
              "🧍‍♂️ Full Body": { next: "intensity", focus: "full" },
              "👨🏼‍🦱 Face and Scalp": { next: "aromatherapy", focus: "face" }
          }
      },
      intensity: {
          question: "What type of pressure do you prefer?",
          options: {
              "🪶 Light to Medium": { next: "duration", intensity: "gentle" },
              "💪 Firm to Deep": { next: "duration", intensity: "deep" }
          }
      },
      duration: {
          question: "How long would you like your session to be?",
          options: {
              " 25 minutes": { next: "aromatherapy", duration: "25" },
              " 50 minutes": { next: "aromatherapy", duration: "50" },
              " 80 minutes": { next: "aromatherapy", duration: "80" }
          }
      },
      aromatherapy: {
          question: "Would you like to include aromatherapy?",
          options: {
              "🪔 Yes": { next: "final", aroma: true },
              "✨ No": { next: "final", aroma: false }
          }
      }
  };




  // Initialize user preferences #3
  let userPreferences = {
      focus: null,
      intensity: null,
      duration: null,
      aroma: null
  };

    // Function to transition between sections #4
    function showSection(currentSection, nextSection) {
      currentSection.classList.add("hidden");
      nextSection.classList.remove("hidden");
      nextSection.scrollIntoView({ behavior: "smooth" });
  }

  // Event listener for Start button #5
  startGuideButton?.addEventListener("click", () => {
      console.log("Start button clicked"); // Debug log
      showSection(guideIntro, decisionTree);
      // Initialize the first question
      updateQuestion("start");
  });


    // Enhance our existing handlers to update progress
    function handleOptionClick(nextStep) {
      const currentContainer = document.querySelector('.question-container');
      currentContainer.style.opacity = '0';
      currentContainer.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
          currentContainer.style.opacity = '1';
          currentContainer.style.transform = 'translateY(0)';
          
          // Update progress before moving to next step
          updateProgress(nextStep);
          
          if (nextStep === 'final') {
              showResults(userPreferences);
          } else {
              updateQuestion(nextStep);
          }
      }, 300);
  }

  function updateQuestion(step) {
    const stepData = steps[step];
    if (!stepData) {
        showResults(userPreferences);
        return;
    }

    questionElement.textContent = stepData.question;
    optionsContainer.innerHTML = "";

    Object.entries(stepData.options).forEach(([text, data]) => {
        const button = document.createElement("button");
        button.className = "option";
            
            // Split emoji and text #6
            const [emoji, ...textParts] = text.split(" ");
            button.innerHTML = `
                <span class="option-emoji">${emoji}</span>
                <span class="option-text">${textParts.join(" ")}</span>
            `;
            
            button.addEventListener("click", () => {
                // Update preferences based on the selection #7
                Object.entries(data).forEach(([key, value]) => {
                    if (key !== 'next') {
                        userPreferences[key] = value;
                    }
                });
                
                handleOptionClick(data.next);
            });
            
            optionsContainer.appendChild(button);
        });
    }


    function showResults(preferences) {
      // 🗺️ Define our recommendation logic map
      let recommendedMassage = '';
      
      // Full-body focused paths
      if (preferences.focus === "full") {
          if (preferences.intensity === "deep") {
              recommendedMassage = "Deep Tissue Massage 💆🏼‍♂️";
          } else if (preferences.aroma) {
              recommendedMassage = "Aromatic Essence Massage 🪔";
          } else {
              recommendedMassage = "Classic Full Body Rejuvenation 🤲🏼";
          }
      }
      // Back-focused paths
      else if (preferences.focus === "back") {
          if (preferences.intensity === "deep") {
              recommendedMassage = "Deep Tissue Massage 💆🏼‍♂️";
          } else if (preferences.duration === "50") {
              recommendedMassage = "Pure Relaxation 🌱";
          } else {
              recommendedMassage = "Classic Partial Body Massage 🦵🏼";
          }
      }
      // Legs-focused paths
      else if (preferences.focus === "legs") {
          if (preferences.intensity === "deep") {
              recommendedMassage = "Deep Tissue Massage 💆🏼‍♂️";
          } else if (preferences.duration === "50") {
              recommendedMassage = "Pure Relaxation 🌱";
          } else {
              recommendedMassage = "Classic Partial Body Massage 🦵🏼";
          }
      }
      // Face-focused paths (always leads to either classic or aromatic)
      else if (preferences.focus === "face") {
          if (preferences.aroma) {
              recommendedMassage = "Aromatic Essence Massage 🪔";
          } else {
              recommendedMassage = "Classic Partial Body Massage 🦵🏼";
          }
      }
  
      // 🎨 Create our result display
      recommendationElement.innerHTML = `
          <div class="recommendation-wrapper">
              <h3>${recommendedMassage}</h3>
           
      `;
      
      // Transition to results
      showSection(decisionTree, resultsSection);
  }

    // Log initial state for debugging #8
    console.log("Guide initialized. Elements found:", {
      startButton: !!startGuideButton,
      guideIntro: !!guideIntro,
      decisionTree: !!decisionTree
  });

  
});
document.addEventListener('DOMContentLoaded', function() {
  // Get dropdown elements for the book/SoMe menu
  const dropdownBtn = document.querySelector('.dropbtn');
  const dropdownContent = document.querySelector('.dropdown-content');
  let isOpen = false;

  // Handle dropdown menu toggling
  dropdownBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (!isOpen) {
          showDropdown();
      } else {
          hideDropdown();
      }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
      if (isOpen && !dropdownContent.contains(e.target)) {
          hideDropdown();
      }
  });

  // Close dropdown with Escape key
  document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isOpen) {
          hideDropdown();
      }
  });

  // Functions to handle dropdown visibility
  function showDropdown() {
      dropdownContent.classList.add('show');
      isOpen = true;
      // Optional animation effect on the button
      dropdownBtn.style.transform = 'scale(0.98)';
      setTimeout(() => {
          dropdownBtn.style.transform = 'scale(1)';
      }, 150);
  }

  function hideDropdown() {
      dropdownContent.classList.remove('show');
      isOpen = false;
  }
});

// Social Float Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all our necessary elements
    const socialFloat = document.querySelector('.social-float');
    const chatBubble = document.querySelector('.chat-bubble');
    const socialOptions = document.querySelector('.social-options');
    const openMenuBtn = document.getElementById('open-menu');
    const closeMenuBtn = document.getElementById('close-menu');
    const navMenu = document.getElementById('nav-menu');
    const finisherSection = document.getElementById('finisher');
    const oneSection = document.getElementById('one');
 
    // Helper function to check if element is in viewport
    function isElementInView(element, threshold = 0.5) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const elementHeight = rect.height;
        return (visibleHeight / elementHeight) >= threshold;
    }

    // Our scroll handler function for managing social float visibility
    function handleScroll() {
        // First check if we're in section "one"
        if (isElementInView(oneSection, 0.3)) {
            socialFloat.classList.add('hidden');
            return;
        }

        // If not in section one, show the social float
        socialFloat.classList.remove('hidden');

        // Check if we're in finisher section
        if (isElementInView(finisherSection, 0.7)) {
            socialFloat.classList.remove('hidden');
            socialFloat.classList.add('horizontal');
            
            // Hide the chat bubble and ensure social options are visible
            if (chatBubble) {
                chatBubble.style.display = 'none';
            }
            if (socialOptions) {
                socialOptions.classList.add('show');
            }
        } else {
            socialFloat.classList.remove('horizontal');
            
            // Show the chat bubble and reset social options visibility
            if (chatBubble) {
                chatBubble.style.display = 'flex';
            }
            if (socialOptions) {
                socialOptions.classList.remove('show');
            }
        }
    }

    // Functions to control social buttons visibility
    function hideSocialButtons() {
        socialFloat.classList.add('hidden');
        socialFloat.classList.remove('horizontal');
    }

    function showSocialButtons() {
        // Don't show buttons if in section one
        if (isElementInView(oneSection, 0.3)) {
            return;
        }
        
        setTimeout(() => {
            socialFloat.classList.remove('hidden');
            if (isElementInView(finisherSection)) {
                socialFloat.classList.add('horizontal');
            }
        }, 300);
    }

    // Set up all event listeners
    openMenuBtn.addEventListener('click', hideSocialButtons);
    closeMenuBtn.addEventListener('click', showSocialButtons);
    window.addEventListener('scroll', handleScroll);

    // Additional safety measures for menu interactions
    document.addEventListener('click', function(event) {
        if (!navMenu.contains(event.target) &&
            !openMenuBtn.contains(event.target) &&
            navMenu.style.display !== 'none') {
            showSocialButtons();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navMenu.style.display !== 'none') {
            showSocialButtons();
        }
    });

    // Initialize social float position on page load
    handleScroll();
});

  document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && navMenu.style.display !== 'none') {
          showSocialButtons();
      }
  });



// Form field focus handling
document.querySelectorAll('input, textarea').forEach((field) => {
  field.addEventListener('focus', (event) => {
      setTimeout(() => {
          event.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300); // Delay to ensure keyboard is fully open
  });
});


// ---- TREATMENTS SECTION -----

document.addEventListener('DOMContentLoaded', function() {
  // Accordion Functionality
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  const accordionItems = document.querySelectorAll('.accordion-item');
  const tagButtons = document.querySelectorAll('.tag-btn');
  const noResults = document.querySelector('.no-results');
  
  // Add animation delay based on item index
  accordionItems.forEach((item, index) => {
      item.style.setProperty('--item-index', index);
  });
  
  // Accordion toggle
  accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
          const item = header.parentElement;
          
          // Toggle current accordion
          item.classList.toggle('active');
          
          // Auto-close others if we're opening this one
          if (item.classList.contains('active')) {
              accordionItems.forEach(otherItem => {
                  if (otherItem !== item && otherItem.classList.contains('active')) {
                      otherItem.classList.remove('active');
                  }
              });
          }
      });
  });
  
  // Tag filtering function
  function filterByTag(tagName) {
      let visibleCount = 0;
      
      accordionItems.forEach(item => {
          // "All" tag shows everything
          if (tagName === 'all') {
              item.classList.remove('hidden');
              visibleCount++;
          } else {
              // Check if item has the selected tag
              const itemTags = item.getAttribute('data-tags').split(' ');
              if (itemTags.includes(tagName)) {
                  item.classList.remove('hidden');
                  visibleCount++;
              } else {
                  item.classList.add('hidden');
                  // Close the accordion if it's hidden
                  if (item.classList.contains('active')) {
                      item.classList.remove('active');
                  }
              }
          }
      });
      
      // Show "No results" message if needed
      if (visibleCount === 0) {
          noResults.classList.add('visible');
      } else {
          noResults.classList.remove('visible');
      }
  }
  
  // Tag button click event
  tagButtons.forEach(button => {
      button.addEventListener('click', () => {
          // Update active button
          tagButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          
          // Filter items
          const tagName = button.getAttribute('data-tag');
          filterByTag(tagName);
      });
  });
  
  // Booking button functionality
  const bookingButton = document.getElementById('booking-button');
  if (bookingButton) {
      bookingButton.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Show the dropdown menu or open a booking dialog
          const dropdownBtn = document.querySelector('.dropbtn');
          if (dropdownBtn) {
              dropdownBtn.click();
          }
          // You can also navigate directly to your booking page if preferred
          // window.location.href = "booking.html";
      });
  }
});


// ===== SLOT MANAGEMENT CLASS =====
class SlotsContainer {
    constructor(containerId, expandButtonId, slotListId) {
        this.container = document.getElementById(containerId);
        this.expandButton = document.getElementById(expandButtonId);
        this.slotList = document.getElementById(slotListId);
        this.setupExpand();
    }

    setupExpand() {
        if (!this.expandButton || !this.container) return;
        
        this.expandButton.addEventListener('click', () => {
            this.container.classList.toggle('expanded');
            this.slotList.classList.toggle('collapsed');
            
            const expandText = this.expandButton.querySelector('.expand-text');
            if (expandText) {
                expandText.textContent = this.container.classList.contains('expanded') 
                    ? 'Show less' 
                    : 'View more times';
            }
        });
    }

    updateSlots(slots) {
        if (!this.slotList) return;

        this.slotList.innerHTML = '';

        if (slots.length === 0) {
            this.slotList.innerHTML = '<div class="no-slots-message">No available time slots found</div>';
            if (this.expandButton) {
                this.expandButton.style.display = 'none';
            }
            return;
        }

        slots.forEach((slot, index) => {
            const slotElement = document.createElement('div');
            slotElement.className = 'slot-item';
            slotElement.style.setProperty('--index', index);
            const relativeDate = getRelativeDateString(slot.date);
            slotElement.innerHTML = `
                <span class="slot-time">${slot.time}</span>
                <span class="slot-date">${relativeDate}</span>
            `;
            slotElement.onclick = () => handleSlotSelect(slot, slotElement);
            this.slotList.appendChild(slotElement);
        });

        if (this.expandButton) {
            this.expandButton.style.display = slots.length <= 2 ? 'none' : 'flex';
        }
    }
}

// ===== TIME UTILITY FUNCTIONS =====
function expandTimeRange(rangeStr) {
    const [start, end] = rangeStr.split('-').map(t => t.trim());
    const startHour = parseInt(start.split(':')[0]);
    const endTime = end.includes(':') ? end : `${end}:00`;
    const [endHour, endMinutes] = endTime.split(':').map(n => parseInt(n));
    
    const times = [];
    for (let hour = startHour; hour <= endHour; hour++) {
        if (hour === endHour && endMinutes === 0) {
            times.push(`${hour}:00`);
        } else if (hour < endHour) {
            times.push(`${hour}:00`);
        }
    }
    
    if (endMinutes > 0) {
        times.push(endTime);
    }
    
    return times;
}

function formatTime(timeStr) {
    timeStr = !timeStr.includes(':') ? timeStr + ':00' : timeStr;
    const [hours, minutes] = timeStr.split(':');
    return `${hours.padStart(2, '0')}:${minutes}`;
}

function parseTimeString(timeStr) {
    return timeStr.includes('-') ? 
        expandTimeRange(timeStr) : 
        [formatTime(timeStr.trim())];
}

function parseSlotString(slotStr) {
    const [dateStr, timesStr] = slotStr.split(' ');
    const timeSegments = timesStr.split(',').map(t => t.trim());
    
    const times = timeSegments.flatMap(segment => parseTimeString(segment));
    return {
        date: dateStr,
        times: [...new Set(times)].sort()
    };
}

// ===== DATE UTILITY FUNCTIONS =====
function parseDate(dateStr) {
    const [day, month] = dateStr.split('.');
    const year = new Date().getFullYear();
    return new Date(year, parseInt(month) - 1, parseInt(day));
}

function formatDate(date) {
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
}

function getRelativeDateString(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((targetDate - today) / (1000 * 60 * 60 * 24));
  
  switch (diffDays) {
      case 0: return "Today";
      case 1: return "Tomorrow";
      default:
          return targetDate.toLocaleDateString('en-US', {
              weekday: 'long', 
              month: 'short', 
              day: 'numeric'
          });
  }
}

// ===== SLOT GENERATION =====
function isSlotInFuture(dateObj, timeStr) {
    const now = new Date();
    const [hours, minutes] = timeStr.split(':').map(num => parseInt(num));
    
    const slotTime = new Date(dateObj);
    slotTime.setHours(hours, minutes, 0, 0);
    
    return slotTime > now;
}

function generateSlots() {
    return AVAILABLE_SLOTS.flatMap(slotStr => {
        const { date, times } = parseSlotString(slotStr);
        const dateObj = parseDate(date);
        
        return times
            .filter(time => isSlotInFuture(dateObj, time))
            .map(time => ({ time, date: dateObj }));
    });
}
// ===== BOOKING INTERFACE =====
function handleSlotSelect(slot, element) {
  const previousSelected = document.querySelector('.slot-item.selected');
  if (previousSelected) {
      previousSelected.classList.remove('selected');
  }
  
  element.classList.add('selected');
  showConfirmationPopup(slot);
}

function showConfirmationPopup(slot) {
  const existingPopup = document.querySelector('.slot-popup');
  if (existingPopup) {
      existingPopup.remove();
  }

  const popup = document.createElement('div');
  popup.className = 'slot-popup';
  popup.innerHTML = `
      <div class="popup-content">
          <div class="popup-header">
              <h3>Claim this slot?</h3>
              <button class="close-btn">&times;</button>
          </div>
          <p>${formatDate(slot.date)} at ${slot.time}</p>
          <button class="confirm-btn">Continue</button>
      </div>
  `;
  
  document.body.appendChild(popup);
  setupPopupListeners(popup, slot, false); // Add false parameter for confirmation popup
}

function setupPopupListeners(popup, slot, isSocialPopup = false) {
  // Close button
  const closeBtn = popup.querySelector('.close-btn');
  if (closeBtn) {
      closeBtn.addEventListener('click', () => {
          popup.remove();
      });
  }
  
  // Only setup confirm button for confirmation popup
  if (!isSocialPopup) {
      const confirmBtn = popup.querySelector('.confirm-btn');
      if (confirmBtn) {
          confirmBtn.addEventListener('click', () => {
              popup.remove();
              showSocialOptions(slot);
          });
      }
  }

  // Outside click
  popup.addEventListener('click', (e) => {
      if (e.target === popup) {
          popup.remove();
      }
  });
}

function showSocialOptions(slot) {
  const message = encodeURIComponent(
      `Hi, I'd like to book a massage for ${formatDate(slot.date)} at ${slot.time}`
  );
  
  const popup = document.createElement('div');
  popup.className = 'slot-popup';
  popup.innerHTML = `
      <div class="popup-content">
          <div class="popup-header">
              <h3>Choose how to contact us</h3>
              <button class="close-btn">&times;</button>
          </div>
          <div class="dropdown-content show">
              <a id="TEL" href="https://t.me/thetemplewellness?text=${message}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telegram" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09"/>
                  </svg>
                  <span>Telegram</span>
              </a>
              <a id="WA" href="https://wa.me/31657363244?text=${message}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
                      <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47"/>
                  </svg>
                  <span>WhatsApp</span>
              </a>
              <a id="SIG" href="https://signal.me/#eu/ZFGRul53UiJoIFY3NDs6EDLu6cKQJEKRqzVElvHxPsxqtsZkW1JIVpKPCCMVuc2x?text=${message}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telegram" viewBox="0 0 16 16">
                      <path d="M8 1.5a6.5 6.5 0 0 0-6.498 6.502 6.5 6.5 0 0 0 .998 3.455l-.625 2.668L4.54 13.5a6.502 6.502 0 0 0 6.93-11A6.5 6.5 0 0 0 8 1.5m3.915 12.08-.384-.64a7.2 7.2 0 0 1-2.007.831l.18.728a8 8 0 0 0 2.211-.919m3.336-5.58-.728-.18a7.3 7.3 0 0 1-.832 2.012l.643.387a8 8 0 0 0 .917-2.219"/>
                  </svg>
                  <span>Signal</span>
              </a>
          </div>
      </div>
  `;
  
  document.body.appendChild(popup);
  setupPopupListeners(popup, null, true); // Add true parameter for social popup
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  const navSlots = new SlotsContainer('nav-slots', 'nav-expand-button', 'nav-slot-list');
  const finisherSlots = new SlotsContainer('finisher-slots', 'finisher-expand-button', 'finisher-slot-list');

  function updateAllSlots() {
      const slots = generateSlots();
      navSlots.updateSlots(slots);
      finisherSlots.updateSlots(slots);
  }

  updateAllSlots();
  setInterval(updateAllSlots, 60000);
});