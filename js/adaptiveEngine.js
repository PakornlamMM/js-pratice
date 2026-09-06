// js/adaptiveEngine.js
// Adaptive progression, topic-pairing enforcement, replay randomization, and mistake review queue.

class AdaptiveEngine {
  constructor(exerciseBank) {
    this.bank = exerciseBank || [];
    this.consecutiveFailures = 0;
    this.consecutiveSuccesses = 0;
  }

  // Topic pairing rules matrix
  static getTopicPairings() {
    return {
      "if-else": {
        medium: ["array", "date"],
        hard: ["object", "error-handling"]
      },
      "date": {
        medium: ["if-else", "array"],
        hard: ["error-handling", "dom"]
      },
      "array": {
        medium: ["if-else", "object"],
        hard: ["error-handling", "dom"]
      },
      "object": {
        medium: ["array", "if-else"],
        hard: ["error-handling", "dom"]
      },
      "error-handling": {
        medium: ["array", "object"],
        hard: ["dom", "date"]
      },
      "dom": {
        medium: ["array", "object"],
        hard: ["error-handling", "date"]
      }
    };
  }

  // Filter exercises by topic and difficulty
  getExercises(topic, difficulty, shouldShuffle = false) {
    let filtered = this.bank.filter(ex => ex.topics[0] === topic && ex.difficulty === difficulty);
    if (shouldShuffle) {
      filtered = this.shuffleArray([...filtered]);
    }
    return filtered;
  }

  // Fisher-Yates array shuffle (non-mutating)
  shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // Build queue of exercises marked as 'incorrect'
  getMistakesQueue(progressStore) {
    const mistakeItems = progressStore.getIncorrectExerciseIds();
    const mistakeIds = new Set(mistakeItems.map(m => m.exerciseId));
    return this.bank.filter(ex => mistakeIds.has(ex.id));
  }

  // Track session performance and provide adaptive recommendations
  recordSessionResult(isPassed, currentDifficulty) {
    if (isPassed) {
      this.consecutiveSuccesses++;
      this.consecutiveFailures = 0;
    } else {
      this.consecutiveFailures++;
      this.consecutiveSuccesses = 0;
    }

    if (this.consecutiveFailures >= 2 && currentDifficulty === "hard") {
      return {
        type: "step_down",
        suggestedDifficulty: "medium",
        message: "These Hard challenges combine 3 topics! Would you like to review with a Medium exercise first?"
      };
    }

    if (this.consecutiveSuccesses >= 3 && currentDifficulty === "easy") {
      return {
        type: "step_up",
        suggestedDifficulty: "medium",
        message: "Great work! You've mastered Easy mode. Ready to try multi-topic Medium challenges?"
      };
    }

    if (this.consecutiveSuccesses >= 3 && currentDifficulty === "medium") {
      return {
        type: "step_up",
        suggestedDifficulty: "hard",
        message: "Outstanding consistency! Ready to tackle realistic Hard scenarios combining 3 topics?"
      };
    }

    return null;
  }

  // Find exercise by ID
  getExerciseById(id) {
    return this.bank.find(ex => ex.id === id) || null;
  }
}

// Global attachment
if (typeof window !== "undefined") {
  window.AdaptiveEngine = AdaptiveEngine;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = AdaptiveEngine;
}
