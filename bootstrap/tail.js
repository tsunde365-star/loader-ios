
(function () {
  'use strict';

  function waitForReady(ms) {
    return new Promise(function (resolve) {
      if (!window.__larpBootstrapReady) {
        resolve({ ok: false, err: 'bootstrap not initialized' });
        return;
      }
      var done = false;
      var t0 = Date.now();
      (function poll() {
        window.__larpBootstrapReady
          .then(function (status) {
            done = true;
            resolve(status);
          })
          .catch(function (e) {
            done = true;
            resolve({ ok: false, err: String(e) });
          });
      })();
      setTimeout(function () {
        if (!done) resolve({ ok: false, err: 'timeout' });
      }, ms);
    });
  }

  function pluginObject() {
    if (typeof __larpPlugin === 'object' && __larpPlugin !== null) return __larpPlugin;
    return null;
  }

  waitForReady(25000).then(function (status) {
    if (!status.ok) {
      try {
        alert('[Larp] init failed: ' + status.err);
      } catch (e) {}
      return;
    }
    try {
      var plugin = pluginObject();
      if (!plugin || typeof plugin.start !== 'function') {
        alert('[Larp] plugin bundle missing or invalid');
        return;
      }
      plugin.start();
      var tries = 0;
      function reStart() {
        tries++;
        try {
          plugin.start();
        } catch (e) {}
        if (tries < 6) setTimeout(reStart, 5000);
      }
      setTimeout(reStart, 5000);
    } catch (e) {
      try {
        alert('[Larp] failed to start: ' + e);
      } catch (e2) {}
    }
  });
})();
