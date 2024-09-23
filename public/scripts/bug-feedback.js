// public/scripts/bug-feedback.js
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM fully loaded and parsed');

  const feedbackButton = document.getElementById('submit-bug-feedback');
  const feedbackModal = document.getElementById('bug-feedback-modal');
  const feedbackForm = document.getElementById('bug-feedback-form');

  if (!feedbackButton) {
    console.error('Feedback button not found');
  } else {
    console.log('Feedback button found');
  }

  if (!feedbackModal) {
    console.error('Feedback modal not found');
  } else {
    console.log('Feedback modal found');
  }

  if (!feedbackForm) {
    console.error('Feedback form not found');
  } else {
    console.log('Feedback form found');
  }

  feedbackButton.addEventListener('click', function () {
    console.log('Feedback button clicked');
    feedbackModal.style.display = 'block';
  });

  feedbackForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    console.log('Feedback form submitted');
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    console.log('Title:', title);
    console.log('Description:', description);

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