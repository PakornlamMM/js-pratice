// js/router.js
// Hash-based client-side router for ExecJS Practice Platform.
// Manages location.hash as the single source of truth for view navigation.
// Works seamlessly on static hosts (like GitHub Pages) with zero server configuration.

class AppRouter {
  constructor() {
    this.validTopics = ["if-else", "date", "array", "object", "error-handling", "dom"];
    this.validDifficulties = ["easy", "medium", "hard"];
    this.routeListeners = [];
    this.currentRoute = null;
    this.isNavigating = false;
  }

  // Subscribe to route changes
  onRoute(callback) {
    if (typeof callback === "function") {
      this.routeListeners.push(callback);
    }
  }

  // Notify all registered route listeners
  notifyListeners(route) {
    this.currentRoute = route;
    this.routeListeners.forEach(fn => {
      try {
        fn(route);
      } catch (err) {
        console.error("Error in route listener:", err);
      }
    });
  }

  // Parse hash string into structured route object
  // Scheme:
  // #/                           -> { view: 'home' }
  // #/topic/:topic               -> { view: 'topic', topic }
  // #/topic/:topic/:diff         -> { view: 'exercise', topic, difficulty, exerciseIndex: 0 }
  // #/topic/:topic/:diff/:index  -> { view: 'exercise', topic, difficulty, exerciseIndex }
  parseHash(hashStr) {
    let clean = (hashStr || "").trim();
    if (clean.startsWith("#")) clean = clean.substring(1);
    if (!clean.startsWith("/")) clean = "/" + clean;

    // Remove trailing slash if not root
    if (clean.length > 1 && clean.endsWith("/")) {
      clean = clean.slice(0, -1);
    }

    // Root / Home
    if (clean === "" || clean === "/") {
      return { view: "home", path: "#/" };
    }

    const segments = clean.split("/").filter(Boolean);

    // /topic/:topic
    if (segments[0] === "topic" && segments[1]) {
      const topic = segments[1].toLowerCase();
      if (!this.validTopics.includes(topic)) {
        return { view: "home", path: "#/", fallback: true };
      }

      // /topic/:topic (Dashboard topic view)
      if (segments.length === 2) {
        return { view: "topic", topic, path: `#/topic/${topic}` };
      }

      // /topic/:topic/:difficulty
      if (segments.length >= 3) {
        const diff = segments[2].toLowerCase();
        if (!this.validDifficulties.includes(diff)) {
          return { view: "topic", topic, path: `#/topic/${topic}`, fallback: true };
        }

        // Exercise Index (1-indexed in URL, e.g. 1, 2, 3... supports generated exercises up to 100)
        let exerciseNum = 1;
        if (segments[3]) {
          const parsed = parseInt(segments[3], 10);
          if (!isNaN(parsed) && parsed >= 1) {
            exerciseNum = Math.min(parsed, 100);
          }
        }

        const exerciseIndex = exerciseNum - 1; // 0-indexed internally
        return {
          view: "exercise",
          topic,
          difficulty: diff,
          exerciseIndex,
          exerciseNumber: exerciseNum,
          path: `#/topic/${topic}/${diff}/${exerciseNum}`
        };
      }
    }

    // Unrecognized route -> Safe fallback to home
    return { view: "home", path: "#/", fallback: true };
  }

  // Get current route from window.location
  getCurrentRoute() {
    const rawHash = typeof window !== "undefined" ? window.location.hash : "#/";
    return this.parseHash(rawHash);
  }

  // Build URL hash string from route components
  buildUrl(topic, difficulty, exerciseIndex = 0) {
    if (!topic) return "#/";
    if (!difficulty) return `#/topic/${topic}`;
    const num = Math.max(1, (exerciseIndex || 0) + 1);
    return `#/topic/${topic}/${difficulty}/${num}`;
  }

  // Programmatic navigation
  navigate(target, replace = false) {
    let targetHash = "";
    if (typeof target === "string") {
      targetHash = target.startsWith("#") ? target : "#" + target;
    } else if (target && typeof target === "object") {
      targetHash = this.buildUrl(target.topic, target.difficulty, target.exerciseIndex);
    } else {
      targetHash = "#/";
    }

    if (typeof window === "undefined") return;

    if (window.location.hash === targetHash) {
      // Hash is already identical, trigger listeners manually
      const route = this.parseHash(targetHash);
      this.notifyListeners(route);
      return;
    }

    this.isNavigating = true;
    if (replace && window.history && window.history.replaceState) {
      window.history.replaceState(null, "", targetHash);
      const route = this.parseHash(targetHash);
      this.notifyListeners(route);
    } else {
      window.location.hash = targetHash;
    }
    this.isNavigating = false;
  }

  // Initialize router and listen for hashchange events
  init() {
    if (typeof window === "undefined") return;

    window.addEventListener("hashchange", () => {
      const route = this.getCurrentRoute();
      // If the URL was invalid and fell back to valid route, update the URL cleanly
      if (route.fallback && window.location.hash !== route.path) {
        window.location.replace(route.path);
        return;
      }
      this.notifyListeners(route);
    });

    // Initial dispatch on load
    const initialRoute = this.getCurrentRoute();
    if (initialRoute.fallback && window.location.hash !== initialRoute.path) {
      window.location.replace(initialRoute.path);
    } else {
      this.notifyListeners(initialRoute);
    }
  }
}

// Global & CommonJS Export
if (typeof module !== "undefined" && module.exports) {
  module.exports = AppRouter;
} else if (typeof window !== "undefined") {
  window.AppRouter = AppRouter;
}
