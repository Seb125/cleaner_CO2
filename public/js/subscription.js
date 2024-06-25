document.getElementById('emailSubscriptionForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const emailInputValue = document.getElementById('emailInput').value;
    const region = document.getElementById('regionInput').value;
    
    // Assume a backend endpoint /subscribe for email subscriptions
    fetch('/subscribe', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: emailInputValue, region }),
    })
    .then(response => {
      if (!response.ok) {
          // If response status code is not OK, throw an error with the status text
          throw new Error('Network response was not ok: ' + response.statusText);
      }
      document.getElementById('subscribeControls').innerHTML = '<p class="m-3">Thank you for subscribing!</p>';
      //return response.json(); // This is a Promise
    })
    .catch(error => {
      console.error('Subscription error:', error);
      // Update the HTML to show a more descriptive error message
      document.getElementById('subscribeControls').innerHTML = `<p class="m-3">Error processing subscription. Details: ${error.message}</p>`;
    })
});