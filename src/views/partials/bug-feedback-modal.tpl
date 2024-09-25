<!-- Trigger Button in Sidebar -->
<div class="m-2">
  <button id="submit-bug-feedback" class="btn btn-primary w-100" onclick="openForm()">Submit Bug/Feedback</button>
</div>

<!-- A button to open the popup form (alternative button outside sidebar) -->
<button class="m-2" onclick="openForm()">Open Form</button>

<!-- The Form Modal -->
<div class="form-popup" id="bug-feedback-modal" style="display:none;">
  <form id="bug-feedback-form" class="form-container">
    <h1>Bug/Feedback</h1>

    <label for="title"><b>Title</b></label>
    <input type="text" placeholder="Enter Title" name="title" class="form-control" required>

    <label for="description"><b>Description</b></label>
    <textarea placeholder="Enter Description" name="description" class="form-control" required></textarea>

    <button type="submit" class="btn btn-primary">Submit</button>
    <button type="button" class="btn btn-danger cancel" onclick="closeForm()">Close</button>
  </form>
</div>

<!-- CSS Styles -->
<style>
  * {
    box-sizing: border-box;
  }

  /* The button used to open the form */
  .open-button {
    background-color: #555;
    color: white;
    padding: 16px 20px;
    border: none;
    cursor: pointer;
    opacity: 0.8;
    position: fixed;
    bottom: 23px;
    right: 28px;
    width: 280px;
  }

  /* The popup form - hidden by default */
  .form-popup {
    display: none;
    position: fixed;
    bottom: 0;
    right: 15px;
    border: 3px solid #f1f1f1;
    z-index: 9;
  }

  /* Form container styles */
  .form-container {
    max-width: 300px;
    padding: 10px;
    background-color: white;
  }

  /* Full-width input fields */
  .form-container input[type=text], .form-container textarea {
    width: 100%;
    padding: 15px;
    margin: 5px 0 22px 0;
    border: none;
    background: #f1f1f1;
  }

  /* When the inputs get focus */
  .form-container input[type=text]:focus, .form-container textarea:focus {
    background-color: #ddd;
    outline: none;
  }

  /* Submit and Cancel button styling */
  .form-container .btn {
    padding: 16px 20px;
    border: none;
    cursor: pointer;
    width: 100%;
    margin-bottom: 10px;
    opacity: 0.8;
  }

  /* Hover effect for buttons */
  .form-container .btn:hover, .open-button:hover {
    opacity: 1;
  }
</style>

<!-- JavaScript for Form Opening and Closing -->
<script>
function openForm() {
  document.getElementById("bug-feedback-modal").style.display = "block";
}

function closeForm() {
  document.getElementById("bug-feedback-modal").style.display = "none";
}
</script>
