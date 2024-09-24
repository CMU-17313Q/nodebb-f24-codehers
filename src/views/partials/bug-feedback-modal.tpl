<!-- src/views/partials/bug-feedback-modal.tpl -->
<div id="bug-feedback-modal" class="modal" tabindex="-1" role="dialog" style="display:none;">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Submit Bug/Feedback</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form id="bug-feedback-form">
          <div class="form-group">
            <label for="title">Title:</label>
            <input type="text" id="title" name="title" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="description">Description:</label>
            <textarea id="description" name="description" class="form-control" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- Trigger Button -->
<button id="openModalButton" class="btn btn-primary">Open Bug/Feedback Form</button>

<!-- Include JavaScript file -->
<script>
  alert('JavaScript file loaded');
  console.log('JavaScript file loaded');

  // Ensure the DOM is fully loaded before attaching event listeners
  document.addEventListener('DOMContentLoaded', function() {
    const feedbackModal = document.getElementById('bug-feedback-modal');
    const openModalButton = document.getElementById('openModalButton');
    const closeModalButton = document.querySelector('.close');

    if (!openModalButton) {
      console.error('Open Modal Button not found');
      return;
    }

    if (!feedbackModal) {
      console.error('Feedback Modal not found');
      return;
    

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
</script>

<!-- JavaScript Code for opening and closing the modal -->
<script>
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');

    // Get elements
    var modal = document.getElementById('bug-feedback-modal');
    var openButton = document.getElementById('openModalButton');
    var closeButton = modal.querySelector('.close');

    if (!openButton) {
      console.error('Open Modal Button not found');
      return;
    }

    if (!modal) {
      console.error('Feedback Modal not found');
      return;
    }

    // Open modal when button is clicked
    openButton.addEventListener('click', function() {
      console.log('Open button clicked');
      modal.style.display = 'block';
      openButton.style.backgroundColor = 'green';  // Change button color to green
    });

    // Close modal when 'x' button is clicked
    closeButton.addEventListener('click', function() {
      console.log('Close button clicked');
      modal.style.display = 'none';
      openButton.style.backgroundColor = '';  // Reset button color
    });

    // Close modal when clicking outside of the modal content
    window.addEventListener('click', function(event) {
      if (event.target == modal) {
        console.log('Clicked outside the modal');
        modal.style.display = 'none';
        openButton.style.backgroundColor = '';  // Reset button color
      }
    });
  });
</script>

<!-- JavaScript Code for handling form submission -->
<script>
  document.getElementById('bug-feedback-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents the form from reloading the page

    // Grab form data
    var title = document.getElementById('title').value;
    var description = document.getElementById('description').value;

    // Process form submission (for now, just log it)
    console.log('Title:', title);
    console.log('Description:', description);

    // Close the modal after submission
    document.getElementById('bug-feedback-modal').style.display = 'none';

    // Optionally, you can clear the form
    this.reset();
  });
</script>