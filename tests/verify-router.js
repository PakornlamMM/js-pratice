// tests/verify-router.js
// Automated verification for AppRouter (hash parsing, URL formatting, and safe fallbacks).

const fs = require('fs');
const path = require('path');

const AppRouter = require('../js/router.js');
const router = new AppRouter();

const assert = (cond, msg) => {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
  console.log(`PASS: ${msg}`);
};

console.log("--- Testing AppRouter Hash Parsing ---");

// 1. Root and empty hashes
assert(router.parseHash("").view === "home", "Empty hash routes to home");
assert(router.parseHash("#").view === "home", "Single hash '#' routes to home");
assert(router.parseHash("#/").view === "home", "'#/' routes to home");
assert(router.parseHash("/").view === "home", "'/' routes to home");

// 2. Topic view
const topicRoute = router.parseHash("#/topic/array");
assert(topicRoute.view === "topic" && topicRoute.topic === "array", "#/topic/array parses to topic view");

const domTopicRoute = router.parseHash("#/topic/dom");
assert(domTopicRoute.view === "topic" && domTopicRoute.topic === "dom", "#/topic/dom parses to topic view");

// 3. Topic + Difficulty (Default exercise 1)
const diffRoute = router.parseHash("#/topic/date/medium");
assert(
  diffRoute.view === "exercise" &&
  diffRoute.topic === "date" &&
  diffRoute.difficulty === "medium" &&
  diffRoute.exerciseIndex === 0 &&
  diffRoute.exerciseNumber === 1,
  "#/topic/date/medium defaults to exercise index 0 (exercise 1)"
);

// 4. Topic + Difficulty + Exercise Index (1-indexed in URL)
const ex2Route = router.parseHash("#/topic/array/easy/2");
assert(
  ex2Route.view === "exercise" &&
  ex2Route.topic === "array" &&
  ex2Route.difficulty === "easy" &&
  ex2Route.exerciseIndex === 1 &&
  ex2Route.exerciseNumber === 2,
  "#/topic/array/easy/2 parses to exercise index 1 (exercise 2 of 3)"
);

const ex3Route = router.parseHash("#/topic/object/hard/3");
assert(
  ex3Route.view === "exercise" &&
  ex3Route.topic === "object" &&
  ex3Route.difficulty === "hard" &&
  ex3Route.exerciseIndex === 2 &&
  ex3Route.exerciseNumber === 3,
  "#/topic/object/hard/3 parses to exercise index 2 (exercise 3 of 3)"
);

// 5. Clamping and index bounds safety
const clampHigh = router.parseHash("#/topic/array/easy/999");
assert(clampHigh.exerciseNumber === 100 && clampHigh.exerciseIndex === 99, "Out of bounds exercise 999 clamped to 100");

const clampLow = router.parseHash("#/topic/array/easy/0");
assert(clampLow.exerciseNumber === 1, "Non-positive exercise 0 clamped to 1");

// 6. Defensive Fallbacks on invalid input
const invalidTopic = router.parseHash("#/topic/quantum-computing");
assert(invalidTopic.view === "home" && invalidTopic.fallback === true, "Invalid topic falls back safely to home");

const invalidDiff = router.parseHash("#/topic/array/impossible");
assert(invalidDiff.view === "topic" && invalidDiff.topic === "array", "Invalid difficulty falls back to topic view");

const randomGarbage = router.parseHash("#/some/totally/unsupported/route");
assert(randomGarbage.view === "home" && randomGarbage.fallback === true, "Unsupported path falls back safely to home");

// 7. URL Building
console.log("\n--- Testing URL Builder ---");
assert(router.buildUrl() === "#/", "Empty arguments build root '#/'");
assert(router.buildUrl("array") === "#/topic/array", "Topic only builds '#/topic/array'");
assert(router.buildUrl("date", "hard", 0) === "#/topic/date/hard/1", "Exercise index 0 formats as 1 in URL");
assert(router.buildUrl("dom", "medium", 2) === "#/topic/dom/medium/3", "Exercise index 2 formats as 3 in URL");

// 8. Event Subscription
console.log("\n--- Testing Subscription Listener ---");
let receivedRoute = null;
router.onRoute(route => {
  receivedRoute = route;
});
router.notifyListeners({ view: "exercise", topic: "array", difficulty: "easy", exerciseIndex: 0 });
assert(receivedRoute && receivedRoute.topic === "array", "Subscriber callback receives dispatched route");

console.log("\nALL ROUTER TESTS PASSED (100% SUCCESS)!");
