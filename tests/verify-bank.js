// tests/verify-bank.js
// Validates exerciseBank.js data integrity

const fs = require('fs');
const path = require('path');

const bankPath = path.join(__dirname, '../js/exerciseBank.js');
if (!fs.existsSync(bankPath)) {
  console.error("FAIL: exerciseBank.js does not exist!");
  process.exit(1);
}

const bankCode = fs.readFileSync(bankPath, 'utf8');

// Mock window or export to evaluate exercise bank in Node environment
const sandbox = { window: {}, exerciseBank: null };
try {
  const evalFunc = new Function('window', bankCode + '; return window.exerciseBank || (typeof exerciseBank !== "undefined" ? exerciseBank : null);');
  sandbox.exerciseBank = evalFunc(sandbox.window);
} catch (err) {
  console.error("Syntax or runtime error evaluating exerciseBank.js:", err);
  process.exit(1);
}

const bank = sandbox.exerciseBank;
if (!bank || !Array.isArray(bank)) {
  console.error("FAIL: exerciseBank is not an array!");
  process.exit(1);
}

console.log(`Loaded exerciseBank with ${bank.length} exercises.`);

const EXPECTED_TOPICS = ['if-else', 'date', 'array', 'object', 'error-handling', 'dom'];
const EXPECTED_DIFFICULTIES = ['easy', 'medium', 'hard'];

// Verify counts
const counts = {};
EXPECTED_TOPICS.forEach(t => {
  counts[t] = { easy: 0, medium: 0, hard: 0 };
});

const pairingRules = {
  'if-else': {
    medium: ['array', 'date'],
    hard: [['object', 'error-handling']]
  },
  'date': {
    medium: ['if-else', 'array'],
    hard: [['error-handling', 'dom']]
  },
  'array': {
    medium: ['if-else', 'object'],
    hard: [['error-handling', 'dom']]
  },
  'object': {
    medium: ['array', 'if-else'],
    hard: [['error-handling', 'dom']]
  },
  'error-handling': {
    medium: ['array', 'object'],
    hard: [['dom', 'date']]
  },
  'dom': {
    medium: ['array', 'object'],
    hard: [['error-handling', 'date']]
  }
};

let errors = [];

bank.forEach((ex, idx) => {
  const prefix = `Exercise [${ex.id || 'index ' + idx}]`;
  
  if (!ex.id) errors.push(`${prefix}: Missing id`);
  if (!ex.title) errors.push(`${prefix}: Missing title`);
  if (!ex.prompt) errors.push(`${prefix}: Missing prompt`);
  if (!ex.starterCode) errors.push(`${prefix}: Missing starterCode`);
  if (!ex.explanation) errors.push(`${prefix}: Missing explanation`);
  if (!ex.difficulty || !EXPECTED_DIFFICULTIES.includes(ex.difficulty)) {
    errors.push(`${prefix}: Invalid difficulty '${ex.difficulty}'`);
  }
  if (!Array.isArray(ex.topics) || ex.topics.length === 0) {
    errors.push(`${prefix}: Missing or invalid topics array`);
  } else {
    const primaryTopic = ex.topics[0];
    if (!EXPECTED_TOPICS.includes(primaryTopic)) {
      errors.push(`${prefix}: Unknown primary topic '${primaryTopic}'`);
    } else if (counts[primaryTopic] && counts[primaryTopic][ex.difficulty] !== undefined) {
      counts[primaryTopic][ex.difficulty]++;
    }

    // Check pairing rules
    if (ex.difficulty === 'medium') {
      const allowedPair = pairingRules[primaryTopic]?.medium || [];
      const hasAllowedPair = ex.topics.some((t, i) => i > 0 && allowedPair.includes(t));
      if (!hasAllowedPair) {
        errors.push(`${prefix}: Medium level should pair '${primaryTopic}' with one of [${allowedPair.join(', ')}], got [${ex.topics.join(', ')}]`);
      }
    } else if (ex.difficulty === 'hard') {
      const allowedPairs = pairingRules[primaryTopic]?.hard || [];
      const matched = allowedPairs.some(pair => pair.every(req => ex.topics.includes(req)));
      if (!matched) {
        errors.push(`${prefix}: Hard level for '${primaryTopic}' must include topics [${allowedPairs.map(p => p.join('+')).join(' or ')}], got [${ex.topics.join(', ')}]`);
      }
    }
  }

  if (ex.type === 'dom-task') {
    if (!ex.starterHtml) errors.push(`${prefix}: DOM task missing starterHtml`);
  } else if (ex.type !== 'write-function') {
    errors.push(`${prefix}: Invalid type '${ex.type}'`);
  }

  if (!Array.isArray(ex.testCases) || ex.testCases.length !== 5) {
    errors.push(`${prefix}: Must have EXACTLY 5 testCases, found ${ex.testCases ? ex.testCases.length : 0}`);
  } else {
    ex.testCases.forEach((tc, tcIdx) => {
      if (ex.type === 'write-function') {
        if (!('input' in tc)) errors.push(`${prefix} Test ${tcIdx + 1}: Missing 'input' property`);
        if (!('expected' in tc)) errors.push(`${prefix} Test ${tcIdx + 1}: Missing 'expected' property`);
      } else if (ex.type === 'dom-task') {
        if (!('check' in tc)) errors.push(`${prefix} Test ${tcIdx + 1}: Missing 'check' property`);
        if (!('expected' in tc)) errors.push(`${prefix} Test ${tcIdx + 1}: Missing 'expected' property`);
      }
    });
  }
});

// Check total count per topic and difficulty
EXPECTED_TOPICS.forEach(t => {
  EXPECTED_DIFFICULTIES.forEach(d => {
    const c = counts[t][d];
    if (c !== 3) {
      errors.push(`Topic '${t}' difficulty '${d}' has ${c} exercises, expected 3`);
    }
  });
});

if (errors.length > 0) {
  console.error(`\nVerification FAILED with ${errors.length} errors:`);
  errors.slice(0, 25).forEach(e => console.error(" - " + e));
  if (errors.length > 25) console.error(` ... and ${errors.length - 25} more`);
  process.exit(1);
}

console.log("SUCCESS: All 54 exercises validated perfectly!");
console.log("- 6 topics × 3 difficulties × 3 exercises = 54 exercises");
console.log("- 54 exercises × 5 test cases = 270 verified test cases");
console.log("- All Medium/Hard topic pairing rules verified.");
