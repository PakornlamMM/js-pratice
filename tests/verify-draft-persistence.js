// tests/verify-draft-persistence.js
// Simulates user editing code, page refresh, and draft restoration lifecycle.

const fs = require('fs');
const path = require('path');

// Mock browser localStorage
const memoryStorage = {};
const mockLocalStorage = {
  getItem: (k) => memoryStorage[k] || null,
  setItem: (k, v) => { memoryStorage[k] = String(v); },
  removeItem: (k) => { delete memoryStorage[k]; },
  clear: () => { Object.keys(memoryStorage).forEach(k => delete memoryStorage[k]); }
};

const progressCode = fs.readFileSync(path.join(__dirname, '../js/progress.js'), 'utf8');
function createStore() {
  const mod = {};
  const evalProg = new Function('window', 'module', 'localStorage', progressCode);
  evalProg(mod, { exports: {} }, mockLocalStorage);
  const ProgressStore = mod.ProgressStore || mod.exports;
  return new ProgressStore();
}

console.log("=== STEP 1: First Session - User opens exercise and types custom code ===");
let store = createStore();
const exerciseId = "array-easy-01";
const customCode = `function doubleElements(arr) {
  // Custom solution written by user
  return arr.map(val => val * 2);
}`;

// Save draft as the user types
store.saveDraft(exerciseId, customCode);
store.saveLastSession({
  topic: "array",
  difficulty: "easy",
  exerciseIndex: 0,
  exerciseId: exerciseId,
  exerciseTitle: "Double Array Elements",
  activeView: "exercise"
});

console.log("Custom code saved to draft. Session saved.");

console.log("\n=== STEP 2: Page Refresh Simulation (re-instantiating store with persisted storage) ===");
// In a real page refresh, JavaScript memory is reset, but localStorage persists
store = createStore();

const lastSession = store.getLastSession();
if (!lastSession || lastSession.activeView !== "exercise") {
  console.error("FAIL: Session was not recognized as active exercise on refresh!");
  process.exit(1);
}
console.log("PASS: Recognized active session on refresh:", lastSession.topic, lastSession.difficulty);

const restoredDraft = store.getDraft(lastSession.exerciseId);
if (restoredDraft !== customCode) {
  console.error("FAIL: Restored draft does not match what user typed!");
  process.exit(1);
}
console.log("PASS: Code draft successfully recovered across refresh!");
console.log("Restored Code:\n" + restoredDraft);

console.log("\n=== STEP 3: Reset Code Action ===");
store.clearDraft(exerciseId);
const draftAfterReset = store.getDraft(exerciseId);
if (draftAfterReset !== null) {
  console.error("FAIL: Draft was not cleared after reset!");
  process.exit(1);
}
console.log("PASS: Draft cleared. Editor can now safely load starterCode.");

console.log("\nALL REFRESH & PERSISTENCE TESTS PASSED (100% SUCCESS)!");
