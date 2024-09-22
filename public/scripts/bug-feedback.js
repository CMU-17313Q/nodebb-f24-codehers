// public/scripts/bug-feedback.js
function openBugFeedbackModal() {
    document.getElementById('bug-feedback-modal').style.display = 'block';
  }
  
  document.getElementById('bug-feedback-form').addEventListener('submit', async (event) => {
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
      document.getElementById('bug-feedback-modal').style.display = 'none';
    } else {
      alert('Failed to submit feedback. Please try again.');
    }
  });