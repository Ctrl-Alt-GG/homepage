/**
 * cag-a11y-toggle.js: high-contrast theme + text-size controls.
 *
 * The actual pre-paint application of a stored preference lives in a tiny
 * inline script in head.html (must run before <body> to avoid a flash of
 * the default theme); this file only wires up the header controls once the
 * DOM is ready and keeps localStorage in sync with user interaction.
 */
(function () {
  'use strict';

  var THEME_KEY = 'cag-theme';
  var SIZE_KEY = 'cag-text-size';
  var SIZES = ['sm', 'md', 'lg'];

  function readStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      if (value) {
        localStorage.setItem(key, value);
      } else {
        localStorage.removeItem(key);
      }
    } catch (e) {}
  }

  function initContrastToggle() {
    var btn = document.getElementById('cag-contrast-toggle');
    if (!btn) return;
    var announce = document.getElementById('cag-a11y-announce');

    function isContrast() {
      return document.documentElement.getAttribute('data-theme') === 'contrast';
    }

    function sync() {
      btn.setAttribute('aria-pressed', String(isContrast()));
    }

    btn.addEventListener('click', function () {
      var next = !isContrast();
      if (next) {
        document.documentElement.setAttribute('data-theme', 'contrast');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      writeStorage(THEME_KEY, next ? 'contrast' : null);
      sync();
      if (announce) {
        announce.textContent = btn.getAttribute(next ? 'data-announce-on' : 'data-announce-off') || '';
      }
    });

    sync();
  }

  function initTextSize() {
    var group = document.getElementById('cag-text-size');
    if (!group) return;
    var buttons = group.querySelectorAll('[data-text-size]');

    function current() {
      var stored = readStorage(SIZE_KEY);
      return SIZES.indexOf(stored) === -1 ? 'md' : stored;
    }

    function apply(size) {
      if (size === 'md') {
        document.documentElement.removeAttribute('data-text-size');
      } else {
        document.documentElement.setAttribute('data-text-size', size);
      }
      writeStorage(SIZE_KEY, size === 'md' ? null : size);
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.textSize === size));
      });
    }

    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        apply(b.dataset.textSize);
      });
    });

    apply(current());
  }

  initContrastToggle();
  initTextSize();
})();
