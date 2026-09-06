// js/progress.js
// Single module responsible for reading/writing user practice progress to localStorage.

class ProgressStore {
  constructor(storageKey = "jsPracticeProgress") {
    this.storageKey = storageKey;
    this.streakKey = "jsPracticeStreak";
    this.draftsKey = "jsPracticeDrafts";
    this.sessionKey = "jsPracticeLastSession";
    this.topics = ["if-else", "date", "array", "object", "error-handling", "dom"];
    this.difficulties = ["easy", "medium", "hard"];
    this.initStore();
  }

  // Save written code draft for specific exercise
  saveDraft(exerciseId, code) {
    try {
      const raw = localStorage.getItem(this.draftsKey);
      const drafts = raw ? JSON.parse(raw) : {};
      drafts[exerciseId] = code;
      localStorage.setItem(this.draftsKey, JSON.stringify(drafts));
    } catch (e) {
      console.error("Failed to save draft:", e);
    }
  }

  // Retrieve saved code draft
  getDraft(exerciseId) {
    try {
      const raw = localStorage.getItem(this.draftsKey);
      if (!raw) return null;
      const drafts = JSON.parse(raw);
      return drafts[exerciseId] !== undefined ? drafts[exerciseId] : null;
    } catch {
      return null;
    }
  }

  // Clear draft for specific exercise (e.g. on Reset Code)
  clearDraft(exerciseId) {
    try {
      const raw = localStorage.getItem(this.draftsKey);
      if (!raw) return;
      const drafts = JSON.parse(raw);
      delete drafts[exerciseId];
      localStorage.setItem(this.draftsKey, JSON.stringify(drafts));
    } catch (e) {
      console.error("Failed to clear draft:", e);
    }
  }

  // Save last active navigation session
  saveLastSession(session) {
    try {
      localStorage.setItem(this.sessionKey, JSON.stringify(session));
    } catch (e) {
      console.error("Failed to save session state:", e);
    }
  }

  // Get last active navigation session
  getLastSession() {
    try {
      const raw = localStorage.getItem(this.sessionKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  // Initialize store structure if not present
  initStore() {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      const initial = {};
      this.topics.forEach(topic => {
        initial[topic] = {
          easy: {},
          medium: {},
          hard: {}
        };
      });
      this.saveRaw(initial);
    }
  }

  // Read raw store
  getRaw() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error("Failed to parse progress from localStorage:", e);
      return null;
    }
  }

  // Save raw store
  saveRaw(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save progress to localStorage:", e);
    }
  }

  // Record exercise attempt ('correct' | 'incorrect')
  recordAttempt(topic, difficulty, exerciseId, isCorrect) {
    const data = this.getRaw() || {};
    if (!data[topic]) data[topic] = { easy: {}, medium: {}, hard: {} };
    if (!data[topic][difficulty]) data[topic][difficulty] = {};

    data[topic][difficulty][exerciseId] = isCorrect ? "correct" : "incorrect";
    this.saveRaw(data);

    if (isCorrect) {
      this.updateStreak();
    }
  }

  // Get status of specific exercise ('unattempted' | 'incorrect' | 'correct')
  getExerciseStatus(topic, difficulty, exerciseId) {
    const data = this.getRaw();
    if (!data || !data[topic] || !data[topic][difficulty]) {
      return "unattempted";
    }
    return data[topic][difficulty][exerciseId] || "unattempted";
  }

  // Topic-level stats
  getTopicStats(topic, totalExercisesPerLevel = 3) {
    const data = this.getRaw();
    const stats = {
      topic,
      easy: { correct: 0, incorrect: 0, total: totalExercisesPerLevel },
      medium: { correct: 0, incorrect: 0, total: totalExercisesPerLevel },
      hard: { correct: 0, incorrect: 0, total: totalExercisesPerLevel },
      totalCorrect: 0,
      totalExercises: totalExercisesPerLevel * 3,
      masteryPercent: 0
    };

    if (!data || !data[topic]) return stats;

    this.difficulties.forEach(diff => {
      const levelData = data[topic][diff] || {};
      Object.values(levelData).forEach(status => {
        if (status === "correct") {
          stats[diff].correct++;
          stats.totalCorrect++;
        } else if (status === "incorrect") {
          stats[diff].incorrect++;
        }
      });
    });

    stats.masteryPercent = Math.round((stats.totalCorrect / stats.totalExercises) * 100);
    return stats;
  }

  // Overall platform stats
  getOverallStats(totalPlatformExercises = 54) {
    const data = this.getRaw();
    let totalCorrect = 0;
    let totalAttempted = 0;

    if (data) {
      this.topics.forEach(topic => {
        if (data[topic]) {
          this.difficulties.forEach(diff => {
            const levelData = data[topic][diff] || {};
            Object.values(levelData).forEach(status => {
              if (status === "correct") {
                totalCorrect++;
                totalAttempted++;
              } else if (status === "incorrect") {
                totalAttempted++;
              }
            });
          });
        }
      });
    }

    const streakData = this.getStreakData();

    return {
      totalExercises: totalPlatformExercises,
      totalCorrect,
      totalAttempted,
      masteryPercent: Math.round((totalCorrect / totalPlatformExercises) * 100),
      streak: streakData.currentStreak
    };
  }

  // List of exercise IDs marked as 'incorrect'
  getIncorrectExerciseIds() {
    const data = this.getRaw();
    const mistakes = [];
    if (!data) return mistakes;

    this.topics.forEach(topic => {
      if (data[topic]) {
        this.difficulties.forEach(diff => {
          const levelData = data[topic][diff] || {};
          Object.entries(levelData).forEach(([exId, status]) => {
            if (status === "incorrect") {
              mistakes.push({ topic, difficulty: diff, exerciseId: exId });
            }
          });
        });
      }
    });

    return mistakes;
  }

  // Streak tracking
  getStreakData() {
    try {
      const raw = localStorage.getItem(this.streakKey);
      if (!raw) return { currentStreak: 0, lastActiveDate: null };
      return JSON.parse(raw);
    } catch {
      return { currentStreak: 0, lastActiveDate: null };
    }
  }

  updateStreak() {
    const today = new Date().toISOString().split("T")[0];
    const streak = this.getStreakData();

    if (!streak.lastActiveDate) {
      streak.currentStreak = 1;
      streak.lastActiveDate = today;
    } else if (streak.lastActiveDate === today) {
      // Already practiced today
      return;
    } else {
      const lastDate = new Date(streak.lastActiveDate);
      const currDate = new Date(today);
      const diffDays = Math.round((currDate - lastDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak.currentStreak++;
      } else if (diffDays > 1) {
        streak.currentStreak = 1; // reset streak
      }
      streak.lastActiveDate = today;
    }

    try {
      localStorage.setItem(this.streakKey, JSON.stringify(streak));
    } catch (e) {
      console.error("Failed to save streak:", e);
    }
  }

  // Reset progress with confirmation
  resetProgress() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.streakKey);
    localStorage.removeItem(this.draftsKey);
    localStorage.removeItem(this.sessionKey);
    this.initStore();
  }

  // Export progress as JSON string
  exportProgressJSON() {
    const data = this.getRaw();
    const streak = this.getStreakData();
    return JSON.stringify({ progress: data, streak, exportedAt: new Date().toISOString() }, null, 2);
  }

  // Import progress from JSON string
  importProgressJSON(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.progress) {
        this.saveRaw(parsed.progress);
        if (parsed.streak) {
          localStorage.setItem(this.streakKey, JSON.stringify(parsed.streak));
        }
        return { success: true };
      }
      return { success: false, error: "Invalid backup format: missing 'progress' key" };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

// Global instance
if (typeof window !== "undefined") {
  window.ProgressStore = ProgressStore;
  window.progressStore = new ProgressStore();
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = ProgressStore;
}
