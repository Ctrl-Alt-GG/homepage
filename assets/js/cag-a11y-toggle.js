(function () {
  'use strict';

  var THEME_KEY = 'cag-theme';
  var SCHEME_KEY = 'cag-color-scheme';
  var SIZE_KEY = 'cag-text-size';
  var SIZES = ['sm', 'md', 'lg'];
  // Cycle order of the colour scheme button: back to "follow the system" last.
  var SCHEMES = ['auto', 'light', 'dark'];
  var root = document.documentElement;
  var announce = document.getElementById('cag-a11y-announce');

  // The two colour preferences are independent: high contrast is a temporary
  // overlay, the manual light/dark choice is what we fall back to when it is
  // switched off again (and the site-level default when there is no choice).
  var contrast = root.getAttribute('data-theme') === 'contrast';
  var scheme = readScheme();

  function readScheme() {
    var value = root.getAttribute('data-color-scheme');
    return value === 'light' || value === 'dark' ? value : 'auto';
  }

  function writeStorage(key, value) {
    try {
      if (value) {
        localStorage.setItem(key, value);
      } else {
        localStorage.removeItem(key);
      }
    } catch {}
  }

  function say(message) {
    if (announce && message) {
      announce.textContent = message;
    }
  }

  function applyTheme() {
    var fallback = root.dataset.defaultTheme;

    if (scheme === 'auto') {
      root.removeAttribute('data-color-scheme');
    } else {
      root.setAttribute('data-color-scheme', scheme);
    }

    if (contrast) {
      root.setAttribute('data-theme', 'contrast');
    } else if (scheme !== 'auto') {
      root.setAttribute('data-theme', scheme);
    } else if (fallback === 'dark' || fallback === 'light') {
      root.setAttribute('data-theme', fallback);
    } else {
      root.removeAttribute('data-theme');
    }
  }

  function initContrastToggle() {
    var btn = document.getElementById('cag-contrast-toggle');
    if (!btn) return;

    btn.addEventListener('click', function () {
      contrast = !contrast;
      applyTheme();
      writeStorage(THEME_KEY, contrast ? 'contrast' : null);
      btn.setAttribute('aria-pressed', String(contrast));
      say(btn.getAttribute(contrast ? 'data-announce-on' : 'data-announce-off'));
    });

    btn.setAttribute('aria-pressed', String(contrast));
  }

  function initThemeToggle() {
    var btn = document.getElementById('cag-theme-toggle');
    if (!btn) return;

    function sync() {
      var label = btn.getAttribute('data-label-' + scheme);
      if (label) {
        btn.setAttribute('aria-label', label);
        btn.setAttribute('title', label);
      }
    }

    btn.addEventListener('click', function () {
      scheme = SCHEMES[(SCHEMES.indexOf(scheme) + 1) % SCHEMES.length];
      applyTheme();
      writeStorage(SCHEME_KEY, scheme === 'auto' ? null : scheme);
      sync();
      say(btn.getAttribute('data-announce-' + scheme));
    });

    sync();
  }

  function initTextSize() {
    var group = document.getElementById('cag-text-size');
    if (!group) return;
    var buttons = group.querySelectorAll('[data-text-size]');

    function current() {
      var size = root.getAttribute('data-text-size');
      return SIZES.indexOf(size) === -1 ? 'md' : size;
    }

    function apply(size) {
      if (size === 'md') {
        root.removeAttribute('data-text-size');
      } else {
        root.setAttribute('data-text-size', size);
      }
      writeStorage(SIZE_KEY, size === 'md' ? null : size);
      buttons.forEach(function (button) {
        button.setAttribute('aria-pressed', String(button.dataset.textSize === size));
      });
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        apply(button.dataset.textSize);
      });
    });

    apply(current());
  }

  initContrastToggle();
  initThemeToggle();
  initTextSize();
})();
