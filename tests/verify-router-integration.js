// tests/verify-router-integration.js
// Verifies integration between AppRouter, ProgressStore, and AdaptiveEngine.

const fs = require('fs');
const path = require('path');

const bank = require('../js/exerciseBank.js');
const AppRouter = require('../js/router.js');

// Mock localStorage
const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; }
};

const progressCode = fs.readFileSync(path.join(__dirname, '../js/progress.js'), 'utf8');
const progModule = {};
const evalProg = new Function('window', 'module', 'localStorage', progressCode);
evalProg(progModule, { exports: {} }, global.localStorage);
const ProgressStore = progModule.ProgressStore || progModule.exports;
const store = new ProgressStore();

const adaptiveCode = fs.readFileSync(path.join(__dirname, '../js/adaptiveEngine.js'), 'utf8');
const adaptModule = {};
const evalAdapt = new Function('window', 'module', adaptiveCode);
evalAdapt(adaptModule, { exports: {} });
const AdaptiveEngine = adaptModule.AdaptiveEngine || adaptModule.exports;
const adaptive = new AdaptiveEngine(bank);

const router = new AppRouter();

const assert = (cond, msg) => {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
  console.log(`PASS: ${msg}`);
};

console.log("=== Integration Test: Router + Progress + Exercises ===");

// 1. Simulate saving code draft for array-medium-02
const targetExerciseId = "array-medium-02";
const userCode = "function chunkArray(arr, size) { /* working solution */ return []; }";
store.saveDraft(targetExerciseId, userCode);
store.recordAttempt("array", "medium", "array-medium-01", true);

// 2. User navigates to #/topic/array/medium/2
const route = router.parseHash("#/topic/array/medium/2");
assert(route.view === "exercise", "Route view is exercise");
assert(route.topic === "array" && route.difficulty === "medium" && route.exerciseIndex === 1, "Route parameters accurate");

// 3. Load exercise queue for this route
const queue = adaptive.getExercises(route.topic, route.difficulty);
assert(queue.length === 3, "Queue loaded 3 exercises");
const currentEx = queue[route.exerciseIndex];
assert(currentEx.id === targetExerciseId, "Exercise index 1 resolves to array-medium-02");

// 4. Verify draft restored for this exercise
const restoredDraft = store.getDraft(currentEx.id);
assert(restoredDraft === userCode, "User code draft successfully retrieved from storage");

// 5. Verify status of previous exercise in set is marked correct
const ex1Status = store.getExerciseStatus("array", "medium", "array-medium-01");
assert(ex1Status === "correct", "Exercise 1 status correctly marked as 'correct'");

// 6. Navigate to Home
const homeRoute = router.parseHash("#/");
assert(homeRoute.view === "home", "Navigating to home route resolves to dashboard");

// 7. Defensive fallback on broken hash
const badRoute = router.parseHash("#/broken/link/here");
assert(badRoute.view === "home" && badRoute.fallback === true, "Broken URL safely falls back to home");

console.log("\nALL ROUTER INTEGRATION TESTS PASSED (100% SUCCESS)!");
