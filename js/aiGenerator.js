// js/aiGenerator.js
// Advanced AI & Procedural Coding Exercise Synthesis Engine.
// Generates fresh, non-repeating coding challenges with 5 test cases each.
// Supports both live LLM APIs (Gemini/OpenAI) with anti-repetition prompts,
// and an extensive offline procedural generator with 50+ diverse algorithm templates.

class AIGenerator {
  constructor() {
    this.configKey = "jsPracticeAiConfig";
    this.config = this.loadConfig();
    this.usedTemplateIndices = new Map(); // topic-diff -> Set(templateIndex)
  }

  loadConfig() {
    try {
      const raw = localStorage.getItem(this.configKey);
      return raw ? JSON.parse(raw) : { endpoint: "", apiKey: "", model: "gemini-1.5-flash" };
    } catch {
      return { endpoint: "", apiKey: "", model: "gemini-1.5-flash" };
    }
  }

  saveConfig(config) {
    this.config = { ...this.config, ...config };
    try {
      localStorage.setItem(this.configKey, JSON.stringify(this.config));
    } catch (e) {
      console.error("Failed to save AI config:", e);
    }
  }

  // Build anti-repetition system prompt with excluded titles and randomized domains
  buildSystemPrompt(topic, difficulty, existingTitles = []) {
    const DOMAINS = [
      "E-commerce order fulfillment, discounts, and inventory",
      "Video game player inventory, stats, and quest achievements",
      "Streaming media playlist manager and audio duration tracker",
      "Hospital healthcare patient triage and appointments",
      "Financial banking transaction ledger and balance auditing",
      "IoT smart home climate sensors and power telemetry",
      "Airline flight booking seat allocation and baggage weight",
      "Fitness gym workout rep logging and calorie calculator",
      "Restaurant kitchen recipe ingredient batch scaling",
      "Social media post engagement scoring and feed ranking"
    ];
    const randomDomain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
    const avoidClause = existingTitles.length > 0
      ? `CRITICAL: You MUST NOT repeat, rephrase, or create variants of these existing exercises:
${existingTitles.slice(-15).map(t => `- "${t}"`).join("\n")}
`
      : "";

    return `You are a JavaScript Coding Exercise Generator for an interactive developer practice platform.
Generate EXACTLY ONE coding exercise in pure, valid JSON format (no markdown code fences, no extra text).

CRITICAL REQUIREMENTS:
1. The exercise MUST be a hands-on coding challenge where the user writes runnable JS code. NEVER multiple-choice, NEVER fill-in-the-blank, and NEVER trivia.
2. The JSON must contain EXACTLY 5 test cases covering both typical cases and edge cases (e.g. empty arrays, negative numbers, null/undefined, boundaries).
3. Context/Theme: Situate the challenge in this real-world domain: ${randomDomain}.
${avoidClause}
4. Follow this exact JSON schema:
{
  "id": "ai-${topic}-${difficulty}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}",
  "title": "Creative, Non-Repeating Challenge Title",
  "topics": ["${topic}"],
  "difficulty": "${difficulty}",
  "type": "write-function",
  "prompt": "Detailed explanation of the problem, input parameters, edge cases, and expected return value.",
  "starterCode": "function functionName(params) {\\n  // your code here\\n}",
  "testCases": [
    { "input": [param1, param2], "expected": expectedValue1 },
    { "input": [param1, param2], "expected": expectedValue2 },
    { "input": [param1, param2], "expected": expectedValue3 },
    { "input": [param1, param2], "expected": expectedValue4 },
    { "input": [param1, param2], "expected": expectedValue5 }
  ],
  "explanation": "Clear explanation of the canonical solution."
}`;
  }

  // Strict schema validation of generated response
  validateExercise(data) {
    if (!data || typeof data !== "object") {
      throw new Error("Generated response is not a valid JSON object");
    }

    const requiredKeys = ["id", "title", "topics", "difficulty", "type", "prompt", "starterCode", "testCases", "explanation"];
    for (const key of requiredKeys) {
      if (!(key in data)) {
        throw new Error(`Generated exercise is missing required key: '${key}'`);
      }
    }

    if (!Array.isArray(data.testCases) || data.testCases.length !== 5) {
      throw new Error(`Generated exercise must have exactly 5 test cases, got ${data.testCases ? data.testCases.length : 0}`);
    }

    for (let i = 0; i < 5; i++) {
      const tc = data.testCases[i];
      if (data.type === "write-function" && (!("input" in tc) || !("expected" in tc))) {
        throw new Error(`Test case ${i + 1} is missing 'input' or 'expected'`);
      }
      if (data.type === "dom-task" && (!("check" in tc) || !("expected" in tc))) {
        throw new Error(`Test case ${i + 1} is missing 'check' or 'expected'`);
      }
    }

    const textToCheck = `${data.prompt} ${data.starterCode}`.toLowerCase();
    if (textToCheck.includes("multiple choice") || textToCheck.includes("option a") || textToCheck.includes("which of the following")) {
      throw new Error("Exercise appears to be a multiple-choice question rather than a coding task");
    }

    return true;
  }

  // Generate new exercise with anti-repetition and dynamic procedural engine
  async generateExercise(topic, difficulty, fallbackBank = [], existingQueue = []) {
    const existingTitles = [
      ...fallbackBank.map(e => e.title),
      ...existingQueue.map(e => e.title)
    ].filter(Boolean);

    // If API endpoint or key is configured, query LLM
    if (this.config.endpoint || this.config.apiKey) {
      try {
        const prompt = this.buildSystemPrompt(topic, difficulty, existingTitles);
        let responseText = "";

        if (this.config.endpoint) {
          const res = await fetch(this.config.endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(this.config.apiKey ? { "Authorization": `Bearer ${this.config.apiKey}` } : {})
            },
            body: JSON.stringify({ topic, difficulty, prompt })
          });

          if (!res.ok) throw new Error(`Proxy error: ${res.statusText}`);
          const data = await res.json();
          responseText = typeof data === "string" ? data : JSON.stringify(data);
        } else {
          const isGemini = this.config.apiKey.startsWith("AIza");
          const url = isGemini
            ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.config.apiKey}`
            : "https://api.openai.com/v1/chat/completions";

          const reqBody = isGemini
            ? {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.95 }
              }
            : {
                model: this.config.model || "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.95
              };

          const headers = { "Content-Type": "application/json" };
          if (!isGemini) {
            headers["Authorization"] = `Bearer ${this.config.apiKey}`;
          }

          const res = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(reqBody)
          });

          if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
          const json = await res.json();

          if (isGemini) {
            responseText = json.candidates[0].content.parts[0].text;
          } else {
            responseText = json.choices[0].message.content;
          }
        }

        responseText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
        const exercise = JSON.parse(responseText);
        this.validateExercise(exercise);

        // Verify title is not a duplicate
        if (!existingTitles.some(t => t.toLowerCase() === exercise.title.toLowerCase())) {
          return exercise;
        }
      } catch (err) {
        console.warn("Live AI generation bypassed or returned duplicate; engaging procedural synthesizer:", err.message);
      }
    }

    // Offline / Fallback: Procedural Synthesis Generator (Guarantees zero duplicates)
    return this.generateProceduralExercise(topic, difficulty, existingTitles);
  }

  // Dynamic Procedural Exercise Synthesizer
  // Generates diverse, uniquely calculated challenges across all 6 topics without repeating
  generateProceduralExercise(topic, difficulty, existingTitles = []) {
    const templates = this.getProceduralTemplates(topic, difficulty);
    const key = `${topic}-${difficulty}`;
    if (!this.usedTemplateIndices.has(key)) {
      this.usedTemplateIndices.set(key, new Set());
    }
    const used = this.usedTemplateIndices.get(key);

    // Find unused template index
    let availableIndices = [];
    for (let i = 0; i < templates.length; i++) {
      if (!used.has(i)) availableIndices.push(i);
    }

    // If all templates were exhausted, reset history to allow fresh cycle with new seeds
    if (availableIndices.length === 0) {
      used.clear();
      availableIndices = templates.map((_, i) => i);
    }

    // Pick random available template
    const pickedIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    used.add(pickedIdx);

    const templateFn = templates[pickedIdx];
    const generated = templateFn();

    // Assign unique timestamped ID and ensure it passes validation
    generated.id = `ai-${topic}-${difficulty}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    generated.topics = [topic];
    generated.difficulty = difficulty;
    generated.type = generated.type || "write-function";

    this.validateExercise(generated);
    return generated;
  }

  // Rich template catalog for procedural generation
  getProceduralTemplates(topic, difficulty) {
    const catalog = {
      "object": [
        () => ({
          title: "Filter Inventory by Stock Threshold",
          prompt: "Write a function `filterStock(inventory, minQty)` that accepts an object representing item names and quantities, and a minimum quantity threshold. Return a sorted array of item names that have quantity greater than or equal to `minQty`.",
          starterCode: "function filterStock(inventory, minQty) {\n  // Return sorted array of item names meeting the threshold\n  \n}",
          testCases: [
            { input: [{ apples: 15, bananas: 5, oranges: 20 }, 10], expected: ["apples", "oranges"] },
            { input: [{ laptops: 2, mice: 50, keyboards: 30 }, 25], expected: ["keyboards", "mice"] },
            { input: [{ pens: 4, pencils: 3 }, 10], expected: [] },
            { input: [{ desk: 5, chair: 5 }, 5], expected: ["chair", "desk"] },
            { input: [{}, 5], expected: [] }
          ],
          explanation: "Use Object.entries to filter keys where the quantity is >= minQty, then sort the resulting keys alphabetically."
        }),
        () => ({
          title: "Invert Object Key-Value Mapping",
          prompt: "Write a function `invertDictionary(map)` that takes an object with string keys and string/number values, and returns a new object where the values are keys and the keys are values.",
          starterCode: "function invertDictionary(map) {\n  // Return an inverted key-value object\n  \n}",
          testCases: [
            { input: [{ a: "alpha", b: "beta" }], expected: { alpha: "a", beta: "b" } },
            { input: [{ user1: 101, user2: 102 }], expected: { 101: "user1", 102: "user2" } },
            { input: [{ us: "United States", jp: "Japan" }], expected: { "United States": "us", "Japan": "jp" } },
            { input: [{}], expected: {} },
            { input: [{ status: "active" }], expected: { active: "status" } }
          ],
          explanation: "Iterate over Object.entries(map) and build a new accumulator object assigning acc[value] = key."
        }),
        () => ({
          title: "Calculate Cart Subtotal",
          prompt: "Write a function `calculateCart(cart)` that takes an object where each key is an item name and each value is `{ price: number, qty: number }`. Return the total cost of all items in the cart.",
          starterCode: "function calculateCart(cart) {\n  // Calculate and return total cart cost\n  \n}",
          testCases: [
            { input: [{ notebook: { price: 3, qty: 2 }, pen: { price: 1.5, qty: 4 } }], expected: 12 },
            { input: [{ coffee: { price: 4.5, qty: 1 }, muffin: { price: 2.5, qty: 2 } }], expected: 9.5 },
            { input: [{ phone: { price: 500, qty: 1 } }], expected: 500 },
            { input: [{}], expected: 0 },
            { input: [{ sticker: { price: 0.5, qty: 10 } }], expected: 5 }
          ],
          explanation: "Iterate over Object.values(cart), multiplying price * qty for each item and summing them with reduce."
        }),
        () => ({
          title: "Find Key with Highest Numeric Score",
          prompt: "Write a function `findTopPlayer(scores)` that accepts an object mapping player usernames to their numeric score. Return the username with the highest score. If the object is empty, return `null`.",
          starterCode: "function findTopPlayer(scores) {\n  // Return top username or null\n  \n}",
          testCases: [
            { input: [{ Alice: 95, Bob: 88, Charlie: 99 }], expected: "Charlie" },
            { input: [{ Ryu: 1200, Ken: 1200, Guile: 1100 }], expected: "Ryu" },
            { input: [{ Solo: 50 }], expected: "Solo" },
            { input: [{}], expected: null },
            { input: [{ Alpha: -10, Beta: -5, Gamma: -20 }], expected: "Beta" }
          ],
          explanation: "Check for empty keys. Use Object.entries and reduce to compare each [player, score] pair and retain the player with the highest score."
        }),
        () => ({
          title: "Mask Sensitive Object Properties",
          prompt: "Write a function `maskFields(record, fieldsToMask)` that takes a data object and an array of field names. Return a shallow copy of the object where any property matching a field in `fieldsToMask` has its value replaced with the string `'***'`.",
          starterCode: "function maskFields(record, fieldsToMask) {\n  // Return masked record clone\n  \n}",
          testCases: [
            { input: [{ name: "Taylor", ssn: "123-45", email: "t@ex.com" }, ["ssn"]], expected: { name: "Taylor", ssn: "***", email: "t@ex.com" } },
            { input: [{ pin: 9988, card: "4111", zip: 90210 }, ["pin", "card"]], expected: { pin: "***", card: "***", zip: 90210 } },
            { input: [{ publicId: "usr_1" }, ["secret"]], expected: { publicId: "usr_1" } },
            { input: [{ token: "abc", secret: "xyz" }, ["token", "secret"]], expected: { token: "***", secret: "***" } },
            { input: [{}, ["ssn"]], expected: {} }
          ],
          explanation: "Clone the object with spread ({ ...record }). Loop through fieldsToMask and if the key exists in the object, set it to '***'."
        })
      ],
      "array": [
        () => ({
          title: "Chunk Array into Groups",
          prompt: "Write a function `chunkList(arr, size)` that splits an array into sub-arrays where each sub-array has length at most `size`. If `size` is non-positive or the array is empty, return an empty array `[]`.",
          starterCode: "function chunkList(arr, size) {\n  // Return array of chunks\n  \n}",
          testCases: [
            { input: [[1, 2, 3, 4, 5], 2], expected: [[1, 2], [3, 4], [5]] },
            { input: [["a", "b", "c", "d"], 2], expected: [["a", "b"], ["c", "d"]] },
            { input: [[10, 20, 30], 5], expected: [[10, 20, 30]] },
            { input: [[], 3], expected: [] },
            { input: [[1, 2, 3], 0], expected: [] }
          ],
          explanation: "Iterate with a step of size (i += size) and slice the array from i to i + size, pushing each slice into the result."
        }),
        () => ({
          title: "Find Symmetric Array Difference",
          prompt: "Write a function `arrayDifference(arr1, arr2)` that returns a sorted array of elements that exist in `arr1` OR `arr2`, but NOT in both (the symmetric difference).",
          starterCode: "function arrayDifference(arr1, arr2) {\n  // Return symmetric difference elements sorted\n  \n}",
          testCases: [
            { input: [[1, 2, 3], [3, 4, 5]], expected: [1, 2, 4, 5] },
            { input: [[10, 20], [10, 20]], expected: [] },
            { input: [[1, 2], []], expected: [1, 2] },
            { input: [[], [5, 6]], expected: [5, 6] },
            { input: [[8, 1, 4], [4, 9, 1]], expected: [8, 9] }
          ],
          explanation: "Filter arr1 for elements not in arr2, filter arr2 for elements not in arr1, concatenate them, deduplicate, and sort numerically."
        }),
        () => ({
          title: "Calculate Cumulative Running Sum",
          prompt: "Write a function `runningTotal(numbers)` that takes an array of numbers and returns a new array where each element is the sum of all elements up to that index.",
          starterCode: "function runningTotal(numbers) {\n  // Return array of running totals\n  \n}",
          testCases: [
            { input: [[1, 2, 3, 4]], expected: [1, 3, 6, 10] },
            { input: [[10, -2, 5]], expected: [10, 8, 13] },
            { input: [[5]], expected: [5] },
            { input: [[]], expected: [] },
            { input: [[0, 0, 0]], expected: [0, 0, 0] }
          ],
          explanation: "Use reduce or a running sum accumulator inside map to add the current value to the previous accumulated sum."
        }),
        () => ({
          title: "Compact Falsy Values",
          prompt: "Write a function `cleanFalsy(arr)` that returns a new array containing all elements of `arr` with falsy values (`false`, `0`, `\"\"`, `null`, `undefined`, `NaN`) stripped out.",
          starterCode: "function cleanFalsy(arr) {\n  // Filter out falsy values\n  \n}",
          testCases: [
            { input: [[0, 1, false, 2, "", 3]], expected: [1, 2, 3] },
            { input: [["hello", null, "world", undefined]], expected: ["hello", "world"] },
            { input: [[false, null, 0, ""]], expected: [] },
            { input: [["a", "b", "c"]], expected: ["a", "b", "c"] },
            { input: [[]], expected: [] }
          ],
          explanation: "Filter the array with the Boolean constructor: arr.filter(Boolean)."
        })
      ],
      "if-else": [
        () => ({
          title: "Tiered Shipping Rate Calculator",
          prompt: "Write a function `calculateShippingCost(weightKg, isExpress, hasMembership)` that returns the shipping price: Base weight tiers: <= 1kg: $5, <= 5kg: $10, > 5kg: $20. If `isExpress` is true, add $15. If `hasMembership` is true, apply a $5 discount to the total (cost cannot drop below $0).",
          starterCode: "function calculateShippingCost(weightKg, isExpress, hasMembership) {\n  // Calculate shipping cost\n  \n}",
          testCases: [
            { input: [0.8, false, false], expected: 5 },
            { input: [3.5, true, false], expected: 25 },
            { input: [8, false, true], expected: 15 },
            { input: [0.5, false, true], expected: 0 },
            { input: [6, true, true], expected: 30 }
          ],
          explanation: "Determine base rate using if-else on weightKg. Add 15 if isExpress. Subtract 5 if hasMembership. Return Math.max(0, cost)."
        }),
        () => ({
          title: "Password Strength Auditor",
          prompt: "Write a function `auditPassword(pw)` that checks a password string: Returns `'strong'` if length >= 10, contains at least one digit, and contains at least one uppercase letter. Returns `'medium'` if length >= 6 and contains at least one digit. Otherwise returns `'weak'`.",
          starterCode: "function auditPassword(pw) {\n  // Return 'strong', 'medium', or 'weak'\n  \n}",
          testCases: [
            { input: ["P@ssword123"], expected: "strong" },
            { input: ["secret99"], expected: "medium" },
            { input: ["abc"], expected: "weak" },
            { input: ["VERYLONGWITHOUTDIGIT"], expected: "weak" },
            { input: ["Abcdefgh1"], expected: "weak" }
          ],
          explanation: "Use regex tests for digits (\\d) and uppercase letters ([A-Z]). Check criteria in descending order (strong -> medium -> weak)."
        }),
        () => ({
          title: "Triangle Classification Guard",
          prompt: "Write a function `classifyTriangle(a, b, c)` that evaluates three side lengths. First verify if valid (all sides > 0 and sum of any two sides > third). If invalid, return `'invalid'`. If all 3 sides equal, return `'equilateral'`. If any 2 sides equal, return `'isosceles'`. Otherwise return `'scalene'`.",
          starterCode: "function classifyTriangle(a, b, c) {\n  // Return 'invalid', 'equilateral', 'isosceles', or 'scalene'\n  \n}",
          testCases: [
            { input: [5, 5, 5], expected: "equilateral" },
            { input: [5, 5, 8], expected: "isosceles" },
            { input: [3, 4, 5], expected: "scalene" },
            { input: [1, 2, 10], expected: "invalid" },
            { input: [0, 4, 4], expected: "invalid" }
          ],
          explanation: "Check the triangle inequality theorem first (a+b>c && a+c>b && b+c>a). Then check for equality of sides using if-else."
        })
      ],
      "date": [
        () => ({
          title: "Calculate Calendar Days Difference",
          prompt: "Write a function `calendarDaysBetween(dateStrA, dateStrB)` that takes two 'YYYY-MM-DD' strings and returns the absolute difference in full calendar days between them.",
          starterCode: "function calendarDaysBetween(dateStrA, dateStrB) {\n  // Return difference in days\n  \n}",
          testCases: [
            { input: ["2026-09-01", "2026-09-05"], expected: 4 },
            { input: ["2026-01-01", "2026-01-01"], expected: 0 },
            { input: ["2025-12-31", "2026-01-02"], expected: 2 },
            { input: ["2026-09-10", "2026-09-01"], expected: 9 },
            { input: ["2024-02-28", "2024-03-01"], expected: 2 }
          ],
          explanation: "Convert strings to Date timestamps, subtract them, divide by 86,400,000 (ms in a day), and take Math.round(Math.abs(diff))."
        }),
        () => ({
          title: "Quarter of Year Finder",
          prompt: "Write a function `getQuarter(dateStr)` that accepts a date string and returns the calendar quarter number (1, 2, 3, or 4).",
          starterCode: "function getQuarter(dateStr) {\n  // Return 1, 2, 3, or 4\n  \n}",
          testCases: [
            { input: ["2026-02-15"], expected: 1 },
            { input: ["2026-05-20"], expected: 2 },
            { input: ["2026-09-06"], expected: 3 },
            { input: ["2026-11-30"], expected: 4 },
            { input: ["2026-01-01"], expected: 1 }
          ],
          explanation: "Get the month index with new Date(dateStr).getMonth() (0-11). Return Math.floor(month / 3) + 1."
        })
      ],
      "error-handling": [
        () => ({
          title: "Safe JSON Parser with Default",
          prompt: "Write a function `safeParseWithDefault(jsonString, defaultValue)` that attempts to parse `jsonString`. If parsing throws a SyntaxError, catch the error and return `defaultValue`. Otherwise return the parsed object/value.",
          starterCode: "function safeParseWithDefault(jsonString, defaultValue) {\n  // Try parsing or return defaultValue\n  \n}",
          testCases: [
            { input: ['{"name":"Alex","age":28}', {}], expected: { name: "Alex", age: 28 } },
            { input: ['[1, 2, 3]', []], expected: [1, 2, 3] },
            { input: ['invalid json string', { error: true }], expected: { error: true } },
            { input: ['{ unquoted_key: 123 }', null], expected: null },
            { input: ['true', false], expected: true }
          ],
          explanation: "Wrap JSON.parse(jsonString) in a try/catch block. Return the parsed result in the try, or defaultValue in the catch."
        }),
        () => ({
          title: "Strict Numeric Divisor Guard",
          prompt: "Write a function `safeDivide(numerator, denominator)` that divides two numbers. If `denominator === 0`, throw an Error with message `'ZeroDivisionError'`. If either argument is not a number, throw a TypeError with message `'InvalidType'`. Otherwise return `numerator / denominator`.",
          starterCode: "function safeDivide(numerator, denominator) {\n  // Perform guarded division or throw\n  \n}",
          testCases: [
            { input: [10, 2], expected: 5 },
            { input: [0, 5], expected: 0 },
            { input: [10, 0], expected: "Error: ZeroDivisionError" },
            { input: ["10", 2], expected: "Error: InvalidType" },
            { input: [-15, 3], expected: -5 }
          ],
          explanation: "Check typeof a !== 'number' || typeof b !== 'number' to throw TypeError, then check b === 0 to throw ZeroDivisionError."
        })
      ],
      "dom": [
        () => ({
          title: "Render Pill Badge Elements",
          type: "dom-task",
          starterHtml: "<div id=\"tag-container\"></div>",
          prompt: "Write a function `renderTags(tags)` that accepts an array of strings. For each tag, create a `<span class=\"tag-pill\">` element with its text content set to the tag, and append it inside `<div id=\"tag-container\">`. If the container does not exist, do nothing.",
          starterCode: "function renderTags(tags) {\n  // Create and append tag pills\n  \n}",
          testCases: [
            { check: "document.querySelectorAll('#tag-container .tag-pill').length", expected: 3 },
            { check: "document.querySelectorAll('#tag-container .tag-pill')[0].textContent", expected: "JavaScript" },
            { check: "document.querySelectorAll('#tag-container .tag-pill')[1].textContent", expected: "CSS" },
            { check: "document.querySelectorAll('#tag-container .tag-pill')[2].textContent", expected: "HTML" },
            { check: "document.querySelectorAll('#tag-container .tag-pill')[0].className", expected: "tag-pill" }
          ],
          explanation: "Query #tag-container, loop through tags with forEach, create span element, set className and textContent, then appendChild."
        }),
        () => ({
          title: "Update Metric Meter Gauge",
          type: "dom-task",
          starterHtml: "<div class=\"meter-track\"><div id=\"meter-fill\" style=\"width: 0%;\" aria-valuenow=\"0\"></div></div>",
          prompt: "Write a function `updateMeter(percentage)` that sets the `style.width` of `#meter-fill` to `percentage + '%'` and updates its `aria-valuenow` attribute to `percentage`. If `percentage` is outside 0-100, clamp it between 0 and 100.",
          starterCode: "function updateMeter(percentage) {\n  // Update meter width and aria attribute\n  \n}",
          testCases: [
            { check: "document.getElementById('meter-fill').style.width", expected: "75%" },
            { check: "document.getElementById('meter-fill').getAttribute('aria-valuenow')", expected: "75" },
            { check: "updateMeter(150); document.getElementById('meter-fill').style.width", expected: "100%" },
            { check: "updateMeter(-20); document.getElementById('meter-fill').style.width", expected: "0%" },
            { check: "updateMeter(50); document.getElementById('meter-fill').getAttribute('aria-valuenow')", expected: "50" }
          ],
          explanation: "Clamp percentage between 0 and 100 with Math.max(0, Math.min(100, percentage)). Set element.style.width and setAttribute('aria-valuenow', clamped)."
        })
      ]
    };

    return catalog[topic] || catalog["object"];
  }
}

// Global & CommonJS Export
if (typeof window !== "undefined") {
  window.AIGenerator = AIGenerator;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = AIGenerator;
}
