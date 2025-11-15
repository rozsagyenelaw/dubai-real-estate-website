// ===== MOBILE NAVIGATION =====
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// ===== HERO MOBILE NAVIGATION =====
const heroNavToggle = document.querySelector('.hero-nav-toggle');
const heroNavMenu = document.querySelector('.hero-nav-menu');

if (heroNavToggle) {
    heroNavToggle.addEventListener('click', () => {
        heroNavMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!heroNavToggle.contains(e.target) && !heroNavMenu.contains(e.target)) {
            heroNavMenu.classList.remove('active');
        }
    });

    // Close menu when clicking a link
    const heroNavLinks = document.querySelectorAll('.hero-nav-menu a');
    heroNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            heroNavMenu.classList.remove('active');
        });
    });
}

// ===== STICKY NAVBAR =====
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
        }

        lastScroll = currentScroll;
    });
}

// ===== TESTIMONIALS SLIDER =====
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');

if (testimonialCards.length > 0) {
    let currentSlide = 0;

    function showSlide(n) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + testimonialCards.length) % testimonialCards.length;
        
        testimonialCards[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    // Auto-slide every 5 seconds
    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
}

// ===== NEWSLETTER FORM =====
const newsletterForm = document.getElementById('newsletterForm');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', () => {
        // Let Netlify handle the form submission and redirect to thank-you.html
        const submitBtn = newsletterForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;
    });
}

// ===== FEATURED PROPERTIES DATA =====
const featuredPropertiesData = [
    {
        id: 0,
        image: 'media/bayz-102/images/exterior/Bayz 102 View1_Day_Final.jpg',
        price: '1,200,000',
        type: 'Apartment',
        location: 'Business Bay',
        bedrooms: 'Studio',
        bathrooms: 1,
        sqft: '500+',
        badge: 'New Launch',
        title: 'BAYZ 102',
        detailPage: 'property-bayz-102.html'
    },
    {
        id: 1,
        image: 'media/bayz/images/exterior/entrance_day_v6.jpg',
        price: '1,175,000',
        type: 'Apartment',
        location: 'Business Bay',
        bedrooms: 'Studio',
        bathrooms: 1,
        sqft: '500+',
        badge: 'New Launch',
        title: 'BAYZ 101',
        detailPage: 'property-bayz.html'
    },
    {
        id: 2,
        image: 'media/diamondz/images/exterior/Exterior.jpg',
        price: '1,130,000',
        type: 'Apartment',
        location: 'Jumeirah Lake Towers',
        bedrooms: 'Studio',
        bathrooms: 1,
        sqft: '407',
        badge: 'Ultra Luxury',
        title: 'Diamondz',
        detailPage: 'property-diamondz.html'
    },
    {
        id: 3,
        image: 'media/danube/oceanz-tower-2/images/exterior/Oceanz3_exterior_newsky.jpg',
        price: '1,138,000',
        type: 'Apartment',
        location: 'Dubai Maritime City',
        bedrooms: 1,
        bathrooms: 1,
        sqft: '746',
        badge: 'Featured',
        title: 'Oceanz Tower 2',
        detailPage: 'property-oceanz-tower-2.html'
    },
    {
        id: 4,
        image: 'media/fashionz/images/exterior/DAY-VIEW.jpg',
        price: '850,000',
        type: 'Apartment',
        location: 'Jumeirah Village Triangle',
        bedrooms: 'Studio',
        bathrooms: 1,
        sqft: '520+',
        badge: 'FashionTV Branded',
        title: 'Fashionz',
        detailPage: 'property-fashionz.html'
    },
    {
        id: 5,
        image: 'media/elitz3/images/exterior/Elitz3_Day Shot.jpg',
        price: '750,000',
        type: 'Apartment',
        location: 'Jumeirah Village Circle',
        bedrooms: 'Studio',
        bathrooms: 1,
        sqft: '450',
        badge: 'New Launch',
        title: 'ELITZ 3',
        detailPage: 'property-elitz3.html'
    },
    {
        id: 6,
        image: 'media/timez/images/exterior/Danube_Timez_Hero2.webp',
        price: '650,000',
        type: 'Apartment',
        location: 'Dubai Silicon Oasis',
        bedrooms: 'Studio',
        bathrooms: 1,
        sqft: '450+',
        badge: 'Convertible Apartments',
        title: 'Timez',
        detailPage: 'property-timez.html'
    },
    {
        id: 7,
        image: 'media/eleganz/images/exterior/Full Building.png',
        price: 'Contact',
        type: 'Apartment',
        location: 'Jumeirah Village Circle',
        bedrooms: '1-4',
        bathrooms: 1,
        sqft: 'Varies',
        badge: 'Completed',
        title: 'Eleganz',
        detailPage: 'property-eleganz.html'
    },
    {
        id: 8,
        image: 'media/opalz/images/exterior/Opalz_Build_2.jpg',
        price: 'Contact',
        type: 'Apartment',
        location: 'Dubai Silicon Oasis',
        bedrooms: 'Studio-2BR',
        bathrooms: 1,
        sqft: 'Varies',
        badge: 'Completed',
        title: 'Opalz',
        detailPage: 'property-opalz.html'
    },
    {
        id: 9,
        image: 'media/breez/images/exterior/BREEZ-60.jpg',
        price: '800,000',
        type: 'Apartment',
        location: 'Dubai Maritime City',
        bedrooms: 'Studio',
        bathrooms: 1,
        sqft: '480',
        badge: 'New Launch',
        title: 'Breez',
        detailPage: 'property-breez.html'
    }
];

// ===== LOAD FEATURED PROPERTIES =====
const featuredPropertiesContainer = document.getElementById('featuredProperties');

if (featuredPropertiesContainer) {
    featuredPropertiesContainer.innerHTML = featuredPropertiesData.map(property => `
        <div class="property-card">
            <div class="property-image">
                <img src="${property.image}" alt="${property.type} in ${property.location}" loading="lazy">
                <span class="property-badge">${property.badge}</span>
            </div>
            <div class="property-info">
                ${property.title ? `<div style="font-weight: 600; color: var(--primary-navy); margin-bottom: 0.5rem;">${property.title}</div>` : ''}
                <div class="property-price">AED ${property.price}</div>
                <div class="property-location">
                    <i class="fas fa-map-marker-alt"></i> ${property.location}
                </div>
                <div class="property-features">
                    <div class="feature">
                        <i class="fas fa-bed"></i> ${typeof property.bedrooms === 'string' ? property.bedrooms : property.bedrooms + ' Bed' + (property.bedrooms !== 1 ? 's' : '')}
                    </div>
                    <div class="feature">
                        <i class="fas fa-bath"></i> ${property.bathrooms} Bath${property.bathrooms !== 1 ? 's' : ''}
                    </div>
                    <div class="feature">
                        <i class="fas fa-ruler-combined"></i> ${property.sqft} sqft
                    </div>
                </div>
                <div class="property-footer">
                    <span class="property-type">${property.type}</span>
                    <a href="${property.detailPage || 'properties.html'}" class="view-details">
                        View Details <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===== LAZY LOADING IMAGES =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => imageObserver.observe(img));
}

// ===== PAGE LOAD ANIMATION =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===== HERO SLIDER =====
const heroSlides = document.querySelectorAll('.hero-slide');
if (heroSlides.length > 0) {
    let currentSlide = 0;

    function showNextSlide() {
        heroSlides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % heroSlides.length;
        heroSlides[currentSlide].classList.add('active');
    }

    // Change slide every 5 seconds
    setInterval(showNextSlide, 5000);
}
