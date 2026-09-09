/**
 * cag-polaroid.js: full-screen viewer for polaroids rendered by the
 * cag/polaroid shortcode. Loaded only on pages that use the shortcode.
 *
 * The print is cloned rather than re-created, so the frame proportions,
 * caption and styling stay identical to the one in the page; only the tilt is
 * straightened, the size is driven off the viewport and the photo is swapped
 * for a larger source.
 *
 * All user-facing strings come from data attributes set by the shortcode, so
 * the script stays language agnostic and needs no per-locale build.
 */
(function () {
  'use strict';

  var SELECTOR = '[data-cag-polaroid]';

  var lb        = null;   // viewer root
  var stage     = null;   // holds the cloned print
  var closeBtn  = null;
  var prevFocus = null;

  function toSafeImageUrl(value) {
    if (!value) return null;
    try {
      var url = new URL(value, window.location.href);
      if (url.protocol === 'http:' || url.protocol === 'https:') return url.href;
    } catch (e) {
      return null;
    }
    return null;
  }

  function ensureViewer(labels) {
    if (lb) {
      lb.setAttribute('aria-label', labels.viewer);
      closeBtn.setAttribute('aria-label', labels.close);
      return;
    }

    lb = document.createElement('div');
    lb.id = 'cag-polaroid-lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', labels.viewer);
    lb.setAttribute('aria-hidden', 'true');
    lb.tabIndex = -1;

    var backdrop = document.createElement('div');
    backdrop.id = 'cag-polaroid-lb-backdrop';
    backdrop.addEventListener('click', close);

    stage = document.createElement('div');
    stage.id = 'cag-polaroid-lb-stage';

    closeBtn = document.createElement('button');
    closeBtn.id = 'cag-polaroid-lb-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', labels.close);
    closeBtn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="2.5" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true">' +
      '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    closeBtn.addEventListener('click', close);

    lb.appendChild(backdrop);
    lb.appendChild(stage);
    lb.appendChild(closeBtn);
    document.body.appendChild(lb);
  }

  function open(figure) {
    ensureViewer({
      viewer: figure.getAttribute('data-cag-polaroid-label') || 'Photo',
      close:  figure.getAttribute('data-cag-polaroid-close') || 'Close'
    });

    var clone = figure.cloneNode(true);
    ['data-cag-polaroid', 'data-cag-polaroid-full', 'data-cag-polaroid-label',
     'data-cag-polaroid-close', 'role', 'tabindex', 'aria-label'
    ].forEach(function (attr) { clone.removeAttribute(attr); });
    // The clone isn't clickable anymore, so drop the zoom-in cursor it inherited.
    clone.classList.remove('cursor-zoom-in');

    // Inline styles win over the utility classes carried over by the clone.
    clone.style.width = 'min(92vw, calc((100dvh - 3.5rem) * 88 / 107))';
    clone.style.rotate = '0deg';

    var img  = clone.querySelector('img');
    var full = toSafeImageUrl(figure.getAttribute('data-cag-polaroid-full'));
    if (img && full) {
      img.removeAttribute('srcset');
      img.removeAttribute('loading');
      img.removeAttribute('width');
      img.removeAttribute('height');
      img.src = full;
    }

    stage.innerHTML = '';
    stage.appendChild(clone);

    prevFocus = document.activeElement;
    lb.setAttribute('aria-hidden', 'false');
    lb.classList.add('is-open');
    document.body.classList.add('cag-lb-active');
    closeBtn.focus();
  }

  function close() {
    if (!lb || !lb.classList.contains('is-open')) return;
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cag-lb-active');
    if (prevFocus) prevFocus.focus();
  }

  function onClick(e) {
    var figure = e.target.closest ? e.target.closest(SELECTOR) : null;
    if (!figure) return;
    e.preventDefault();
    open(figure);
  }

  function onKeyDown(e) {
    if (lb && lb.classList.contains('is-open')) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
      return;
    }
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var figure = document.activeElement && document.activeElement.closest
      ? document.activeElement.closest(SELECTOR)
      : null;
    if (!figure) return;
    e.preventDefault();
    open(figure);
  }

  function init() {
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeyDown);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
