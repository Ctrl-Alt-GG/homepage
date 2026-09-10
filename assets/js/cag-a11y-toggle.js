(function () {
  'use strict';

  var THEME_KEY = 'cag-theme';
  var SIZE_KEY = 'cag-text-size';
  var SIZES = ['sm', 'md', 'lg'];
  var root = document.documentElement;

  function writeStorage(key, value) {
    try {
      if (value) {
        localStorage.setItem(key, value);
      } else {
        localStorage.removeItem(key);
      }
    } catch {}
  }

  function initContrastToggle() {
    var btn = document.getElementById('cag-contrast-toggle');
    if (!btn) return;
    var announce = document.getElementById('cag-a11y-announce');

    function isContrast() {
      return root.getAttribute('data-theme') === 'contrast';
    }

    function sync() {
      btn.setAttribute('aria-pressed', String(isContrast()));
    }

    btn.addEventListener('click', function () {
      var next = !isContrast();
      if (next) {
        root.setAttribute('data-theme', 'contrast');
      } else if (root.dataset.defaultTheme === 'dark' || root.dataset.defaultTheme === 'light') {
        root.setAttribute('data-theme', root.dataset.defaultTheme);
      } else {
        root.removeAttribute('data-theme');
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
  initTextSize();
})();
