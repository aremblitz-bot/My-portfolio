// ===================================
// CUSTOM CURSOR
// ===================================
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursor) {
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    }
});

function animateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    if (follower) {
        follower.style.left = (followerX - 17) + 'px';
        follower.style.top = (followerY - 17) + 'px';
    }
    requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor hover effects
document.querySelectorAll('a, button, .gallery-item, .category-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (follower) {
            follower.style.width = '60px';
            follower.style.height = '60px';
            follower.style.borderColor = '#ec4899';
        }
    });
    el.addEventListener('mouseleave', () => {
        if (follower) {
            follower.style.width = '35px';
            follower.style.height = '35px';
            follower.style.borderColor = '#8b5cf6';
        }
    });
});

// ===================================
// MOBILE NAVIGATION
// ===================================
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// ===================================
// GALLERY FILTER
// ===================================
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
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

// ===================================
// LIGHTBOX
// ===================================
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

// Open lightbox on gallery item click
galleryItems.forEach((item, index) => {
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

// ===================================
// SCROLL ANIMATIONS
// ===================================
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

// Add fade-in class to elements
document.querySelectorAll('.category-card, .gallery-item, .service-item, .timeline-item, .info-item').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (navbar) {
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(10, 10, 15, 0.9)';
            navbar.style.borderBottomColor = 'rgba(139, 92, 246, 0.2)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.7)';
            navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
        }
    }
    
    lastScroll = currentScroll;
});

// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===================================
// FORM SUBMISSION HANDLER
// ===================================
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        // Form will submit to Formspree automatically
        // Add a small loading state
        const btn = contactForm.querySelector('button[type="submit"]');
        if (btn) {
            btn.innerHTML = 'Sending...';
            btn.disabled = true;
        }
    });
}

console.log('🎮 Portfolio loaded successfully!');
