// ---------------------------------------------------------------------------
// Bukas Cafe — nav overlay, scrolled top bar, and email capture
// ---------------------------------------------------------------------------

// Full-screen menu overlay (with keyboard focus trap)
(function(){
  var overlay = document.querySelector('.nav-overlay');
  if(!overlay) return;
  var openers = document.querySelectorAll('[data-menu-open]');
  var closers = overlay.querySelectorAll('[data-menu-close]');
  var lastFocused = null;

  function focusables(){
    return overlay.querySelectorAll('a[href], button:not([disabled])');
  }
  function open(){
    lastFocused = document.activeElement;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    // force style+layout so the now-visible overlay accepts focus synchronously
    void overlay.offsetHeight;
    var f = focusables();
    if(f.length) f[0].focus();
  }
  function close(){
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    if(lastFocused && lastFocused.focus) lastFocused.focus();
  }

  openers.forEach(function(b){ b.addEventListener('click', open); });
  closers.forEach(function(b){ b.addEventListener('click', close); });
  // Close when a destination link inside the overlay is clicked
  overlay.querySelectorAll('nav a').forEach(function(a){ a.addEventListener('click', close); });
  document.addEventListener('keydown', function(e){
    if(!overlay.classList.contains('open')) return;
    if(e.key === 'Escape'){ close(); return; }
    if(e.key !== 'Tab') return;
    // keep Tab cycling inside the overlay while it is open
    var f = focusables();
    if(!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if(!overlay.contains(document.activeElement)){ e.preventDefault(); first.focus(); }
    else if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  });
})();

// Solidify the top bar once the user scrolls past the hero fold
(function(){
  var bar = document.querySelector('.topbar');
  if(!bar) return;
  function onScroll(){
    bar.classList.toggle('scrolled', window.scrollY > 40);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});
})();

// Lightweight, no-backend email capture (in-memory). Hook the endpoint
// below up to Mailchimp / Beehiiv / Klaviyo / etc. when ready.
document.querySelectorAll('form.capture').forEach(function(form){
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var input = form.querySelector('input[type=email]');
    var note = form.querySelector('.form-note');
    if(!input.value || input.value.indexOf('@') === -1){
      if(note) note.textContent = 'Please enter a valid email.';
      return;
    }
    // TODO: POST input.value to your email provider here.
    if(note) note.innerHTML = '<span class="form-ok">You\'re on the list — salamat! See you soon.</span>';
    input.value = '';
    input.disabled = true;
    var btn = form.querySelector('button');
    if(btn) btn.disabled = true;
  });
});
