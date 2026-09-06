// js/domSandbox.js
// Safe execution sandbox for function and DOM exercises with deep equality, error trapping, and timeout protection.

class SandboxEngine {
  constructor() {
    this.iframe = null;
    this.timeoutMs = 2500;
    this.initIframe();
  }

  initIframe() {
    if (typeof document === "undefined") return;
    // Re-use or create hidden sandbox iframe
    let existing = document.getElementById("sandbox-iframe");
    if (existing) {
      existing.remove();
    }

    this.iframe = document.createElement("iframe");
    this.iframe.id = "sandbox-iframe";
    this.iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");
    this.iframe.src = "about:blank";
    this.iframe.style.position = "fixed";
    this.iframe.style.top = "-9999px";
    this.iframe.style.left = "-9999px";
    this.iframe.style.width = "400px";
    this.iframe.style.height = "400px";
    this.iframe.style.opacity = "0";
    this.iframe.style.pointerEvents = "none";
    document.body.appendChild(this.iframe);
  }

  // Deep equality comparison
  deepEqual(a, b) {
    if (Object.is(a, b)) return true;

    // Both NaN
    if (typeof a === "number" && typeof b === "number" && isNaN(a) && isNaN(b)) {
      return true;
    }

    // Dates
    if (a instanceof Date && b instanceof Date) {
      return a.getTime() === b.getTime();
    }

    // Error comparisons: allows comparing error strings e.g. "Error: Message" or Error instances
    if (a instanceof Error && typeof b === "string") {
      return `${a.name}: ${a.message}` === b || a.message === b;
    }
    if (b instanceof Error && typeof a === "string") {
      return `${b.name}: ${b.message}` === a || b.message === a;
    }
    if (a instanceof Error && b instanceof Error) {
      return a.name === b.name && a.message === b.message;
    }

    // If either is null or not an object
    if (a === null || b === null || typeof a !== "object" || typeof b !== "object") {
      return a === b;
    }

    // Arrays
    if (Array.isArray(a) !== Array.isArray(b)) {
      return false;
    }
    if (Array.isArray(a)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!this.deepEqual(a[i], b[i])) return false;
      }
      return true;
    }

    // Plain Objects
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
      if (!this.deepEqual(a[key], b[key])) return false;
    }

    return true;
  }

  // Format value for display in test results
  formatValue(val) {
    if (val === undefined) return "undefined";
    if (val === null) return "null";
    if (typeof val === "function") return val.toString();
    if (typeof val === "string") return `"${val}"`;
    if (val instanceof Date) return `Date("${val.toISOString()}")`;
    if (val instanceof Error) return `${val.name}: ${val.message}`;
    if (typeof val === "number" && isNaN(val)) return "NaN";
    try {
      return JSON.stringify(val, (k, v) => (typeof v === "function" ? v.toString() : v));
    } catch {
      return String(val);
    }
  }

  // Execute Function Exercise
  async runFunctionExercise(exercise, userCode) {
    const results = [];
    let allPassed = true;

    // Extract function name from signature or exercise
    const fnMatch = exercise.starterCode.match(/function\s+([a-zA-Z0-9_$]+)/);
    const fnName = fnMatch ? fnMatch[1] : null;

    for (let i = 0; i < exercise.testCases.length; i++) {
      const tc = exercise.testCases[i];
      const startTime = performance.now();
      let actual = undefined;
      let error = null;
      let passed = false;

      try {
        const runPromise = new Promise((resolve, reject) => {
          try {
            // Construct executable wrapper
            const wrappedScript = `
              (() => {
                ${userCode}
                if (typeof ${fnName} !== 'function') {
                  throw new ReferenceError("Function '${fnName}' is not defined");
                }
                return ${fnName};
              })()
            `;

            let fn = null;

            // Attempt 1: Isolated iframe execution
            try {
              if (this.iframe && this.iframe.contentWindow) {
                const win = this.iframe.contentWindow;
                fn = win.eval(wrappedScript);
              }
            } catch (frameErr) {
              // If cross-origin or SecurityError occurs, fall back gracefully
              if (frameErr.name !== "SecurityError" && !frameErr.message?.includes("cross-origin")) {
                throw frameErr;
              }
            }

            // Attempt 2: Resilient fallback via Function constructor if iframe cross-origin access was restricted
            if (!fn) {
              fn = new Function(`
                "use strict";
                ${userCode}
                if (typeof ${fnName} !== 'function') {
                  throw new ReferenceError("Function '${fnName}' is not defined");
                }
                return ${fnName};
              `)();
            }

            // Execute with spread inputs
            const args = Array.isArray(tc.input) ? tc.input : [tc.input];
            // Clone arguments to avoid user mutations between runs
            const clonedArgs = args.map(arg => {
              if (arg instanceof Date) return new Date(arg.getTime());
              if (arg === null || typeof arg !== "object") return arg;
              try { return JSON.parse(JSON.stringify(arg)); } catch { return arg; }
            });

            const result = fn.apply(null, clonedArgs);
            resolve(result);
          } catch (err) {
            reject(err);
          }
        });

        // Race against timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Execution timed out (possible infinite loop)")), this.timeoutMs)
        );

        actual = await Promise.race([runPromise, timeoutPromise]);
      } catch (err) {
        error = err;
        actual = `${err.name}: ${err.message}`;
      }

      const executionTimeMs = Math.round((performance.now() - startTime) * 10) / 10;

      // Check expected
      if (typeof tc.expected === "string" && tc.expected.startsWith("Error:") && error) {
        // Matches expected error
        passed = actual === tc.expected || (error && error.message === tc.expected.replace(/^Error:\s*/, ""));
      } else if (typeof tc.expected === "string" && tc.expected.startsWith("TypeError:") && error) {
        passed = actual === tc.expected || (error && error.name === "TypeError");
      } else if (typeof tc.expected === "string" && tc.expected.startsWith("RangeError:") && error) {
        passed = actual === tc.expected || (error && error.name === "RangeError");
      } else if (error) {
        passed = false;
      } else {
        passed = this.deepEqual(actual, tc.expected);
      }

      if (!passed) allPassed = false;

      results.push({
        index: i + 1,
        passed,
        input: tc.input,
        expected: tc.expected,
        actual,
        error: error ? `${error.name}: ${error.message}` : null,
        executionTimeMs
      });
    }

    return {
      passed: allPassed,
      results
    };
  }

  // Execute DOM Exercise
  async runDomExercise(exercise, userCode) {
    const results = [];
    let allPassed = true;

    for (let i = 0; i < exercise.testCases.length; i++) {
      const tc = exercise.testCases[i];
      const startTime = performance.now();
      let actual = undefined;
      let error = null;
      let passed = false;

      try {
        const runPromise = new Promise((resolve, reject) => {
          try {
            let doc = null;
            let win = null;

            try {
              if (this.iframe) {
                doc = this.iframe.contentDocument;
                win = this.iframe.contentWindow;
              }
            } catch (frameErr) {
              // Frame access restricted
            }

            if (doc && win) {
              try {
                doc.open();
                doc.write(`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta charset="utf-8">
                      <style>
                        body { font-family: sans-serif; padding: 8px; margin: 0; }
                        .hidden { display: none !important; }
                      </style>
                    </head>
                    <body>
                      ${exercise.starterHtml || ""}
                    </body>
                  </html>
                `);
                doc.close();

                // Run test case setup if defined
                if (tc.setup) {
                  win.eval(tc.setup);
                }

                // Run user code
                win.eval(userCode);

                // Run check expression
                const checkVal = win.eval(tc.check);
                resolve(checkVal);
                return;
              } catch (writeErr) {
                if (writeErr.name !== "SecurityError" && !writeErr.message?.includes("cross-origin")) {
                  throw writeErr;
                }
              }
            }

            // Fallback for DOM when iframe cross-origin is blocked:
            // Use a detached container element in the host page
            let container = document.getElementById("dom-fallback-container");
            if (!container) {
              container = document.createElement("div");
              container.id = "dom-fallback-container";
              container.style.position = "fixed";
              container.style.top = "-9999px";
              container.style.left = "-9999px";
              container.style.opacity = "0";
              container.style.pointerEvents = "none";
              document.body.appendChild(container);
            }

            container.innerHTML = exercise.starterHtml || "";

            // Execute scripts inside starterHtml if any
            container.querySelectorAll("script").forEach(s => {
              try {
                (new Function(s.textContent))();
              } catch (e) {}
            });

            if (tc.setup) {
              (new Function(tc.setup))();
            }

            (new Function(userCode))();
            const checkVal = (new Function("return " + tc.check))();
            resolve(checkVal);
          } catch (err) {
            reject(err);
          }
        });

        // Timeout race
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("DOM Execution timed out")), this.timeoutMs)
        );

        actual = await Promise.race([runPromise, timeoutPromise]);
      } catch (err) {
        error = err;
        actual = `${err.name}: ${err.message}`;
      }

      const executionTimeMs = Math.round((performance.now() - startTime) * 10) / 10;

      passed = !error && this.deepEqual(actual, tc.expected);
      if (!passed) allPassed = false;

      results.push({
        index: i + 1,
        passed,
        check: tc.check,
        expected: tc.expected,
        actual,
        error: error ? `${error.name}: ${error.message}` : null,
        executionTimeMs
      });
    }

    return {
      passed: allPassed,
      results
    };
  }

  // Unified runner dispatcher
  async runExercise(exercise, userCode) {
    if (exercise.type === "dom-task") {
      return await this.runDomExercise(exercise, userCode);
    } else {
      return await this.runFunctionExercise(exercise, userCode);
    }
  }
}

// Attach to window
if (typeof window !== "undefined") {
  window.SandboxEngine = SandboxEngine;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = SandboxEngine;
}
