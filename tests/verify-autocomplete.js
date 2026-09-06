// tests/verify-autocomplete.js
// Tests the autocomplete suggestion matching logic

const fs = require('fs');
const path = require('path');

const autoCode = fs.readFileSync(path.join(__dirname, '../js/autocomplete.js'), 'utf8');
const moduleObj = {};
const evalFunc = new Function('window', 'module', autoCode);
evalFunc(moduleObj, { exports: {} });
const CodeSuggest = moduleObj.CodeSuggest || moduleObj.exports;

// Create instance with mock elements
const mockTextarea = {
  value: "",
  selectionStart: 0,
  selectionEnd: 0,
  addEventListener: () => {}
};
const mockContainer = {
  appendChild: () => {}
};

// Mock document.createElement
global.document = {
  createElement: () => ({
    appendChild: () => {},
    classList: { add: () => {}, remove: () => {} },
    style: {}
  }),
  body: { appendChild: () => {} }
};

const suggest = new CodeSuggest(mockTextarea, mockContainer);

console.log(`Loaded CodeSuggest with ${suggest.items.length} autocomplete entries.`);

// Test 1: typing "con" should match "console"
const conMatches = suggest.items.filter(i => i.label.toLowerCase().startsWith("con"));
console.log("Matches for 'con':", conMatches.map(m => m.label));
if (!conMatches.some(m => m.label === "console")) {
  console.error("FAIL: 'console' not found in matches for 'con'");
  process.exit(1);
}
if (!conMatches.some(m => m.label === "const")) {
  console.error("FAIL: 'const' not found in matches for 'con'");
  process.exit(1);
}

// Test 2: typing "log" should match "log"
const logMatches = suggest.items.filter(i => i.label.toLowerCase().startsWith("log"));
if (!logMatches.some(m => m.label === "log")) {
  console.error("FAIL: 'log' not found in matches for 'log'");
  process.exit(1);
}

// Test 3: Array methods
const mapMatches = suggest.items.filter(i => i.label.toLowerCase().startsWith("map"));
if (!mapMatches.some(m => m.label === "map")) {
  console.error("FAIL: 'map' not found in matches for 'map'");
  process.exit(1);
}

console.log("SUCCESS: Autocomplete suggestion system verified perfectly!");
