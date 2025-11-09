// Property Image Carousel
class PropertyCarousel {
    constructor(carouselId) {
        this.carousel = document.getElementById(carouselId);
        if (!this.carousel) return;

        this.slides = this.carousel.querySelectorAll('.carousel-slide');
        this.dotsContainer = this.carousel.querySelector('.carousel-dots');
        this.prevBtn = this.carousel.querySelector('.carousel-arrow.prev');
        this.nextBtn = this.carousel.querySelector('.carousel-arrow.next');
        this.currentSlide = 0;
        this.autoPlayInterval = null;

        this.init();
    }

    init() {
        // Create dots
        this.createDots();

        // Show first slide
        this.showSlide(0);

        // Add event listeners
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Start autoplay
        this.startAutoPlay();

        // Pause on hover
        this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    createDots() {
        if (!this.dotsContainer) return;

        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
    }

    showSlide(index) {
        // Remove active class from all slides
        this.slides.forEach(slide => slide.classList.remove('active'));

        // Remove active class from all dots
        const dots = this.dotsContainer?.querySelectorAll('.carousel-dot');
        dots?.forEach(dot => dot.classList.remove('active'));

        // Set current slide
        this.currentSlide = index;

        // Add active class to current slide
        this.slides[this.currentSlide].classList.add('active');

        // Add active class to current dot
        if (dots && dots[this.currentSlide]) {
            dots[this.currentSlide].classList.add('active');
        }
    }

    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(next);
    }

    previousSlide() {
        const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prev);
    }

    goToSlide(index) {
        this.showSlide(index);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Initialize carousels when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize exterior carousel
    new PropertyCarousel('exteriorCarousel');

    // Initialize interior carousel
    new PropertyCarousel('interiorCarousel');

    // Initialize amenities carousel (if exists)
    new PropertyCarousel('amenitiesCarousel');
});
