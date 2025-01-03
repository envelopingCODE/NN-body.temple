"use strict"; // Use strict mode for better error checking and debugging

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

/* Massage Guide */

// Wait for DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  // Cache all relevant sections
  const guideIntro = document.getElementById("guide-intro");
  const decisionTree = document.getElementById("decision-tree");
  const resultsSection = document.getElementById("results");
  const startGuideButton = document.getElementById("start-guide");
  const questionElement = document.getElementById("question");
  const optionsContainer = decisionTree.querySelector(".options");
  const recommendationElement = document.getElementById("massage-recommendation");

  // Steps for the decision tree
  const steps = {
    start: {
      question: "Which areas would you like to focus on?",
      options: {
        "🦴 Back": "pressure",
        "🦵 Legs": "pressure",
        "🧍‍♂️ Full Body": "pressure",
        "🙂 Face": "aromatherapy",
      },
    },
    pressure: {
      question: "Do you prefer hard or soft pressure?",
      options: {
        "🌸 Soft Pressure": "aromatherapy",
        "🏋️ Firm Pressure": "deep-tissue",
      },
    },
    aromatherapy: {
      question: "Would you like to use essential oils?",
      options: {
        "🪔 Yes": "aromatic",
        "🚫 No": "classic",
      },
    },
  };

  // Final massage recommendations
  const massageResults = {
    classic: "🤲 Classic Full Body Rejuvenation",
    "deep-tissue": "💪 Deep Tissue Massage",
    aromatic: "🪔 Aromatic Essence Massage",
  };

  // Track the current step
  let currentStep = "start";

  // Function to transition between sections
  function showSection(currentSection, nextSection) {
    currentSection.classList.add("hidden");
    nextSection.classList.remove("hidden");
    nextSection.scrollIntoView({ behavior: "smooth" });
  }

  // Event listener for the Start button
  startGuideButton.addEventListener("click", () => {
    showSection(guideIntro, decisionTree);
    updateQuestion("start");
  });

  // Update the question and options dynamically
  function updateQuestion(step) {
    const stepData = steps[step];
    if (!stepData) {
      showResults(step);
      return;
    }

    // Update the question text
    questionElement.textContent = stepData.question;

    // Clear previous options
    optionsContainer.innerHTML = "";

    // Create buttons for available options
    for (const [optionText, nextStep] of Object.entries(stepData.options)) {
      const button = document.createElement("button");
      button.className = "option";
      button.textContent = optionText;
      button.dataset.next = nextStep;

      // Attach click handler
      button.addEventListener("click", () => {
        handleOptionClick(nextStep);
      });

      optionsContainer.appendChild(button);
    }
  }

  // Handle option clicks
  function handleOptionClick(nextStep) {
    // Fade out current question and options
    decisionTree.style.animation = "fadeOut 0.3s forwards";

    // Wait for animation to complete before updating
    setTimeout(() => {
      decisionTree.style.animation = ""; // Reset animations
      currentStep = nextStep; // Update the current step
      updateQuestion(nextStep); // Load the next question
      decisionTree.style.animation = "fadeIn 0.5s forwards"; // Fade in next question
    }, 300);
  }

  // Display the final result
  function showResults(resultKey) {
    showSection(decisionTree, resultsSection);
    recommendationElement.textContent = massageResults[resultKey];
  }
});
