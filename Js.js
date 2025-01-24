"use strict"; // Use strict mode for better error checking and debugging

// ===== EASY CONFIGURATION SECTION =====
// Supports multiple formats:
// - Time range: "15-18" (creates hourly slots from 15:00 to 18:00)
// - Individual times: "15, 16:30, 17"
// - Mix both: "15-17, 18:30"
const AVAILABLE_SLOTS = [
  "25.01 13-14",            // One specific time + range
  "26.01 16-19"             // Range + specific time
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




// Function to expand time range
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
  
  // Add the end time if it's not on the hour
  if (endMinutes > 0) {
      times.push(endTime);
  }
  
  return times;
}

// Function to format time properly
function formatTime(timeStr) {
  // Add ":00" if only hours are provided
  if (!timeStr.includes(':')) {
      timeStr = timeStr + ':00';
  }
  // Ensure two digits for hours
  const [hours, minutes] = timeStr.split(':');
  return `${hours.padStart(2, '0')}:${minutes}`;
}

// Function to parse time string (handles both ranges and individual times)
function parseTimeString(timeStr) {
  if (timeStr.includes('-')) {
      return expandTimeRange(timeStr);
  }
  return [formatTime(timeStr.trim())];
}

// Function to parse slot string
function parseSlotString(slotStr) {
  const [dateStr, timesStr] = slotStr.split(' ');
  const timeSegments = timesStr.split(',').map(t => t.trim());
  
  const times = timeSegments.flatMap(segment => parseTimeString(segment));
  return {
      date: dateStr,
      times: [...new Set(times)].sort() // Remove duplicates and sort
  };
}

// Function to convert date string to Date object
function parseDate(dateStr) {
  const [day, month] = dateStr.split('.');
  const year = new Date().getFullYear();
  return new Date(year, parseInt(month) - 1, parseInt(day));
}

// Function to get relative date string
function getRelativeDateString(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((targetDate - today) / (1000 * 60 * 60 * 24));
  
  switch (diffDays) {
      case 0: return "Today";
      case 1: return "Tomorrow";
      case 2: return "Day After Tomorrow";
      default:
          return targetDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
          });
  }
}

// Function to generate all slots
function generateSlots() {
  const slots = [];
  AVAILABLE_SLOTS.forEach(slotStr => {
      const { date, times } = parseSlotString(slotStr);
      const dateObj = parseDate(date);
      
      times.forEach(time => {
          slots.push({
              time: time,
              date: dateObj
          });
      });
  });
  return slots;
}
// Function to update available slots
function updateAvailableSlots() {
  const slots = generateSlots();
  const slotList = document.getElementById('slot-list');
  const container = document.querySelector('.slots-container');
  slotList.innerHTML = '';

  slots.forEach((slot, index) => {
      const slotElement = document.createElement('div');
      slotElement.className = 'slot-item';
      slotElement.style.setProperty('--index', index);
      const relativeDate = getRelativeDateString(slot.date);
      slotElement.innerHTML = `
          <span class="slot-time">${slot.time}</span>
          <span class="slot-date">${relativeDate}</span>
      `;
      slotElement.onclick = () => {
          console.log(`Selected slot: ${slot.time} on ${slot.date.toDateString()}`);
      };
      slotList.appendChild(slotElement);
  });

  // Hide expand button if there are 2 or fewer slots
  const expandButton = document.getElementById('expand-button');
  expandButton.style.display = slots.length <= 2 ? 'none' : 'flex';
}

// Initialize slots and expand functionality
document.addEventListener('DOMContentLoaded', () => {
  updateAvailableSlots();

  const expandButton = document.getElementById('expand-button');
  const container = document.querySelector('.slots-container');
  const slotList = document.getElementById('slot-list');

  expandButton.addEventListener('click', () => {
      container.classList.toggle('expanded');
      slotList.classList.toggle('collapsed');
      
      if (container.classList.contains('expanded')) {
          expandButton.querySelector('.expand-text').textContent = 'Show less';
      } else {
          expandButton.querySelector('.expand-text').textContent = 'View more times';
      }
  });
});

// Update the display every day at midnight
setInterval(() => {
  const now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 0) {
      updateAvailableSlots();
  }
}, 60000);

