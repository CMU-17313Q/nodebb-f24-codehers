// public/scripts/bug-feedback.js
document.addEventListener('DOMContentLoaded', function () {
    const feedbackButton = document.getElementById('submit-bug-feedback');
    const feedbackModal = document.getElementById('bug-feedback-modal');
    const feedbackForm = document.getElementById('bug-feedback-form');
  
    feedbackButton.addEventListener('click', function () {
      feedbackModal.style.display = 'block';
    });
  
    feedbackForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;
  
      const response = await fetch('/api/bugs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });
  
      if (response.ok) {
        alert('Thank you for your feedback!');
        feedbackModal.style.display = 'none';
      } else {
        alert('Failed to submit feedback. Please try again.');
      }
    });
  
    // Close modal when clicking outside of it
    window.addEventListener('click', function (event) {
      if (event.target === feedbackModal) {
        feedbackModal.style.display = 'none';
      }
    });
  });