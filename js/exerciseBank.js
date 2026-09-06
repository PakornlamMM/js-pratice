// js/exerciseBank.js
// 54 coding exercises covering 6 topics, 3 difficulties, with exactly 5 test cases each.

const exerciseBank = [
  // =========================================================================
  // TOPIC 1: IF-ELSE (9 exercises)
  // =========================================================================

  // Easy 1: categorizeAge
  {
    id: "if-else-easy-01",
    title: "Categorize Age",
    topics: ["if-else"],
    difficulty: "easy",
    type: "write-function",
    prompt: "Write a function `categorizeAge(age)` that returns a string classifying the age:\n- `'child'` if age is strictly less than 13\n- `'teen'` if age is between 13 and 17 (inclusive)\n- `'adult'` if age is between 18 and 64 (inclusive)\n- `'senior'` if age is 65 or older",
    starterCode: "function categorizeAge(age) {\n  // your code here\n}",
    testCases: [
      { input: [8], expected: "child" },
      { input: [13], expected: "teen" },
      { input: [17], expected: "teen" },
      { input: [25], expected: "adult" },
      { input: [65], expected: "senior" }
    ],
    explanation: "Use standard if / else if / else chain comparing age against numerical thresholds: `< 13`, `<= 17`, `<= 64`, and `else`."
  },

  // Easy 2: fizzBuzzSingle
  {
    id: "if-else-easy-02",
    title: "Single-Number FizzBuzz",
    topics: ["if-else"],
    difficulty: "easy",
    type: "write-function",
    prompt: "Write a function `fizzBuzzSingle(n)` that takes an integer `n` and returns:\n- `'FizzBuzz'` if `n` is divisible by both 3 and 5\n- `'Fizz'` if `n` is divisible by 3\n- `'Buzz'` if `n` is divisible by 5\n- The number as a string (e.g. `'7'`) otherwise",
    starterCode: "function fizzBuzzSingle(n) {\n  // your code here\n}",
    testCases: [
      { input: [15], expected: "FizzBuzz" },
      { input: [9], expected: "Fizz" },
      { input: [10], expected: "Buzz" },
      { input: [7], expected: "7" },
      { input: [30], expected: "FizzBuzz" }
    ],
    explanation: "Check the combined condition `n % 3 === 0 && n % 5 === 0` (or `n % 15 === 0`) first before checking individual divisors."
  },

  // Easy 3: checkPasswordStrength
  {
    id: "if-else-easy-03",
    title: "Password Strength Evaluator",
    topics: ["if-else"],
    difficulty: "easy",
    type: "write-function",
    prompt: "Write a function `checkPasswordStrength(pw)` that returns:\n- `'Weak'` if length is less than 6\n- `'Medium'` if length is 6 to 10 (inclusive)\n- If length is greater than 10:\n  - `'Strong'` if it contains at least one digit (0-9)\n  - `'Medium'` if it contains no digits",
    starterCode: "function checkPasswordStrength(pw) {\n  // your code here\n}",
    testCases: [
      { input: ["abc"], expected: "Weak" },
      { input: ["abcdef"], expected: "Medium" },
      { input: ["supersecret9"], expected: "Strong" },
      { input: ["supersecretlong"], expected: "Medium" },
      { input: ["12345"], expected: "Weak" }
    ],
    explanation: "Evaluate `pw.length` first, and if `pw.length > 10`, test for digits with `/[0-9]/.test(pw)`."
  },

  // Medium 1 (pairs with Array): filterPassingScores
  {
    id: "if-else-medium-01",
    title: "Filter Passing Scores",
    topics: ["if-else", "array"],
    difficulty: "medium",
    type: "write-function",
    prompt: "Write a function `filterPassingScores(scores, minPassing)` that takes an array of numerical scores and a minimum passing threshold. Use an if-else condition inside a loop or `.filter()` callback to return a new array containing only scores that meet or exceed `minPassing`.",
    starterCode: "function filterPassingScores(scores, minPassing) {\n  // your code here\n}",
    testCases: [
      { input: [[75, 40, 92, 58, 88], 60], expected: [75, 92, 88] },
      { input: [[50, 45, 30], 60], expected: [] },
      { input: [[100, 90, 80], 70], expected: [100, 90, 80] },
      { input: [[], 50], expected: [] },
      { input: [[60, 59, 61], 60], expected: [60, 61] }
    ],
    explanation: "Iterate through `scores` and use `if (score >= minPassing)` to push into the result, or return `score >= minPassing` in `.filter()`."
  },

  // Medium 2 (pairs with Date): isWeekend
  {
    id: "if-else-medium-02",
    title: "Weekend Detector",
    topics: ["if-else", "date"],
    difficulty: "medium",
    type: "write-function",
    prompt: "Write a function `isWeekend(dateInput)` that accepts a Date object or an ISO date string (e.g. `'2026-09-05'`). Using `new Date(dateInput).getUTCDay()`, return `true` if the day is Saturday (6) or Sunday (0), and `false` otherwise.",
    starterCode: "function isWeekend(dateInput) {\n  // your code here\n}",
    testCases: [
      { input: ["2026-09-05"], expected: true },
      { input: ["2026-09-06"], expected: true },
      { input: ["2026-09-07"], expected: false },
      { input: ["2026-09-04"], expected: false },
      { input: ["2026-09-02"], expected: false }
    ],
    explanation: "Instantiate `new Date(dateInput)` and check `const day = d.getUTCDay(); if (day === 0 || day === 6) return true; else return false;`"
  },

  // Medium 3 (pairs with Array): classifyTemperatures
  {
    id: "if-else-medium-03",
    title: "Classify Temperatures",
    topics: ["if-else", "array"],
    difficulty: "medium",
    type: "write-function",
    prompt: "Write a function `classifyTemperatures(temps)` that takes an array of temperature readings in Celsius and returns an object `{ hot: count, moderate: count, cold: count }`:\n- `hot`: temp > 30\n- `moderate`: 15 <= temp <= 30\n- `cold`: temp < 15",
    starterCode: "function classifyTemperatures(temps) {\n  // your code here\n}",
    testCases: [
      { input: [[35, 20, 10, 31, 15]], expected: { hot: 2, moderate: 2, cold: 1 } },
      { input: [[]], expected: { hot: 0, moderate: 0, cold: 0 } },
      { input: [[5, -2, 14]], expected: { hot: 0, moderate: 0, cold: 3 } },
      { input: [[32, 40]], expected: { hot: 2, moderate: 0, cold: 0 } },
      { input: [[15, 30, 25]], expected: { hot: 0, moderate: 3, cold: 0 } }
    ],
    explanation: "Initialize counters `{ hot: 0, moderate: 0, cold: 0 }` and loop through `temps`, incrementing the appropriate bucket using `if/else if/else`."
  },

  // Hard 1 (pairs with Object + Error handling): processTransaction
  {
    id: "if-else-hard-01",
    title: "Bank Account Transaction Validator",
    topics: ["if-else", "object", "error-handling"],
    difficulty: "hard",
    type: "write-function",
    prompt: "Write a function `processTransaction(account, transaction)` where:\n- `account` has `{ balance: number, active: boolean, limit: number }`\n- `transaction` has `{ type: 'deposit'|'withdraw', amount: number }`\n\nValidation rules (throw Error if violated):\n1. If `!account.active`, throw `new Error('Account inactive')`\n2. If `typeof transaction.amount !== 'number' || transaction.amount <= 0`, throw `new Error('Invalid amount')`\n3. If `transaction.type === 'withdraw'`:\n   - If `transaction.amount > account.limit`, throw `new Error('Exceeds limit')`\n   - If `transaction.amount > account.balance`, throw `new Error('Insufficient balance')`\n   - Deduct amount and return updated balance\n4. If `transaction.type === 'deposit'`, add amount and return updated balance\n5. Otherwise throw `new Error('Invalid transaction type')`",
    starterCode: "function processTransaction(account, transaction) {\n  // your code here\n}",
    testCases: [
      { input: [{ balance: 500, active: true, limit: 200 }, { type: "withdraw", amount: 150 }], expected: 350 },
      { input: [{ balance: 200, active: true, limit: 500 }, { type: "deposit", amount: 100 }], expected: 300 },
      { input: [{ balance: 1000, active: false, limit: 500 }, { type: "deposit", amount: 50 }], expected: "Error: Account inactive" },
      { input: [{ balance: 100, active: true, limit: 500 }, { type: "withdraw", amount: 250 }], expected: "Error: Insufficient balance" },
      { input: [{ balance: 800, active: true, limit: 100 }, { type: "withdraw", amount: 150 }], expected: "Error: Exceeds limit" }
    ],
    explanation: "Chain if/else statements validating each business rule. For error test cases, our sandbox catches throws and compares error message."
  },

  // Hard 2 (pairs with Object + Error handling): validateUserProfile
  {
    id: "if-else-hard-02",
    title: "User Profile Validator",
    topics: ["if-else", "object", "error-handling"],
    difficulty: "hard",
    type: "write-function",
    prompt: "Write a function `validateUserProfile(user)` that validates a user object `{ username, email, age, role }`:\n- If `!user || typeof user !== 'object'`, throw `new Error('Invalid payload')`\n- If `!user.username || user.username.trim().length < 3`, throw `new Error('Username too short')`\n- If `!user.email || !user.email.includes('@') || !user.email.includes('.')`, throw `new Error('Invalid email')`\n- If `typeof user.age !== 'number' || user.age < 18`, throw `new Error('Underage')`\n- If valid, return `{ valid: true, role: (user.role || 'member').toLowerCase() }`",
    starterCode: "function validateUserProfile(user) {\n  // your code here\n}",
    testCases: [
      { input: [{ username: "alice", email: "alice@example.com", age: 24, role: "ADMIN" }], expected: { valid: true, role: "admin" } },
      { input: [{ username: "al", email: "al@test.com", age: 30 }], expected: "Error: Username too short" },
      { input: [{ username: "bob", email: "bobtestcom", age: 25 }], expected: "Error: Invalid email" },
      { input: [{ username: "charlie", email: "charlie@web.com", age: 16 }], expected: "Error: Underage" },
      { input: [{ username: "dana", email: "dana@corp.org", age: 32 }], expected: { valid: true, role: "member" } }
    ],
    explanation: "Check each property sequentially using if-else and throw informative errors when a constraint fails."
  },

  // Hard 3 (pairs with Object + Error handling): applyDiscountRule
  {
    id: "if-else-hard-03",
    title: "Cart Discount Processor",
    topics: ["if-else", "object", "error-handling"],
    difficulty: "hard",
    type: "write-function",
    prompt: "Write a function `applyDiscountRule(cart, coupon)` where:\n- `cart` has `{ total: number }`\n- `coupon` has `{ percent: number, minSpend: number, active: boolean }`\n\nRules:\n- If `!coupon || !coupon.active`, throw `new Error('Coupon inactive')`\n- If `cart.total < (coupon.minSpend || 0)`, throw `new Error('Minimum spend not met')`\n- If `coupon.percent <= 0 || coupon.percent > 100`, throw `new Error('Invalid discount')`\n- Calculate savings = `(cart.total * coupon.percent) / 100`\n- Return `{ discountedTotal: +(cart.total - savings).toFixed(2), savings: +savings.toFixed(2) }`",
    starterCode: "function applyDiscountRule(cart, coupon) {\n  // your code here\n}",
    testCases: [
      { input: [{ total: 100 }, { percent: 20, minSpend: 50, active: true }], expected: { discountedTotal: 80, savings: 20 } },
      { input: [{ total: 200 }, { percent: 15, minSpend: 100, active: true }], expected: { discountedTotal: 170, savings: 30 } },
      { input: [{ total: 40 }, { percent: 10, minSpend: 50, active: true }], expected: "Error: Minimum spend not met" },
      { input: [{ total: 100 }, { percent: 10, minSpend: 50, active: false }], expected: "Error: Coupon inactive" },
      { input: [{ total: 150 }, { percent: 120, minSpend: 50, active: true }], expected: "Error: Invalid discount" }
    ],
    explanation: "Enforce coupon validation with conditionals, calculate discounted values, and round to 2 decimals using `+val.toFixed(2)`."
  },

  // =========================================================================
  // TOPIC 2: DATE OBJECT (9 exercises)
  // =========================================================================

  // Easy 1: getDaysInMonth
  {
    id: "date-easy-01",
    title: "Days in Month",
    topics: ["date"],
    difficulty: "easy",
    type: "write-function",
    prompt: "Write a function `getDaysInMonth(year, monthIndex)` that returns the total number of days in the specified month (0-indexed: 0 for January, 1 for February, etc.). Use the `Date` constructor's day 0 trick (`new Date(year, monthIndex + 1, 0).getDate()`).",
    starterCode: "function getDaysInMonth(year, monthIndex) {\n  // your code here\n}",
    testCases: [
      { input: [2024, 1], expected: 29 }, // leap year Feb
      { input: [2023, 1], expected: 28 }, // non-leap Feb
      { input: [2024, 0], expected: 31 }, // Jan
      { input: [2024, 3], expected: 30 }, // Apr
      { input: [2000, 1], expected: 29 }  // century leap Feb
    ],
    explanation: "Setting day to `0` in `new Date(year, monthIndex + 1, 0)` rolls back to the final day of `monthIndex`."
  },

  // Easy 2: isLeapYear
  {
    id: "date-easy-02",
    title: "Leap Year Checker",
    topics: ["date"],
    difficulty: "easy",
    type: "write-function",
    prompt: "Write a function `isLeapYear(year)` that checks if a year is a leap year using the Date object. Construct a Date for February 29th of that year (`new Date(year, 1, 29)`) and return `true` if its month is still February (`1`), `false` otherwise.",
    starterCode: "function isLeapYear(year) {\n  // your code here\n}",
    testCases: [
      { input: [2024], expected: true },
      { input: [2023], expected: false },
      { input: [2000], expected: true },
      { input: [1900], expected: false },
      { input: [2028], expected: true }
    ],
    explanation: "If `year` is not a leap year, `new Date(year, 1, 29)` automatically rolls over to March (`getMonth() === 2`)."
  },

  // Easy 3: formatYMD
  {
    id: "date-easy-03",
    title: "Format Date as YYYY-MM-DD",
    topics: ["date"],
    difficulty: "easy",
    type: "write-function",
    prompt: "Write a function `formatYMD(dateInput)` that takes a Date instance or ISO string and returns its UTC date formatted as `'YYYY-MM-DD'` with zero-padding (e.g. `'2026-05-04'`).",
    starterCode: "function formatYMD(dateInput) {\n  // your code here\n}",
    testCases: [
      { input: ["2026-05-04T00:00:00Z"], expected: "2026-05-04" },
      { input: ["2024-12-25T12:00:00Z"], expected: "2024-12-25" },
      { input: ["2025-01-09T08:00:00Z"], expected: "2025-01-09" },
      { input: ["2023-10-31T23:59:59Z"], expected: "2023-10-31" },
      { input: ["2022-07-04T00:00:00Z"], expected: "2022-07-04" }
    ],
    explanation: "Create `d = new Date(dateInput)` and extract `d.getUTCFullYear()`, `String(d.getUTCMonth() + 1).padStart(2, '0')`, and `String(d.getUTCDate()).padStart(2, '0')`."
  },

  // Medium 1 (pairs with If-else): businessDaysBetween
  {
    id: "date-medium-01",
    title: "Count Business Days",
    topics: ["date", "if-else"],
    difficulty: "medium",
    type: "write-function",
    prompt: "Write a function `businessDaysBetween(startDateStr, endDateStr)` that counts the number of business days (Monday through Friday, UTC) between two ISO date strings, inclusive of start and end dates. Exclude Saturdays and Sundays.",
    starterCode: "function businessDaysBetween(startDateStr, endDateStr) {\n  // your code here\n}",
    testCases: [
      { input: ["2026-09-07", "2026-09-11"], expected: 5 }, // Mon - Fri
      { input: ["2026-09-05", "2026-09-06"], expected: 0 }, // Sat - Sun
      { input: ["2026-09-04", "2026-09-07"], expected: 2 }, // Fri, Sat, Sun, Mon -> Fri & Mon = 2
      { input: ["2026-09-08", "2026-09-08"], expected: 1 }, // Tuesday only
      { input: ["2026-09-01", "2026-09-14"], expected: 10 } // 2 full weeks = 10 days
    ],
    explanation: "Loop day-by-day from start to end date using UTC timestamps; increment count if `d.getUTCDay()` is not 0 (Sunday) and not 6 (Saturday)."
  },

  // Medium 2 (pairs with Array): sortByRecentDate
  {
    id: "date-medium-02",
    title: "Sort Dates Descending",
    topics: ["date", "array"],
    difficulty: "medium",
    type: "write-function",
    prompt: "Write a function `sortByRecentDate(dateStrings)` that takes an array of ISO date strings and returns a new array sorted from newest (most recent) to oldest.",
    starterCode: "function sortByRecentDate(dateStrings) {\n  // your code here\n}",
    testCases: [
      { input: [["2024-01-01", "2026-05-10", "2025-12-31"]], expected: ["2026-05-10", "2025-12-31", "2024-01-01"] },
      { input: [[]], expected: [] },
      { input: [["2023-08-15", "2023-08-15"]], expected: ["2023-08-15", "2023-08-15"] },
      { input: [["2020-02-01", "2020-01-01", "2020-03-01"]], expected: ["2020-03-01", "2020-02-01", "2020-01-01"] },
      { input: [["2026-09-01", "2026-09-02", "2026-08-30"]], expected: ["2026-09-02", "2026-09-01", "2026-08-30"] }
    ],
    explanation: "Use `[...dateStrings].sort((a, b) => new Date(b) - new Date(a))` to sort descending without mutating input."
  },

  // Medium 3 (pairs with If-else): getAgeInYears
  {
    id: "date-medium-03",
    title: "Calculate Exact Age",
    topics: ["date", "if-else"],
    difficulty: "medium",
    type: "write-function",
    prompt: "Write a function `getAgeInYears(birthDateStr, refDateStr)` that calculates the full elapsed years between `birthDateStr` and `refDateStr` (both 'YYYY-MM-DD'). Use if-else logic to adjust by -1 if the reference date has not yet reached the birth month/day.",
    starterCode: "function getAgeInYears(birthDateStr, refDateStr) {\n  // your code here\n}",
    testCases: [
      { input: ["2000-05-15", "2025-05-20"], expected: 25 },
      { input: ["2000-05-15", "2025-05-10"], expected: 24 },
      { input: ["2000-05-15", "2025-05-15"], expected: 25 },
      { input: ["2024-02-29", "2025-03-01"], expected: 1 },
      { input: ["2025-01-01", "2025-11-30"], expected: 0 }
    ],
    explanation: "Calculate initial diff `ref.getFullYear() - birth.getFullYear()`, then subtract 1 if `refMonth < birthMonth || (refMonth === birthMonth && refDay < birthDay)`."
  },

  // Hard 1 (pairs with Error handling + DOM): renderEventCountdown
  {
    id: "date-hard-01",
    title: "Event Status Renderer",
    topics: ["date", "error-handling", "dom"],
    difficulty: "hard",
    type: "dom-task",
    prompt: "Write JavaScript that reads the event date from `window.targetDate`. Wrap your logic in `try/catch`. If `targetDate` is invalid or missing, set `#event-status` text to `'Error: Invalid date'` and add class `'error'`. If valid, compare it to reference timestamp `2026-09-01T00:00:00Z`: if target date is on or after reference, set `#event-status` text to `'Upcoming'` and add class `'upcoming'`; otherwise set text to `'Passed'` and add class `'passed'`.",
    starterHtml: "<script>window.targetDate = '2026-10-01T00:00:00Z';</script><div id=\"event-box\"><span id=\"event-status\"></span></div>",
    starterCode: "// Reads window.targetDate\ntry {\n  const d = new Date(window.targetDate);\n  if (isNaN(d.getTime())) throw new Error('Invalid date');\n  const ref = new Date('2026-09-01T00:00:00Z');\n  const el = document.getElementById('event-status');\n  el.className = '';\n  if (d >= ref) {\n    el.textContent = 'Upcoming';\n    el.classList.add('upcoming');\n  } else {\n    el.textContent = 'Passed';\n    el.classList.add('passed');\n  }\n} catch (err) {\n  const el = document.getElementById('event-status');\n  el.className = 'error';\n  el.textContent = 'Error: Invalid date';\n}",
    testCases: [
      { check: "document.getElementById('event-status') !== null", expected: true },
      { check: "document.getElementById('event-status').textContent", expected: "Upcoming" },
      { check: "document.getElementById('event-status').classList.contains('upcoming')", expected: true },
      { setup: "window.targetDate = '2025-01-01T00:00:00Z';", check: "document.getElementById('event-status').textContent", expected: "Passed" },
      { setup: "window.targetDate = 'invalid-date';", check: "document.getElementById('event-status').textContent", expected: "Error: Invalid date" }
    ],
    explanation: "Use `new Date(targetDate).getTime()`. If `isNaN(...)`, throw error. Otherwise branch on `>= Date.parse('2026-09-01T00:00:00Z')`."
  },

  // Hard 2 (pairs with Error handling + DOM): buildCalendarHeader
  {
    id: "date-hard-02",
    title: "Calendar Header Generator",
    topics: ["date", "error-handling", "dom"],
    difficulty: "hard",
    type: "dom-task",
    prompt: "Write JavaScript that reads `window.calendarMonth` (1-12) and `window.calendarYear` (e.g. 2026). Validate with `try/catch`: if month < 1 or month > 12 or year < 1900, set `#cal-title` text to `'Invalid Range'`, clear `#days-grid`, and add class `'error'` to `#cal-title`. Otherwise, remove class `'error'` from `#cal-title`, calculate total days in that month using `Date`, set `#cal-title` text to `'Month ' + month + ' (' + days + ' days)'`, and append `days` div elements with class `'day-chip'` to `#days-grid`.",
    starterHtml: "<script>window.calendarMonth = 2; window.calendarYear = 2024;</script><div id=\"cal-container\"><h2 id=\"cal-title\"></h2><div id=\"days-grid\"></div></div>",
    starterCode: "// Reads window.calendarMonth and window.calendarYear\n// your code here\n",
    testCases: [
      { check: "document.querySelectorAll('#days-grid .day-chip').length", expected: 29 },
      { check: "document.getElementById('cal-title').textContent", expected: "Month 2 (29 days)" },
      { setup: "window.calendarMonth = 4; window.calendarYear = 2026;", check: "document.querySelectorAll('#days-grid .day-chip').length", expected: 30 },
      { setup: "window.calendarMonth = 13; window.calendarYear = 2024;", check: "document.getElementById('cal-title').textContent", expected: "Invalid Range" },
      { setup: "window.calendarMonth = 0; window.calendarYear = 2024;", check: "document.getElementById('cal-title').classList.contains('error')", expected: true }
    ],
    explanation: "Validate bounds in try/catch, calculate days with `new Date(year, month, 0).getDate()`, and construct elements with `document.createElement('div')`."
  },

  // Hard 3 (pairs with Error handling + DOM): renderBookingTimeline
  {
    id: "date-hard-03",
    title: "Booking Timeline Renderer",
    topics: ["date", "error-handling", "dom"],
    difficulty: "hard",
    type: "dom-task",
    prompt: "Given `window.bookingList` (array of ISO date strings), write JS inside `try/catch` that filters out any invalid dates, sorts valid dates chronologically ascending, and renders each as `<div class=\"timeline-node\" data-date=\"YYYY-MM-DD\">YYYY-MM-DD</div>` inside `#timeline`. If no valid dates exist, render `<div class=\"empty-msg\">No bookings</div>` inside `#timeline`.",
    starterHtml: "<script>window.bookingList = ['2026-09-10', '2026-09-01', 'invalid', '2026-09-05'];</script><div id=\"timeline\"></div>",
    starterCode: "// Reads window.bookingList\n// your code here\n",
    testCases: [
      { check: "document.querySelectorAll('#timeline .timeline-node').length", expected: 3 },
      { check: "document.querySelectorAll('#timeline .timeline-node')[0].getAttribute('data-date')", expected: "2026-09-01" },
      { check: "document.querySelectorAll('#timeline .timeline-node')[2].getAttribute('data-date')", expected: "2026-09-10" },
      { setup: "window.bookingList = ['junk', 'bad'];", check: "document.querySelector('#timeline .empty-msg').textContent", expected: "No bookings" },
      { setup: "window.bookingList = [];", check: "document.querySelectorAll('#timeline .timeline-node').length", expected: 0 }
    ],
    explanation: "Filter items where `!isNaN(Date.parse(item))`, sort by timestamp, create `.timeline-node` elements, and fall back to `.empty-msg` if list is empty."
  },

  // =========================================================================
  // TOPIC 3: ARRAYS (9 exercises)
  // =========================================================================

  // Easy 1: doubleNumbers
  {
    id: "array-easy-01",
    title: "Double Numbers",
    topics: ["array"],
    difficulty: "easy",
    type: "write-function",
    prompt: "Write a function `doubleNumbers(arr)` that returns a new array with every number multiplied by 2.",
    starterCode: "function doubleNumbers(arr) {\n  // your code here\n}",
    testCases: [
      { input: [[1, 2, 3]], expected: [2, 4, 6] },
      { input: [[]], expected: [] },
      { input: [[0, -1, 5]], expected: [0, -2, 10] },
      { input: [[10]], expected: [20] },
      { input: [[2, 2, 2]], expected: [4, 4, 4] }
    ],
    explanation: "Use `arr.map(num => num * 2)` to return a transformed new array."
  },

  // Easy 2: chunkArray
  {
    id: "array-easy-02",
    title: "Chunk Array",
    topics: ["array"],
    difficulty: "easy",
    type: "write-function",
    prompt: "Write a function `chunkArray(arr, size)` that splits an array into sub-arrays of maximum length `size`. Return an empty array if `size <= 0` or if `arr` is empty.",
    starterCode: "function chunkArray(arr, size) {\n  // your code here\n}",
    testCases: [
      { input: [[1, 2, 3, 4, 5], 2], expected: [[1, 2], [3, 4], [5]] },
      { input: [[1, 2, 3, 4], 2], expected: [[1, 2], [3, 4]] },
      { input: [["a", "b", "c"], 1], expected: [["a"], ["b"], ["c"]] },
      { input: [[1, 2, 3], 5], expected: [[1, 2, 3]] },
      { input: [[], 3], expected: [] }
    ],
    explanation: "Iterate with a `for (let i = 0; i < arr.length; i += size)` loop and slice chunks with `arr.slice(i, i + size)`."
  },

  // Easy 3: uniqueValues
  {
    id: "array-easy-03",
    title: "Unique Array Values",
    topics: ["array"],
    difficulty: "easy",
    type: "write-function",
    prompt: "Write a function `uniqueValues(arr)` that returns a new array containing only the unique elements of `arr`, preserving their first-seen order.",
    starterCode: "function uniqueValues(arr) {\n  // your code here\n}",
    testCases: [
      { input: [[1, 2, 2, 3, 1, 4]], expected: [1, 2, 3, 4] },
      { input: [["apple", "banana", "apple"]], expected: ["apple", "banana"] },
      { input: [[]], expected: [] },
      { input: [[5, 5, 5, 5]], expected: [5] },
      { input: [[true, false, true]], expected: [true, false] }
    ],
    explanation: "Use `[...new Set(arr)]` or `arr.filter((v, i) => arr.indexOf(v) === i)`."
  },

  // Medium 1 (pairs with If-else): partitionByCondition
  {
    id: "array-medium-01",
    title: "Partition Array by Predicate",
    topics: ["array", "if-else"],
    difficulty: "medium",
    type: "write-function",
    prompt: "Write a function `partitionByCondition(arr, predicateFn)` that splits an array into two arrays based on an if-else check against `predicateFn(item)`: `{ pass: [...], fail: [...] }`.",
    starterCode: "function partitionByCondition(arr, predicateFn) {\n  // your code here\n}",
    testCases: [
      { input: [[1, 2, 3, 4, 5, 6], (n) => n % 2 === 0], expected: { pass: [2, 4, 6], fail: [1, 3, 5] } },
      { input: [[10, 15, 20], (n) => n > 12], expected: { pass: [15, 20], fail: [10] } },
      { input: [[], (x) => true], expected: { pass: [], fail: [] } },
      { input: [["ant", "bear", "cat"], (s) => s.startsWith("b")], expected: { pass: ["bear"], fail: ["ant", "cat"] } },
      { input: [[-2, -1, 0, 1], (n) => n >= 0], expected: { pass: [0, 1], fail: [-2, -1] } }
    ],
    explanation: "Iterate over `arr` with `.reduce()` or `.forEach()` and use `if (predicateFn(item))` to push to `pass` or `fail`."
  },

  // Medium 2 (pairs with Object): groupByCategory
  {
    id: "array-medium-02",
    title: "Group Array by Category",
    topics: ["array", "object"],
    difficulty: "medium",
    type: "write-function",
    prompt: "Write a function `groupByCategory(items)` that takes an array of objects `{ name: string, category: string }` and returns an object grouping item names by category: `{ [category]: string[] }`.",
    starterCode: "function groupByCategory(items) {\n  // your code here\n}",
    testCases: [
      {
        input: [[
          { name: "Apple", category: "Fruit" },
          { name: "Carrot", category: "Vegetable" },
          { name: "Banana", category: "Fruit" }
        ]],
        expected: { Fruit: ["Apple", "Banana"], Vegetable: ["Carrot"] }
      },
      { input: [[]], expected: {} },
      {
        input: [[{ name: "Shirt", category: "Apparel" }, { name: "Pants", category: "Apparel" }]],
        expected: { Apparel: ["Shirt", "Pants"] }
      },
      {
        input: [[{ name: "A", category: "Cat1" }, { name: "B", category: "Cat2" }, { name: "C", category: "Cat3" }]],
        expected: { Cat1: ["A"], Cat2: ["B"], Cat3: ["C"] }
      },
      {
        input: [[{ name: "Single", category: "Solo" }]],
        expected: { Solo: ["Single"] }
      }
    ],
    explanation: "Use `items.reduce((acc, item) => { (acc[item.category] = acc[item.category] || []).push(item.name); return acc; }, {})`."
  },

  // Medium 3 (pairs with Object): findTopScorer
  {
    id: "array-medium-03",
    title: "Find Top Scorer",
    topics: ["array", "object"],
    difficulty: "medium",
    type: "write-function",
    prompt: "Write a function `findTopScorer(players)` that takes an array of objects `{ name: string, score: number }` and returns the player object with the highest score. If the array is empty, return `null`. In case of a tie, return the first player with that score.",
    starterCode: "function findTopScorer(players) {\n  // your code here\n}",
    testCases: [
      { input: [[{ name: "Alice", score: 85 }, { name: "Bob", score: 92 }, { name: "Charlie", score: 78 }]], expected: { name: "Bob", score: 92 } },
      { input: [[]], expected: null },
      { input: [[{ name: "Dana", score: 100 }]], expected: { name: "Dana", score: 100 } },
      { input: [[{ name: "A", score: 50 }, { name: "B", score: 50 }]], expected: { name: "A", score: 50 } },
      { input: [[{ name: "Low", score: -10 }, { name: "High", score: 0 }]], expected: { name: "High", score: 0 } }
    ],
    explanation: "If `players.length === 0` return `null`. Otherwise reduce over the array comparing `curr.score > best.score`."
  },

  // Hard 1 (pairs with Error handling + DOM): renderValidatedList
  {
    id: "array-hard-01",
    title: "Validated List Renderer",
    topics: ["array", "error-handling", "dom"],
    difficulty: "hard",
    type: "dom-task",
    prompt: "Given `window.itemList`, write JS inside `try/catch` to validate that `itemList` is a non-empty Array. If not an array or length === 0, throw an error, clear `#item-list`, and set `#error-msg` to `'Invalid or empty item list'`. Otherwise, clear `#error-msg` and render each item as an `<li>` with class `'valid-item'` inside `#item-list`.",
    starterHtml: "<script>window.itemList = ['Alpha', 'Beta', 'Gamma'];</script><div id=\"list-wrap\"><p id=\"error-msg\"></p><ul id=\"item-list\"></ul></div>",
    starterCode: "// Reads window.itemList\n// your code here\n",
    testCases: [
      { check: "document.querySelectorAll('#item-list li.valid-item').length", expected: 3 },
      { check: "document.querySelectorAll('#item-list li')[0].textContent", expected: "Alpha" },
      { setup: "window.itemList = [];", check: "document.getElementById('error-msg').textContent", expected: "Invalid or empty item list" },
      { check: "document.querySelectorAll('#item-list li').length", expected: 0 },
      { setup: "window.itemList = 'not-an-array';", check: "document.getElementById('error-msg').textContent", expected: "Invalid or empty item list" }
    ],
    explanation: "Validate with `if (!Array.isArray(window.itemList) || window.itemList.length === 0) throw new Error(...)`. Catch error and update `#error-msg`."
  },

  // Hard 2 (pairs with Error handling + DOM): renderFilterableTable
  {
    id: "array-hard-02",
    title: "User Table Search Filter",
    topics: ["array", "error-handling", "dom"],
    difficulty: "hard",
    type: "dom-task",
    prompt: "Given `window.userList` (array of `{ name, role }`) and `window.searchQuery` (string), validate in `try/catch`. If `userList` is invalid or not an array, render `<tr class=\"err\"><td colspan=\"2\">Data error</td></tr>` in `#table-body`. Otherwise, filter users whose `name` includes `searchQuery` (case-insensitive) and render a `<tr><td>${name}</td><td>${role}</td></tr>` for each. If no users match, render `<tr class=\"no-results\"><td colspan=\"2\">No matches</td></tr>`.",
    starterHtml: "<script>window.userList = [{ name: 'Alice Smith', role: 'Admin' }, { name: 'Bob Jones', role: 'Dev' }]; window.searchQuery = 'alice';</script><table><thead><tr><th>Name</th><th>Role</th></tr></thead><tbody id=\"table-body\"></tbody></table>",
    starterCode: "// Reads window.userList and window.searchQuery\n// your code here\n",
    testCases: [
      { check: "document.querySelectorAll('#table-body tr').length", expected: 1 },
      { check: "document.querySelector('#table-body tr td').textContent", expected: "Alice Smith" },
      { setup: "window.searchQuery = 'nobody';", check: "document.querySelector('#table-body .no-results').textContent", expected: "No matches" },
      { setup: "window.userList = null;", check: "document.querySelector('#table-body .err').textContent", expected: "Data error" },
      { setup: "window.userList = [{ name: 'A', role: 'R1' }, { name: 'B', role: 'R2' }]; window.searchQuery = '';", check: "document.querySelectorAll('#table-body tr').length", expected: 2 }
    ],
    explanation: "Check `Array.isArray(userList)`, filter with `.filter(u => u.name.toLowerCase().includes(q.toLowerCase()))`, and handle 0-match and error conditions."
  },

  // Hard 3 (pairs with Error handling + DOM): renderTagsWithRemover
  {
    id: "array-hard-03",
    title: "Interactive Tag Tray",
    topics: ["array", "error-handling", "dom"],
    difficulty: "hard",
    type: "dom-task",
    prompt: "Given `window.tagArray` (array of strings), validate with `try/catch`. Filter out any empty strings or non-string items. For each valid tag, create `<span class=\"tag-chip\" data-tag=\"${tag}\">${tag}</span>` inside `#tag-tray`. Also, set `#tag-count` text to the total number of valid tags rendered. If an error occurs, set `#tag-count` to `'0'` and clear `#tag-tray`.",
    starterHtml: "<script>window.tagArray = ['javascript', 'web', 'dom'];</script><div id=\"tag-wrapper\"><span id=\"tag-count\">0</span><div id=\"tag-tray\"></div></div>",
    starterCode: "// Reads window.tagArray\n// your code here\n",
    testCases: [
      { check: "document.querySelectorAll('#tag-tray .tag-chip').length", expected: 3 },
      { check: "document.getElementById('tag-count').textContent", expected: "3" },
      { check: "document.querySelector('#tag-tray .tag-chip').getAttribute('data-tag')", expected: "javascript" },
      { setup: "window.tagArray = ['', null, 'valid'];", check: "document.querySelectorAll('#tag-tray .tag-chip').length", expected: 1 },
      { setup: "window.tagArray = null;", check: "document.getElementById('tag-count').textContent", expected: "0" }
    ],
    explanation: "Filter `typeof t === 'string' && t.trim().length > 0`, construct `.tag-chip` spans, and update `#tag-count`."
  },

  // =========================================================================
  // TOPIC 4: OBJECTS (9 exercises)
  // =========================================================================

  // Easy 1: countKeys
  {
    id: "object-easy-01",
    title: "Count Object Keys",
    topics: ["object"],
    difficulty: "easy",
    type: "write-function",
    prompt: "Write a function `countKeys(obj)` that returns the count of own enumerable properties on `obj`. Return `0` if `obj` is null or not an object.",
    starterCode: "function countKeys(obj) {\n  // your code here\n}",
    testCases: [
      { input: [{ a: 1, b: 2, c: 3 }], expected: 3 },
      { input: [{}], expected: 0 },
      { input: [null], expected: 0 },
      { input: [{ name: "JS", version: 2026 }], expected: 2 },
      { input: [{ single: true }], expected: 1 }
    ],
    explanation: "Check `if (!obj || typeof obj !== 'object') return 0;` and return `Object.keys(obj).length`."
  },

  // Easy 2: mergeDefaults
  {
    id: "object-easy-02",
    title: "Merge Defaults",
    topics: ["object"],
    difficulty: "easy",
    type: "write-function",
    prompt: "Write a function `mergeDefaults(options, defaults)` that returns a new object with `defaults` overwritten by any properties in `options`. Neither input object should be mutated.",
    starterCode: "function mergeDefaults(options, defaults) {\n  // your code here\n}",
    testCases: [
      { input: [{ theme: "dark" }, { theme: "light", fontSize: 14 }], expected: { theme: "dark", fontSize: 14 } },
      { input: [{}, { timeout: 3000 }], expected: { timeout: 3000 } },
      { input: [{ timeout: 5000 }, { timeout: 3000 }], expected: { timeout: 5000 } },
      { input: [{ a: 1 }, { b: 2, c: 3 }], expected: { a: 1, b: 2, c: 3 } },
      { input: [{}, {}], expected: {} }
    ],
    explanation: "Use `{ ...defaults, ...options }` or `Object.assign({}, defaults, options)`."
  },

  // Easy 3: invertObject
  {
    id: "object-easy-03",
    title: "Invert Object Keys and Values",
    topics: ["object"],
    difficulty: "easy",
    type: "write-function",
    prompt: "Write a function `invertObject(obj)` that returns a new object where keys become values and values become keys (assuming values are unique strings or numbers).",
    starterCode: "function invertObject(obj) {\n  // your code here\n}",
    testCases: [
      { input: [{ a: "1", b: "2" }], expected: { "1": "a", "2": "b" } },
      { input: [{ x: 10, y: 20 }], expected: { "10": "x", "20": "y" } },
      { input: [{}], expected: {} },
      { input: [{ role: "admin" }], expected: { admin: "role" } },
      { input: [{ mon: 1, tue: 2, wed: 3 }], expected: { "1": "mon", "2": "tue", "3": "wed" } }
    ],
    explanation: "Use `Object.entries(obj).reduce((acc, [k, v]) => { acc[v] = k; return acc; }, {})`."
  },

  // Medium 1 (pairs with Array): pluckProperties
  {
    id: "object-medium-01",
    title: "Pluck Properties from Array of Objects",
    topics: ["object", "array"],
    difficulty: "medium",
    type: "write-function",
    prompt: "Write a function `pluckProperties(items, key)` that takes an array of objects and a property name `key`. Return an array containing the values of that key from each object. Skip any object that does not possess that own property.",
    starterCode: "function pluckProperties(items, key) {\n  // your code here\n}",
    testCases: [
      { input: [[{ id: 1, name: "A" }, { id: 2, name: "B" }], "id"], expected: [1, 2] },
      { input: [[{ a: 10 }, { b: 20 }, { a: 30 }], "a"], expected: [10, 30] },
      { input: [[], "anyKey"], expected: [] },
      { input: [[{ x: 1 }, { x: 2 }], "missing"], expected: [] },
      { input: [[{ val: 0 }, { val: false }, { val: null }], "val"], expected: [0, false, null] }
    ],
    explanation: "Iterate over `items`, check `Object.prototype.hasOwnProperty.call(item, key)` or `key in item`, and collect values."
  },

  // Medium 2 (pairs with If-else): safeNestedGet
  {
    id: "object-medium-02",
    title: "Safe Nested Property Access",
    topics: ["object", "if-else"],
    difficulty: "medium",
    type: "write-function",
    prompt: "Write a function `safeNestedGet(obj, path, defaultValue)` where `path` is a dot-delimited string (e.g. `'user.profile.age'`). Traverse the nested object safely using if-else checks. If any step is undefined or null, or if the final value is undefined, return `defaultValue`.",
    starterCode: "function safeNestedGet(obj, path, defaultValue) {\n  // your code here\n}",
    testCases: [
      { input: [{ user: { profile: { age: 25 } } }, "user.profile.age", 0], expected: 25 },
      { input: [{ user: null }, "user.profile.age", "N/A"], expected: "N/A" },
      { input: [{}, "a.b.c", "default"], expected: "default" },
      { input: [{ data: { active: false } }, "data.active", true], expected: false },
      { input: [{ count: 0 }, "count", 10], expected: 0 }
    ],
    explanation: "Split `path.split('.')` and reduce/loop while verifying `curr !== null && curr !== undefined`. Return `defaultValue` if result is undefined."
  },

  // Medium 3 (pairs with Array): objectToQueryString
  {
    id: "object-medium-03",
    title: "Object to Query String",
    topics: ["object", "array"],
    difficulty: "medium",
    type: "write-function",
    prompt: "Write a function `objectToQueryString(params)` that converts an object into a URL query string. Keys must be sorted alphabetically. Format: `'key1=val1&key2=val2'`. If `params` is empty, return an empty string `''`.",
    starterCode: "function objectToQueryString(params) {\n  // your code here\n}",
    testCases: [
      { input: [{ page: 2, sort: "desc", search: "js" }], expected: "page=2&search=js&sort=desc" },
      { input: [{}], expected: "" },
      { input: [{ z: 1, a: 2 }], expected: "a=2&z=1" },
      { input: [{ name: "Alice", active: true }], expected: "active=true&name=Alice" },
      { input: [{ id: 101 }], expected: "id=101" }
    ],
    explanation: "Use `Object.keys(params).sort().map(k => k + '=' + params[k]).join('&')`."
  },

  // Hard 1 (pairs with Error handling + DOM): renderUserProfileCard
  {
    id: "object-hard-01",
    title: "User Profile Card Renderer",
    topics: ["object", "error-handling", "dom"],
    difficulty: "hard",
    type: "dom-task",
    prompt: "Given `window.profileData`, validate inside `try/catch`:\n- `profileData` must be an object with non-empty string `name` and string `email` containing `'@'`.\n- If invalid, display the error message in `#card-error` and hide `#profile-details` (add class `'hidden'`).\n- If valid, clear `#card-error`, remove `'hidden'` from `#profile-details`, set `#user-name` to `profileData.name`, `#user-email` to `profileData.email`, and `#user-role` to `profileData.role || 'Member'`.",
    starterHtml: "<script>window.profileData = { name: 'Jane Doe', email: 'jane@test.com', role: 'Admin' };</script><div id=\"profile-card\"><p id=\"card-error\"></p><div id=\"profile-details\" class=\"hidden\"><h3 id=\"user-name\"></h3><span id=\"user-email\"></span><span id=\"user-role\"></span></div></div>",
    starterCode: "// Reads window.profileData\n// your code here\n",
    testCases: [
      { check: "document.getElementById('user-name').textContent", expected: "Jane Doe" },
      { check: "document.getElementById('user-email').textContent", expected: "jane@test.com" },
      { check: "document.getElementById('user-role').textContent", expected: "Admin" },
      { setup: "window.profileData = { name: '', email: 'bad' };", check: "document.getElementById('profile-details').classList.contains('hidden')", expected: true },
      { check: "document.getElementById('card-error').textContent !== ''", expected: true }
    ],
    explanation: "Check required fields and format; throw informative Error in try/catch to toggle `.hidden` and display error."
  },

  // Hard 2 (pairs with Error handling + DOM): buildDynamicForm
  {
    id: "object-hard-02",
    title: "Dynamic Form Generator from Schema",
    topics: ["object", "error-handling", "dom"],
    difficulty: "hard",
    type: "dom-task",
    prompt: "Given `window.formSchema` (object with `{ title: string, fields: [{ id, label, type, required }] }`), validate in `try/catch`. If invalid, set `#form-container` HTML to `'<p class=\"schema-err\">Invalid schema</p>'`. Otherwise, render `<h2 id=\"form-title\">${schema.title}</h2>` and for each field create `<div class=\"field-group\"><label for=\"${field.id}\">${field.label}</label><input id=\"${field.id}\" type=\"${field.type}\"></div>`. If `required` is true, add the `'required'` attribute to the input.",
    starterHtml: "<script>window.formSchema = { title: 'Sign Up', fields: [{ id: 'email', label: 'Email Address', type: 'email', required: true }, { id: 'age', label: 'Age', type: 'number', required: false }] };</script><div id=\"form-container\"></div>",
    starterCode: "// Reads window.formSchema\n// your code here\n",
    testCases: [
      { check: "document.querySelectorAll('#form-container .field-group').length", expected: 2 },
      { check: "document.getElementById('form-title').textContent", expected: "Sign Up" },
      { check: "document.getElementById('email').hasAttribute('required')", expected: true },
      { check: "document.getElementById('age').hasAttribute('required')", expected: false },
      { setup: "window.formSchema = null;", check: "document.querySelector('#form-container .schema-err').textContent", expected: "Invalid schema" }
    ],
    explanation: "Validate `schema && schema.fields && Array.isArray(schema.fields)`. Build DOM elements programmatically."
  },

  // Hard 3 (pairs with Error handling + DOM): renderMetricsDashboard
  {
    id: "object-hard-03",
    title: "Metrics Dashboard Renderer",
    topics: ["object", "error-handling", "dom"],
    difficulty: "hard",
    type: "dom-task",
    prompt: "Given `window.metricsObject` (key-value map of metric names to numeric values), validate in `try/catch`. All values must be numbers. If any value is not a number or input is not an object, set `#dash-error` to `'Malformed metrics'`. Otherwise, clear `#dash-error` and for each key render `<div class=\"metric-box\" data-key=\"${key}\"><span class=\"k\">${key}</span><span class=\"v\">${val}</span></div>` inside `#dashboard-grid`.",
    starterHtml: "<script>window.metricsObject = { cpu: 45, memory: 72, disk: 30 };</script><div id=\"dash-wrap\"><p id=\"dash-error\"></p><div id=\"dashboard-grid\"></div></div>",
    starterCode: "// Reads window.metricsObject\n// your code here\n",
    testCases: [
      { check: "document.querySelectorAll('#dashboard-grid .metric-box').length", expected: 3 },
      { check: "document.querySelector('#dashboard-grid [data-key=\"cpu\"] .v').textContent", expected: "45" },
      { check: "document.querySelector('#dashboard-grid [data-key=\"memory\"] .v').textContent", expected: "72" },
      { setup: "window.metricsObject = { cpu: 'bad' };", check: "document.getElementById('dash-error').textContent", expected: "Malformed metrics" },
      { check: "document.querySelectorAll('#dashboard-grid .metric-box').length", expected: 0 }
    ],
    explanation: "Iterate `Object.entries(metricsObject)`. If `typeof v !== 'number'` throw Error. Render metric boxes dynamically."
  },

  // =========================================================================
  // TOPIC 5: ERROR HANDLING (9 exercises)
  // =========================================================================

  // Easy 1: safeJsonParse
  {
    id: "error-handling-easy-01",
    title: "Safe JSON Parse",
    topics: ["error-handling"],
    difficulty: "easy",
    type: "write-function",
    prompt: "Write a function `safeJsonParse(jsonStr, fallback)` that attempts to parse `jsonStr` with `JSON.parse()`. If parsing throws a SyntaxError, catch it and return `fallback` instead.",
    starterCode: "function safeJsonParse(jsonStr, fallback) {\n  // your code here\n}",
    testCases: [
      { input: ['{"name":"Antigravity"}', {}], expected: { name: "Antigravity" } },
      { input: ["invalid-json", { error: true }], expected: { error: true } },
      { input: ["[1, 2, 3]", []], expected: [1, 2, 3] },
      { input: ["{ missingQuotes: 1 }", "fallback"], expected: "fallback" },
      { input: ["true", false], expected: true }
    ],
    explanation: "Wrap `JSON.parse(jsonStr)` in `try { return JSON.parse(jsonStr); } catch (e) { return fallback; }`."
  },

  // Easy 2: validateAgeRange
  {
    id: "error-handling-easy-02",
    title: "Age Range Validator with Custom Errors",
    topics: ["error-handling"],
    difficulty: "easy",
    type: "write-function",
    prompt: "Write a function `validateAgeRange(age)` that validates an age value:\n- If `typeof age !== 'number' || isNaN(age)`, throw `new TypeError('Age must be a number')`\n- If `age < 0 || age > 120`, throw `new RangeError('Age must be between 0 and 120')`\n- If valid, return `true`",
    starterCode: "function validateAgeRange(age) {\n  // your code here\n}",
    testCases: [
      { input: [25], expected: true },
      { input: [0], expected: true },
      { input: ["25"], expected: "TypeError: Age must be a number" },
      { input: [-5], expected: "RangeError: Age must be between 0 and 120" },
      { input: [150], expected: "RangeError: Age must be between 0 and 120" }
    ],
    explanation: "Use `if (typeof age !== 'number') throw new TypeError(...); if (age < 0 || age > 120) throw new RangeError(...); return true;`."
  },

  // Easy 3: runWithCleanup
  {
    id: "error-handling-easy-03",
    title: "Execute with Guaranteed Cleanup",
    topics: ["error-handling"],
    difficulty: "easy",
    type: "write-function",
    prompt: "Write a function `runWithCleanup(actionFn, cleanupFn)` that executes `actionFn()`. Use a `finally` block to ensure `cleanupFn()` is ALWAYS called, regardless of whether `actionFn()` succeeds or throws. If `actionFn()` succeeds, return its result; if it throws, rethrow the error.",
    starterCode: "function runWithCleanup(actionFn, cleanupFn) {\n  // your code here\n}",
    testCases: [
      {
        input: [() => 42, () => {}],
        expected: 42
      },
      {
        input: [
          () => { throw new Error("Boom"); },
          () => {}
        ],
        expected: "Error: Boom"
      },
      {
        input: [
          () => "Success",
          () => {}
        ],
        expected: "Success"
      },
      {
        input: [
          () => [1, 2],
          () => {}
        ],
        expected: [1, 2]
      },
      {
        input: [
          () => { throw new TypeError("Wrong type"); },
          () => {}
        ],
        expected: "TypeError: Wrong type"
      }
    ],
    explanation: "Use `try { return actionFn(); } finally { cleanupFn(); }`. In JavaScript, `finally` executes before return or rethrow."
  },

  // Medium 1 (pairs with Array): safeBatchProcess
  {
    id: "error-handling-medium-01",
    title: "Safe Batch Processor",
    topics: ["error-handling", "array"],
    difficulty: "medium",
    type: "write-function",
    prompt: "Write a function `safeBatchProcess(items, workerFn)` that runs `workerFn(item)` on each element of `items`. If `workerFn` succeeds, store the returned result in a `successful` array. If `workerFn` throws an error, catch it and store `{ item: item, error: error.message }` in a `failed` array. Return `{ successful: [...], failed: [...] }` without letting any error bubble up.",
    starterCode: "function safeBatchProcess(items, workerFn) {\n  // your code here\n}",
    testCases: [
      {
        input: [
          [2, 4, -1, 6],
          (n) => { if (n < 0) throw new Error("Negative number"); return n * 10; }
        ],
        expected: { successful: [20, 40, 60], failed: [{ item: -1, error: "Negative number" }] }
      },
      {
        input: [
          ["a", "b"],
          (s) => s.toUpperCase()
        ],
        expected: { successful: ["A", "B"], failed: [] }
      },
      {
        input: [
          [1, 2],
          () => { throw new Error("Failed"); }
        ],
        expected: { successful: [], failed: [{ item: 1, error: "Failed" }, { item: 2, error: "Failed" }] }
      },
      {
        input: [[], (x) => x],
        expected: { successful: [], failed: [] }
      },
      {
        input: [
          ["ok", null],
          (val) => { if (!val) throw new Error("Nil"); return val.length; }
        ],
        expected: { successful: [2], failed: [{ item: null, error: "Nil" }] }
      }
    ],
    explanation: "Iterate over `items` with a `for..of` or `forEach`. Wrap each `workerFn(item)` in its own `try/catch` block."
  },

  // Medium 2 (pairs with Object): validateRequiredKeys
  {
    id: "error-handling-medium-02",
    title: "Object Schema Key Validator",
    topics: ["error-handling", "object"],
    difficulty: "medium",
    type: "write-function",
    prompt: "Write a function `validateRequiredKeys(data, requiredKeys)` that checks if `data` is a valid object containing all keys listed in the `requiredKeys` array. If `!data || typeof data !== 'object'`, throw `new Error('Input must be an object')`. If any key is missing, throw `new Error('Missing required key: ' + missingKey)` for the first missing key encountered. If all keys exist, return `true`.",
    starterCode: "function validateRequiredKeys(data, requiredKeys) {\n  // your code here\n}",
    testCases: [
      { input: [{ id: 1, name: "Alice", role: "Admin" }, ["id", "name"]], expected: true },
      { input: [{ id: 1 }, ["id", "email"]], expected: "Error: Missing required key: email" },
      { input: [null, ["id"]], expected: "Error: Input must be an object" },
      { input: [{ a: 1, b: 2 }, ["a", "b", "c"]], expected: "Error: Missing required key: c" },
      { input: [{}, []], expected: true }
    ],
    explanation: "Check object type first, then loop through `requiredKeys` and check `!(key in data)`."
  },

  // Medium 3 (pairs with Array): fallbackChain
  {
    id: "error-handling-medium-03",
    title: "Sequential Fallback Chain",
    topics: ["error-handling", "array"],
    difficulty: "medium",
    type: "write-function",
    prompt: "Write a function `fallbackChain(fnArray)` that accepts an array of functions. Execute each function in order inside `try/catch`. Return the return value of the FIRST function that does not throw. If every function throws (or if `fnArray` is empty), throw `new Error('All operations failed')`.",
    starterCode: "function fallbackChain(fnArray) {\n  // your code here\n}",
    testCases: [
      {
        input: [[() => { throw new Error("1"); }, () => "Success", () => "Never reached"]],
        expected: "Success"
      },
      {
        input: [[() => 100]],
        expected: 100
      },
      {
        input: [[() => { throw new Error("A"); }, () => { throw new Error("B"); }]],
        expected: "Error: All operations failed"
      },
      {
        input: [[]],
        expected: "Error: All operations failed"
      },
      {
        input: [[() => { throw new Error("Err"); }, () => ({ status: 200 })]],
        expected: { status: 200 }
      }
    ],
    explanation: "Loop through `fnArray`, `try { return fn(); } catch(e) {}`. If the loop finishes without returning, throw `new Error('All operations failed')`."
  },

  // Hard 1 (pairs with DOM + Date): renderDateLogViewer
  {
    id: "error-handling-hard-01",
    title: "Date Log Parser & Viewer",
    topics: ["error-handling", "dom", "date"],
    difficulty: "hard",
    type: "dom-task",
    prompt: "Given `window.rawLogs` (array of `{ rawDate, msg }`), process each entry in `try/catch`. If `new Date(rawDate).getTime()` is `NaN`, catch the error and append `<li class=\"log-err\">Invalid timestamp for: ${msg}</li>` to `#log-list`. If valid, format the UTC date as `'YYYY-MM-DD'` and append `<li class=\"log-ok\">[${formattedDate}] ${msg}</li>`. If `rawLogs` is not an array, set `#log-list` to `'<li class=\"fatal-err\">Fatal: Logs unavailable</li>'`.",
    starterHtml: "<script>window.rawLogs = [{ rawDate: '2026-09-01T00:00:00Z', msg: 'Started' }, { rawDate: 'bad-date', msg: 'Corrupted' }];</script><ul id=\"log-list\"></ul>",
    starterCode: "// Reads window.rawLogs\n// your code here\n",
    testCases: [
      { check: "document.querySelectorAll('#log-list li').length", expected: 2 },
      { check: "document.querySelector('#log-list .log-ok').textContent", expected: "[2026-09-01] Started" },
      { check: "document.querySelector('#log-list .log-err').textContent", expected: "Invalid timestamp for: Corrupted" },
      { setup: "window.rawLogs = 'not-array';", check: "document.querySelector('#log-list .fatal-err').textContent", expected: "Fatal: Logs unavailable" },
      { setup: "window.rawLogs = [];", check: "document.querySelectorAll('#log-list li').length", expected: 0 }
    ],
    explanation: "Validate `rawLogs`, then loop each item parsing `new Date(rawDate)`. Branch on `isNaN(...)` to create appropriate styled `<li>` elements."
  },

  // Hard 2 (pairs with DOM + Date): renderDateRangeValidator
  {
    id: "error-handling-hard-02",
    title: "Date Range Audit Display",
    topics: ["error-handling", "dom", "date"],
    difficulty: "hard",
    type: "dom-task",
    prompt: "Given `window.rangeStart` and `window.rangeEnd` strings, validate with `try/catch`:\n1. If either string is invalid date (`isNaN(Date.parse(str))`), throw `new Error('Malformed date')`\n2. If `new Date(rangeStart) > new Date(rangeEnd)`, throw `new Error('Start date must precede end date')`\n3. If valid, compute difference in full 24-hour days: `Math.round((end - start) / (1000 * 60 * 60 * 24))` and set `#range-output` text to `'Span: ' + days + ' days'` with class `'valid'`.\nIf an error is thrown, catch it, set `#range-output` text to error message, and add class `'invalid'`.",
    starterHtml: "<script>window.rangeStart = '2026-09-01'; window.rangeEnd = '2026-09-11';</script><div id=\"range-wrap\"><p id=\"range-output\"></p></div>",
    starterCode: "// Reads window.rangeStart and window.rangeEnd\n// your code here\n",
    testCases: [
      { check: "document.getElementById('range-output').textContent", expected: "Span: 10 days" },
      { check: "document.getElementById('range-output').classList.contains('valid')", expected: true },
      { setup: "window.rangeStart = '2026-09-15'; window.rangeEnd = '2026-09-10';", check: "document.getElementById('range-output').textContent", expected: "Start date must precede end date" },
      { check: "document.getElementById('range-output').classList.contains('invalid')", expected: true },
      { setup: "window.rangeStart = 'invalid'; window.rangeEnd = '2026-09-10';", check: "document.getElementById('range-output').textContent", expected: "Malformed date" }
    ],
    explanation: "Parse dates, throw errors on invalid input or inverted range, and catch to format `#range-output`."
  },

  // Hard 3 (pairs with DOM + Date): scheduleTimerBanner
  {
    id: "error-handling-hard-03",
    title: "Scheduled Task Status Banner",
    topics: ["error-handling", "dom", "date"],
    difficulty: "hard",
    type: "dom-task",
    prompt: "Given `window.taskPayload` (object with `{ name: string, targetIso: string }`), validate in `try/catch`:\n- If `!taskPayload || !taskPayload.name || !taskPayload.targetIso`, throw `new Error('Incomplete task payload')`\n- Parse `new Date(taskPayload.targetIso)`. If invalid, throw `new Error('Invalid task date')`\n- If `new Date(taskPayload.targetIso).getTime() < Date.parse('2026-09-01T00:00:00Z')`, throw `new Error('Target date is in the past')`\n- If valid: set `#task-banner` text to `'Scheduled: ' + taskPayload.name + ' on ' + taskPayload.targetIso.split('T')[0]` and add class `'success'`.\n- If any error is thrown: set `#task-banner` text to error message and add class `'alert-danger'`.",
    starterHtml: "<script>window.taskPayload = { name: 'DB Backup', targetIso: '2026-10-15T04:00:00Z' };</script><div id=\"banner-area\"><div id=\"task-banner\"></div></div>",
    starterCode: "// Reads window.taskPayload\n// your code here\n",
    testCases: [
      { check: "document.getElementById('task-banner').textContent", expected: "Scheduled: DB Backup on 2026-10-15" },
      { check: "document.getElementById('task-banner').classList.contains('success')", expected: true },
      { setup: "window.taskPayload = { name: 'Old Task', targetIso: '2025-01-01T00:00:00Z' };", check: "document.getElementById('task-banner').textContent", expected: "Target date is in the past" },
      { check: "document.getElementById('task-banner').classList.contains('alert-danger')", expected: true },
      { setup: "window.taskPayload = null;", check: "document.getElementById('task-banner').textContent", expected: "Incomplete task payload" }
    ],
    explanation: "Perform checks, throw custom error messages on failures, and update `#task-banner` styles and text."
  },

  // =========================================================================
  // TOPIC 6: DOM MANIPULATION (9 exercises)
  // =========================================================================

  // Easy 1: createListItems
  {
    id: "dom-easy-01",
    title: "Append List Items",
    topics: ["dom"],
    difficulty: "easy",
    type: "dom-task",
    prompt: "Given `window.listItems` (array of strings, e.g. `['Apple', 'Banana', 'Cherry']`), write JS that creates an `<li>` element for each item with class `'list-item'` and appends it to `<ul id=\"fruit-list\"></ul>`.",
    starterHtml: "<script>window.listItems = ['Apple', 'Banana', 'Cherry'];</script><ul id=\"fruit-list\"></ul>",
    starterCode: "// Reads window.listItems\n// your code here\n",
    testCases: [
      { check: "document.querySelectorAll('#fruit-list li.list-item').length", expected: 3 },
      { check: "document.querySelectorAll('#fruit-list li')[0].textContent", expected: "Apple" },
      { check: "document.querySelectorAll('#fruit-list li')[1].textContent", expected: "Banana" },
      { check: "document.querySelectorAll('#fruit-list li')[2].textContent", expected: "Cherry" },
      { check: "document.querySelectorAll('#fruit-list li')[0].tagName", expected: "LI" }
    ],
    explanation: "Loop through `window.listItems`, create element with `document.createElement('li')`, assign `.className = 'list-item'` and `.textContent = item`, and call `appendChild`."
  },

  // Easy 2: toggleElementState
  {
    id: "dom-easy-02",
    title: "Toggle Active Card State",
    topics: ["dom"],
    difficulty: "easy",
    type: "dom-task",
    prompt: "Write JS that toggles the `'active'` class on `#profile-box` and synchronizes the attribute `data-active` to `'true'` (if active) or `'false'` (if not active).",
    starterHtml: "<div id=\"profile-box\" data-active=\"false\">User Profile</div>",
    starterCode: "// your code here\n",
    testCases: [
      { check: "document.getElementById('profile-box').classList.contains('active')", expected: true },
      { check: "document.getElementById('profile-box').getAttribute('data-active')", expected: "true" },
      { check: "document.getElementById('profile-box').tagName", expected: "DIV" },
      { check: "document.getElementById('profile-box').textContent.trim()", expected: "User Profile" },
      { check: "document.getElementById('profile-box').id", expected: "profile-box" }
    ],
    explanation: "Use `el.classList.toggle('active')` and `el.setAttribute('data-active', String(el.classList.contains('active')))`."
  },

  // Easy 3: updateCounterDisplay
  {
    id: "dom-easy-03",
    title: "Counter Value and Color Badge",
    topics: ["dom"],
    difficulty: "easy",
    type: "dom-task",
    prompt: "Given `window.currentCount` (an integer), write JS that sets `#counter-value` text to `currentCount`. Also update its classes: remove any existing `'positive'`, `'negative'`, or `'zero'` class, and add:\n- `'positive'` if count > 0\n- `'negative'` if count < 0\n- `'zero'` if count === 0",
    starterHtml: "<script>window.currentCount = 5;</script><div id=\"counter-widget\"><span id=\"counter-value\">0</span></div>",
    starterCode: "// Reads window.currentCount\n// your code here\n",
    testCases: [
      { check: "document.getElementById('counter-value').textContent", expected: "5" },
      { check: "document.getElementById('counter-value').classList.contains('positive')", expected: true },
      { setup: "window.currentCount = -3;", check: "document.getElementById('counter-value').classList.contains('negative')", expected: true },
      { setup: "window.currentCount = 0;", check: "document.getElementById('counter-value').classList.contains('zero')", expected: true },
      { check: "document.getElementById('counter-value').textContent", expected: "0" }
    ],
    explanation: "Set `.textContent = String(window.currentCount)`. Remove all three classes first, then add the appropriate class based on the sign."
  },

  // Medium 1 (pairs with Array): renderSortedChips
  {
    id: "dom-medium-01",
    title: "Render Sorted Category Chips",
    topics: ["dom", "array"],
    difficulty: "medium",
    type: "dom-task",
    prompt: "Given `window.categoryList` (an array of strings), write JS that takes a copy of the array, sorts it alphabetically, and creates `<span class=\"chip\" data-category=\"${cat}\">${cat}</span>` inside `#chip-tray`. Clear any existing chips in `#chip-tray` before rendering.",
    starterHtml: "<script>window.categoryList = ['Zebra', 'Apple', 'Mango'];</script><div id=\"chip-tray\"></div>",
    starterCode: "// Reads window.categoryList\n// your code here\n",
    testCases: [
      { check: "document.querySelectorAll('#chip-tray .chip').length", expected: 3 },
      { check: "document.querySelectorAll('#chip-tray .chip')[0].textContent", expected: "Apple" },
      { check: "document.querySelectorAll('#chip-tray .chip')[1].textContent", expected: "Mango" },
      { check: "document.querySelectorAll('#chip-tray .chip')[2].textContent", expected: "Zebra" },
      { check: "document.querySelectorAll('#chip-tray .chip')[0].getAttribute('data-category')", expected: "Apple" }
    ],
    explanation: "Clone and sort `[...window.categoryList].sort()`, clear `#chip-tray.innerHTML = ''`, and append new chip elements."
  },

  // Medium 2 (pairs with Object): renderUserProfileSummary
  {
    id: "dom-medium-02",
    title: "Populate User Summary Widget",
    topics: ["dom", "object"],
    difficulty: "medium",
    type: "dom-task",
    prompt: "Given `window.userAccount` (an object `{ name: string, role: string, active: boolean }`), write JS that populates the DOM:\n- Set `#user-name-text` to `userAccount.name`\n- Set `#user-role-badge` to `userAccount.role`\n- If `userAccount.active` is true, add class `'status-online'` to `#status-indicator` and remove `'status-offline'`; if false, add `'status-offline'` and remove `'status-online'`.",
    starterHtml: "<script>window.userAccount = { name: 'Sarah Connor', role: 'Leader', active: true };</script><div id=\"user-widget\"><h4 id=\"user-name-text\"></h4><span id=\"user-role-badge\"></span><div id=\"status-indicator\"></div></div>",
    starterCode: "// Reads window.userAccount\n// your code here\n",
    testCases: [
      { check: "document.getElementById('user-name-text').textContent", expected: "Sarah Connor" },
      { check: "document.getElementById('user-role-badge').textContent", expected: "Leader" },
      { check: "document.getElementById('status-indicator').classList.contains('status-online')", expected: true },
      { setup: "window.userAccount = { name: 'John Doe', role: 'Observer', active: false };", check: "document.getElementById('status-indicator').classList.contains('status-offline')", expected: true },
      { check: "document.getElementById('status-indicator').classList.contains('status-online')", expected: false }
    ],
    explanation: "Extract object properties and map them directly into DOM nodes, toggling the corresponding status class."
  },

  // Medium 3 (pairs with Array): buildAccordion
  {
    id: "dom-medium-03",
    title: "Dynamic Accordion Builder",
    topics: ["dom", "array"],
    difficulty: "medium",
    type: "dom-task",
    prompt: "Given `window.accordionSections` (array of `{ title: string, body: string }`), clear `#accordion-root` and render for each section:\n`<div class=\"acc-panel\"><button class=\"acc-trigger\">${title}</button><div class=\"acc-content hidden\">${body}</div></div>`.",
    starterHtml: "<script>window.accordionSections = [{ title: 'Intro', body: 'Welcome to the site' }, { title: 'FAQ', body: 'Questions here' }];</script><div id=\"accordion-root\"></div>",
    starterCode: "// Reads window.accordionSections\n// your code here\n",
    testCases: [
      { check: "document.querySelectorAll('#accordion-root .acc-panel').length", expected: 2 },
      { check: "document.querySelectorAll('#accordion-root .acc-trigger')[0].textContent", expected: "Intro" },
      { check: "document.querySelectorAll('#accordion-root .acc-content')[0].textContent", expected: "Welcome to the site" },
      { check: "document.querySelectorAll('#accordion-root .acc-content')[0].classList.contains('hidden')", expected: true },
      { check: "document.querySelectorAll('#accordion-root .acc-trigger')[1].textContent", expected: "FAQ" }
    ],
    explanation: "Loop through `accordionSections` and construct nested panel DOM structures with `.acc-panel`, `.acc-trigger`, and `.acc-content.hidden`."
  },

  // Hard 1 (pairs with Error handling + Date): renderExpiryBadge
  {
    id: "dom-hard-01",
    title: "License Expiry Badge",
    topics: ["dom", "error-handling", "date"],
    difficulty: "hard",
    type: "dom-task",
    prompt: "Given `window.licenseExpiry` (ISO date string), write JS inside `try/catch`:\n- If `licenseExpiry` is invalid (`isNaN(Date.parse(licenseExpiry))`), throw an error and set `#badge` text to `'Invalid Date'` with class `'badge-error'`.\n- If valid, compare with reference date `2026-09-01T00:00:00Z`:\n  - If `expiry < reference`, set text to `'Expired'` with class `'badge-expired'`.\n  - If `expiry >= reference`, set text to `'Active'` with class `'badge-active'`.\nEnsure previous badge classes are cleared.",
    starterHtml: "<script>window.licenseExpiry = '2026-12-31T00:00:00Z';</script><div id=\"badge-holder\"><span id=\"badge\"></span></div>",
    starterCode: "// Reads window.licenseExpiry\n// your code here\n",
    testCases: [
      { check: "document.getElementById('badge').textContent", expected: "Active" },
      { check: "document.getElementById('badge').classList.contains('badge-active')", expected: true },
      { setup: "window.licenseExpiry = '2025-01-01T00:00:00Z';", check: "document.getElementById('badge').textContent", expected: "Expired" },
      { check: "document.getElementById('badge').classList.contains('badge-expired')", expected: true },
      { setup: "window.licenseExpiry = 'not-a-date';", check: "document.getElementById('badge').textContent", expected: "Invalid Date" }
    ],
    explanation: "Validate date string in try/catch, compare against reference timestamp, reset class list, and assign status class."
  },

  // Hard 2 (pairs with Error handling + Date): renderRelativeTimestampCard
  {
    id: "dom-hard-02",
    title: "Relative Day Difference Display",
    topics: ["dom", "error-handling", "date"],
    difficulty: "hard",
    type: "dom-task",
    prompt: "Given `window.targetIsoDate`, validate inside `try/catch`:\n- If invalid date, set `#time-diff-output` text to `'Malformed timestamp'` and add class `'err'`.\n- If valid, calculate difference in integer days from reference `2026-09-01T00:00:00Z` (`Math.floor((target - ref) / 86400000)`):\n  - If diff === 0, text is `'Today'`\n  - If diff > 0, text is `'In ' + diff + ' days'`\n  - If diff < 0, text is `Math.abs(diff) + ' days ago'`\n  - Add class `'ok'` to `#time-diff-output`.",
    starterHtml: "<script>window.targetIsoDate = '2026-09-01T00:00:00Z';</script><div id=\"diff-box\"><span id=\"time-diff-output\"></span></div>",
    starterCode: "// Reads window.targetIsoDate\n// your code here\n",
    testCases: [
      { check: "document.getElementById('time-diff-output').textContent", expected: "Today" },
      { check: "document.getElementById('time-diff-output').classList.contains('ok')", expected: true },
      { setup: "window.targetIsoDate = '2026-09-06T00:00:00Z';", check: "document.getElementById('time-diff-output').textContent", expected: "In 5 days" },
      { setup: "window.targetIsoDate = '2026-08-30T00:00:00Z';", check: "document.getElementById('time-diff-output').textContent", expected: "2 days ago" },
      { setup: "window.targetIsoDate = 'garbage';", check: "document.getElementById('time-diff-output').textContent", expected: "Malformed timestamp" }
    ],
    explanation: "Compute day delta relative to 2026-09-01, format relative wording ('Today', 'In X days', 'X days ago'), and handle error catch."
  },

  // Hard 3 (pairs with Error handling + Date): auditAndRenderDateForm
  {
    id: "dom-hard-03",
    title: "Event Booking Form Validator",
    topics: ["dom", "error-handling", "date"],
    difficulty: "hard",
    type: "dom-task",
    prompt: "Write JS that inspects inputs `#event-name` and `#event-date` inside `try/catch`:\n1. If `#event-name` value is empty, throw `new Error('Event name required')`\n2. If `#event-date` value is invalid date or prior to `2026-09-01`, throw `new Error('Date must be on or after 2026-09-01')`\n3. If valid, set `#form-msg` text to `'Valid: Ready to submit'`, add class `'valid'`, and enable `#submit-btn` (`disabled = false`).\n4. If error thrown: set `#form-msg` text to error message, add class `'invalid'`, and disable `#submit-btn` (`disabled = true`).",
    starterHtml: "<form id=\"event-form\"><input id=\"event-name\" type=\"text\" value=\"Tech Conference\"><input id=\"event-date\" type=\"text\" value=\"2026-10-01\"><p id=\"form-msg\"></p><button id=\"submit-btn\" disabled>Submit</button></form>",
    starterCode: "// your code here\n",
    testCases: [
      { check: "document.getElementById('submit-btn').disabled", expected: false },
      { check: "document.getElementById('form-msg').textContent", expected: "Valid: Ready to submit" },
      { setup: "document.getElementById('event-name').value = '';", check: "document.getElementById('submit-btn').disabled", expected: true },
      { check: "document.getElementById('form-msg').textContent", expected: "Event name required" },
      { setup: "document.getElementById('event-name').value = 'Concert'; document.getElementById('event-date').value = '2025-01-01';", check: "document.getElementById('form-msg').textContent", expected: "Date must be on or after 2026-09-01" }
    ],
    explanation: "Extract input values, validate non-empty title and valid forward date in try/catch, toggle disabled on submit button."
  }
];

// Export for both Browser and Node.js
if (typeof window !== "undefined") {
  window.exerciseBank = exerciseBank;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = exerciseBank;
}
