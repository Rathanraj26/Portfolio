// Initialize Lucide Icons
lucide.createIcons();

// ==========================================================================
// 1. DYNAMIC CURSOR FOLLOWER
// ==========================================================================
const cursorDot = document.getElementById('custom-cursor');
const cursorGlow = document.getElementById('custom-cursor-glow');

if (window.innerWidth > 768) {
  document.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    
    // Smooth trailing effect for glow
    cursorGlow.animate({
      left: `${posX}px`,
      top: `${posY}px`
    }, { duration: 150, fill: 'forwards' });
  });

  // Scale up cursor on interactive items
  const interactives = 'a, button, input, textarea, .skill-pill, .project-card, .certificate-card, .timeline-item';
  document.querySelectorAll(interactives).forEach((item) => {
    item.addEventListener('mouseenter', () => {
      cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursorGlow.style.transform = 'translate(-50%, -50%) scale(1.8)';
      cursorGlow.style.borderColor = '#ff2a5f';
      cursorGlow.style.backgroundColor = 'rgba(255, 42, 95, 0.15)';
    });
    item.addEventListener('mouseleave', () => {
      cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorGlow.style.borderColor = '#ff2a5f';
      cursorGlow.style.backgroundColor = 'rgba(255, 42, 95, 0.05)';
    });
  });
}

// Ripple Click Effect
document.addEventListener('click', (e) => {
  const ripple = document.createElement('div');
  ripple.className = 'click-ripple';
  ripple.style.left = `${e.clientX}px`;
  ripple.style.top = `${e.clientY}px`;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});

// Ripple animation style injection
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  .click-ripple {
    position: fixed;
    width: 2px;
    height: 2px;
    border: 2px solid var(--accent-pink);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 9997;
    animation: ripple-out 0.6s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
  }
  @keyframes ripple-out {
    0% { width: 0; height: 0; opacity: 1; }
    100% { width: 60px; height: 60px; opacity: 0; border-width: 1px; }
  }
`;
document.head.appendChild(rippleStyle);


// ==========================================================================
// 2. FLOATING PARTICLES (HTML5 CANVAS)
// ==========================================================================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const numberOfParticles = 65;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 0.4 - 0.2;
    this.speedY = Math.random() * 0.4 - 0.2;
    this.alpha = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Boundary collision wrapping
    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
    if (this.y > canvas.height) this.y = 0;
    if (this.y < 0) this.y = canvas.height;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = '#ff2a5f';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff2a5f';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function initParticles() {
  particlesArray = [];
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
  }
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();


// ==========================================================================
// 3. ANIMATED TYPING ROLE EFFECT
// ==========================================================================
const roles = ["Data Analyst", "Full Stack Developer", "Machine Learning Enthusiast"];
let activeRoleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const dynamicTxtSpan = document.querySelector('.dynamic-txt');

function typeEffect() {
  const currentRole = roles[activeRoleIndex];
  
  if (isDeleting) {
    charIndex--;
    dynamicTxtSpan.textContent = currentRole.substring(0, charIndex);
  } else {
    charIndex++;
    dynamicTxtSpan.textContent = currentRole.substring(0, charIndex);
  }
  
  let typingSpeed = isDeleting ? 40 : 80;
  
  if (!isDeleting && charIndex === currentRole.length) {
    typingSpeed = 2200; // Pause at full word
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    activeRoleIndex = (activeRoleIndex + 1) % roles.length;
    typingSpeed = 300; // Small delay before next word
  }
  
  setTimeout(typeEffect, typingSpeed);
}

if (dynamicTxtSpan) {
  setTimeout(typeEffect, 1000);
}


// ==========================================================================
// 4. 3D TILT ENGINE (Awwwards / Apple Inspired)
// ==========================================================================
const tiltElements = document.querySelectorAll('.tilt-element');

tiltElements.forEach((el) => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    
    // Max rotation 12deg
    const rotateX = ((midY - y) / midY) * 12;
    const rotateY = ((x - midX) / midX) * 12;
    
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });
  
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
});


// ==========================================================================
// 5. PDF.js RESUME INTERACTIVE VIEWER
// ==========================================================================
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

let resumePdfDoc = null;
let resumePageNum = 1;
let resumeScale = 1.0;
const resumeCanvas = document.getElementById('resume-pdf-canvas');
const resumeCtx = resumeCanvas.getContext('2d');

function loadResumePDF() {
  const url = '/resume/RR_Resume.pdf';
  const loadingIndicator = document.getElementById('pdf-loading');
  
  pdfjsLib.getDocument(url).promise.then((pdfDoc_) => {
    resumePdfDoc = pdfDoc_;
    document.getElementById('resume-page-count').textContent = resumePdfDoc.numPages;
    loadingIndicator.style.display = 'none';
    renderResumePage(resumePageNum);
  }).catch((err) => {
    console.error('PDF parsing error: ', err);
    loadingIndicator.innerHTML = '<span style="color: var(--accent-pink)">Error fetching resume file.</span>';
  });
}

function renderResumePage(num) {
  if (!resumePdfDoc) return;
  
  resumePdfDoc.getPage(num).then((page) => {
    const viewport = page.getViewport({ scale: resumeScale });
    resumeCanvas.height = viewport.height;
    resumeCanvas.width = viewport.width;
    
    const renderContext = {
      canvasContext: resumeCtx,
      viewport: viewport
    };
    
    page.render(renderContext);
    document.getElementById('resume-page-num').textContent = num;
    document.getElementById('resume-zoom-val').textContent = `${Math.round(resumeScale * 100)}%`;
  });
}

// Resume Navigation events
document.getElementById('resume-prev').addEventListener('click', () => {
  if (resumePageNum <= 1) return;
  resumePageNum--;
  renderResumePage(resumePageNum);
});

document.getElementById('resume-next').addEventListener('click', () => {
  if (!resumePdfDoc || resumePageNum >= resumePdfDoc.numPages) return;
  resumePageNum++;
  renderResumePage(resumePageNum);
});

document.getElementById('resume-zoom-in').addEventListener('click', () => {
  if (resumeScale >= 2.0) return;
  resumeScale += 0.25;
  renderResumePage(resumePageNum);
});

document.getElementById('resume-zoom-out').addEventListener('click', () => {
  if (resumeScale <= 0.5) return;
  resumeScale -= 0.25;
  renderResumePage(resumePageNum);
});

document.getElementById('resume-fullscreen').addEventListener('click', () => {
  if (resumeCanvas.requestFullscreen) {
    resumeCanvas.requestFullscreen();
  } else if (resumeCanvas.webkitRequestFullscreen) {
    resumeCanvas.webkitRequestFullscreen();
  }
});

document.getElementById('resume-print').addEventListener('click', () => {
  const win = window.open('/resume/RR_Resume.pdf', '_blank');
  win.focus();
  win.print();
});

loadResumePDF();


// ==========================================================================
// 6. CERTIFICATES GALLERY DYNAMIC LOADER
// ==========================================================================
const certsContainer = document.getElementById('certificates-container');
let activeModalPdf = null;
let modalPageNum = 1;
let modalScale = 1.0;
const modalCanvas = document.getElementById('modal-pdf-canvas');
const modalCtx = modalCanvas.getContext('2d');

function fetchCertificates() {
  fetch('/api/certificates')
    .then(res => res.json())
    .then(certs => {
      if (certs.length === 0) {
        certsContainer.innerHTML = '<div class="loading-placeholder">No certifications found.</div>';
        return;
      }
      certsContainer.innerHTML = '';
      certs.forEach(cert => {
        const card = document.createElement('div');
        card.className = 'certificate-card glass-card tilt-element';
        card.innerHTML = `
          <div class="cert-top">
            <span class="cert-name">${cert.name}</span>
            <div class="pdf-icon-box">
              <i data-lucide="file-text"></i>
            </div>
          </div>
          <div class="cert-actions">
            <button class="cert-btn cert-btn-view" data-url="${cert.url}" data-name="${cert.name}">
              <i data-lucide="eye"></i> View
            </button>
            <a href="${cert.url}" download class="cert-btn cert-btn-download">
              <i data-lucide="download"></i> Get
            </a>
          </div>
        `;
        certsContainer.appendChild(card);
      });
      
      // Reinitialize Lucide and Tilt for dynamic cards
      lucide.createIcons();
      rebindDynamicEvents();
    })
    .catch(err => {
      console.error('Certificates loading failed', err);
      certsContainer.innerHTML = '<div class="loading-placeholder" style="color:var(--accent-pink)">Failed to load certificates.</div>';
    });
}

// Certificate Modal Event handling
const pdfModal = document.getElementById('pdf-modal');
const modalClose = document.querySelector('.close-modal-btn');
const modalTitle = document.getElementById('modal-pdf-title');

function rebindDynamicEvents() {
  // Bind View Click Handlers
  document.querySelectorAll('.cert-btn-view').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-url');
      const name = btn.getAttribute('data-name');
      modalTitle.textContent = name;
      document.getElementById('modal-download').setAttribute('href', url);
      pdfModal.classList.add('active');
      loadModalPDF(url);
    });
  });
  
  // Re-bind 3D Tilt for new cards
  document.querySelectorAll('.certificate-card').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = (((rect.height/2) - y) / (rect.height/2)) * 12;
      const rotateY = ((x - (rect.width/2)) / (rect.width/2)) * 12;
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    el.style.transition = 'transform 0.1s ease';
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

function loadModalPDF(url) {
  const loadingIndicator = document.getElementById('modal-pdf-loading');
  loadingIndicator.style.display = 'flex';
  modalPageNum = 1;
  modalScale = 1.0;
  
  pdfjsLib.getDocument(url).promise.then((pdfDoc_) => {
    activeModalPdf = pdfDoc_;
    document.getElementById('modal-page-count').textContent = activeModalPdf.numPages;
    loadingIndicator.style.display = 'none';
    renderModalPage(modalPageNum);
  }).catch((err) => {
    console.error('Modal PDF Loading error', err);
    loadingIndicator.innerHTML = '<span style="color: var(--accent-pink)">Failed to render document.</span>';
  });
}

function renderModalPage(num) {
  if (!activeModalPdf) return;
  activeModalPdf.getPage(num).then((page) => {
    const viewport = page.getViewport({ scale: modalScale });
    modalCanvas.height = viewport.height;
    modalCanvas.width = viewport.width;
    
    const renderContext = {
      canvasContext: modalCtx,
      viewport: viewport
    };
    page.render(renderContext);
    document.getElementById('modal-page-num').textContent = num;
    document.getElementById('modal-zoom-val').textContent = `${Math.round(modalScale * 100)}%`;
  });
}

// Modal controls
document.getElementById('modal-prev').addEventListener('click', () => {
  if (modalPageNum <= 1) return;
  modalPageNum--;
  renderModalPage(modalPageNum);
});

document.getElementById('modal-next').addEventListener('click', () => {
  if (!activeModalPdf || modalPageNum >= activeModalPdf.numPages) return;
  modalPageNum++;
  renderModalPage(modalPageNum);
});

document.getElementById('modal-zoom-in').addEventListener('click', () => {
  if (modalScale >= 2.0) return;
  modalScale += 0.25;
  renderModalPage(modalPageNum);
});

document.getElementById('modal-zoom-out').addEventListener('click', () => {
  if (modalScale <= 0.5) return;
  modalScale -= 0.25;
  renderModalPage(modalPageNum);
});

modalClose.addEventListener('click', () => {
  pdfModal.classList.remove('active');
  activeModalPdf = null;
});

// Close modal if background is clicked
pdfModal.addEventListener('click', (e) => {
  if (e.target === pdfModal) {
    pdfModal.classList.remove('active');
    activeModalPdf = null;
  }
});

fetchCertificates();


// ==========================================================================
// 7. RESPONSIVE MOBILE DRAWER & TO-TOP
// ==========================================================================
const menuToggle = document.querySelector('.menu-toggle');
const closeDrawer = document.querySelector('.close-drawer');
const navDrawer = document.querySelector('.mobile-nav-drawer');

menuToggle.addEventListener('click', () => {
  navDrawer.classList.add('active');
});

closeDrawer.addEventListener('click', () => {
  navDrawer.classList.remove('active');
});

document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    navDrawer.classList.remove('active');
  });
});

// To Top Button
const toTopBtn = document.getElementById('to-top-btn');
toTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ==========================================================================
// 8. SCROLL REVEAL & NAVIGATION HIGHLIGHT
// ==========================================================================
const revealItems = document.querySelectorAll('.scroll-reveal');
const navLinks = document.querySelectorAll('.desktop-nav a, .mobile-nav a');
const sections = document.querySelectorAll('section');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

revealItems.forEach(item => revealObserver.observe(item));

// Highlighting Nav on scroll
window.addEventListener('scroll', () => {
  let currentSec = '';
  sections.forEach(sec => {
    const sectionTop = sec.offsetTop - 150;
    if (pageYOffset >= sectionTop) {
      currentSec = sec.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSec}`) {
      link.classList.add('active');
    }
  });
});


// ==========================================================================
// 9. FORM DISPATCH SIMULATION
// ==========================================================================
const contactForm = document.getElementById('portfolio-contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.className = 'form-status-msg';
    formStatus.textContent = 'Encrypting & sending message...';
    
    // Simulate API dispatch latency
    setTimeout(() => {
      formStatus.classList.add('success');
      formStatus.textContent = 'Success! Message has been routed to Rathan Raj M.';
      contactForm.reset();
      
      // Auto fadeout message after 4s
      setTimeout(() => {
        formStatus.textContent = '';
        formStatus.className = 'form-status-msg';
      }, 4000);
    }, 1500);
  });
}
