// tests/verify-security-cross-origin.js
// Verifies that SandboxEngine avoids cross-origin SecurityErrors and provides seamless fallbacks.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const bank = require('../js/exerciseBank.js');
const sandboxCode = fs.readFileSync(path.join(__dirname, '../js/domSandbox.js'), 'utf8');

const assert = (cond, msg) => {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
  console.log(`PASS: ${msg}`);
};

console.log("=== Testing SandboxEngine Cross-Origin Security Resilience ===");

// 1. Verify iframe attribute contains allow-same-origin
const mockIframe = {
  attributes: {},
  setAttribute(k, v) { this.attributes[k] = v; },
  style: {},
  contentWindow: {
    // Simulate GitHub Pages cross-origin block throwing SecurityError when eval is accessed
    get eval() {
      const err = new Error("Blocked a frame with origin \"https://pakornlammm.github.io\" from accessing a cross-origin frame.");
      err.name = "SecurityError";
      throw err;
    }
  },
  contentDocument: {
    open() {
      const err = new Error("Blocked a frame with origin \"https://pakornlammm.github.io\" from accessing a cross-origin frame.");
      err.name = "SecurityError";
      throw err;
    }
  }
};

const mockElements = {};
const mockDoc = {
  getElementById(id) { return mockElements[id] || null; },
  createElement(tag) {
    if (tag === 'iframe') return mockIframe;
    const el = {
      id: '',
      style: {},
      _html: '',
      get innerHTML() { return this._html; },
      set innerHTML(v) { this._html = v; },
      querySelectorAll() { return []; }
    };
    return el;
  },
  body: {
    appendChild(c) {
      if (c.id) mockElements[c.id] = c;
    }
  }
};

// Evaluate domSandbox.js in simulated browser environment
const env = {
  document: mockDoc,
  window: {},
  performance: { now: () => Date.now() },
  setTimeout: (fn) => setTimeout(fn, 0),
  clearTimeout: (id) => clearTimeout(id),
  console: console
};

vm.runInNewContext(sandboxCode, env);
const SandboxEngine = env.window.SandboxEngine || env.SandboxEngine;
const sandbox = new SandboxEngine();

// Verify sandbox attribute on created iframe
assert(mockIframe.attributes['sandbox'].includes('allow-scripts'), "Sandbox attribute includes allow-scripts");
assert(mockIframe.attributes['sandbox'].includes('allow-same-origin'), "Sandbox attribute includes allow-same-origin for GitHub Pages SOP compliance");

(async () => {
  // 2. Test function exercise when iframe eval throws SecurityError
  const funcEx = bank.find(b => b.id === 'array-easy-01');
  const workingCode = `function doubleNumbers(arr) { return arr.map(x => x * 2); }`;

  const result = await sandbox.runFunctionExercise(funcEx, workingCode);
  assert(result.passed === true, "Function exercise successfully evaluated via resilient fallback when iframe throws SecurityError");
  assert(result.results.length === 5, "All 5 test cases completed");
  assert(result.results.every(r => r.passed), "Every test case passed accurately");

  console.log("\nALL CROSS-ORIGIN SECURITY TESTS PASSED (100% SUCCESS)!");
})();
