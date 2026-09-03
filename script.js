// =========================================================
// AHMED PORTFOLIO — INTERACTIONS
// Everything is vanilla JS so it is easy to edit.
// =========================================================

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Decorative hero panels: subtle mouse parallax
const hero = document.querySelector('.hero');
const panels = document.querySelectorAll('.parallax');

hero?.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - .5);
  const y = (e.clientY / window.innerHeight - .5);
  panels.forEach(panel => {
    const speed = parseFloat(panel.dataset.speed || 0.01);
    panel.style.marginLeft = `${x * speed * -1000}px`;
    panel.style.marginTop = `${y * speed * -1000}px`;
  });
});

// Life timeline
const clips = [...document.querySelectorAll('.life-clip')];
const playhead = document.querySelector('#playhead');
const title = document.querySelector('#clipTitle');
const counter = document.querySelector('#clipCounter');

function selectClip(clip) {
  clips.forEach(c => c.classList.remove('active'));
  clip.classList.add('active');
  title.textContent = clip.dataset.description;
  counter.textContent = `CLIP ${clip.dataset.index} / ${clips.length}`;
}

clips.forEach((clip, index) => {
  clip.addEventListener('click', () => {
    const pct = clips.length === 1 ? 100 : (index / (clips.length - 1)) * 100;
    playhead.value = pct;
    selectClip(clip);
  });
});

playhead?.addEventListener('input', (e) => {
  const index = Math.min(
    clips.length - 1,
    Math.round((Number(e.target.value) / 100) * (clips.length - 1))
  );
  selectClip(clips[index]);
});

// Animated stats
const stats = document.querySelectorAll('[data-target]');
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting || entry.target.dataset.done) return;
    entry.target.dataset.done = '1';
    const target = Number(entry.target.dataset.target);
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      entry.target.textContent = Math.round(start + (target - start) * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}, { threshold: .7 });

stats.forEach(s => statsObserver.observe(s));

// Tiny "currently editing" rotation
const statusText = document.querySelector('#statusText');
const statuses = ['new ideas', 'a client project', 'motion tests', 'the next cut'];
let statusIndex = 0;
setInterval(() => {
  if (!statusText) return;
  statusIndex = (statusIndex + 1) % statuses.length;
  statusText.style.opacity = 0;
  setTimeout(() => {
    statusText.textContent = statuses[statusIndex];
    statusText.style.opacity = 1;
  }, 180);
}, 2400);

// Respect reduced-motion preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.scrollBehavior = 'auto';
}

// Project hover previews: videos play only while the card is hovered/focused.
document.querySelectorAll('.project-card').forEach(card => {
  const video = card.querySelector('.project-video');
  if (!video) return;
  card.addEventListener('mouseenter', () => { video.currentTime = 0; video.play().catch(()=>{}); });
  card.addEventListener('mouseleave', () => { video.pause(); });
  card.addEventListener('focusin', () => { video.play().catch(()=>{}); });
  card.addEventListener('focusout', () => { video.pause(); });
});


// Project video hover previews: play only while the card is hovered/focused.
document.querySelectorAll('.project-card').forEach(card => {
  const video = card.querySelector('video');
  if (!video) return;
  const play = () => { video.currentTime = 0; video.play().catch(() => {}); };
  const stop = () => { video.pause(); video.currentTime = 0; };
  card.addEventListener('mouseenter', play);
  card.addEventListener('mouseleave', stop);
  card.addEventListener('focusin', play);
  card.addEventListener('focusout', stop);
});

// Reference-inspired custom cursor: small point + expanding blue ring.
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
let mouseX = -100, mouseY = -100, ringX = -100, ringY = -100;

window.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  if (cursorDot) {
    cursorDot.style.opacity = 1;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  }
  if (cursorRing) cursorRing.style.opacity = 1;
});
function cursorLoop() {
  ringX += (mouseX - ringX) * .18;
  ringY += (mouseY - ringY) * .18;
  if (cursorRing) {
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
  }
  requestAnimationFrame(cursorLoop);
}
cursorLoop();

const cursorTargets = document.querySelectorAll('a, button, summary, .project-card, input, select, textarea');
cursorTargets.forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing?.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorRing?.classList.remove('hover'));
});


// Contact form: reveal a custom project-type field only when "Other" is selected.
const projectType = document.querySelector('#projectType');
const otherProjectWrap = document.querySelector('#otherProjectWrap');
const otherProject = document.querySelector('#otherProject');
function syncOtherProject() {
  const isOther = projectType?.value === 'Other';
  if (otherProjectWrap) otherProjectWrap.hidden = !isOther;
  if (otherProject) otherProject.required = isOther;
}
projectType?.addEventListener('change', syncOtherProject);
syncOtherProject();

// Magnetic CTA labels: the text moves toward the pointer and returns smoothly on leave.
document.querySelectorAll('[data-magnetic]').forEach(button => {
  const text = button.querySelector('.magnetic-text');
  if (!text) return;
  button.addEventListener('mousemove', e => {
    const r = button.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * .16;
    const y = (e.clientY - (r.top + r.height / 2)) * .18;
    text.style.transform = `translate(${x}px, ${y}px)`;
  });
  button.addEventListener('mouseleave', () => {
    text.style.transform = 'translate(0, 0)';
  });
});


// Scroll-spy: the section currently in view is highlighted in neon purple.
const navLinks=[...document.querySelectorAll('.site-nav .nav-link')];
const navSections=navLinks.map(l=>document.querySelector(l.getAttribute('href'))).filter(Boolean);
if(navLinks.length&&navSections.length){
  const setActive=id=>navLinks.forEach(l=>l.classList.toggle('active',l.getAttribute('href')===`#${id}`));
  const observer=new IntersectionObserver(entries=>{
    const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(visible)setActive(visible.target.id);
  },{rootMargin:'-35% 0px -55% 0px',threshold:[0,.2,.5,.8]});
  navSections.forEach(s=>observer.observe(s));
  setActive('top');
}

// =========================================================
// CONTACT FORM — CLOUDFLARE WORKER + TELEGRAM
// =========================================================

const contactForm = document.querySelector('#contactForm');

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton?.textContent;

  // Get form fields
  const name = document.querySelector('#name')?.value.trim() || '';
  const email = document.querySelector('#email')?.value.trim() || '';
  const otherProjectValue = document.querySelector('#otherProject')?.value.trim() || '';
  const message = document.querySelector('#message')?.value.trim() || '';

  // If "Other" is selected, use the custom project type
  const project =
    projectTypeValue === 'Other'
      ? otherProjectValue
      : projectTypeValue;

  // Basic validation
  if (!name || !email || !message) {
    alert('Please fill in all required fields.');
    return;
  }

  // Change button while sending
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'SENDING...';
  }

  try {

    const response = await fetch(
      'https://ahmed-portfolio-contact.ahmedhakem286.workers.dev/',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          name: name,
          email: email,
          message: message
        })
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error('Message could not be sent.');
    }

    // Success
    alert('Message sent successfully! I’ll get back to you soon.');

    contactForm.reset();

    // Hide the "Other project" field again
    syncOtherProject();

  } catch (error) {

    console.error('Contact form error:', error);

    alert(
      'Something went wrong while sending your message. Please try again.'
    );

  } finally {

    // Restore button
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  }
});

// =========================================================
// FULL PROJECT VIDEO VIEWER
// Hover = lightweight preview
// Click = full-quality video
// =========================================================

const videoModal = document.querySelector('#videoModal');
const fullProjectVideo = document.querySelector('#fullProjectVideo');
const videoModalClose = document.querySelector('#videoModalClose');

document.querySelectorAll('.project-card').forEach(card => {

  card.addEventListener('click', (event) => {

    if (event.target.closest('a, button')) return;

    const video = card.querySelector('video');

    if (!video) return;

    const source = video.querySelector('source');

    if (!source) return;

    // Convert preview filename to the original full-quality filename
    const fullVideo = source.src.replace(
      '-preview.mp4',
      '.mp4'
    );

    fullProjectVideo.src = fullVideo;

    videoModal.classList.add('active');
    videoModal.setAttribute('aria-hidden', 'false');

    document.body.classList.add('video-modal-open');

    // Stop the hover preview
    video.pause();

    // Play the full-quality video
    fullProjectVideo.play().catch(() => {});

  });

});

function closeVideoModal() {

  fullProjectVideo.pause();

  fullProjectVideo.removeAttribute('src');
  fullProjectVideo.load();

  videoModal.classList.remove('active');
  videoModal.setAttribute('aria-hidden', 'true');

  document.body.classList.remove('video-modal-open');
}

videoModalClose?.addEventListener(
  'click',
  closeVideoModal
);

videoModal?.addEventListener('click', (event) => {

  if (event.target === videoModal) {
    closeVideoModal();
  }

});

document.addEventListener('keydown', (event) => {

  if (
    event.key === 'Escape' &&
    videoModal?.classList.contains('active')
  ) {
    closeVideoModal();
  }

});

// =========================================================
// PREVENT RIGHT-CLICK ON VIDEOS
// =========================================================

document.addEventListener('contextmenu', (e) => {
  if (e.target.tagName === 'VIDEO') {
    e.preventDefault();
  }
});


// =========================================================
// TEXT HOVER CURSOR
// =========================================================

const textTargets = document.querySelectorAll(
  'h1, h2, h3, h4, h5, p, span, em, strong, small, label, .mono'
);

textTargets.forEach(el => {

  el.addEventListener('mouseenter', () => {

    if (!cursorRing || !cursorDot) return;

    cursorRing.classList.remove('hover');
    cursorRing.classList.add('text-hover');

    cursorDot.classList.add('text-hover');

  });

  el.addEventListener('mouseleave', () => {

    if (!cursorRing || !cursorDot) return;

    cursorRing.classList.remove('text-hover');
    cursorDot.classList.remove('text-hover');

  });

});
