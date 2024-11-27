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
  function toggleMenu() {
    let style = window.getComputedStyle(navMenuEl);
    navMenuEl.style.display = style.display === "none" ? "block" : "none";
  }

  openMenuButtonEl?.addEventListener("click", toggleMenu);
  closeMenuButtonEl?.addEventListener("click", toggleMenu);

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
    });
  }

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


document.querySelectorAll('.star').forEach(star => {
  star.addEventListener('click', () => {
      document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
      star.classList.add('active');
  });
});

