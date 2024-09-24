<!-- src/views/partials/bug-feedback-modal.tpl -->
<div id="bug-feedback-modal" class="modal" tabindex="-1" role="dialog" style="display:none;">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Submit Bug/Feedback</h5>
        <button id="openModalButton" class="btn btn-primary">Open Bug/Feedback Form</button>
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
<script src="/path/to/bug-feedback.js"></script>


<!-- JavaScript Code for opening and closing the modal -->
<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    var modal = document.getElementById('bug-feedback-modal');
    var openButton = document.getElementById('openModalButton');
    var closeButton = modal.querySelector('.close');

    // Open modal when button is clicked
    openButton.addEventListener('click', function() {
      modal.style.display = 'block';
    });

    // Close modal when 'x' button is clicked
    closeButton.addEventListener('click', function() {
      modal.style.display = 'none';
    });

    // Close modal when clicking outside of the modal content
    window.addEventListener('click', function(event) {
      if (event.target == modal) {
        modal.style.display = 'none';
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

<script src="/path/to/bug-feedback.js"></script>
