// tests/verify-execution.js
// Automated verification for SandboxEngine, deepEqual, ProgressStore, and AdaptiveEngine.

const fs = require('fs');
const path = require('path');

// 1. Test deepEqual from domSandbox.js
const sandboxCode = fs.readFileSync(path.join(__dirname, '../js/domSandbox.js'), 'utf8');
const sandboxModule = {};
const evalSandbox = new Function('window', 'module', sandboxCode);
evalSandbox(sandboxModule, { exports: {} });
const SandboxEngine = sandboxModule.SandboxEngine || sandboxModule.exports;
const engine = new SandboxEngine();

console.log("--- Testing deepEqual ---");
const assert = (cond, msg) => {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
  console.log(`PASS: ${msg}`);
};

assert(engine.deepEqual(1, 1), "Primitives match");
assert(!engine.deepEqual(1, 2), "Different primitives don't match");
assert(engine.deepEqual([1, 2, 3], [1, 2, 3]), "Arrays match");
assert(!engine.deepEqual([1, 2], [1, 2, 3]), "Different length arrays don't match");
assert(engine.deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 }), "Objects with same keys match");
assert(!engine.deepEqual({ a: 1 }, { a: 2 }), "Objects with different values don't match");
assert(engine.deepEqual(NaN, NaN), "NaN equals NaN");
assert(!engine.deepEqual(null, undefined), "null does not equal undefined");
assert(engine.deepEqual(new Date("2026-09-01"), new Date("2026-09-01")), "Dates match");

// 2. Test ProgressStore
console.log("\n--- Testing ProgressStore ---");
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

store.recordAttempt("array", "easy", "array-easy-01", true);
assert(store.getExerciseStatus("array", "easy", "array-easy-01") === "correct", "Exercise status is correct");

store.recordAttempt("array", "easy", "array-easy-02", false);
assert(store.getExerciseStatus("array", "easy", "array-easy-02") === "incorrect", "Exercise status is incorrect");

const mistakes = store.getIncorrectExerciseIds();
assert(mistakes.length === 1 && mistakes[0].exerciseId === "array-easy-02", "Mistakes queue tracks incorrect items");

const stats = store.getTopicStats("array", 3);
assert(stats.easy.correct === 1, "Topic stats reflect correct count");

// Test Draft Persistence
store.saveDraft("array-easy-01", "function doubleElements(arr) { return arr.map(x => x * 2); }");
assert(store.getDraft("array-easy-01") === "function doubleElements(arr) { return arr.map(x => x * 2); }", "Draft saved and retrieved accurately");
assert(store.getDraft("non-existent") === null, "Non-existent draft returns null");

store.clearDraft("array-easy-01");
assert(store.getDraft("array-easy-01") === null, "Draft successfully cleared on reset");

// Test Last Session State
store.saveLastSession({
  topic: "date",
  difficulty: "medium",
  exerciseIndex: 1,
  exerciseId: "date-medium-02",
  exerciseTitle: "Working Days Counter",
  activeView: "exercise"
});
const session = store.getLastSession();
assert(session && session.topic === "date" && session.activeView === "exercise", "Last navigation session persisted and restored");

// 3. Test AdaptiveEngine
console.log("\n--- Testing AdaptiveEngine ---");
const bank = require('../js/exerciseBank.js');
const adaptiveCode = fs.readFileSync(path.join(__dirname, '../js/adaptiveEngine.js'), 'utf8');
const adaptModule = {};
const evalAdapt = new Function('window', 'module', adaptiveCode);
evalAdapt(adaptModule, { exports: {} });
const AdaptiveEngine = adaptModule.AdaptiveEngine || adaptModule.exports;
const adaptive = new AdaptiveEngine(bank);

const easyArray = adaptive.getExercises("array", "easy");
assert(easyArray.length === 3, "getExercises returns 3 easy array exercises");

const shuffled = adaptive.getExercises("array", "easy", true);
assert(shuffled.length === 3, "Shuffled exercises returns 3 exercises");

const stepUp = adaptive.recordSessionResult(true, "easy");
adaptive.recordSessionResult(true, "easy");
const stepUp3 = adaptive.recordSessionResult(true, "easy");
assert(stepUp3 && stepUp3.suggestedDifficulty === "medium", "Adaptive suggests Medium after 3 consecutive easy successes");

// 4. Test AIGenerator schema validator
console.log("\n--- Testing AIGenerator Validator ---");
const aiCode = fs.readFileSync(path.join(__dirname, '../js/aiGenerator.js'), 'utf8');
const aiModule = {};
const evalAi = new Function('window', 'module', 'localStorage', aiCode);
evalAi(aiModule, { exports: {} }, global.localStorage);
const AIGenerator = aiModule.AIGenerator || aiModule.exports;
const aiGen = new AIGenerator();

const validAiExercise = {
  id: "ai-test-01",
  title: "AI Test",
  topics: ["array"],
  difficulty: "easy",
  type: "write-function",
  prompt: "Write test",
  starterCode: "function test() {}",
  testCases: [
    { input: [1], expected: 2 },
    { input: [2], expected: 4 },
    { input: [3], expected: 6 },
    { input: [4], expected: 8 },
    { input: [5], expected: 10 }
  ],
  explanation: "Multiply by 2"
};

assert(aiGen.validateExercise(validAiExercise) === true, "Valid exercise passes schema check");

let caughtInvalid = false;
try {
  aiGen.validateExercise({ ...validAiExercise, testCases: [{ input: [1], expected: 2 }] });
} catch (e) {
  caughtInvalid = true;
}
assert(caughtInvalid, "Rejects exercise with fewer than 5 test cases");

console.log("\nALL BACKEND & SYSTEM VERIFICATIONS PASSED (100% SUCCESS)!");
