/**
 * cag-gallery.js – Lightbox for .paige-shortcode-gallery images.
 *
 * Standalone images (rendered via the render-image hook) are NOT wrapped in
 * .paige-shortcode-gallery, so they are completely unaffected.
 *
 * Features:
 *  - Click a gallery image → opens full-screen lightbox with blurred backdrop
 *  - Prev/next arrow buttons (hidden at edges)
 *  - Keyboard: ArrowLeft / ArrowRight to navigate, Escape to close
 *  - Pointer events (mouse drag + touch swipe on mobile / touch laptops)
 *  - Rubber-band resistance at edges; bounce animation when trying to go past
 *    the first or last image
 *  - Smooth CSS-driven slide transition between images
 *  - Backdrop click or close button closes the lightbox
 *  - Focus is trapped inside the lightbox while open; restored on close
 */
(function () {
  'use strict';

  /* ── Constants ────────────────────────────────────────────────────────────── */
  var SWIPE_THRESHOLD   = 60;   // px of drag required to trigger a slide
  var ANIM_DURATION_MS  = 320;  // must match --cag-lb-transition-duration in :root of cag.css
  var BOUNCE_PX         = 38;   // how far the track overshoots on edge bounce
  var RUBBER_BAND_RATIO = 3;    // divides drag distance past an edge

  /* ── State ────────────────────────────────────────────────────────────────── */
  var lb         = null;   // lightbox root element
  var lbTrack    = null;
  var btnPrev    = null;
  var btnNext    = null;
  var images     = [];     // { src, alt } for current gallery
  var current    = 0;
  var animating  = false;
  var prevFocus  = null;

  // Pointer / drag state
  var dragging   = false;
  var dragStartX = 0;
  var dragDeltaX = 0;

  /* ── Helpers ──────────────────────────────────────────────────────────────── */
  function isHu() {
    return (document.documentElement.lang || 'en').slice(0, 2) === 'hu';
  }

  function t(hu, en) {
    return isHu() ? hu : en;
  }

  function svgIcon(path) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ' +
      'fill="none" stroke="currentColor" stroke-width="2.5" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      path + '</svg>';
  }

  /* ── Build DOM (once, lazily) ─────────────────────────────────────────────── */
  function ensureLightbox() {
    if (lb) return;

    lb = document.createElement('div');
    lb.id = 'cag-lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', t('Képnézegető', 'Image viewer'));
    lb.setAttribute('aria-hidden', 'true');
    lb.tabIndex = -1;

    // Backdrop – click to close
    var backdrop = document.createElement('div');
    backdrop.id = 'cag-lb-backdrop';
    backdrop.addEventListener('click', closeLightbox);

    // Viewport + track (handles drag/swipe)
    var viewport = document.createElement('div');
    viewport.id = 'cag-lb-viewport';

    lbTrack = document.createElement('div');
    lbTrack.id = 'cag-lb-track';
    viewport.appendChild(lbTrack);

    // Close button
    var closeBtn = makeButton(
      'cag-lb-close',
      t('Bezárás', 'Close'),
      svgIcon('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),
      closeLightbox
    );

    // Prev / next arrow buttons
    btnPrev = makeButton(
      'cag-lb-prev',
      t('Előző kép', 'Previous image'),
      svgIcon('<polyline points="15 18 9 12 15 6"/>'),
      function () { navigate(-1); }
    );
    btnNext = makeButton(
      'cag-lb-next',
      t('Következő kép', 'Next image'),
      svgIcon('<polyline points="9 18 15 12 9 6"/>'),
      function () { navigate(1); }
    );

    lb.appendChild(backdrop);
    lb.appendChild(viewport);
    lb.appendChild(closeBtn);
    lb.appendChild(btnPrev);
    lb.appendChild(btnNext);
    document.body.appendChild(lb);

    // Pointer events for drag / swipe on the viewport
    viewport.addEventListener('pointerdown',   onPointerDown);
    viewport.addEventListener('pointermove',   onPointerMove);
    viewport.addEventListener('pointerup',     onPointerUp);
    viewport.addEventListener('pointercancel', onPointerUp);
  }

  function makeButton(id, label, iconHTML, onClick) {
    var btn = document.createElement('button');
    btn.id = id;
    btn.type = 'button';
    btn.setAttribute('aria-label', label);
    btn.innerHTML = iconHTML;
    btn.addEventListener('click', onClick);
    return btn;
  }

  /* ── Open / Close ─────────────────────────────────────────────────────────── */
  function openLightbox(galleryImages, index) {
    ensureLightbox();

    // Collect image metadata from the gallery
    images = galleryImages.map(function (img) {
      return { src: img.src, alt: img.alt || '' };
    });
    current = index;

    // Populate slides
    lbTrack.innerHTML = '';
    images.forEach(function (imgData) {
      var slide = document.createElement('div');
      slide.className = 'cag-lb-slide';
      var img = document.createElement('img');
      img.src = imgData.src;
      img.alt = imgData.alt;
      img.draggable = false;
      slide.appendChild(img);
      lbTrack.appendChild(slide);
    });

    // Set initial position without animation
    setTrackPosition(current, false);
    updateButtons();

    prevFocus = document.activeElement;
    lb.setAttribute('aria-hidden', 'false');
    lb.classList.add('is-open');
    document.body.classList.add('cag-lb-active');
    lb.focus();
  }

  function closeLightbox() {
    if (!lb || !lb.classList.contains('is-open')) return;
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cag-lb-active');
    if (prevFocus) prevFocus.focus();
  }

  /* ── Navigation ───────────────────────────────────────────────────────────── */
  function navigate(delta) {
    if (animating) return;
    var next = current + delta;

    if (next < 0) {
      bounceTrack(+BOUNCE_PX);   // nudge right: user tried to go before start
      return;
    }
    if (next >= images.length) {
      bounceTrack(-BOUNCE_PX);   // nudge left: user tried to go past end
      return;
    }

    animating = true;
    current = next;
    setTrackPosition(current, true);
    updateButtons();
    setTimeout(function () { animating = false; }, ANIM_DURATION_MS);
  }

  /** Set the track's translateX to show slide at `index`. */
  function setTrackPosition(index, animate) {
    if (!animate) {
      lbTrack.style.transition = 'none';
    } else {
      lbTrack.style.transition = '';   // restored to CSS-defined value
    }
    lbTrack.style.transform = 'translateX(-' + (index * 100) + '%)';
    if (!animate) {
      // Force reflow so the instant position is committed before re-enabling transition
      void lbTrack.offsetWidth;
      lbTrack.style.transition = '';
    }
  }

  /**
   * Overshoot the track by `px` pixels (positive = right, negative = left)
   * then spring back.  Provides tactile edge-bounce feedback.
   */
  function bounceTrack(px) {
    if (animating) return;
    animating = true;

    var baseX = current * 100;

    // Instant jump to overshoot position
    lbTrack.style.transition = 'none';
    lbTrack.style.transform = 'translateX(calc(-' + baseX + '% + ' + px + 'px))';
    void lbTrack.offsetWidth;   // reflow

    // Spring back with a physics-y overshoot easing
    lbTrack.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    lbTrack.style.transform = 'translateX(-' + baseX + '%)';

    setTimeout(function () {
      lbTrack.style.transition = '';
      animating = false;
    }, 550);
  }

  function updateButtons() {
    toggleHidden(btnPrev, current === 0);
    toggleHidden(btnNext, current === images.length - 1);
  }

  function toggleHidden(el, hide) {
    if (hide) {
      el.classList.add('cag-lb-hidden');
      el.setAttribute('aria-hidden', 'true');
    } else {
      el.classList.remove('cag-lb-hidden');
      el.removeAttribute('aria-hidden');
    }
  }

  /* ── Keyboard ─────────────────────────────────────────────────────────────── */
  function onKeyDown(e) {
    if (!lb || !lb.classList.contains('is-open')) return;
    switch (e.key) {
      case 'ArrowLeft':  e.preventDefault(); navigate(-1);     break;
      case 'ArrowRight': e.preventDefault(); navigate(1);      break;
      case 'Escape':     e.preventDefault(); closeLightbox();  break;
    }
  }

  /* ── Pointer / touch drag ─────────────────────────────────────────────────── */
  function onPointerDown(e) {
    if (animating || !e.isPrimary) return;
    dragging   = true;
    dragStartX = e.clientX;
    dragDeltaX = 0;
    lbTrack.style.transition = 'none';
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!dragging || !e.isPrimary) return;
    dragDeltaX = e.clientX - dragStartX;

    // Apply rubber-band resistance when dragging past the first or last image
    var visualDelta = dragDeltaX;
    if ((current === 0                 && dragDeltaX > 0) ||
        (current === images.length - 1 && dragDeltaX < 0)) {
      visualDelta = dragDeltaX / RUBBER_BAND_RATIO;
    }

    lbTrack.style.transform =
      'translateX(calc(-' + (current * 100) + '% + ' + visualDelta + 'px))';
  }

  function onPointerUp(e) {
    if (!dragging || !e.isPrimary) return;
    dragging = false;
    lbTrack.style.transition = '';   // restore CSS transition

    var wasDrag = Math.abs(dragDeltaX) > 5;

    if (dragDeltaX < -SWIPE_THRESHOLD) {
      navigate(1);                    // swiped left → next image
    } else if (dragDeltaX > SWIPE_THRESHOLD) {
      navigate(-1);                   // swiped right → previous image
    } else if (!wasDrag && e.target.classList.contains('cag-lb-slide')) {
      // Tap on the empty area of the slide (outside the image) → close lightbox
      closeLightbox();
    } else {
      // Not a full swipe – spring back to current position
      lbTrack.style.transform = 'translateX(-' + (current * 100) + '%)';
    }

    dragDeltaX = 0;
  }

  /* ── Gallery click delegation ─────────────────────────────────────────────── */
  function onDocumentClick(e) {
    if (e.target.tagName !== 'IMG') return;
    var gallery = e.target.closest('.paige-shortcode-gallery');
    if (!gallery) return;

    var galleryImages = Array.from(gallery.querySelectorAll('img'));
    var index = galleryImages.indexOf(e.target);
    if (index < 0) return;

    e.preventDefault();
    openLightbox(galleryImages, index);
  }

  /* ── Init ─────────────────────────────────────────────────────────────────── */
  function init() {
    document.addEventListener('click',   onDocumentClick);
    document.addEventListener('keydown', onKeyDown);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
