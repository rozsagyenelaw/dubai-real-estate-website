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

// ===== STICKY NAVBAR =====
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
    }
    
    lastScroll = currentScroll;
});

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
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        // Simulate submission
        alert(`Thank you for subscribing! We'll send property updates to ${email}`);
        newsletterForm.reset();
    });
}

// ===== FEATURED PROPERTIES DATA =====
const featuredPropertiesData = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        price: '1,850,000',
        type: 'Apartment',
        location: 'Downtown Dubai',
        bedrooms: 2,
        bathrooms: 2,
        sqft: '1,450',
        badge: 'Featured'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        price: '4,500,000',
        type: 'Villa',
        location: 'Arabian Ranches',
        bedrooms: 5,
        bathrooms: 6,
        sqft: '5,200',
        badge: 'Luxury'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        price: '2,200,000',
        type: 'Penthouse',
        location: 'Dubai Marina',
        bedrooms: 3,
        bathrooms: 3,
        sqft: '2,100',
        badge: 'Premium'
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        price: '6,800,000',
        type: 'Villa',
        location: 'Palm Jumeirah',
        bedrooms: 6,
        bathrooms: 7,
        sqft: '7,500',
        badge: 'Exclusive'
    },
    {
        id: 5,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        price: '1,450,000',
        type: 'Apartment',
        location: 'Business Bay',
        bedrooms: 2,
        bathrooms: 2,
        sqft: '1,250',
        badge: 'New'
    },
    {
        id: 6,
        image: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800',
        price: '3,200,000',
        type: 'Townhouse',
        location: 'Dubai Hills Estate',
        bedrooms: 4,
        bathrooms: 4,
        sqft: '3,000',
        badge: 'Hot Deal'
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
                <div class="property-price">AED ${property.price}</div>
                <div class="property-location">
                    <i class="fas fa-map-marker-alt"></i> ${property.location}
                </div>
                <div class="property-features">
                    <div class="feature">
                        <i class="fas fa-bed"></i> ${property.bedrooms} Beds
                    </div>
                    <div class="feature">
                        <i class="fas fa-bath"></i> ${property.bathrooms} Baths
                    </div>
                    <div class="feature">
                        <i class="fas fa-ruler-combined"></i> ${property.sqft} sqft
                    </div>
                </div>
                <div class="property-footer">
                    <span class="property-type">${property.type}</span>
                    <a href="properties.html" class="view-details">
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
