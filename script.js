/**
 * Sri Pratti Narayana Rao Garu Tribute Website
 * Lightweight Interactive Enhancements:
 * 1. Mobile Navigation Toggle
 * 2. Accessible, Touch-Enabled Historical Image Lightbox (Zero Dependencies)
 */

document.addEventListener('DOMContentLoaded', function () {
  console.log("Tribute website for Sri Pratti Narayana Rao Garu loaded.");

  /* ==========================================================================
     1. MOBILE NAVIGATION TOGGLE
     ========================================================================== */
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.header-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      const isExpanded = mainNav.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', function (e) {
      if (!navToggle.contains(e.target) && !mainNav.contains(e.target) && mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close mobile nav on escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ==========================================================================
     2. HISTORICAL IMAGE LIGHTBOX
     ========================================================================== */
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (galleryItems.length > 0) {
    // Collect all gallery image data
    const imagesData = [];
    galleryItems.forEach(function (item, index) {
      const img = item.querySelector('img');
      const caption = item.querySelector('figcaption');
      if (img) {
        imagesData.push({
          src: img.getAttribute('src'),
          alt: img.getAttribute('alt') || '',
          caption: caption ? caption.textContent.trim() : (img.getAttribute('alt') || '')
        });

        // Add accessible role and click listener
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', 'View photo: ' + (caption ? caption.textContent.trim() : 'Historical photo'));

        const openHandler = function () {
          openLightbox(index);
        };

        item.addEventListener('click', openHandler);
        item.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openHandler();
          }
        });
      }
    });

    // Create Lightbox DOM Elements
    let lightbox = document.getElementById('lightbox-modal');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'lightbox-modal';
      lightbox.className = 'lightbox-modal';
      lightbox.setAttribute('role', 'dialog');
      lightbox.setAttribute('aria-modal', 'true');
      lightbox.setAttribute('aria-label', 'Image preview lightbox');

      lightbox.innerHTML = `
        <button class="lightbox-btn lightbox-close-btn" aria-label="Close lightbox">&times;</button>
        <button class="lightbox-btn lightbox-prev-btn" aria-label="Previous image">&#8249;</button>
        <button class="lightbox-btn lightbox-next-btn" aria-label="Next image">&#8250;</button>
        <div class="lightbox-content-wrap">
          <img class="lightbox-img" src="" alt="" />
          <div class="lightbox-caption-bar">
            <div class="lightbox-caption-text"></div>
            <div class="lightbox-counter"></div>
          </div>
        </div>
      `;
      document.body.appendChild(lightbox);
    }

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const captionText = lightbox.querySelector('.lightbox-caption-text');
    const counterText = lightbox.querySelector('.lightbox-counter');
    const closeBtn = lightbox.querySelector('.lightbox-close-btn');
    const prevBtn = lightbox.querySelector('.lightbox-prev-btn');
    const nextBtn = lightbox.querySelector('.lightbox-next-btn');

    let currentIndex = 0;

    function updateLightbox(index) {
      if (index < 0) index = imagesData.length - 1;
      if (index >= imagesData.length) index = 0;
      currentIndex = index;

      const data = imagesData[currentIndex];
      lightboxImg.src = data.src;
      lightboxImg.alt = data.alt;
      captionText.textContent = data.caption;
      counterText.textContent = `Photograph ${currentIndex + 1} of ${imagesData.length}`;
    }

    function openLightbox(index) {
      updateLightbox(index);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      if (galleryItems[currentIndex]) {
        galleryItems[currentIndex].focus();
      }
    }

    function showNext() {
      updateLightbox(currentIndex + 1);
    }

    function showPrev() {
      updateLightbox(currentIndex - 1);
    }

    // Button Listeners
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    // Click outside image closes lightbox
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrap')) {
        closeLightbox();
      }
    });

    // Keyboard Navigation
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        showNext();
      } else if (e.key === 'ArrowLeft') {
        showPrev();
      }
    });

    // Touch Swipe Support for Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 45) {
        if (swipeDistance < 0) {
          showNext(); // Swipe left to see next
        } else {
          showPrev(); // Swipe right to see previous
        }
      }
    }
  }
});
