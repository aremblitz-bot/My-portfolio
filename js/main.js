// ============================================================
// GAME DEV PORTFOLIO - SYSTEM CONTROLLER
// ============================================================

// Mobile Navigation
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Gallery Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        galleryItems.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = '';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Lightbox
const lightbox = document.querySelector('.lightbox');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
const lightboxTitle = document.querySelector('.lightbox-info h3');
const lightboxDesc = document.querySelector('.lightbox-info p');

let currentIndex = 0;
let visibleItems = [];

function updateVisibleItems() {
    visibleItems = Array.from(galleryItems).filter(item => 
        item.style.display !== 'none'
    );
}

function openLightbox(index) {
    updateVisibleItems();
    currentIndex = index;
    updateLightbox();
    if (lightbox) lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    if (lightbox) lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function updateLightbox() {
    const item = visibleItems[currentIndex];
    if (!item) return;
    
    const title = item.querySelector('h3')?.textContent || '';
    const desc = item.querySelector('p')?.textContent || '';
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxDesc) lightboxDesc.textContent = desc;
}

function nextItem() {
    updateVisibleItems();
    currentIndex = (currentIndex + 1) % visibleItems.length;
    updateLightbox();
}

function prevItem() {
    updateVisibleItems();
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightbox();
}

galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
        updateVisibleItems();
        const realIndex = visibleItems.indexOf(item);
        openLightbox(realIndex);
    });
});

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxNext) lightboxNext.addEventListener('click', nextItem);
if (lightboxPrev) lightboxPrev.addEventListener('click', prevItem);

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}

document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextItem();
    if (e.key === 'ArrowLeft') prevItem();
});

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.category-card, .gallery-item, .service-item, .timeline-item, .info-item, .contact-method').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (navbar) {
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 240, 255, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    }
    
    lastScroll = currentScroll;
});

// Web3Forms Contact Form
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    const formResult = document.getElementById('form-result');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'TRANSMITTING...';
        submitBtn.disabled = true;
        formResult.innerHTML = '';
        
        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);
        
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            });
            
            const result = await response.json();
            
            if (result.success) {
                formResult.innerHTML = '<p style="color: var(--neon-green); font-weight: 600;">> TRANSMISSION_SUCCESS // Message received. Response incoming.</p>';
                contactForm.reset();
            } else {
                formResult.innerHTML = '<p style="color: var(--neon-red); font-weight: 600;">> ERROR_500 // Transmission failed. Direct contact: marfelelfontanilla@gmail.com</p>';
            }
        } catch (error) {
            formResult.innerHTML = '<p style="color: var(--neon-red); font-weight: 600;">> NETWORK_ERROR // Connection failed. Direct contact: marfelelfontanilla@gmail.com</p>';
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            
            setTimeout(() => {
                formResult.innerHTML = '';
            }, 6000);
        }
    });
}

console.log('%c> SYSTEM_BOOT_COMPLETE', 'color: #00f0ff; font-weight: bold; font-family: monospace;');
console.log('%c> PORTFOLIO_v2.0 // GAME_DEV_THEME', 'color: #ff006e; font-family: monospace;');
