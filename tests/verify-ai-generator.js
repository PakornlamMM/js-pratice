// tests/verify-ai-generator.js
// Verifies anti-repetition engine and procedural synthesis of fresh exercises.

const fs = require('fs');
const path = require('path');

const AIGenerator = require('../js/aiGenerator.js');
const AppRouter = require('../js/router.js');

const aiGen = new AIGenerator();
const router = new AppRouter();

const assert = (cond, msg) => {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
  console.log(`PASS: ${msg}`);
};

console.log("=== Testing Anti-Repetition Procedural Exercise Generator ===");

// 1. Generate 10 consecutive exercises for 'object' 'easy'
const generatedObjects = [];
const titles = new Set();
const ids = new Set();

for (let i = 0; i < 10; i++) {
  const ex = aiGen.generateProceduralExercise("object", "easy");
  assert(aiGen.validateExercise(ex), `Exercise ${i + 1} passes strict schema validation`);
  assert(ex.testCases.length === 5, `Exercise ${i + 1} has exactly 5 test cases`);
  assert(!ids.has(ex.id), `Exercise ${i + 1} has unique ID: ${ex.id}`);
  ids.add(ex.id);
  generatedObjects.push(ex);
  titles.add(ex.title);
}

console.log(`Generated 10 exercises. Distinct titles count: ${titles.size} (Titles: ${Array.from(titles).join(", ")})`);
assert(titles.size >= 4, "Procedural engine generates diverse, non-repeating concepts");

// 2. Test Array topic generation
const arrayTitles = new Set();
for (let i = 0; i < 6; i++) {
  const ex = aiGen.generateProceduralExercise("array", "easy");
  assert(aiGen.validateExercise(ex), `Array exercise ${i + 1} is valid`);
  arrayTitles.add(ex.title);
}
console.log(`Generated 6 array exercises. Distinct titles: ${Array.from(arrayTitles).join(", ")}`);
assert(arrayTitles.size >= 3, "Array exercises are diverse and non-repeating");

// 3. Test Conditionals topic generation
const ifTitles = new Set();
for (let i = 0; i < 6; i++) {
  const ex = aiGen.generateProceduralExercise("if-else", "easy");
  assert(aiGen.validateExercise(ex), `If-else exercise ${i + 1} is valid`);
  ifTitles.add(ex.title);
}
console.log(`Generated 6 if-else exercises. Distinct titles: ${Array.from(ifTitles).join(", ")}`);
assert(ifTitles.size >= 3, "If-else exercises are diverse and non-repeating");

// 4. Test Large Exercise Index URL Routing (> 3 up to 100)
console.log("\n=== Testing Router for High Exercise Counts (e.g. 15, 31) ===");
const route15 = router.parseHash("#/topic/object/easy/15");
assert(route15.exerciseNumber === 15 && route15.exerciseIndex === 14, "Router correctly handles exercise 15 (index 14)");

const route31 = router.parseHash("#/topic/object/easy/31");
assert(route31.exerciseNumber === 31 && route31.exerciseIndex === 30, "Router correctly handles exercise 31 (index 30)");

const routeUrl = router.buildUrl("object", "easy", 30);
assert(routeUrl === "#/topic/object/easy/31", "buildUrl correctly generates URL for exercise 31");

console.log("\nALL ANTI-REPETITION & HIGH COUNT ROUTING TESTS PASSED (100% SUCCESS)!");
