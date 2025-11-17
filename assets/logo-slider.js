/**
 * Logo Slider Component
 * 
 * A lightweight, accessible logo slider with:
 * - Auto-advance carousel functionality
 * - Keyboard navigation (arrow keys, tab)
 * - Screen reader announcements
 * - Touch/drag support
 * - Pause on hover/focus
 * - Respects prefers-reduced-motion
 */

import { Component } from '@theme/component';

/**
 * @typedef {Object} Refs
 * @property {HTMLElement} track - The scrollable track element
 * @property {HTMLElement} trackContainer - The track container
 * @property {HTMLButtonElement} [prevButton] - Previous button
 * @property {HTMLButtonElement} [nextButton] - Next button
 * @property {HTMLElement} [pagination] - Pagination container
 */

/**
 * Logo Slider Component Class
 * @extends {Component<Refs>}
 */
export class LogoSlider extends Component {
  requiredRefs = ['track'];

  /**
   * Component initialization
   */
  connectedCallback() {
    super.connectedCallback();

    // Get configuration from data attributes
    this.config = {
      autoplay: this.dataset.autoplay === 'true',
      autoplaySpeed: parseInt(this.dataset.autoplaySpeed || '5', 10) || 5,
      logosPerViewDesktop: parseInt(this.dataset.logosPerViewDesktop || '4', 10) || 4,
      logosPerViewMobile: parseInt(this.dataset.logosPerViewMobile || '2', 10) || 2,
    };

    // State
    /** @type {number} */
    this.currentIndex = 0;
    this.isPaused = false;
    this.isDragging = false;
    this.autoplayInterval = null;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Get all slides
    this.originalSlides = Array.from(this.refs.track.children);
    this.totalOriginalSlides = this.originalSlides.length;
    
    // Clone slides for infinite loop (append duplicates at the end)
    this.cloneSlides();
    
    // Now get all slides including clones
    this.slides = Array.from(this.refs.track.children);
    this.totalSlides = this.slides.length;

    // Calculate pages based on logos per view
    this.calculatePages();

    // Initialize components
    this.initializeNavigation();
    this.initializePagination();
    this.initializeDragScroll();
    this.initializeKeyboardNavigation();
    this.initializeAutoplay();

    // Intersection Observer for pausing when not visible
    this.initializeIntersectionObserver();

    // Mark as loaded
    this.classList.add('loaded');
  }

  /**
   * Clone slides for infinite loop effect
   */
  cloneSlides() {
    const { track } = this.refs;
    if (!track) return;
    
    // Clone all original slides and append them
    this.originalSlides.forEach((slide) => {
      const clone = slide.cloneNode(true);
      if (!(clone instanceof Element)) return;
      clone.classList.add('logo-slider__slide--clone');
      clone.setAttribute('aria-hidden', 'true'); // Hide clones from screen readers
      track.appendChild(clone);
    });
  }

  /**
   * Calculate the number of pages based on visible logos
   */
  calculatePages() {
    const isDesktop = window.matchMedia('(min-width: 750px)').matches;
    this.logosPerView = isDesktop ? this.config.logosPerViewDesktop : this.config.logosPerViewMobile;
    // Use original slides count for pagination
    this.totalPages = Math.ceil(this.totalOriginalSlides / this.logosPerView);
  }

  /**
   * Initialize navigation buttons
   */
  initializeNavigation() {
    const { prevButton, nextButton } = this.refs;

    if (prevButton) {
      prevButton.addEventListener('click', () => this.previous());
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => this.next());
    }

    // Update button states
    this.updateNavigationState();
  }

  /**
   * Initialize pagination dots
   */
  initializePagination() {
    const { pagination } = this.refs;
    if (!pagination || this.totalPages <= 1) return;

    // Clear existing dots
    pagination.innerHTML = '';

    // Create dots for each page
    for (let i = 0; i < this.totalPages; i++) {
      const dot = document.createElement('button');
      dot.className = 'logo-slider__dot';
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.dataset.index = String(i);
      
      dot.addEventListener('click', () => {
        this.goToPage(i);
        this.resetAutoplay();
      });

      pagination.appendChild(dot);
    }

    this.dots = Array.from(pagination.children);
  }

  /**
   * Initialize drag scrolling
   */
  initializeDragScroll() {
    const { track } = this.refs;
    if (!track) return;
    let startX = 0;
    let scrollLeft = 0;
    let isDragging = false;

    /** @param {MouseEvent} e */
    const handleMouseDown = (e) => {
      if (!(track instanceof HTMLElement)) return;
      isDragging = true;
      this.isDragging = true;
      track.classList.add('is-dragging');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
      this.pauseAutoplay();
    };

    /** @param {MouseEvent} e */
    const handleMouseMove = (e) => {
      if (!isDragging || !(track instanceof HTMLElement)) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 2; // Multiply for faster scroll
      track.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      this.isDragging = false;
      track.classList.remove('is-dragging');
      
      // Snap to nearest slide
      this.snapToNearestSlide();
      this.resumeAutoplay();
    };

    // Mouse events
    track.addEventListener('mousedown', handleMouseDown);
    track.addEventListener('mousemove', handleMouseMove);
    track.addEventListener('mouseup', handleMouseUp);
    track.addEventListener('mouseleave', handleMouseUp);

    // Touch events
    track.addEventListener('touchstart', (e) => {
      if (!(track instanceof HTMLElement)) return;
      startX = e.touches[0].pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
      this.pauseAutoplay();
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      if (!(track instanceof HTMLElement)) return;
      const x = e.touches[0].pageX - track.offsetLeft;
      const walk = (x - startX) * 2;
      track.scrollLeft = scrollLeft - walk;
    }, { passive: true });

    track.addEventListener('touchend', () => {
      this.snapToNearestSlide();
      this.resumeAutoplay();
    }, { passive: true });

    // Scroll event to update current index
    track.addEventListener('scroll', () => {
      if (!this.isDragging) {
        this.updateCurrentIndexFromScroll();
      }
    });

    // Pause on hover
    this.addEventListener('mouseenter', () => this.pauseAutoplay());
    this.addEventListener('mouseleave', () => this.resumeAutoplay());

    // Pause on focus
    this.addEventListener('focusin', () => this.pauseAutoplay());
    this.addEventListener('focusout', () => this.resumeAutoplay());
  }

  /**
   * Snap to the nearest slide after dragging
   */
  snapToNearestSlide() {
    const { track } = this.refs;
    if (!track || !(this.slides[0] instanceof HTMLElement)) return;
    const slideWidth = this.slides[0].offsetWidth;
    const gap = parseInt(getComputedStyle(track).gap) || 0;
    const scrollPosition = track.scrollLeft;
    const slideWithGap = slideWidth + gap;
    
    const nearestIndex = Math.round(scrollPosition / slideWithGap);
    this.goToSlide(nearestIndex);
  }

  /**
   * Update current index based on scroll position
   */
  updateCurrentIndexFromScroll() {
    const { track } = this.refs;
    if (!track || !(this.slides[0] instanceof HTMLElement)) return;
    const slideWidth = this.slides[0].offsetWidth;
    const gap = parseInt(getComputedStyle(track).gap) || 0;
    const scrollPosition = track.scrollLeft;
    const slideWithGap = slideWidth + gap;
    
    const newIndex = Math.round(scrollPosition / slideWithGap);
    if (newIndex !== this.currentIndex) {
      this.currentIndex = newIndex;
      this.updatePaginationState();
      this.updateNavigationState();
    }
  }

  /**
   * Initialize keyboard navigation
   */
  initializeKeyboardNavigation() {
    this.addEventListener('keydown', (e) => {
      // Arrow keys
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.previous();
        this.resetAutoplay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.next();
        this.resetAutoplay();
      }
      // Home/End keys
      else if (e.key === 'Home') {
        e.preventDefault();
        this.goToSlide(0);
        this.resetAutoplay();
      } else if (e.key === 'End') {
        e.preventDefault();
        this.goToSlide(this.totalSlides - 1);
        this.resetAutoplay();
      }
    });
  }

  /**
   * Initialize autoplay
   */
  initializeAutoplay() {
    if (!this.config.autoplay || this.prefersReducedMotion) return;
    
    this.startAutoplay();
  }

  /**
   * Start autoplay
   */
  startAutoplay() {
    if (this.autoplayInterval || this.isPaused || this.prefersReducedMotion) return;

    const intervalMs = this.config.autoplaySpeed * 1000;
    
    this.autoplayInterval = setInterval(() => {
      if (!this.isPaused && !document.hidden) {
        this.next();
      }
    }, intervalMs);
  }

  /**
   * Stop autoplay
   */
  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  /**
   * Pause autoplay
   */
  pauseAutoplay() {
    this.isPaused = true;
    this.dataset.paused = '';
  }

  /**
   * Resume autoplay
   */
  resumeAutoplay() {
    this.isPaused = false;
    delete this.dataset.paused;
  }

  /**
   * Reset autoplay (stop and restart)
   */
  resetAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }

  /**
   * Go to specific slide index
   * @param {number} index - Target slide index
   */
  goToSlide(index) {
    // Clamp index to valid range (including clones)
    index = Math.max(0, Math.min(index, this.totalSlides - 1));
    
    const { track } = this.refs;
    if (!track || !(this.slides[0] instanceof HTMLElement)) return;
    const slideWidth = this.slides[0].offsetWidth;
    const gap = parseInt(getComputedStyle(track).gap) || 0;
    const slideWithGap = slideWidth + gap;
    
    const scrollPosition = index * slideWithGap;
    
    track.scrollTo({
      left: scrollPosition,
      behavior: this.prefersReducedMotion ? 'auto' : 'smooth',
    });

    this.currentIndex = index;
    this.updatePaginationState();
    this.updateNavigationState();
    // Only announce if not a clone
    if (index < this.totalOriginalSlides) {
      this.announceSlideChange(index);
    }
  }

  /**
   * Go to specific page
   * @param {number} pageIndex - Target page index
   */
  goToPage(pageIndex) {
    const slideIndex = pageIndex * this.logosPerView;
    this.goToSlide(slideIndex);
  }

  /**
   * Go to next slide
   */
  next() {
    const nextIndex = this.currentIndex + 1;
    
    // If we've reached the end of the original slides, reset to start seamlessly
    if (nextIndex >= this.totalOriginalSlides) {
      // Move to the first cloned slide (smooth transition)
      this.goToSlide(nextIndex);
      
      // After the transition, instantly reset to the actual first slide
      setTimeout(() => {
        this.resetToStart();
      }, this.prefersReducedMotion ? 0 : 300); // Wait for scroll animation
    } else {
      this.goToSlide(nextIndex);
    }
  }

  /**
   * Reset to start position without animation (for infinite loop)
   */
  resetToStart() {
    const { track } = this.refs;
    if (!track || !(this.slides[0] instanceof HTMLElement)) return;
    const slideWidth = this.slides[0].offsetWidth;
    const gap = parseInt(getComputedStyle(track).gap) || 0;
    const slideWithGap = slideWidth + gap;
    
    // Disable smooth scrolling temporarily
    if (!(track instanceof HTMLElement)) return;
    const originalBehavior = track.style.scrollBehavior;
    track.style.scrollBehavior = 'auto';
    
    // Instantly jump to the real first slide (index 0)
    track.scrollLeft = 0;
    this.currentIndex = 0;
    
    // Re-enable smooth scrolling
    setTimeout(() => {
      if (!(track instanceof HTMLElement)) return;
      track.style.scrollBehavior = originalBehavior;
    }, 50);
    
    this.updatePaginationState();
    this.updateNavigationState();
  }

  /**
   * Go to previous slide
   */
  previous() {
    const prevIndex = this.currentIndex - 1;
    
    // Loop to end if at start
    if (prevIndex < 0) {
      // Jump to the end of the original slides
      this.resetToEnd();
    } else {
      this.goToSlide(prevIndex);
    }
  }

  /**
   * Reset to end position without animation (for infinite loop going backwards)
   */
  resetToEnd() {
    const { track } = this.refs;
    if (!track || !(this.slides[0] instanceof HTMLElement)) return;
    const slideWidth = this.slides[0].offsetWidth;
    const gap = parseInt(getComputedStyle(track).gap) || 0;
    const slideWithGap = slideWidth + gap;
    
    // Disable smooth scrolling temporarily
    if (!(track instanceof HTMLElement)) return;
    const originalBehavior = track.style.scrollBehavior;
    track.style.scrollBehavior = 'auto';
    
    // Instantly jump to the last original slide
    const lastIndex = this.totalOriginalSlides - 1;
    track.scrollLeft = lastIndex * slideWithGap;
    this.currentIndex = lastIndex;
    
    // Re-enable smooth scrolling
    setTimeout(() => {
      if (!(track instanceof HTMLElement)) return;
      track.style.scrollBehavior = originalBehavior;
    }, 50);
    
    this.updatePaginationState();
    this.updateNavigationState();
  }

  /**
   * Update pagination dot states
   */
  updatePaginationState() {
    if (!this.dots || this.dots.length === 0) return;

    // Use modulo to wrap around for clones
    const actualIndex = this.currentIndex % this.totalOriginalSlides;
    const currentPage = Math.floor(actualIndex / this.logosPerView);
    
    this.dots.forEach((dot, i) => {
      dot.setAttribute('aria-selected', i === currentPage ? 'true' : 'false');
    });
  }

  /**
   * Update navigation button states
   */
  updateNavigationState() {
    const { prevButton, nextButton } = this.refs;
    
    // For infinite loop, buttons are never disabled
    if (prevButton) {
      prevButton.disabled = false;
    }
    if (nextButton) {
      nextButton.disabled = false;
    }
  }

  /**
   * Announce slide change to screen readers
   * @param {number} index - Current slide index
   */
  announceSlideChange(index) {
    const announcement = `Slide ${index + 1} of ${this.totalOriginalSlides}`;
    
    // Create or update live region
    let liveRegion = this.querySelector('[role="status"]');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'visually-hidden';
      this.appendChild(liveRegion);
    }
    
    liveRegion.textContent = announcement;
  }

  /**
   * Initialize Intersection Observer to pause when not visible
   */
  initializeIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            this.pauseAutoplay();
          } else if (!this.matches(':hover') && !this.matches(':focus-within')) {
            this.resumeAutoplay();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(this);
  }

  /**
   * Cleanup on disconnect
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopAutoplay();
  }
}

// Register the custom element
if (!customElements.get('logo-slider-component')) {
  customElements.define('logo-slider-component', LogoSlider);
}
