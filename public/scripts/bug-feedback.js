// Ensure the DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
  const feedbackModal = document.getElementById('bug-feedback-modal');
  const openModalButton = document.getElementById('openModalButton');
  const closeModalButton = document.querySelector('.close');

  // Show the modal when the button is clicked
  openModalButton.addEventListener('click', function() {
    console.log('Open button clicked');  // Add this to debug
    feedbackModal.style.display = 'block';
    openModalButton.style.backgroundColor = 'green';  // Change button color to green
  });

  // Hide the modal when the close button is clicked
  closeModalButton.addEventListener('click', function() {
    console.log('Close button clicked');  // Add this to debug
    feedbackModal.style.display = 'none';
    openModalButton.style.backgroundColor = '';  // Reset button color
  });

  // Hide the modal when clicking outside of it
  window.addEventListener('click', function(event) {
    if (event.target === feedbackModal) {
      feedbackModal.style.display = 'none';
      console.log('Modal display style set to none (clicked outside)');
      openModalButton.style.backgroundColor = '';  // Reset button color
    }
  });

  // Existing code for form submission
  document.getElementById('bug-feedback-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    try {
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
        console.log('Modal display style set to none');
        openModalButton.style.backgroundColor = '';  // Reset button color
      } else {
        alert('Failed to submit feedback. Please try again.');
        console.error('Failed to submit feedback:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  });
});