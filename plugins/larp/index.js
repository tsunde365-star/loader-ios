(function () {
'use strict';
const { metro, patcher, storage, toasts, assets } = window.unbound;
const LARP_UI_TAG = 'v12.0.0';

const React = metro.common.React;
const RN = metro.common.ReactNative;
const View = RN.View;
const Text = RN.Text;
const TextInput = RN.TextInput;
const ScrollView = RN.ScrollView;
const Pressable = RN.Pressable || RN.TouchableOpacity;

function findByStoreName(name) {
  if (name === 'UserStore') return metro.findStore('User');
  if (name === 'UserProfileStore') return metro.findStore('UserProfile');
  if (name === 'UserProfileStoreV2') return metro.findStore('UserProfileV2');
  if (name === 'GuildMemberProfileStore') return metro.findStore('GuildMemberProfile');
  return metro.findStore(name.replace(/Store$/, ''));
}

function getAssetIDByName(name) {
  try {
    const svg = assets.getIDByName(name, 'svg');
    if (svg != null) return svg;
    return assets.getIDByName(name, 'png');
  } catch (_e) {
    return undefined;
  }
}

function showToast(content, iconName) {
  try {
    toasts.showToast({ content: content, icon: iconName ? getAssetIDByName(iconName) : undefined });
  } catch (_e) {}
}

const store = storage.getStore('larp');

function sg(key, def) {
  return store.get(key, def);
}

function ss(key, val) {
  store.set(key, val);
}

(function initDefaults() {
  if (sg('badges', undefined) === undefined) ss('badges', {});
  if (sg('hideNative', undefined) === undefined) ss('hideNative', {});
  if (sg('otherProfiles', undefined) === undefined) ss('otherProfiles', []);
})();

var CDN = 'https://cdn.discordapp.com/badge-icons';
var ICON_EMERALD = '11e2d339068b55d3a506cff34d3780f3';
var ICON_RUBY = 'cd5e2cfd9d7f27a8cdcd3e8a8d5dc9f4';
var ICON_OPAL = '5b154df19c53dce2af92c9b61e6be5e2';

var BADGES = [
  { id: 'staff',                   label: 'Discord Staff',            asset: 'StaffBadge',                       url: CDN + '/5e74e9b61934fc1f67c65515d1f7e60d.png' },
  { id: 'partner',                 label: 'Discord Partner',          asset: 'DiscordPartnerBadge',              url: CDN + '/3f9748e53446a137a052f3454e2de41e.png' },
  { id: 'moderator',               label: 'Certified Moderator',      asset: 'DiscordCertifiedModeratorBadge',   url: CDN + '/fee1624003e2fee35cb398e125dc479b.png' },
  { id: 'hypesquad_events',        label: 'HypeSquad Events',         asset: 'HypeSquadEventsBadge',             url: CDN + '/bf01d1073931f921909045f3a39fd264.png' },
  { id: 'hypesquad_bravery',       label: 'HypeSquad Bravery',        asset: 'HypeSquadBraveryBadge',            url: CDN + '/8a88d63823d8a71cd5e390baa45efa02.png' },
  { id: 'hypesquad_brilliance',    label: 'HypeSquad Brilliance',     asset: 'HypeSquadBrillianceBadge',         url: CDN + '/011940fd013da3f7fb926e4a1cd2e618.png' },
  { id: 'hypesquad_balance',       label: 'HypeSquad Balance',        asset: 'HypeSquadBalanceBadge',            url: CDN + '/3aa41de486fa12454c3761e8e223442e.png' },
  { id: 'bug_hunter_1',            label: 'Bug Hunter Level 1',       asset: 'BugHunterLevel1Badge',             url: CDN + '/2717692c7dca7289b35297368a940dd0.png' },
  { id: 'bug_hunter_2',            label: 'Bug Hunter Level 2',       asset: 'BugHunterLevel2Badge',             url: CDN + '/848f79194d4be5ff5f81505cbd0ce1e6.png' },
  { id: 'active_developer',        label: 'Active Developer',         asset: 'ActiveDeveloperBadge',             url: CDN + '/6bdc42827a38498929a4920da12695d9.png' },
  { id: 'verified_developer',      label: 'Early Verified Bot Dev',   asset: 'VerifiedDeveloperBadge',           url: CDN + '/6df5892e0f35b051f8b61eace34f4967.png' },
  { id: 'early_supporter',         label: 'Early Supporter',          asset: 'EarlySupporterBadge',              url: CDN + '/7060786766c9c840eb3019e725d2b358.png' },
  {
    id: 'premium',
    label: 'Discord Nitro (generic icon)',
    assetCandidates: ['NitroSubscriberBadge', 'NitroSubscriber', 'PremiumSubscriberBadge', 'SubscriberBadge'],
    url: CDN + '/2ba85e8026a8614b640c2837bcdfe21b.png'
  },
  { id: 'premium_tenure_3_month',  label: 'Nitro · ~3 mo (bronze)',   assetCandidates: ['NitroBronzeBadge', 'NitroBronze', 'premium_tenure_03_month_v2'], url: CDN + '/6de6d34650760ba5551a79732e98ed60.png' },
  { id: 'premium_tenure_6_month',  label: 'Nitro · ~6 mo (silver)',   assetCandidates: ['NitroSilverBadge', 'NitroSilver', 'premium_tenure_06_month_v2'], url: CDN + '/6de6d34650760ba5551a79732e98ed60.png' },
  { id: 'premium_tenure_12_month', label: 'Nitro · ~12 mo (gold)',    assetCandidates: ['NitroGoldBadge', 'NitroGold', 'premium_tenure_12_month_v2'], url: CDN + '/d92998916f4ce6f74de7da0a37b8d740.png' },
  { id: 'premium_tenure_24_month', label: 'Nitro · ~24 mo (platinum)', assetCandidates: ['NitroPlatinumBadge', 'NitroPlatinum', 'premium_tenure_24_month_v2'], url: CDN + '/9d4f73ca6df09bc63a39ea84d5fd0ff5.png' },
  { id: 'premium_tenure_36_month', label: 'Nitro · ~36 mo (diamond)', assetCandidates: ['NitroDiamondBadge', 'NitroDiamond', 'premium_tenure_36_month_v2'], url: CDN + '/65d6d6df9d56b8c3f4b3b1f3e4f3a0c8.png' },
  {
    id: 'premium_tenure_emerald',
    label: 'Nitro · Emerald (36 mo.)',
    assetCandidates: ['NitroEmeraldBadge', 'NitroEmerald', 'EmeraldNitroBadge', 'premium_tenure_36_month_v2'],
    url: CDN + '/' + ICON_EMERALD + '.png'
  },
  {
    id: 'premium_tenure_ruby',
    label: 'Nitro · Ruby (60 mo.)',
    assetCandidates: ['NitroRubyBadge', 'NitroRuby', 'RubyNitroBadge', 'premium_tenure_60_month_v2'],
    url: CDN + '/' + ICON_RUBY + '.png'
  },
  {
    id: 'premium_tenure_opal',
    label: 'Nitro · Opal (72+ mo)',
    assetCandidates: ['NitroOpalBadge', 'NitroOpal', 'NitroFireBadge', 'FireNitroBadge', 'premium_tenure_72_month_v2'],
    url: CDN + '/' + ICON_OPAL + '.png'
  },
  {
    id: 'guild_boost_12',
    label: 'Server boost · ~12 mo',
    assetCandidates: [
      'GuildBoosterLevel6Badge',
      'GuildBoosterBadgeTier6',
      'PremiumGuildSubscriberBadgeTier6',
      'guild_booster_lvl6'
    ],
    url: CDN + '/991c9f39ee33d7537d9f408c3e53141e.png'
  },
  {
    id: 'guild_boost_24',
    label: 'Server boost · ~24 mo',
    assetCandidates: [
      'GuildBoosterLevel9Badge',
      'GuildBoosterBadgeTier9',
      'PremiumGuildSubscriberBadgeTier9',
      'guild_booster_lvl9'
    ],
    url: CDN + '/ec92202290b48d0879b7413d2dde3bab.png'
  },
  { id: 'bot_commands',            label: 'Supports Commands',        asset: 'BotCommandsBadge',                 url: CDN + '/6f9e37f9029ff57aef81db857890005e.png' },
  { id: 'automod',                 label: 'Uses AutoMod',             asset: 'AutoModBadge',                     url: CDN + '/f2459b691ac7453ed6039bbcfaccbfcd.png' },
  { id: 'legacy_username',         label: 'Originally Known As',      asset: 'LegacyUsernameBadge',              url: CDN + '/6de6d34650760ba5551a79732e98ed60.png' },
  { id: 'quest',                   label: 'Completed a Quest',        asset: 'QuestBadge',                       url: CDN + '/7d9ae358c8c5e118768335dbe68b4fb8.png' }
];

var QUEST_BADGE_ICON_HASH = '7d9ae358c8c5e118768335dbe68b4fb8';
var ORB_BADGE_ICON_HASH = '83d8a1eb09a8d64e59233eec5d4d5c2d';
var LEVEL_LEAF_ICON_HASH = 'ca105ad9cfc8580c765101d17bbb2323';

var NITRO_LARP_ORDER = [
  'premium_tenure_opal',
  'premium_tenure_ruby',
  'premium_tenure_emerald',
  'premium_tenure_36_month',
  'premium_tenure_24_month',
  'premium_tenure_12_month',
  'premium_tenure_6_month',
  'premium_tenure_3_month',
  'premium'
];
var NITRO_LARP_SET = {};
for (var _ni = 0; _ni < NITRO_LARP_ORDER.length; _ni++) {
  NITRO_LARP_SET[NITRO_LARP_ORDER[_ni]] = true;
}

var BOOST_LARP_ORDER = ['guild_boost_24', 'guild_boost_12'];
var BOOST_LARP_SET = {};
for (var _bi0 = 0; _bi0 < BOOST_LARP_ORDER.length; _bi0++) {
  BOOST_LARP_SET[BOOST_LARP_ORDER[_bi0]] = true;
}

var NITRO_NATIVE_ASSET_NAMES = [
  'NitroSubscriberBadge',
  'NitroSubscriber',
  'PremiumSubscriberBadge',
  'SubscriberBadge',
  'NitroBronzeBadge',
  'NitroBronze',
  'NitroSilverBadge',
  'NitroSilver',
  'NitroGoldBadge',
  'NitroGold',
  'NitroPlatinumBadge',
  'NitroPlatinum',
  'NitroDiamondBadge',
  'NitroDiamond',
  'NitroEmeraldBadge',
  'NitroEmerald',
  'EmeraldNitroBadge',
  'NitroRubyBadge',
  'NitroRuby',
  'RubyNitroBadge',
  'NitroOpalBadge',
  'NitroOpal',
  'NitroFireBadge',
  'FireNitroBadge',
  'PremiumTenureBadge',
  'ProfilePremiumBadge',
  'ProfileNitroBadge',
  'TenureBadge',
  'premium_tenure_03_month_v2',
  'premium_tenure_06_month_v2',
  'premium_tenure_12_month_v2',
  'premium_tenure_24_month_v2',
  'premium_tenure_36_month_v2',
  'premium_tenure_60_month_v2',
  'premium_tenure_72_month_v2'
];

var LARP_BADGE_META = {};
for (var _bi = 0; _bi < BADGES.length; _bi++) {
  var _bb = BADGES[_bi];
  var _entry = { uri: _bb.url, label: _bb.label };
  LARP_BADGE_META['larp-' + _bb.id] = _entry;
}

function makeBadgePayload(b) {
  var idOut = 'larp-' + b.id;
  if (NITRO_LARP_SET[b.id] || BOOST_LARP_SET[b.id]) {
    return { id: idOut, description: b.label, icon: ' ' };
  }
  var assetNum = firstResolvedAsset(collectAssetNames(b));
  var uri = b.url;
  var base = { id: idOut, description: b.label };
  if (assetNum != null) {
    base.icon = assetNum;
    base.source = assetNum;
  } else {
    base.icon = uri;
    base.uri = uri;
    base.source = { uri: uri };
  }
  return base;
}

function collectAssetNames(b) {
  var out = [];
  if (b.assetCandidates) {
    for (var _ci = 0; _ci < b.assetCandidates.length; _ci++) {
      out.push(b.assetCandidates[_ci]);
    }
  }
  if (b.asset) out.push(b.asset);
  return out;
}

function firstResolvedAsset(names) {
  if (!names || !names.length) return null;
  for (var _ai = 0; _ai < names.length; _ai++) {
    try {
      var _id = getAssetIDByName(names[_ai]);
      var _num =
        typeof _id === 'number'
          ? _id
          : typeof _id === 'string'
            ? parseInt(_id, 10)
            : NaN;
      if (!isNaN(_num) && isFinite(_num)) return _num;
    } catch (_e) {}
  }
  return null;
}

function getEnabledNitroLarpIdFromMap(bm) {
  if (!bm || typeof bm !== 'object') return null;
  for (var _ti = 0; _ti < NITRO_LARP_ORDER.length; _ti++) {
    var tid = NITRO_LARP_ORDER[_ti];
    if (bm[tid]) return tid;
  }
  return null;
}

function getEnabledBoostLarpIdFromMap(bm) {
  if (!bm || typeof bm !== 'object') return null;
  for (var _bj = 0; _bj < BOOST_LARP_ORDER.length; _bj++) {
    var bid = BOOST_LARP_ORDER[_bj];
    if (bm[bid]) return bid;
  }
  return null;
}

function getEnabledNitroLarpId() {
  return getEnabledNitroLarpIdFromMap(getBadgesMap());
}

function getEnabledBoostLarpId() {
  return getEnabledBoostLarpIdFromMap(getBadgesMap());
}

function nativeBoostCount(arr) {
  var c = 0;
  for (var _bk = 0; _bk < arr.length; _bk++) {
    if (isGuildBoostBadge(arr[_bk])) c++;
  }
  return c;
}

function badgeHaystack(b) {
  if (!b) return '';
  var bits = [
    String(b.id || ''),
    String(b.description || ''),
    String(b.tooltip || ''),
    String(b.icon != null ? b.icon : '')
  ];
  try {
    if (b.link != null) bits.push(JSON.stringify(b.link));
  } catch (_e0) {}
  try {
    if (b.source != null) bits.push(JSON.stringify(b.source));
  } catch (_e1) {}
  return bits.join('\n').toLowerCase();
}

var LARP_ICON_IDS_QUEST = {};
var LARP_ICON_IDS_ORB = {};
var LARP_ICON_IDS_NITRO = {};

function addAssetNamesToIconSet(nameList, setObj) {
  if (!nameList || !nameList.length) return;
  var xi;
  for (xi = 0; xi < nameList.length; xi++) {
    try {
      var _aid = getAssetIDByName(nameList[xi]);
      var _n =
        typeof _aid === 'number'
          ? _aid
          : typeof _aid === 'string'
            ? parseInt(_aid, 10)
            : NaN;
      if (!isNaN(_n) && isFinite(_n)) setObj[String(_n)] = true;
    } catch (_x) {}
  }
}

function warmLarpIconAssetCache() {
  try {
    addAssetNamesToIconSet(
      ['QuestBadge', 'QuestCompletedBadge', 'QuestCompletedProfileBadge', 'ProfileQuestBadge'],
      LARP_ICON_IDS_QUEST
    );
    addAssetNamesToIconSet(
      ['OrbProfileBadge', 'CollectedOrbProfileBadge', 'ProfileOrbBadge', 'OrbBadge'],
      LARP_ICON_IDS_ORB
    );
    addAssetNamesToIconSet(NITRO_NATIVE_ASSET_NAMES, LARP_ICON_IDS_NITRO);
  } catch (_w) {}
}

function iconIdInSet(b, setObj) {
  if (!b || b.icon == null || !setObj) return false;
  return !!setObj[String(b.icon)];
}

function shouldHideNativeBadge(b) {
  if (!b) return false;
  if (String(b.id || '').indexOf('larp-') === 0) return false;
  var h = sg('hideNative', {}) || {};
  var id = String(b.id || '').toLowerCase();
  var desc = String(b.description || b.tooltip || '').toLowerCase();
  var hay = '';
  if (h.quest || h.orb || h.levelLeaf || (h.idSubstrings && String(h.idSubstrings).trim())) {
    hay = badgeHaystack(b);
  }

  if (h.quest) {
    if (id.indexOf('quest') !== -1 || desc.indexOf('quest') !== -1) return true;
    if (hay && hay.indexOf(QUEST_BADGE_ICON_HASH) !== -1) return true;
    if (iconIdInSet(b, LARP_ICON_IDS_QUEST)) return true;
  }
  if (h.orb) {
    if (id.indexOf('orb') !== -1 || desc.indexOf('orb profile') !== -1 || desc.indexOf('collected the orb') !== -1) {
      return true;
    }
    if (hay && hay.indexOf(ORB_BADGE_ICON_HASH) !== -1) return true;
    if (iconIdInSet(b, LARP_ICON_IDS_ORB)) return true;
  }
  if (h.nitro && isNativeNitroLike(b)) return true;
  if (h.boost && isGuildBoostBadge(b)) return true;
  if (h.levelLeaf) {
    if (hay && hay.indexOf(LEVEL_LEAF_ICON_HASH) !== -1) return true;
    if (id.indexOf('april_fool') !== -1 || id.indexOf('aprilfool') !== -1) return true;
    if (/\blevel\b\s*\d+\s*reached/i.test(desc) || /\breached\b.*\blevel\b/i.test(desc)) return true;
    if (/niveau.*atteint|atteint.*niveau/i.test(desc)) return true;
  }
  if (
    h.legacyUsername &&
    (id.indexOf('legacy_username') !== -1 ||
      id.indexOf('originally_known') !== -1 ||
      desc.indexOf('originally known') !== -1)
  ) {
    return true;
  }
  var raw = String(h.idSubstrings || '').trim().toLowerCase();
  if (raw) {
    var parts = raw.split(/[\s,;]+/);
    for (var _hp = 0; _hp < parts.length; _hp++) {
      var frag = parts[_hp];
      if (frag && id.indexOf(frag) !== -1) return true;
    }
  }
  return false;
}

function isGuildBoostBadge(b) {
  if (!b) return false;
  var id = String(b.id || '').toLowerCase();
  var desc = String(b.description || '').toLowerCase();
  if (id.indexOf('guild_booster') !== -1) return true;
  if (id.indexOf('premium_guild') !== -1) return true;
  if (desc.indexOf('server boost') !== -1) return true;
  if (desc.indexOf('guild boost') !== -1) return true;
  if (desc.indexOf('boosting') !== -1 && desc.indexOf('nitro') === -1) return true;
  return false;
}

function isNativeNitroLike(b) {
  if (!b) return false;
  if (String(b.id || '').indexOf('larp-') === 0) return false;
  if (isGuildBoostBadge(b)) return false;
  var id = String(b.id || '').toLowerCase();
  var desc = String(b.description || '').toLowerCase();
  if (id.indexOf('premium_tenure') !== -1 && id.indexOf('guild') === -1) return true;
  if (id.indexOf('premium_since') !== -1 && id.indexOf('guild') === -1) return true;
  if (id.indexOf('nitro') !== -1 && id.indexOf('guild') === -1) return true;
  if (id.indexOf('premium') !== -1 && id.indexOf('guild') === -1) return true;
  if (id.indexOf('subscriber') !== -1 && desc.indexOf('nitro') !== -1) return true;
  if (desc.indexOf('discord nitro') !== -1) return true;
  if (desc.indexOf('nitro') !== -1 && /subscriber|since|month|year|tenure|bronze|silver|gold|platinum|diamond|emerald|ruby|opal|classic|basic/i.test(desc)) {
    return true;
  }
  if (iconIdInSet(b, LARP_ICON_IDS_NITRO)) return true;
  return false;
}

function nativeNitroCount(arr) {
  var c = 0;
  for (var _nj = 0; _nj < arr.length; _nj++) {
    if (isNativeNitroLike(arr[_nj])) c++;
  }
  return c;
}

function isNitroBadgeRow(b, nitroPayload) {
  if (!b) return false;
  if (nitroPayload != null && String(b.id) === String(nitroPayload.id)) return true;
  if (nitroPayload == null && isNativeNitroLike(b)) return true;
  return false;
}

function isBoostBadgeRow(b, boostPayload) {
  if (!b) return false;
  if (boostPayload != null && String(b.id) === String(boostPayload.id)) return true;
  if (boostPayload == null && isGuildBoostBadge(b)) return true;
  return false;
}

function plateRank(b, nitroPayload, boostPayload) {
  if (!b) return 999;
  if (isNitroBadgeRow(b, nitroPayload)) return 0;

  var id = String(b.id || '').toLowerCase();
  var desc = String(b.description || '').toLowerCase();

  if (id === 'staff' || id.indexOf('larp-staff') === 0 || desc.indexOf('discord staff') !== -1) {
    return 10;
  }
  if (id.indexOf('larp-partner') === 0 || (id.indexOf('partner') !== -1 && id.indexOf('application_guild') === -1)) {
    return 20;
  }
  if (
    id.indexOf('larp-hypesquad_events') === 0 ||
    id === 'hypesquad' ||
    id.indexOf('hypesquad_events') !== -1 ||
    (desc.indexOf('hypesquad') !== -1 && desc.indexOf('house') === -1 && desc.indexOf('bravery') === -1 && desc.indexOf('brilliance') === -1 && desc.indexOf('balance') === -1)
  ) {
    return 30;
  }
  if (
    id.indexOf('larp-active_developer') === 0 ||
    id.indexOf('larp-verified_developer') === 0 ||
    id.indexOf('active_developer') !== -1 ||
    id.indexOf('verified_developer') !== -1 ||
    desc.indexOf('active developer') !== -1 ||
    desc.indexOf('early verified bot') !== -1
  ) {
    return 40;
  }
  if (id.indexOf('larp-early_supporter') === 0 || id.indexOf('early_supporter') !== -1 || desc.indexOf('early supporter') !== -1) {
    return 50;
  }
  if (isBoostBadgeRow(b, boostPayload)) return 60;

  return 100;
}

function openLarpNitroBoostSheet(innerId, meta) {
  var isBoost = BOOST_LARP_SET[innerId];
  var title = isBoost ? 'Boost' : 'Nitro';
  var body = meta.label + '\n\n' + 'Local preview only (Larp).';
  try {
    var buttons = [
      { text: 'OK', onPress: function () {} }
    ];
    if (!isBoost) {
      buttons.push({
        text: 'discord.com/nitro',
        onPress: function () {
          try {
            if (RN.Linking && typeof RN.Linking.openURL === 'function') {
              RN.Linking.openURL('https://discord.com/nitro');
            }
          } catch (_lk) {}
        }
      });
    }
    RN.Alert.alert(title, body, buttons);
  } catch (_al) {
    try {
      showToast(meta.label, 'Nitro');
    } catch (_t) {}
  }
}

var larpPatcher = patcher.createPatcher('larp');
var __larpInsideUserStoreWrap = false;
var __larpProfileStorePatched = {};
var UserStoreRef = null;

var __larpGetUserCache = new Map();
var __larpGetUserCacheQueue = [];
var LARP_GET_USER_CACHE_MAX = 320;

function clearLarpGetUserCache() {
  __larpGetUserCache.clear();
  __larpGetUserCacheQueue.length = 0;
}

function cachedGetUser(uid) {
  if (uid == null || !UserStoreRef || typeof UserStoreRef.getUser !== 'function') return null;
  var k = String(uid);
  if (__larpGetUserCache.has(k)) return __larpGetUserCache.get(k);
  var gu = null;
  try {
    gu = UserStoreRef.getUser(k);
  } catch (_cg) {}
  if (gu == null) return null;
  __larpGetUserCache.set(k, gu);
  __larpGetUserCacheQueue.push(k);
  while (__larpGetUserCacheQueue.length > LARP_GET_USER_CACHE_MAX) {
    var rem = __larpGetUserCacheQueue.shift();
    __larpGetUserCache.delete(rem);
  }
  return gu;
}

function normName(s) {
  if (s == null || typeof s !== 'string') return '';
  var t = s.trim();
  if (t.charAt(0) === '@') t = t.slice(1);
  return t.toLowerCase();
}

function usernameMatchesSpoofPair(pun, matchUsername, replaceUsername) {
  if (!pun) return false;
  var m = normName(matchUsername || '');
  var r = normName((replaceUsername || '').trim());
  if (!m || !r) return false;
  return pun === m || pun === r;
}

function parseAccountDateIsoMs(s) {
  if (s == null || typeof s !== 'string') return null;
  var t = s.trim();
  if (!t) return null;
  var d = Date.parse(t);
  if (!isNaN(d)) return d;
  var fr = t.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/);
  if (fr) {
    var day = parseInt(fr[1], 10);
    var mon = parseInt(fr[2], 10) - 1;
    var yr = parseInt(fr[3], 10);
    var hr = fr[4] != null ? parseInt(fr[4], 10) : 12;
    var mn = fr[5] != null ? parseInt(fr[5], 10) : 0;
    var u = Date.UTC(yr, mon, day, hr, mn, 0, 0);
    if (!isNaN(u)) return u;
  }
  return null;
}

function getBadgesMap() {
  var b = sg('badges', {});
  if (!b || typeof b !== 'object') return {};
  return b;
}

function hasAnyBadgesInMap(bm) {
  if (!bm || typeof bm !== 'object') return false;
  for (var hk in bm) {
    if (bm[hk]) return true;
  }
  return false;
}

function findSpoofEntryForBadges(uid, profileUser) {
  var pun = profileUser && normName(profileUser.username || '');
  var cur = UserStoreRef && UserStoreRef.getCurrentUser && UserStoreRef.getCurrentUser();
  var curId = cur && cur.id;
  var others = sg('otherProfiles', []);
  if (!Array.isArray(others)) others = [];
  var oi;
  for (oi = 0; oi < others.length; oi++) {
    var op = others[oi] || {};
    if (op.userId && uid != null && String(op.userId) === String(uid)) {
      return { badgesMap: op.badges && typeof op.badges === 'object' ? op.badges : {} };
    }
  }
  for (oi = 0; oi < others.length; oi++) {
    var op2 = others[oi] || {};
    if (pun && usernameMatchesSpoofPair(pun, op2.matchUsername, op2.replaceUsername)) {
      return { badgesMap: op2.badges && typeof op2.badges === 'object' ? op2.badges : {} };
    }
  }
  if (
    uid != null &&
    curId != null &&
    String(uid) === String(curId) &&
    (!pun ||
      usernameMatchesSpoofPair(pun, sg('matchUsername', ''), sg('replaceUsername', ''))) &&
    normName(sg('matchUsername', '') || '') &&
    (sg('replaceUsername', '') || '').trim()
  ) {
    return { badgesMap: sg('badges', {}) && typeof sg('badges', {}) === 'object' ? sg('badges', {}) : {} };
  }
  return null;
}

var wrapProxyByUser = new WeakMap();

function getUsernameSpoofReplace(user) {
  if (!user) return null;
  var pun = normName(user.username || '');
  if (!pun) return null;
  if (normName(sg('matchUsername', '') || '') === pun && (sg('replaceUsername', '') || '').trim()) {
    return (sg('replaceUsername', '') || '').trim();
  }
  var others = sg('otherProfiles', []);
  if (!Array.isArray(others)) return null;
  for (var gi = 0; gi < others.length; gi++) {
    var op = others[gi] || {};
    if (normName(op.matchUsername || '') === pun && (op.replaceUsername || '').trim()) {
      return (op.replaceUsername || '').trim();
    }
  }
  return null;
}

function shouldSpoofUser(user) {
  return getUsernameSpoofReplace(user) != null;
}

function shouldWrapUserForProxy(user) {
  if (!user) return false;
  if (getUsernameSpoofReplace(user)) return true;
  if (parseAccountDateIsoMs(sg('spoofAccountDateIso', '')) == null) return false;
  var cur =
    UserStoreRef &&
    UserStoreRef.getCurrentUser &&
    UserStoreRef.getCurrentUser();
  if (!cur || cur.id == null || user.id == null) return false;
  return String(user.id) === String(cur.id);
}

function buildUserProxy(user) {
  var prev = wrapProxyByUser.get(user);
  if (prev) return prev;

  var proxy = new Proxy(user, {
    get: function (t, p, recv) {
      var cur =
        UserStoreRef &&
        UserStoreRef.getCurrentUser &&
        UserStoreRef.getCurrentUser();
      var spoofCreatedMs = parseAccountDateIsoMs(sg('spoofAccountDateIso', ''));
      if (
        spoofCreatedMs != null &&
        cur &&
        cur.id != null &&
        t &&
        t.id != null &&
        String(t.id) === String(cur.id)
      ) {
        if (p === 'createdTimestamp' || p === 'createdAtTimestamp') return spoofCreatedMs;
        if (p === 'createdAt' || p === 'created_at') return new Date(spoofCreatedMs);
      }

      if (!getUsernameSpoofReplace(t)) return Reflect.get(t, p, recv);
      var replace = getUsernameSpoofReplace(t);

      if (p === 'username') return replace;

      if (p === 'tag') {
        var tag = Reflect.get(t, 'tag', recv);
        if (typeof tag === 'string') {
          var hash = tag.indexOf('#');
          if (hash !== -1) return replace + tag.slice(hash);
        }
      }

      return Reflect.get(t, p, recv);
    },
    ownKeys: function (t) {
      return Reflect.ownKeys(t);
    },
    getOwnPropertyDescriptor: function (t, p) {
      var cur =
        UserStoreRef &&
        UserStoreRef.getCurrentUser &&
        UserStoreRef.getCurrentUser();
      var spoofCreatedMs = parseAccountDateIsoMs(sg('spoofAccountDateIso', ''));
      if (
        spoofCreatedMs != null &&
        cur &&
        cur.id != null &&
        t &&
        t.id != null &&
        String(t.id) === String(cur.id)
      ) {
        if (p === 'createdTimestamp' || p === 'createdAtTimestamp') {
          return { configurable: true, enumerable: true, value: spoofCreatedMs };
        }
        if (p === 'createdAt' || p === 'created_at') {
          return { configurable: true, enumerable: true, value: new Date(spoofCreatedMs) };
        }
      }

      if (!getUsernameSpoofReplace(t)) return Reflect.getOwnPropertyDescriptor(t, p);
      var replace = getUsernameSpoofReplace(t);
      if (p === 'username') {
        return {
          configurable: true,
          enumerable: true,
          value: replace
        };
      }
      return Reflect.getOwnPropertyDescriptor(t, p);
    }
  });
  wrapProxyByUser.set(user, proxy);
  return proxy;
}

function wrap(user) {
  if (!user) return user;
  if (!shouldWrapUserForProxy(user)) return user;
  return buildUserProxy(user);
}

function larpUnpatchAll() {
  try {
    larpPatcher.unpatchAll();
  } catch (_up) {}
  __larpProfileStorePatched = {};
  clearLarpGetUserCache();
  wrapProxyByUser = new WeakMap();
}

function patchUsername() {
  try {
    var UserStore = findByStoreName('UserStore');
    UserStoreRef = UserStore || null;
    if (!UserStore || typeof UserStore.getCurrentUser !== 'function') return;

    larpPatcher.after(UserStore, 'getCurrentUser', function (_ctx) {
      if (__larpInsideUserStoreWrap) return _ctx.result;
      __larpInsideUserStoreWrap = true;
      try {
        return wrap(_ctx.result);
      } finally {
        __larpInsideUserStoreWrap = false;
      }
    });
    larpPatcher.after(UserStore, 'getUser', function (_ctx) {
      if (__larpInsideUserStoreWrap) return _ctx.result;
      __larpInsideUserStoreWrap = true;
      try {
        return wrap(_ctx.result);
      } finally {
        __larpInsideUserStoreWrap = false;
      }
    });
  } catch (e) {
    console.error('[Larp] patchUsername failed', e);
  }
}

function patchUserProfileRecordMemberSince() {
  try {
    var storeNames = ['UserProfileStore', 'UserProfileStoreV2', 'GuildMemberProfileStore'];
    var methods = ['getUserProfile', 'getProfile', 'getMutableUserProfiles', 'getMutableUsers'];
    for (var si = 0; si < storeNames.length; si++) {
      var S = findByStoreName(storeNames[si]);
      if (!S) continue;
      for (var mj = 0; mj < methods.length; mj++) {
        var mn = methods[mj];
        var pkey = storeNames[si] + ':' + mn;
        if (__larpProfileStorePatched[pkey]) continue;
        if (typeof S[mn] !== 'function') continue;
        __larpProfileStorePatched[pkey] = true;

        larpPatcher.after(S, mn, function (_ctx) {
          var args = _ctx.args || [];
          var ret = _ctx.result;
          var ms = parseAccountDateIsoMs(sg('spoofAccountDateIso', ''));
          if (ms == null || ret == null) return ret;
          var a0 = args && args[0];
          var uid =
            a0 != null && typeof a0 === 'object'
              ? a0.id || a0.userId || (a0.user && (a0.user.id || a0.user.userId))
              : a0;
          if (uid == null) return ret;
          var cur =
            UserStoreRef &&
            UserStoreRef.getCurrentUser &&
            UserStoreRef.getCurrentUser();
          if (!cur || cur.id == null) return ret;
          if (String(uid) !== String(cur.id)) return ret;
          if (typeof ret !== 'object') return ret;
          try {
            var d = new Date(ms);
            var merged = Object.assign({}, ret, {
              createdAt: d,
              memberSince: d,
              joinedAt: d,
              createdTimestamp: ms
            });
            if (ret.user && typeof ret.user === 'object') {
              merged.user = Object.assign({}, ret.user, {
                createdAt: d,
                createdTimestamp: ms
              });
            }
            if (ret.userProfile && typeof ret.userProfile === 'object') {
              merged.userProfile = Object.assign({}, ret.userProfile, {
                createdAt: d,
                memberSince: d,
                createdTimestamp: ms
              });
            }
            if (ret.profile && typeof ret.profile === 'object') {
              merged.profile = Object.assign({}, ret.profile, {
                createdAt: d,
                memberSince: d,
                createdTimestamp: ms
              });
            }
            return merged;
          } catch (_e) {
            return ret;
          }
        });
      }
    }
  } catch (e) {
    console.error('[Larp] patchUserProfileRecordMemberSince failed', e);
  }
}

function extractBadgeHookUid(u) {
  if (u == null) return null;
  if (typeof u === 'string' || typeof u === 'number' || typeof u === 'bigint') {
    return u;
  }
  if (typeof u !== 'object') return null;
  if (u.userId != null) return u.userId;
  if (u.id != null) return u.id;
  if (u.user && typeof u.user === 'object') {
    if (u.user.userId != null) return u.user.userId;
    if (u.user.id != null) return u.user.id;
  }
  if (u.member && u.member.user && typeof u.member.user === 'object') {
    if (u.member.user.userId != null) return u.member.user.userId;
    if (u.member.user.id != null) return u.member.user.id;
  }
  return null;
}

function resolveProfileUserForBadges(u) {
  if (u == null) return null;
  if (typeof u === 'string' || typeof u === 'number' || typeof u === 'bigint') {
    if (UserStoreRef && typeof UserStoreRef.getUser === 'function') {
      try {
        var g0 = cachedGetUser(u);
        if (g0 && typeof g0 === 'object') return g0;
      } catch (_e0) {}
    }
    return null;
  }
  if (typeof u !== 'object') return null;
  var nests = [
    u,
    u.user,
    u.member && u.member.user,
    u.author,
    u.displayProfile && u.displayProfile.user,
    u.profile && u.profile.user
  ];
  var ni;
  for (ni = 0; ni < nests.length; ni++) {
    var n = nests[ni];
    if (n && typeof n === 'object' && (n.username != null || n.globalName != null)) {
      return n;
    }
  }
  var uid = extractBadgeHookUid(u);
  if (uid != null && UserStoreRef && typeof UserStoreRef.getUser === 'function') {
    try {
      var gu = cachedGetUser(uid);
      if (gu && typeof gu === 'object') return gu;
    } catch (_e1) {}
  }
  return u.user && typeof u.user === 'object' ? u.user : u;
}

function patchBadges() {
  try {
    var mod = metro.findByName('useBadges', { interop: false });
    if (!mod) return;
    var hookKey = typeof mod.default === 'function' ? 'default' : null;
    if (!hookKey && typeof mod.useBadges === 'function') {
      hookKey = 'useBadges';
    }
    if (!hookKey) return;

    function badgeHandler(_ctx) {
      var args = _ctx.args || [];
      var ret = _ctx.result;
      if (!ret || !Array.isArray(ret)) return ret;

      function applyNonSpoofLocalFilters(arr) {
        return arr.filter(function (x) {
          if (!x) return true;
          if (String(x.id || '').indexOf('larp-') === 0) return false;
          return !shouldHideNativeBadge(x);
        });
      }

      var u = args && args[0];
      var uid = extractBadgeHookUid(u);
      var profileUser = resolveProfileUserForBadges(u);
      var spoofCtx = findSpoofEntryForBadges(uid, profileUser);
      var badgesMap = spoofCtx && spoofCtx.badgesMap ? spoofCtx.badgesMap : {};
      if (!spoofCtx || !hasAnyBadgesInMap(badgesMap)) {
        return applyNonSpoofLocalFilters(ret);
      }

      var base = ret.filter(function (x) {
        return !x || !x.id || String(x.id).indexOf('larp-') !== 0;
      });

      var nitroPick = getEnabledNitroLarpIdFromMap(badgesMap);
      var boostPick = getEnabledBoostLarpIdFromMap(badgesMap);

      var hasRealNitro = nativeNitroCount(base) > 0;
      var hasRealBoost = nativeBoostCount(base) > 0;
      var stripNativeNitro = nitroPick != null && hasRealNitro;
      var stripNativeBoost = boostPick != null && hasRealBoost;
      var base2 = base;
      if (stripNativeNitro) {
        base2 = base2.filter(function (x) {
          return !isNativeNitroLike(x);
        });
      }
      if (stripNativeBoost) {
        base2 = base2.filter(function (x) {
          return !isGuildBoostBadge(x);
        });
      }
      var base3 = base2.filter(function (x) {
        return !shouldHideNativeBadge(x);
      });

      var nitroPayload = null;
      var boostPayload = null;
      var otherAdditions = [];
      for (var i = 0; i < BADGES.length; i++) {
        var b = BADGES[i];
        if (!badgesMap[b.id]) continue;
        if (NITRO_LARP_SET[b.id] && b.id !== nitroPick) continue;
        if (BOOST_LARP_SET[b.id] && b.id !== boostPick) continue;
        var row = makeBadgePayload(b);
        if (nitroPick != null && b.id === nitroPick) {
          nitroPayload = row;
        } else if (boostPick != null && b.id === boostPick) {
          boostPayload = row;
        } else {
          otherAdditions.push(row);
        }
      }
      var lead = [];
      if (nitroPayload) lead.push(nitroPayload);
      if (boostPayload) lead.push(boostPayload);
      var merged = lead.concat(base3).concat(otherAdditions);
      var annotated = [];
      for (var mj = 0; mj < merged.length; mj++) {
        annotated.push({ row: merged[mj], ord: mj });
      }
      annotated.sort(function (a, b) {
        var ra = plateRank(a.row, nitroPayload, boostPayload);
        var rb = plateRank(b.row, nitroPayload, boostPayload);
        if (ra !== rb) return ra - rb;
        return a.ord - b.ord;
      });
      var sorted = [];
      for (var sj = 0; sj < annotated.length; sj++) {
        sorted.push(annotated[sj].row);
      }
      return sorted;
    }

    larpPatcher.after(mod, hookKey, badgeHandler);
  } catch (e) {
    console.error('[Larp] patchBadges failed', e);
  }
}

function badgeIdFromProps(p) {
  if (!p) return null;
  if (typeof p.id === 'string' && p.id.indexOf('larp-') === 0) return p.id;
  if (p.badge && typeof p.badge.id === 'string' && p.badge.id.indexOf('larp-') === 0) return p.badge.id;
  if (p.item && typeof p.item.id === 'string' && p.item.id.indexOf('larp-') === 0) return p.item.id;
  if (p.row && typeof p.row.id === 'string' && p.row.id.indexOf('larp-') === 0) return p.row.id;
  if (typeof p.badgeId === 'string' && p.badgeId.indexOf('larp-') === 0) return p.badgeId;
  return null;
}

var LARP_RENDER_CANDIDATE_NAMES = [
  'ProfileBadge',
  'RenderedBadge',
  'ProfileBadgeRow',
  'BadgeRow',
  'UserProfileBadge',
  'ProfileBadgesRow',
  'BadgeStack',
  'GuildBadge',
  'GuildBadgeV2',
  'TenureBadge',
  'PremiumBadge',
  'GiftingBadge'
];

function patchBadgeIconsViaJsx() {
  try {
    var jsxRuntime = metro.findByProps('jsx', 'jsxs');
    if (!jsxRuntime) return;

    function onJsx(_ctx) {
      var args = _ctx.args || [];
      var ret = _ctx.result;
      if (!ret || !ret.props) return ret;
      var Type = args[0];

      var hn = sg('hideNative', {}) || {};
      if (hn.orbBalance && Type && typeof Type === 'function') {
        var n0 = Type.displayName || Type.name;
        if (n0 && typeof n0 === 'string' && /orb/i.test(n0) && /balance|wallet|currency|amount|credits|ledger|inventory/i.test(n0)) {
          var hideOrbBal = {
            opacity: 0,
            height: 0,
            maxHeight: 0,
            overflow: 'hidden',
            margin: 0,
            padding: 0,
            borderWidth: 0
          };
          var st0 = ret.props.style;
          if (Array.isArray(st0)) ret.props.style = st0.concat([hideOrbBal]);
          else if (st0 && typeof st0 === 'object') ret.props.style = [st0, hideOrbBal];
          else ret.props.style = hideOrbBal;
          return ret;
        }
      }

      var id = badgeIdFromProps(ret.props);
      if (id == null) {
        if (typeof Type !== 'function') return ret;
        var n = Type.displayName || Type.name;
        if (!n || typeof n !== 'string') return ret;
        if (LARP_RENDER_CANDIDATE_NAMES.indexOf(n) === -1) return ret;
        if (ret.props.badge && typeof ret.props.badge.id === 'string') {
          id = ret.props.badge.id;
        } else if (typeof ret.props.badgeId === 'string') {
          id = ret.props.badgeId;
        }
        if (id == null || String(id).indexOf('larp-') !== 0) return ret;
      }

      var meta = LARP_BADGE_META[id];
      if (!meta) return ret;

      ret.props.source = { uri: meta.uri };

      var innerId = String(id).slice(5);
      if (NITRO_LARP_SET[innerId] || BOOST_LARP_SET[innerId]) {
        try {
          delete ret.props.link;
          delete ret.props.href;
          delete ret.props.to;
          delete ret.props.route;
          delete ret.props.navigation;
        } catch (_lp) {}
        ret.props.onPress = undefined;
        ret.props.onLongPress = undefined;
        ret.props.onPress = function () {
          openLarpNitroBoostSheet(innerId, meta);
        };
      }
      if (ret.props.description == null || ret.props.description === '') {
        ret.props.description = meta.label;
      }
      return ret;
    }

    larpPatcher.after(jsxRuntime, 'jsx', onJsx);
    larpPatcher.after(jsxRuntime, 'jsxs', onJsx);
  } catch (e) {
    console.error('[Larp] patchBadgeIconsViaJsx failed', e);
  }
}

function Settings() {
  var s = React.useState(0);
  var force = s[1];

  var C = {
    bg: '#313338',
    card: '#2b2d31',
    inset: '#1e1f22',
    line: '#1e1f22',
    muted: '#b5bac1',
    text: '#dbdee1',
    accent: '#5865f2',
    danger: '#f23f43',
    link: '#00a8fc'
  };

  function refresh() {
    clearLarpGetUserCache();
    force(function (n) {
      return n + 1;
    });
    try {
      var us = findByStoreName('UserStore');
      if (us && typeof us.emitChange === 'function') {
        us.emitChange();
      }
      var profStores = ['UserProfileStore', 'UserProfileStoreV2', 'GuildMemberProfileStore'];
      var pi;
      for (pi = 0; pi < profStores.length; pi++) {
        var Ps = findByStoreName(profStores[pi]);
        if (Ps && typeof Ps.emitChange === 'function') {
          Ps.emitChange();
        }
      }
    } catch (_) {}
  }

  var matchValue = sg('matchUsername', '') || '';
  var replaceValue = sg('replaceUsername', '') || '';

  function section(title, body) {
    return React.createElement(View, { style: { marginBottom: 16 } },
      React.createElement(Text, {
        style: {
          color: C.muted,
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 6
        }
      }, title),
      React.createElement(View, {
        style: {
          backgroundColor: C.card,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#202225',
          overflow: 'hidden'
        }
      }, body)
    );
  }

  function field(label, value, key, isFirst) {
    return React.createElement(View, {
      style: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderTopWidth: isFirst ? 0 : 1,
        borderTopColor: C.line
      }
    },
      React.createElement(Text, {
        style: { color: C.muted, fontSize: 12, marginBottom: 6, fontWeight: '600' }
      }, label),
      React.createElement(TextInput, {
        style: {
          backgroundColor: C.inset,
          color: C.text,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: '#111214',
          paddingHorizontal: 10,
          paddingVertical: 9,
          fontSize: 15
        },
        placeholder: label,
        placeholderTextColor: '#6d6f78',
        value: value,
        autoCorrect: false,
        autoCapitalize: 'none',
        onChangeText: function (v) {
          ss(key, v);
          refresh();
        }
      })
    );
  }

  function badgeRow(b) {
    var bm = sg('badges', {}) || {};
    var on = !!bm[b.id];
    return React.createElement(Pressable, {
      key: b.id,
      onPress: function () {
        var bm2 = Object.assign({}, bm);
        bm2[b.id] = !on;
        ss('badges', bm2);
        refresh();
        try {
          showToast((on ? 'Removed ' : 'Added ') + b.label, on ? 'Small' : 'Check');
        } catch (_) {}
      },
      style: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderTopWidth: 1,
        borderTopColor: C.line,
        backgroundColor: on ? '#383a40' : 'transparent'
      }
    },
      React.createElement(Text, { style: { color: C.text, fontSize: 15, flex: 1 } }, b.label),
      React.createElement(Text, {
        style: { color: on ? C.accent : C.muted, fontSize: 13, marginLeft: 6 }
      }, on ? '✓' : '')
    );
  }

  function hideToggle(key, label, noTop) {
    var hn = sg('hideNative', {}) || {};
    var on = !!hn[key];
    return React.createElement(Pressable, {
      key: key,
      onPress: function () {
        var hn2 = Object.assign({}, hn);
        hn2[key] = !on;
        ss('hideNative', hn2);
        refresh();
      },
      style: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 11,
        borderTopWidth: noTop ? 0 : 1,
        borderTopColor: C.line
      }
    },
      React.createElement(Text, {
        style: { color: on ? C.accent : C.muted, fontSize: 14, width: 20, marginRight: 6 }
      }, on ? '☑' : '☐'),
      React.createElement(Text, { style: { color: C.text, fontSize: 15, flex: 1 } }, label)
    );
  }

  var primaryBadgesBlock = React.createElement(View, null,
    React.createElement(View, {
      style: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: C.line }
    }, React.createElement(Text, { style: { color: C.muted, fontSize: 12 } }, 'Primary account')),
    BADGES.map(badgeRow)
  );

  var oth = sg('otherProfiles', []) || [];
  var otherProfilesBlock = React.createElement(View, null,
    oth.map(function (_op, oi) {
      var op = oth[oi];
      if (!op || typeof op !== 'object') return null;
      var opBadges = (op.badges && typeof op.badges === 'object') ? op.badges : {};

      function otherField(label, val, opKey, firstRow) {
        return React.createElement(View, {
          style: {
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderTopWidth: firstRow ? 0 : 1,
            borderTopColor: C.line
          }
        },
          React.createElement(Text, {
            style: { color: C.muted, fontSize: 12, marginBottom: 5, fontWeight: '600' }
          }, label),
          React.createElement(TextInput, {
            style: {
              backgroundColor: C.inset,
              color: C.text,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: '#111214',
              paddingHorizontal: 10,
              paddingVertical: 8,
              fontSize: 15
            },
            placeholder: label,
            placeholderTextColor: '#6d6f78',
            value: val == null ? '' : String(val),
            autoCorrect: false,
            autoCapitalize: 'none',
            onChangeText: function (v) {
              var ops = sg('otherProfiles', []).slice();
              ops[oi][opKey] = v;
              ss('otherProfiles', ops);
              refresh();
            }
          })
        );
      }

      function otherBadgeRow(b) {
        var on = !!opBadges[b.id];
        return React.createElement(Pressable, {
          key: 'o' + oi + '-' + b.id,
          onPress: function () {
            var ops = sg('otherProfiles', []).slice();
            var op2 = ops[oi] || {};
            var ob = Object.assign({}, (op2.badges && typeof op2.badges === 'object') ? op2.badges : {});
            ob[b.id] = !on;
            op2.badges = ob;
            ss('otherProfiles', ops);
            refresh();
          },
          style: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 9,
            borderTopWidth: 1,
            borderTopColor: C.line,
            backgroundColor: on ? '#383a40' : 'transparent'
          }
        },
          React.createElement(Text, { style: { color: C.text, fontSize: 14, flex: 1 } }, b.label),
          React.createElement(Text, {
            style: { color: on ? C.accent : C.muted, fontSize: 13, marginLeft: 6 }
          }, on ? '✓' : '')
        );
      }

      return React.createElement(View, {
        key: 'otherprof-' + oi,
        style: {
          borderTopWidth: oi > 0 ? 1 : 0,
          borderTopColor: C.line,
          paddingBottom: 4
        }
      },
        React.createElement(Text, {
          style: { color: C.text, fontWeight: '600', fontSize: 14, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 5 }
        }, 'Account ' + (oi + 1)),
        otherField('User ID (optional)', op.userId || '', 'userId', true),
        otherField('Match username', op.matchUsername || '', 'matchUsername'),
        otherField('Replace @handle', op.replaceUsername || '', 'replaceUsername'),
        React.createElement(Text, {
          style: { color: C.muted, fontSize: 11, paddingHorizontal: 12, marginTop: 4, marginBottom: 2 }
        }, 'Badges'),
        BADGES.map(otherBadgeRow),
        React.createElement(Pressable, {
          onPress: function () {
            var ops = sg('otherProfiles', []).slice();
            ops.splice(oi, 1);
            ss('otherProfiles', ops);
            refresh();
          },
          style: {
            marginHorizontal: 10,
            marginTop: 6,
            marginBottom: 6,
            paddingVertical: 9,
            alignItems: 'center'
          }
        }, React.createElement(Text, { style: { color: C.danger, fontWeight: '600', fontSize: 14 } }, 'Remove'))
      );
    }),
    React.createElement(Pressable, {
      onPress: function () {
        var ops = sg('otherProfiles', []).slice();
        ops.push({
          userId: '',
          matchUsername: '',
          replaceUsername: '',
          badges: {}
        });
        ss('otherProfiles', ops);
        refresh();
      },
      style: {
        borderTopWidth: oth.length ? 1 : 0,
        borderTopColor: C.line,
        paddingVertical: 12,
        alignItems: 'center'
      }
    }, React.createElement(Text, { style: { color: C.link, fontWeight: '600', fontSize: 15 } }, 'Add account'))
  );

  return React.createElement(ScrollView, {
    style: { flex: 1, backgroundColor: C.bg },
    contentContainerStyle: { padding: 16, paddingBottom: 64 }
  },
    React.createElement(Text, {
      style: { color: C.text, fontSize: 20, fontWeight: '700' }
    }, 'Larp'),
    React.createElement(Text, {
      style: { color: C.muted, fontSize: 13, marginTop: 2, marginBottom: 16 }
    }, 'Client-side only.'),

    section(
      'Username',
      React.createElement(View, null, [
        field('Match (without @)', matchValue, 'matchUsername', true),
        field('Show as @handle', replaceValue, 'replaceUsername')
      ])
    ),

    section('Other accounts', otherProfilesBlock),

    section(
      'Member since',
      field('Date (ISO or DD/MM/YYYY)', sg('spoofAccountDateIso', '') || '', 'spoofAccountDateIso', true)
    ),

    section('Badges', primaryBadgesBlock),

    section(
      'Hide native (local)',
      React.createElement(View, null, [
        hideToggle('quest', 'Quest', true),
        hideToggle('orb', 'Orb badge'),
        hideToggle('nitro', 'Nitro / tenure'),
        hideToggle('boost', 'Server boost'),
        hideToggle('orbBalance', 'Orb balance row'),
        hideToggle('levelLeaf', 'Level leaf / April Fools'),
        hideToggle('legacyUsername', 'Originally known as'),
        React.createElement(View, {
          style: { paddingHorizontal: 12, paddingVertical: 11, borderTopWidth: 1, borderTopColor: C.line }
        },
          React.createElement(Text, {
            style: { color: C.muted, fontSize: 12, marginBottom: 6, fontWeight: '600' }
          }, 'Hide if badge id contains'),
          React.createElement(TextInput, {
            style: {
              backgroundColor: C.inset,
              color: C.text,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: '#111214',
              paddingHorizontal: 10,
              paddingVertical: 9,
              fontSize: 15
            },
            placeholder: 'space or comma separated',
            placeholderTextColor: '#6d6f78',
            value: sg('hideNative.idSubstrings', '') || '',
            autoCorrect: false,
            autoCapitalize: 'none',
            onChangeText: function (v) {
              var hn = Object.assign({}, sg('hideNative', {}) || {});
              hn.idSubstrings = v;
              ss('hideNative', hn);
              refresh();
            }
          })
        )
      ])
    ),

    React.createElement(Pressable, {
      onPress: function () {
        ss('badges', {});
        refresh();
        try {
          showToast('Cleared', 'trash');
        } catch (_) {}
      },
      style: {
        marginTop: 8,
        paddingVertical: 12,
        alignItems: 'center'
      }
    }, React.createElement(Text, { style: { color: C.danger, fontWeight: '600', fontSize: 14 } }, 'Clear all spoof badges'))
  );
}

function start() {
  larpUnpatchAll();
  try {
    warmLarpIconAssetCache();
  } catch (_wm) {}
  try {
    showToast('[Larp] ' + LARP_UI_TAG + ' enabled', 'Check');
  } catch (_) {}
  patchUsername();
  patchUserProfileRecordMemberSince();
  patchBadges();
  patchBadgeIconsViaJsx();
}

function stop() {
  larpUnpatchAll();
}
return {
  start: start,
  stop: stop,
  getSettingsPanel: function () {
    return React.createElement(Settings);
  }
};

})()