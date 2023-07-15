
let reviewTextInput;
let characterCountElement;


window.addEventListener('DOMContentLoaded', (event) => {
  const scriptElement = document.querySelector('script[data-review-rating]');
  const reviewRating = parseInt(scriptElement.getAttribute('data-review-rating'));
  characterCountElement = document.getElementById('character-count');
  reviewTextInput = document.getElementById('review_text');

  reviewTextInput.addEventListener('input', () => {
    updateCharacterCount()
  });

  highlightStars(reviewRating);
  updateCharacterCount()
});




function updateRating(rating) {
  const radioBtn = document.querySelector(`#rating${rating}`);
  if (radioBtn) {
    radioBtn.checked = true;
    highlightStars(rating);
  }
}

function highlightStars(rating) {
  const stars = document.querySelectorAll('.rating label.star');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add('highlight');
    } else {
      star.classList.remove('highlight');
    }
  });
}

function updateCharacterCount() {
  const reviewTextValue = reviewTextInput.value.trim();
  const remainingCharacters = 1000 - reviewTextValue.length;
  characterCountElement.textContent = `${remainingCharacters}/1000 characters`;
}

