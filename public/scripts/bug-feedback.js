alert('JavaScript file loaded');
console.log('JavaScript file loaded');

// Ensure the DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded and parsed');

  // Functions to open and close the form
  window.openForm = function() {
    document.getElementById("bug-feedback-modal").style.display = "block";
    console.log('Form opened');
  }

  window.closeForm = function() {
    document.getElementById("bug-feedback-modal").style.display = "none";
    console.log('Form closed');
  }

  // Existing code for form submission
  document.getElementById('bug-feedback-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const title = document.querySelector('input[name="title"]').value;
    const description = document.querySelector('textarea[name="description"]').value;

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
        closeForm();
        console.log('Form submitted and closed');
      } else {
        alert('Failed to submit feedback. Please try again.');
        console.error('Failed to submit feedback:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  });
});