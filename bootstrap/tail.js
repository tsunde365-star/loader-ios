(function () {
  'use strict';

  var plugin = null;

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

  function evalPlugin() {
    if (plugin) return plugin;
    try {
      if (typeof window.__larpPluginFactory === 'function') {
        plugin = window.__larpPluginFactory();
      }
    } catch (e) {
      try {
        alert('[Larp] plugin eval error: ' + e);
      } catch (e2) {}
      plugin = null;
    }
    return plugin;
  }

  waitForReady(25000).then(function (status) {
    if (!status.ok) {
      try {
        window.__larpState.readyErr = String(status.err);
      } catch (e) {}
      try {
        alert('[Larp] init failed: ' + status.err);
      } catch (e) {}
      return;
    }
    try {
      window.__larpState.phase = 'ready';
    } catch (e) {}
    try {
      try {
        var store = window.unbound.storage.getStore('larp');
        if (store.get('badges', undefined) === undefined) {
          store.set('badges', {
            staff: true,
            partner: true,
            hypesquad_events: true,
            early_supporter: true,
            active_developer: true,
            verified_developer: true,
            bug_hunter_2: true,
            premium_tenure_opal: true,
            guild_boost_24: true
          });
        }
      } catch (e2) {}
      var p = evalPlugin();
      if (!p || typeof p.start !== 'function') {
        alert('[Larp] plugin bundle missing or invalid');
        return;
      }
      window.__larpState.phase = 'started';
      window.__larpState.started = true;
      var tries = 0;
      function reStart() {
        tries++;
        if (tries > 6) return;
        try {
          p.start();
        } catch (e) {
          window.__larpState.startErr = String(e);
        }
        setTimeout(reStart, 5000);
      }
      p.start();
      setTimeout(reStart, 5000);
    } catch (e) {
      try {
        window.__larpState.startErr = String(e);
      } catch (e2) {}
      try {
        alert('[Larp] failed to start: ' + e);
      } catch (e3) {}
    }
  });
})();
