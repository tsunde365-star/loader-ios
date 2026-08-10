/* Larp standalone bootstrap - no Unbound client. Provides a minimal window.unbound API
 * (metro, patcher, storage, toasts, assets) on top of Discord's own module registry,
 * then the Larp plugin bundle is concatenated right after this file.
 */

(function () {
  'use strict';

  var modulesGlobal = null;

  function ensureModules() {
    if (modulesGlobal) return modulesGlobal;
    try {
      if (!globalThis.modules && typeof globalThis.__c === 'function') {
        globalThis.modules = globalThis.__c();
      }
      modulesGlobal = globalThis.modules;
    } catch (e) {
      modulesGlobal = globalThis.modules || null;
    }
    return modulesGlobal;
  }

  function registryIds() {
    var m = ensureModules();
    if (!m || typeof m.keys !== 'function') return [];
    try {
      return Array.from(m.keys());
    } catch (e) {
      return [];
    }
  }

  function exportsFor(id) {
    var m = ensureModules();
    try {
      if (m && typeof m.get === 'function') {
        var rec = m.get(id);
        if (rec && rec.isInitialized && rec.publicModule && rec.publicModule.exports) {
          return rec.publicModule.exports;
        }
      }
    } catch (e) {}
    return undefined;
  }

  function matchesFilter(filter, mdl, id) {
    try {
      return !!filter(mdl, id);
    } catch (e) {
      return false;
    }
  }

  function scan(filter, opts) {
    opts = opts || {};
    var interop = opts.interop !== false;
    var ids = registryIds();
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      var ex = exportsFor(id);
      if (!ex) continue;
      if (matchesFilter(filter, ex, id)) {
        return interop && ex.__esModule && ex.default ? ex.default : ex;
      }
      if (ex.default && matchesFilter(filter, ex.default, id)) {
        return interop ? ex.default : ex;
      }
    }
    return null;
  }

  var posCache = {};

  function cached(fn, keyArgs) {
    return function () {
      var key;
      try {
        key = keyArgs.apply(null, arguments);
      } catch (e) {}
      if (key && posCache[key] !== undefined) return posCache[key];
      var res = fn.apply(null, arguments);
      if (key && res) posCache[key] = res;
      return res;
    };
  }

  function findByProps() {
    var args = Array.prototype.slice.call(arguments);
    var opts = {};
    if (args.length && typeof args[args.length - 1] === 'object' && args[args.length - 1] !== null) {
      opts = args.pop();
    }
    var props = args;
    if (!props.length) return null;
    return scan(function (mdl) {
      for (var i = 0; i < props.length; i++) {
        if (mdl[props[i]] === undefined) return false;
      }
      return true;
    }, opts);
  }

  var findByPropsCached = cached(findByProps, function () {
    var a = Array.prototype.slice.call(arguments);
    return 'p::' + a.join('|');
  });

  function findByName(name, opts) {
    opts = opts || {};
    return scan(function (mdl) {
      return (
        mdl.name === name ||
        (mdl.default && mdl.default.name === name) ||
        mdl.displayName === name
      );
    }, opts);
  }

  var findByNameCached = cached(findByName, function (name) {
    return 'n::' + String(name);
  });

  function findStore(name, opts) {
    opts = opts || {};
    var short = opts.short !== false;
    var target = short ? name + 'Store' : name;
    return scan(function (mdl) {
      return mdl._dispatcher && typeof mdl.getName === 'function' && mdl.getName() === target;
    }, opts);
  }

  var findStoreCached = cached(findStore, function (name) {
    return 's::' + String(name);
  });

  function createPatcher(id) {
    var patches = [];

    function unpatchEntry(entry) {
      try {
        var target = entry[0];
        var key = entry[1];
        var orig = entry[2];
        if (target && key && target[key] && target[key].__larpWrapped === true) {
          Object.defineProperty(target, key, { value: orig, writable: true, configurable: true });
        }
      } catch (e) {}
    }

    function patch(target, key, kind, cb) {
      if (!target || key === undefined || typeof target[key] !== 'function') {
        return function () {};
      }
      var orig = target[key];
      var wrapped = function () {
        var args = Array.prototype.slice.call(arguments);
        var ctx = { args: args, thisObject: this, methodName: String(key), target: target };
        if (kind === 'before') {
          cb.call(this, ctx);
          return orig.apply(this, args);
        }
        if (kind === 'instead') {
          return cb.call(this, ctx, function () {
            return orig.apply(this, args);
          });
        }
        var result = orig.apply(this, args);
        ctx.result = result;
        return cb.call(this, ctx);
      };
      wrapped.__larpWrapped = true;
      try {
        Object.defineProperty(target, key, { value: wrapped, writable: true, configurable: true });
      } catch (e) {
        try {
          target[key] = wrapped;
        } catch (e2) {
          return function () {};
        }
      }
      patches.push([target, key, orig]);
      return function () {
        unpatchEntry([target, key, orig]);
      };
    }

    return {
      after: function (t, k, c) {
        return patch(t, k, 'after', c);
      },
      before: function (t, k, c) {
        return patch(t, k, 'before', c);
      },
      instead: function (t, k, c) {
        return patch(t, k, 'instead', c);
      },
      unpatchAll: function () {
        for (var i = 0; i < patches.length; i++) unpatchEntry(patches[i]);
        patches.length = 0;
      }
    };
  }

  var storageMem = new Map();
  var AsyncStorage = null;

  function findAsyncStorage() {
    if (AsyncStorage) return AsyncStorage;
    AsyncStorage =
      findByPropsCached('setItem', 'getItem', 'removeItem', 'multiSet', 'multiGet') ||
      findByPropsCached('setItem', 'getItem');
    return AsyncStorage;
  }

  function getStore(id) {
    return {
      get: function (key, def) {
        var k = id + ':' + key;
        return storageMem.has(k) ? storageMem.get(k) : def;
      },
      set: function (key, val) {
        var k = id + ':' + key;
        storageMem.set(k, val);
        try {
          var as = findAsyncStorage();
          if (as && typeof as.setItem === 'function') {
            as.setItem('larp:' + k, JSON.stringify({ v: val }));
          }
        } catch (e) {}
      }
    };
  }

  function restoreStorage() {
    return new Promise(function (resolve) {
      try {
        var as = findAsyncStorage();
        if (!as || typeof as.getAllKeys !== 'function' || typeof as.multiGet !== 'function') {
          resolve();
          return;
        }
        as.getAllKeys().then(function (allKeys) {
          var keys = [];
          for (var i = 0; i < allKeys.length; i++) {
            if (typeof allKeys[i] === 'string' && allKeys[i].indexOf('larp:') === 0) keys.push(allKeys[i]);
          }
          if (!keys.length) {
            resolve();
            return;
          }
          return as.multiGet(keys).then(function (pairs) {
            for (var j = 0; j < pairs.length; j++) {
              var pair = pairs[j];
              if (!pair || !pair[0] || pair[1] === null || pair[1] === undefined) continue;
              try {
                var obj = JSON.parse(pair[1]);
                if (obj && 'v' in obj) {
                  storageMem.set(pair[0].replace(/^larp:/, ''), obj.v);
                }
              } catch (e) {}
            }
            resolve();
          });
        });
      } catch (e) {
        resolve();
      }
    });
  }

  function showToast(opts) {
    try {
      opts = opts || {};
      var toast = findByPropsCached('showToast');
      if (toast && typeof toast.showToast === 'function') {
        toast.showToast(opts.content, opts.icon);
      }
    } catch (e) {}
  }

  function getAssetIDByName(name, type) {
    try {
      var assets = findByPropsCached('getIDByName');
      if (assets && typeof assets.getIDByName === 'function') {
        return assets.getIDByName(name, type);
      }
    } catch (e) {}
    return undefined;
  }

  var common = { React: null, ReactNative: null };

  var metro = {
    common: common,
    findByName: findByNameCached,
    findByProps: findByPropsCached,
    findByPropsId: function () {
      return null;
    },
    findStore: findStoreCached
  };

  window.unbound = {
    metro: metro,
    patcher: { createPatcher: createPatcher },
    storage: { getStore: getStore },
    toasts: { showToast: showToast },
    assets: { getIDByName: getAssetIDByName }
  };
  globalThis.unbound = window.unbound;

  function sleep(ms) {
    return new Promise(function (r) {
      setTimeout(r, ms);
    });
  }

  window.__larpBootstrapReady = (async function init() {
    var t0 = Date.now();
    var React = null;
    var RN = null;
    while (Date.now() - t0 < 20000) {
      React = findByPropsCached('createElement', 'createContext', 'useState', 'useEffect');
      RN = findByPropsCached('View', 'Text', 'StyleSheet', 'AppState');
      if (React && RN) break;
      await sleep(300);
    }
    common.React = React;
    common.ReactNative = RN;
    try {
      await restoreStorage();
    } catch (e) {}
    return { ok: !!(React && RN), err: React && RN ? null : 'react/rn not found' };
  })();
})();

var __larpPlugin =
