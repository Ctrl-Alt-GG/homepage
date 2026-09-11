(function () {
  'use strict';

  var SECOND = 1000;
  var MINUTE = 60 * SECOND;
  var HOUR = 60 * MINUTE;
  var DAY = 24 * HOUR;

  var bar = document.getElementById('cag-countdown-bar');
  if (!bar) return;

  var target = new Date(bar.dataset.countdownTarget).getTime();
  if (Number.isNaN(target)) {
    // The template refuses to emit an unparseable target, so this only fires if
    // something downstream mangled it. Leave the static date sentence standing.
    bar.dataset.cagCountdown = 'invalid';
    return;
  }

  var values = {};
  var labels = {};
  ['days', 'hours', 'minutes', 'seconds'].forEach(function (unit) {
    values[unit] = bar.querySelector('[data-countdown-value="' + unit + '"]');
    labels[unit] = bar.querySelector('[data-countdown-label="' + unit + '"]');
  });

  function render(unit, value) {
    var valueNode = values[unit];
    var labelNode = labels[unit];
    if (!valueNode) return;

    // Two digits keeps the row from reflowing as values tick down past ten.
    valueNode.textContent = value < 10 ? '0' + value : String(value);

    if (labelNode) {
      var word = value === 1 ? labelNode.dataset.one : labelNode.dataset.many;
      if (word && labelNode.textContent !== word) {
        labelNode.textContent = word;
      }
    }
  }

  var timer = null;

  function tick() {
    var remaining = target - Date.now();

    if (remaining <= 0) {
      bar.dataset.cagCountdown = 'complete';
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }
      return;
    }

    bar.dataset.cagCountdown = 'running';
    render('days', Math.floor(remaining / DAY));
    render('hours', Math.floor((remaining % DAY) / HOUR));
    render('minutes', Math.floor((remaining % HOUR) / MINUTE));
    render('seconds', Math.floor((remaining % MINUTE) / SECOND));
  }

  // Every tick recomputes from the clock rather than decrementing a counter,
  // so a throttled background tab or a sleeping laptop cannot drift.
  tick();
  timer = setInterval(tick, SECOND);

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) tick();
  });
})();
