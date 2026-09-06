// tests/verify-topics-navigation.js
// Verifies all topic navigation routes, breadcrumbs, Back button, and renderDashboard integrity.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const bank = require('../js/exerciseBank.js');

const windowMock = {
  _hash: '#/',
  get hash() { return this._hash; },
  set hash(v) {
    this._hash = v;
    if (this._hashListeners) this._hashListeners.forEach(fn => fn());
  },
  replace: function(v) { this.hash = v; },
  _hashListeners: [],
  addEventListener: function(ev, fn) {
    if (ev === 'hashchange') this._hashListeners.push(fn);
  },
  scrollTo: () => {}
};

global.window = {
  get location() { return windowMock; },
  addEventListener: function(ev, fn) { windowMock.addEventListener(ev, fn); },
  scrollTo: () => {}
};

const AppRouter = require('../js/router.js');

const appJs = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');

const assert = (cond, msg) => {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
  console.log(`PASS: ${msg}`);
};

console.log("=== Testing Topic Navigation & Dashboard Render Integrity ===");

// 1. Verify AppRouter parsing of topic and topics routes
const router = new AppRouter();

const routeTopicsRoot = router.parseHash("#/topics");
assert(routeTopicsRoot.view === "home", "#/topics correctly resolves to home/dashboard");

const routeTopicArray = router.parseHash("#/topic/array");
assert(routeTopicArray.view === "topic" && routeTopicArray.topic === "array", "#/topic/array resolves to topic view with topic=array");

const routeTopicsDate = router.parseHash("#/topics/date");
assert(routeTopicsDate.view === "topic" && routeTopicsDate.topic === "date", "#/topics/date alias resolves to topic view with topic=date");

// 2. Mock full browser DOM and verify app.js navigation execution
let scrolledToTopic = null;

const createMockElement = (id = "", className = "") => {
  const el = {
    id,
    className,
    classList: {
      _classes: new Set(className ? className.split(' ') : []),
      add: function(c) { this._classes.add(c); el.className = Array.from(this._classes).join(' '); },
      remove: function(c) { this._classes.delete(c); el.className = Array.from(this._classes).join(' '); },
      toggle: function(c, val) {
        if (val === undefined) val = !this._classes.has(c);
        if (val) this.add(c); else this.remove(c);
        return val;
      },
      contains: function(c) { return this._classes.has(c); }
    },
    _innerHTML: '',
    get innerHTML() { return this._innerHTML; },
    set innerHTML(val) {
      this._innerHTML = val;
      if (val === '') this.children = [];
    },
    style: {},
    children: [],
    attributes: {},
    setAttribute: function(k, v) { this.attributes[k] = v; },
    getAttribute: function(k) { return this.attributes[k] || null; },
    appendChild: function(c) { this.children.push(c); },
    scrollIntoView: function() { scrolledToTopic = el.getAttribute('data-topic'); },
    scrollBy: function() {},
    addEventListener: function(ev, fn) {
      if (!this._listeners) this._listeners = {};
      if (!this._listeners[ev]) this._listeners[ev] = [];
      this._listeners[ev].push(fn);
    },
    click: function() {
      if (this._listeners && this._listeners['click']) {
        this._listeners['click'].forEach(fn => fn({ preventDefault: () => {}, stopPropagation: () => {}, target: el }));
      }
    },
    querySelector: function(sel) {
      if (sel.includes('[data-topic="')) {
        const topic = sel.match(/\[data-topic="([^"]+)"\]/)[1];
        return this.children.find(c => c.getAttribute('data-topic') === topic) || null;
      }
      return createMockElement();
    },
    querySelectorAll: function() { return []; }
  };
  return el;
};

const domStore = {};
const getOrCreate = (id, cls = '') => {
  if (!domStore[id]) domStore[id] = createMockElement(id, cls);
  return domStore[id];
};

const viewDashboard = getOrCreate('view-dashboard', 'app-view active');
const viewExercise = getOrCreate('view-exercise', 'app-view');
const viewResults = getOrCreate('view-results', 'app-view');
const topicsGrid = getOrCreate('topics-grid');

const sandboxEnv = {
  exerciseBank: bank,
  document: {
    addEventListener: (ev, fn) => { if (ev === 'DOMContentLoaded') sandboxEnv.domLoaded = fn; },
    getElementById: (id) => getOrCreate(id),
    querySelector: (sel) => {
      if (sel === '.editor-container') return createMockElement('editor-container');
      return createMockElement();
    },
    querySelectorAll: () => [],
    createElement: (tag) => createMockElement('', tag === 'div' ? 'topic-card' : '')
  },
  window: {
    exerciseBank: bank,
    scrollTo: () => {},
    addEventListener: function(ev, fn) { windowMock.addEventListener(ev, fn); },
    get location() { return windowMock; }
  },
  localStorage: {
    _data: {},
    getItem: function(k) { return this._data[k] || null; },
    setItem: function(k, v) { this._data[k] = String(v); },
    removeItem: function(k) { delete this._data[k]; }
  },
  setTimeout: (fn) => fn(),
  clearTimeout: () => {},
  console: console,
  AdaptiveEngine: class {
    constructor(bank) { this.bank = bank; }
    getExercises(t, d) { return bank.filter(b => b.topics.includes(t) && b.difficulty === d); }
    recordSessionResult() { return null; }
  },
  SandboxEngine: class {},
  AIGenerator: class { loadConfig() { return {}; } },
  AppRouter: AppRouter,
  ProgressStore: class {
    getLastSession() { return null; }
    saveLastSession() {}
    getOverallStats() { return { streak: 0, masteryPercent: 0, totalCorrect: 0 }; }
    getIncorrectExerciseIds() { return []; }
    getTopicStats() { return { masteryPercent: 0, easy: { correct: 0 }, medium: { correct: 0 }, hard: { correct: 0 } }; }
    getExerciseStatus() { return 'unattempted'; }
    getDraft() { return null; }
  },
  CodeSuggest: class { constructor() { this.isOpen = false; } }
};

// Execute app.js in sandbox
vm.runInNewContext(appJs, sandboxEnv);

// Trigger DOMContentLoaded
sandboxEnv.domLoaded();

console.log("DOM loaded. Verifying initial state...");
assert(viewDashboard.classList.contains('active'), "Dashboard view is active on load");
assert(!viewExercise.classList.contains('active'), "Exercise view is inactive on load");
assert(topicsGrid.children.length === 6, "Topics grid rendered all 6 topic cards");

// Verify each card has data-topic
const topicsRendered = topicsGrid.children.map(c => c.getAttribute('data-topic'));
assert(topicsRendered.includes('array'), "Array topic card has data-topic='array'");
assert(topicsRendered.includes('if-else'), "If-else topic card has data-topic='if-else'");

// Test 3: Navigate to exercise #/topic/array/easy/1
windowMock.hash = "#/topic/array/easy/1";
assert(viewExercise.classList.contains('active'), "Exercise view active after navigating to exercise");
assert(!viewDashboard.classList.contains('active'), "Dashboard view inactive after navigating to exercise");

// Test 4: Navigate back to topics via btn-back-dashboard
const btnBack = getOrCreate('btn-back-dashboard');
btnBack.click();

assert(viewDashboard.classList.contains('active'), "Dashboard view is active after clicking ← Topics!");
assert(!viewExercise.classList.contains('active'), "Exercise view is hidden after navigating back to topics!");
assert(windowMock.hash === "#/topic/array", "URL correctly updated to #/topic/array");
assert(scrolledToTopic === "array", "Topic card for 'array' smoothly scrolled into view and highlighted!");

// Test 5: Navigate back via ExecJS brand logo
windowMock.hash = "#/topic/date/medium/2";
assert(viewExercise.classList.contains('active'), "Exercise view active for date/medium/2");
const brand = getOrCreate('nav-brand');
brand.click();
assert(viewDashboard.classList.contains('active'), "Dashboard view active after clicking brand logo");
assert(windowMock.hash === "#/", "URL updated to #/");

console.log("\nALL TOPIC NAVIGATION TESTS PASSED (100% SUCCESS)!");
