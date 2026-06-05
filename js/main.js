// Lightweight, no-backend email capture (in-memory). Hook the endpoint
// below up to Mailchimp / Beehiiv / Klaviyo / etc. when ready.
document.querySelectorAll('form.capture').forEach(function(form){
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var input = form.querySelector('input[type=email]');
    var note = form.querySelector('.form-note');
    if(!input.value || input.value.indexOf('@') === -1){
      note.textContent = 'Please enter a valid email.';
      return;
    }
    // TODO: POST input.value to your email provider here.
    note.innerHTML = '<span class="form-ok">You\'re on the list — salamat! See you soon. ☕</span>';
    input.value = '';
    input.disabled = true;
    form.querySelector('button').disabled = true;
  });
});
