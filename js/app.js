// js/app.js
// Main application controller for ExecJS Practice Platform.

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Core Engines
  const bank = window.exerciseBank || [];
  const store = window.progressStore || new ProgressStore();
  const adaptive = new AdaptiveEngine(bank);
  const sandbox = new SandboxEngine();
  const aiGen = new AIGenerator();
  const router = window.appRouter || new AppRouter();

  // Application State
  const state = {
    currentTopic: "if-else",
    currentDifficulty: "easy",
    currentExerciseIndex: 0,
    exerciseQueue: [],
    currentExercise: null,
    isReviewMode: false
  };

  // DOM Element References
  const views = {
    dashboard: document.getElementById("view-dashboard"),
    exercise: document.getElementById("view-exercise"),
    results: document.getElementById("view-results")
  };

  // Header Metrics
  const elGlobalStreak = document.getElementById("global-streak");
  const elGlobalMastery = document.getElementById("global-mastery");
  const elGlobalCount = document.getElementById("global-count");
  const elGlobalProgressBar = document.getElementById("global-progress-bar");
  const elMistakesCount = document.getElementById("mistakes-count");
  const btnOpenMistakes = document.getElementById("btn-open-mistakes");
  const btnOpenSettings = document.getElementById("btn-open-settings");
  const navBrand = document.getElementById("nav-brand");

  // Dashboard View
  const topicsGrid = document.getElementById("topics-grid");
  const resumeSessionBar = document.getElementById("resume-session-bar");
  const resumeExerciseTitle = document.getElementById("resume-exercise-title");
  const resumeExerciseMeta = document.getElementById("resume-exercise-meta");
  const btnResumeSession = document.getElementById("btn-resume-session");

  // Workspace View
  const btnBackDashboard = document.getElementById("btn-back-dashboard");
  const navTopicSelect = document.getElementById("nav-topic-select");
  const navDiffToggle = document.getElementById("nav-diff-toggle");
  const exerciseStepper = document.getElementById("exercise-stepper");
  const stepperScrollLeft = document.getElementById("stepper-scroll-left");
  const stepperScrollRight = document.getElementById("stepper-scroll-right");
  const stepperCounter = document.getElementById("stepper-counter");
  const btnPrevExercise = document.getElementById("btn-prev-exercise");
  const btnNextExercise = document.getElementById("btn-next-exercise");

  const exerciseBadgeDifficulty = document.getElementById("exercise-badge-difficulty");
  const exerciseTopicTags = document.getElementById("exercise-topic-tags");
  const exerciseStatusBadge = document.getElementById("exercise-status-badge");
  const exerciseTitle = document.getElementById("exercise-title");
  const exercisePrompt = document.getElementById("exercise-prompt");
  const starterDomBox = document.getElementById("starter-dom-box");
  const domHtmlContent = document.getElementById("dom-html-content");
  const btnToggleHint = document.getElementById("btn-toggle-hint");
  const hintContent = document.getElementById("hint-content");
  const exerciseExplanation = document.getElementById("exercise-explanation");

  const codeEditor = document.getElementById("code-editor");
  const editorGutter = document.getElementById("editor-gutter");
  const autosaveStatus = document.getElementById("autosave-status");
  const btnResetCode = document.getElementById("btn-reset-code");
  const btnAiGenerateSimilar = document.getElementById("btn-ai-generate-similar");
  const btnRunTests = document.getElementById("btn-run-tests");
  const btnQuickNext = document.getElementById("btn-quick-next");

  const testScoreChip = document.getElementById("test-score-chip");
  const testTotalTime = document.getElementById("test-total-time");
  const testCasesList = document.getElementById("test-cases-list");

  // Results View
  const resultsHeading = document.getElementById("results-heading");
  const resultsSubheading = document.getElementById("results-subheading");
  const resultsPassedCount = document.getElementById("results-passed-count");
  const resultsTestTotal = document.getElementById("results-test-total");
  const resultsMasteryDiff = document.getElementById("results-mastery-diff");
  const resultsCalloutText = document.getElementById("results-callout-text");
  const btnResultsReplay = document.getElementById("btn-results-replay");
  const btnResultsTopics = document.getElementById("btn-results-topics");
  const btnResultsNextLevel = document.getElementById("btn-results-next-level");

  // Modals
  const modalMistakes = document.getElementById("modal-mistakes");
  const btnCloseMistakes = document.getElementById("btn-close-mistakes");
  const mistakesListContainer = document.getElementById("mistakes-list-container");

  const modalSettings = document.getElementById("modal-settings");
  const btnCloseSettings = document.getElementById("btn-close-settings");
  const btnExportJson = document.getElementById("btn-export-json");
  const btnImportTrigger = document.getElementById("btn-import-trigger");
  const importFileInput = document.getElementById("import-file-input");
  const importStatusMsg = document.getElementById("import-status-msg");
  const btnResetAllData = document.getElementById("btn-reset-all-data");

  const aiEndpointInput = document.getElementById("ai-endpoint-input");
  const aiKeyInput = document.getElementById("ai-key-input");
  const btnSaveAiConfig = document.getElementById("btn-save-ai-config");
  const aiSaveFeedback = document.getElementById("ai-save-feedback");

  // Toast Container
  const toastContainer = document.getElementById("toast-container");

  // Topic Metadata Definition
  const TOPIC_METADATA = {
    "if-else": {
      name: "Conditionals",
      icon: "🔀",
      desc: "Branching control flow, boolean evaluation, nested conditionals, and edge-case guards.",
      mediumPairs: "Array or Date",
      hardPairs: "Object + Error Handling"
    },
    "date": {
      name: "Date Object",
      icon: "📅",
      desc: "Timestamps, calendar calculations, date arithmetic, UTC transformations, and formatting.",
      mediumPairs: "If-else or Array",
      hardPairs: "Error Handling + DOM"
    },
    "array": {
      name: "Arrays",
      icon: "📦",
      desc: "Transformations, reductions, partitioning, deduplication, and nested multi-dimensional data.",
      mediumPairs: "If-else or Object",
      hardPairs: "Error Handling + DOM"
    },
    "object": {
      name: "Objects",
      icon: "🗂️",
      desc: "Key-value dictionaries, property inspection, nesting traversal, merging, and serialization.",
      mediumPairs: "Array or If-else",
      hardPairs: "Error Handling + DOM"
    },
    "error-handling": {
      name: "Error Handling",
      icon: "🛡️",
      desc: "Try/catch/finally pipelines, custom errors, defensive boundaries, and cleanup hooks.",
      mediumPairs: "Array or Object",
      hardPairs: "DOM + Date"
    },
    "dom": {
      name: "DOM Manipulation",
      icon: "🌐",
      desc: "Querying nodes, reactive tree mutations, attribute synchronization, and form audits.",
      mediumPairs: "Array or Object",
      hardPairs: "Error Handling + Date"
    }
  };

  // =========================================================================
  // VIEW SWITCHING
  // =========================================================================
  function switchView(viewName) {
    Object.keys(views).forEach(k => {
      views[k].classList.toggle("active", k === viewName);
    });
    updateGlobalMetrics();
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Track active view in last session for seamless page refresh restoration
    const last = store.getLastSession() || {};
    last.activeView = viewName;
    store.saveLastSession(last);
  }

  // =========================================================================
  // GLOBAL METRICS UPDATE
  // =========================================================================
  function updateGlobalMetrics() {
    const overall = store.getOverallStats(bank.length);
    elGlobalStreak.textContent = overall.streak;
    elGlobalMastery.textContent = `${overall.masteryPercent}%`;
    elGlobalCount.textContent = `(${overall.totalCorrect}/${bank.length})`;
    elGlobalProgressBar.style.width = `${overall.masteryPercent}%`;

    const mistakes = store.getIncorrectExerciseIds();
    elMistakesCount.textContent = mistakes.length;
    btnOpenMistakes.style.display = mistakes.length > 0 ? "inline-flex" : "none";
  }

  // =========================================================================
  // RENDER DASHBOARD / TOPIC CARDS
  // =========================================================================
  function renderDashboard() {
    topicsGrid.innerHTML = "";

    Object.entries(TOPIC_METADATA).forEach(([topicId, meta]) => {
      const stats = store.getTopicStats(topicId, 3);

      const card = document.createElement("div");
      card.className = "topic-card";

      card.innerHTML = `
        <div>
          <div class="topic-card-header">
            <div class="topic-card-icon-title">
              <span class="topic-card-icon">${meta.icon}</span>
              <h3 class="topic-card-title">${meta.name}</h3>
            </div>
            <span class="topic-mastery-tag">${stats.masteryPercent}%</span>
          </div>
          <p class="topic-card-desc">${meta.desc}</p>
          <div class="topic-progress-wrap">
            <div class="topic-progress-fill" style="width: ${stats.masteryPercent}%;"></div>
          </div>
        </div>

        <div class="difficulty-selector">
          <button class="diff-btn" data-topic="${topicId}" data-diff="easy">
            <span class="diff-name">Easy</span>
            <span class="diff-score">${stats.easy.correct}/3</span>
            <span class="diff-pairing-tag">Isolated</span>
          </button>
          <button class="diff-btn" data-topic="${topicId}" data-diff="medium">
            <span class="diff-name">Medium</span>
            <span class="diff-score">${stats.medium.correct}/3</span>
            <span class="diff-pairing-tag">+ ${meta.mediumPairs}</span>
          </button>
          <button class="diff-btn" data-topic="${topicId}" data-diff="hard">
            <span class="diff-name">Hard</span>
            <span class="diff-score">${stats.hard.correct}/3</span>
            <span class="diff-pairing-tag">+ ${meta.hardPairs}</span>
          </button>
        </div>
      `;

      // Attach difficulty buttons
      card.querySelectorAll(".diff-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const topic = btn.getAttribute("data-topic");
          const diff = btn.getAttribute("data-diff");
          router.navigate(router.buildUrl(topic, diff, 0));
        });
      });

      topicsGrid.appendChild(card);
    });

    // Check for previous session to resume
    const lastSession = store.getLastSession();
    if (lastSession && lastSession.exerciseId) {
      resumeSessionBar.classList.remove("hidden");
      resumeExerciseTitle.textContent = `Resume: ${lastSession.exerciseTitle || "Last Exercise"}`;
      const topicName = TOPIC_METADATA[lastSession.topic]?.name || lastSession.topic;
      resumeExerciseMeta.textContent = `${topicName} • ${lastSession.difficulty.toUpperCase()} • Exercise ${(lastSession.exerciseIndex || 0) + 1}`;
      btnResumeSession.onclick = () => {
        router.navigate(router.buildUrl(lastSession.topic, lastSession.difficulty, lastSession.exerciseIndex || 0));
      };
    } else {
      resumeSessionBar.classList.add("hidden");
    }

    // Scroll to & highlight focused topic if requested (e.g. from #/topic/:topic)
    if (focusedTopic) {
      setTimeout(() => {
        const card = topicsGrid.querySelector(`.topic-card[data-topic="${focusedTopic}"]`);
        if (card) {
          card.scrollIntoView({ behavior: "smooth", block: "center" });
          card.classList.add("highlighted-topic");
          setTimeout(() => card.classList.remove("highlighted-topic"), 1800);
        }
      }, 50);
    }

    updateGlobalMetrics();
  }

  // =========================================================================
  // PRACTICE SESSION CONTROLLER
  // =========================================================================
  function startPracticeSession(topic, difficulty, exerciseIdx = 0, shouldShuffle = false) {
    state.currentTopic = topic;
    state.currentDifficulty = difficulty;
    state.isReviewMode = false;
    state.exerciseQueue = adaptive.getExercises(topic, difficulty, shouldShuffle);

    if (state.exerciseQueue.length === 0) {
      showToast("No exercises found for this category.", "error");
      router.navigate("#/");
      return;
    }

    const targetIdx = Math.min(Math.max(0, exerciseIdx), state.exerciseQueue.length - 1);
    loadExercise(targetIdx);
    switchView("exercise");
  }

  // Render clickable 1, 2, 3 stepper pills in header
  function renderExerciseStepper() {
    exerciseStepper.innerHTML = "";
    state.exerciseQueue.forEach((ex, idx) => {
      const status = store.getExerciseStatus(ex.topics[0], ex.difficulty, ex.id);
      let statusIcon = "⚪";
      if (status === "correct") statusIcon = "✅";
      if (status === "incorrect") statusIcon = "❌";

      const pill = document.createElement("button");
      pill.className = `stepper-pill ${idx === state.currentExerciseIndex ? "active" : ""} ${status}`;
      pill.title = `${ex.title} (${status})`;
      pill.setAttribute("data-index", idx);
      pill.innerHTML = `<span>${idx + 1}</span> <span>${statusIcon}</span>`;
      pill.addEventListener("click", () => {
        router.navigate(router.buildUrl(state.currentTopic, state.currentDifficulty, idx));
      });
      exerciseStepper.appendChild(pill);
    });

    // Update counter and toggle scroll buttons if more than 5 exercises
    if (stepperCounter) {
      stepperCounter.textContent = `${state.currentExerciseIndex + 1} / ${state.exerciseQueue.length}`;
    }
    const hasOverflow = state.exerciseQueue.length > 5;
    if (stepperScrollLeft) stepperScrollLeft.classList.toggle("hidden", !hasOverflow);
    if (stepperScrollRight) stepperScrollRight.classList.toggle("hidden", !hasOverflow);
  }

  function loadExercise(index) {
    if (index < 0 || index >= state.exerciseQueue.length) return;

    state.currentExerciseIndex = index;
    const ex = state.exerciseQueue[index];
    state.currentExercise = ex;

    // Save session for seamless resume on refresh
    store.saveLastSession({
      topic: state.currentTopic,
      difficulty: state.currentDifficulty,
      exerciseIndex: index,
      exerciseId: ex.id,
      exerciseTitle: ex.title,
      activeView: "exercise"
    });

    // Update Quick Navigation Controls
    navTopicSelect.value = state.currentTopic;
    navDiffToggle.querySelectorAll(".segmented-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-diff") === state.currentDifficulty);
    });
    renderExerciseStepper();

    btnPrevExercise.disabled = index === 0;
    btnNextExercise.disabled = index === state.exerciseQueue.length - 1;
    btnQuickNext.classList.add("hidden");

    // Update counter and scroll active stepper pill into center view
    if (stepperCounter) {
      stepperCounter.textContent = `${index + 1} / ${state.exerciseQueue.length}`;
    }
    setTimeout(() => {
      const activePill = exerciseStepper.querySelector(".stepper-pill.active");
      if (activePill) {
        activePill.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }, 40);

    // Badges & Meta
    exerciseBadgeDifficulty.textContent = ex.difficulty;
    exerciseBadgeDifficulty.className = `badge-difficulty ${ex.difficulty}`;

    exerciseTopicTags.innerHTML = ex.topics
      .map(t => `<span class="topic-tag">${TOPIC_METADATA[t]?.name || t}</span>`)
      .join("");

    const status = store.getExerciseStatus(ex.topics[0], ex.difficulty, ex.id);
    exerciseStatusBadge.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    exerciseStatusBadge.className = `badge-status ${status}`;

    // Prompt
    exerciseTitle.textContent = ex.title;
    exercisePrompt.innerHTML = formatMarkdown(ex.prompt);

    // DOM Fragment Preview (if applicable)
    if (ex.type === "dom-task" && ex.starterHtml) {
      starterDomBox.classList.remove("hidden");
      domHtmlContent.textContent = ex.starterHtml.replace(/<script[\s\S]*?<\/script>/gi, "").trim();
    } else {
      starterDomBox.classList.add("hidden");
    }

    // Explanation / Hint
    hintContent.classList.add("hidden");
    btnToggleHint.classList.remove("open");
    exerciseExplanation.textContent = ex.explanation;

    // Restore saved user code draft if available, otherwise starter code
    const savedDraft = store.getDraft(ex.id);
    codeEditor.value = savedDraft !== null ? savedDraft : ex.starterCode;
    updateEditorLineNumbers();

    autosaveStatus.classList.remove("saving");
    autosaveStatus.innerHTML = '<span class="autosave-dot"></span> Saved';

    // Reset Test Runner Tray
    testScoreChip.textContent = "0 / 5 Passed";
    testScoreChip.className = "test-score-chip";
    testTotalTime.textContent = "";
    testCasesList.innerHTML = `
      <div class="test-placeholder-msg">
        Click "Run 5 Tests" or press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to evaluate your solution.
      </div>
    `;
  }

  // =========================================================================
  // TEST EXECUTION RUNNER
  // =========================================================================
  async function runTests() {
    if (!state.currentExercise) return;

    btnRunTests.disabled = true;
    btnRunTests.innerHTML = `<span>⏳ Evaluating...</span>`;
    testCasesList.innerHTML = `<div class="test-placeholder-msg">Running 5 test cases in safe sandbox...</div>`;

    const ex = state.currentExercise;
    const userCode = codeEditor.value;

    try {
      const runOutcome = await sandbox.runExercise(ex, userCode);
      const { passed, results } = runOutcome;

      // Update store
      store.recordAttempt(ex.topics[0], ex.difficulty, ex.id, passed);
      updateGlobalMetrics();

      // Update status badge
      exerciseStatusBadge.textContent = passed ? "Correct" : "Incorrect";
      exerciseStatusBadge.className = `badge-status ${passed ? "correct" : "incorrect"}`;

      // Update Score Chip
      const passCount = results.filter(r => r.passed).length;
      testScoreChip.textContent = `${passCount} / 5 Passed`;
      testScoreChip.className = `test-score-chip ${passed ? "all-passed" : "has-failed"}`;

      const totalTime = results.reduce((acc, r) => acc + (r.executionTimeMs || 0), 0);
      testTotalTime.textContent = `${totalTime.toFixed(1)}ms`;

      // Render Test Case Rows with Staggered Visual Indicator
      testCasesList.innerHTML = "";
      results.forEach((r, idx) => {
        const row = document.createElement("div");
        row.className = `test-row ${r.passed ? "pass" : "fail"} evaluating`;
        row.style.animationDelay = `${idx * 0.05}s`;

        const testName = `Test ${r.index}`;
        const inputDesc = r.input !== undefined ? sandbox.formatValue(r.input) : (r.check || "");
        const expectedDesc = sandbox.formatValue(r.expected);
        const actualDesc = r.actual !== undefined ? sandbox.formatValue(r.actual) : "undefined";

        row.innerHTML = `
          <div class="test-row-main">
            <div class="test-row-left">
              <span class="test-status-badge">${r.passed ? "✅" : "❌"}</span>
              <span class="test-row-name">${testName}</span>
            </div>
            <span class="test-row-timing">${r.executionTimeMs}ms</span>
          </div>
          <div class="test-row-details">
            <span class="label">${ex.type === "dom-task" ? "Check:" : "Input:"}</span>
            <span><code>${escapeHtml(inputDesc)}</code></span>
            <span class="label">Expected:</span>
            <span><code>${escapeHtml(expectedDesc)}</code></span>
            <span class="label">Actual:</span>
            <span class="actual ${r.passed ? "" : "error-val"}"><code>${escapeHtml(actualDesc)}</code></span>
          </div>
        `;
        testCasesList.appendChild(row);
      });

      // Show toast and auto-reveal hint if passed
      if (passed) {
        showToast("All 5 tests passed!", "success");
        hintContent.classList.remove("hidden");
        btnToggleHint.classList.add("open");

        // Update stepper pills with new status
        renderExerciseStepper();

        // Show quick next challenge button if there's a next exercise
        if (state.currentExerciseIndex < state.exerciseQueue.length - 1 && !state.isReviewMode) {
          btnQuickNext.classList.remove("hidden");
        }

        // Check if last exercise in set
        if (state.currentExerciseIndex === state.exerciseQueue.length - 1 && !state.isReviewMode) {
          setTimeout(() => showResultsView(), 1200);
        }
      } else {
        renderExerciseStepper();
        btnQuickNext.classList.add("hidden");
        showToast("Some tests failed. Check the details below.", "warning");
      }
    } catch (fatalErr) {
      testCasesList.innerHTML = `
        <div class="test-row fail">
          <div class="test-row-main">
            <span class="test-row-name">Sandbox Error</span>
          </div>
          <div class="test-row-details">
            <span class="label">Error:</span>
            <span class="error-val">${escapeHtml(fatalErr.message)}</span>
          </div>
        </div>
      `;
    } finally {
      btnRunTests.disabled = false;
      btnRunTests.innerHTML = `<span class="btn-run-icon">▶</span> Run 5 Tests`;
    }
  }

  // =========================================================================
  // RESULTS VIEW CONTROLLER
  // =========================================================================
  function showResultsView() {
    const queue = state.exerciseQueue;
    let totalTestsPassed = 0;
    let exercisesPassed = 0;

    queue.forEach(ex => {
      const status = store.getExerciseStatus(ex.topics[0], ex.difficulty, ex.id);
      if (status === "correct") {
        exercisesPassed++;
        totalTestsPassed += 5;
      }
    });

    const isAllCorrect = exercisesPassed === queue.length;
    resultsHeading.textContent = isAllCorrect ? "Set Completed!" : "Practice Set Finished";
    resultsSubheading.textContent = `You finished the ${TOPIC_METADATA[state.currentTopic]?.name || state.currentTopic} (${state.currentDifficulty}) challenge set.`;

    resultsPassedCount.textContent = `${exercisesPassed}/${queue.length}`;
    resultsTestTotal.textContent = `${totalTestsPassed}/${queue.length * 5}`;

    const topicStats = store.getTopicStats(state.currentTopic, 3);
    resultsMasteryDiff.textContent = `${topicStats.masteryPercent}%`;

    // Adaptive Recommendation Callout
    const rec = adaptive.recordSessionResult(isAllCorrect, state.currentDifficulty);
    if (rec) {
      resultsCalloutText.textContent = rec.message;
    } else if (isAllCorrect) {
      resultsCalloutText.textContent = "Flawless run! You solved all test cases accurately.";
    } else {
      resultsCalloutText.textContent = "Review your incorrect exercises to build complete topic mastery.";
    }

    // Configure Next Level Button
    if (state.currentDifficulty === "easy") {
      btnResultsNextLevel.textContent = "Start Medium Level";
      btnResultsNextLevel.style.display = "inline-flex";
      btnResultsNextLevel.onclick = () => router.navigate(router.buildUrl(state.currentTopic, "medium", 0));
    } else if (state.currentDifficulty === "medium") {
      btnResultsNextLevel.textContent = "Start Hard Level";
      btnResultsNextLevel.style.display = "inline-flex";
      btnResultsNextLevel.onclick = () => router.navigate(router.buildUrl(state.currentTopic, "hard", 0));
    } else {
      btnResultsNextLevel.style.display = "none";
    }

    switchView("results");
  }

  // =========================================================================
  // MISTAKES REVIEW DRAWER
  // =========================================================================
  function openMistakesDrawer() {
    const mistakeItems = store.getIncorrectExerciseIds();
    mistakesListContainer.innerHTML = "";

    if (mistakeItems.length === 0) {
      mistakesListContainer.innerHTML = `<p class="modal-desc">No mistakes recorded! All attempted exercises are currently marked correct.</p>`;
      modalMistakes.classList.remove("hidden");
      return;
    }

    mistakeItems.forEach(item => {
      const ex = adaptive.getExerciseById(item.exerciseId);
      if (!ex) return;

      const div = document.createElement("div");
      div.className = "mistake-item";
      div.innerHTML = `
        <div class="mistake-info">
          <span class="mistake-title">${ex.title}</span>
          <span class="mistake-meta">${TOPIC_METADATA[item.topic]?.name || item.topic} • ${item.difficulty.toUpperCase()}</span>
        </div>
        <button class="btn-secondary btn-retry-mistake" data-id="${ex.id}">Retry</button>
      `;

      div.querySelector(".btn-retry-mistake").addEventListener("click", () => {
        modalMistakes.classList.add("hidden");
        state.currentTopic = item.topic;
        state.currentDifficulty = item.difficulty;
        state.isReviewMode = true;
        state.exerciseQueue = [ex];
        state.currentExerciseIndex = 0;
        loadExercise(0);
        switchView("exercise");
      });

      mistakesListContainer.appendChild(div);
    });

    modalMistakes.classList.remove("hidden");
  }

  // =========================================================================
  // AI GENERATOR INTEGRATION
  // =========================================================================
  async function generateAIVariant() {
    if (!state.currentExercise) return;

    btnAiGenerateSimilar.disabled = true;
    btnAiGenerateSimilar.textContent = "Generating...";

    try {
      const generated = await aiGen.generateExercise(
        state.currentTopic,
        state.currentDifficulty,
        bank,
        state.exerciseQueue
      );
      if (generated) {
        state.exerciseQueue.push(generated);
        const newIdx = state.exerciseQueue.length - 1;
        loadExercise(newIdx);
        router.navigate(router.buildUrl(state.currentTopic, state.currentDifficulty, newIdx));
        showToast(`Generated: "${generated.title}"`, "success");
      }
    } catch (err) {
      showToast(`AI generation failed: ${err.message}`, "error");
    } finally {
      btnAiGenerateSimilar.disabled = false;
      btnAiGenerateSimilar.textContent = "✨ Generate AI Variant";
    }
  }

  // =========================================================================
  // CODE EDITOR HELPERS (Line numbers & Tab indentation)
  // =========================================================================
  function updateEditorLineNumbers() {
    const lines = (codeEditor.value || "").split("\n").length;
    let gutterText = "";
    for (let i = 1; i <= lines; i++) {
      gutterText += `${i}\n`;
    }
    editorGutter.textContent = gutterText;
  }

  // Real-time Debounced Autosave to localStorage
  let autosaveTimer = null;
  function triggerAutosave() {
    if (!state.currentExercise) return;
    autosaveStatus.classList.add("saving");
    autosaveStatus.innerHTML = '<span class="autosave-dot"></span> Saving...';

    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => {
      if (state.currentExercise) {
        store.saveDraft(state.currentExercise.id, codeEditor.value);
        autosaveStatus.classList.remove("saving");
        autosaveStatus.innerHTML = '<span class="autosave-dot"></span> Saved';
      }
    }, 350);
  }

  codeEditor.addEventListener("input", () => {
    updateEditorLineNumbers();
    triggerAutosave();
  });
  codeEditor.addEventListener("scroll", () => {
    editorGutter.scrollTop = codeEditor.scrollTop;
  });

  // Initialize Code Suggestion / Autocomplete System
  const editorContainer = document.querySelector(".editor-container");
  const codeSuggest = new CodeSuggest(codeEditor, editorContainer);

  // Tab key, Ctrl+S save & Run shortcut
  codeEditor.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      if (state.currentExercise) {
        clearTimeout(autosaveTimer);
        store.saveDraft(state.currentExercise.id, codeEditor.value);
        autosaveStatus.classList.remove("saving");
        autosaveStatus.innerHTML = '<span class="autosave-dot"></span> Saved';
        showToast("Draft saved to browser storage.", "info");
      }
      return;
    }

    if (e.key === "Tab") {
      // If code suggestion widget is active, let CodeSuggest commit the item
      if (codeSuggest && codeSuggest.isOpen) {
        return;
      }
      e.preventDefault();
      const start = codeEditor.selectionStart;
      const end = codeEditor.selectionEnd;
      codeEditor.value = codeEditor.value.substring(0, start) + "  " + codeEditor.value.substring(end);
      codeEditor.selectionStart = codeEditor.selectionEnd = start + 2;
      updateEditorLineNumbers();
      triggerAutosave();
    } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      runTests();
    }
  });

  // =========================================================================
  // EVENT LISTENERS
  // =========================================================================
  navBrand.addEventListener("click", () => router.navigate("#/"));
  btnBackDashboard.addEventListener("click", () => router.navigate("#/"));

  btnPrevExercise.addEventListener("click", () => {
    if (state.currentExerciseIndex > 0) {
      router.navigate(router.buildUrl(state.currentTopic, state.currentDifficulty, state.currentExerciseIndex - 1));
    }
  });

  btnNextExercise.addEventListener("click", () => {
    if (state.currentExerciseIndex < state.exerciseQueue.length - 1) {
      router.navigate(router.buildUrl(state.currentTopic, state.currentDifficulty, state.currentExerciseIndex + 1));
    }
  });

  // Stepper Track Scroll Buttons
  if (stepperScrollLeft) {
    stepperScrollLeft.addEventListener("click", () => {
      exerciseStepper.scrollBy({ left: -140, behavior: "smooth" });
    });
  }
  if (stepperScrollRight) {
    stepperScrollRight.addEventListener("click", () => {
      exerciseStepper.scrollBy({ left: 140, behavior: "smooth" });
    });
  }

  btnResetCode.addEventListener("click", () => {
    if (state.currentExercise) {
      store.clearDraft(state.currentExercise.id);
      codeEditor.value = state.currentExercise.starterCode;
      updateEditorLineNumbers();
      autosaveStatus.classList.remove("saving");
      autosaveStatus.innerHTML = '<span class="autosave-dot"></span> Saved';
      showToast("Starter code restored.", "info");
    }
  });

  btnRunTests.addEventListener("click", runTests);
  btnAiGenerateSimilar.addEventListener("click", generateAIVariant);

  btnToggleHint.addEventListener("click", () => {
    hintContent.classList.toggle("hidden");
    btnToggleHint.classList.toggle("open");
  });

  // Quick Switchers & Direct Stepper
  navTopicSelect.addEventListener("change", (e) => {
    const selectedTopic = e.target.value;
    if (selectedTopic && selectedTopic !== state.currentTopic) {
      router.navigate(router.buildUrl(selectedTopic, state.currentDifficulty, 0));
    }
  });

  navDiffToggle.querySelectorAll(".segmented-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const diff = btn.getAttribute("data-diff");
      if (diff && diff !== state.currentDifficulty) {
        router.navigate(router.buildUrl(state.currentTopic, diff, 0));
      }
    });
  });

  btnQuickNext.addEventListener("click", () => {
    if (state.currentExerciseIndex < state.exerciseQueue.length - 1) {
      router.navigate(router.buildUrl(state.currentTopic, state.currentDifficulty, state.currentExerciseIndex + 1));
    }
  });

  // Results View Actions
  btnResultsReplay.addEventListener("click", () => {
    startPracticeSession(state.currentTopic, state.currentDifficulty, 0, true);
    router.navigate(router.buildUrl(state.currentTopic, state.currentDifficulty, 0));
  });
  btnResultsTopics.addEventListener("click", () => {
    router.navigate("#/");
  });

  // Mistakes Modal
  btnOpenMistakes.addEventListener("click", openMistakesDrawer);
  btnCloseMistakes.addEventListener("click", () => modalMistakes.classList.add("hidden"));
  modalMistakes.addEventListener("click", e => {
    if (e.target === modalMistakes) modalMistakes.classList.add("hidden");
  });

  // Settings Modal
  btnOpenSettings.addEventListener("click", () => {
    const config = aiGen.loadConfig();
    aiEndpointInput.value = config.endpoint || "";
    aiKeyInput.value = config.apiKey || "";
    modalSettings.classList.remove("hidden");
  });

  btnCloseSettings.addEventListener("click", () => modalSettings.classList.add("hidden"));
  modalSettings.addEventListener("click", e => {
    if (e.target === modalSettings) modalSettings.classList.add("hidden");
  });

  // Settings Tabs
  modalSettings.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      modalSettings.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      modalSettings.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      const target = document.getElementById(btn.getAttribute("data-tab"));
      if (target) target.classList.add("active");
    });
  });

  // Export JSON
  btnExportJson.addEventListener("click", () => {
    const jsonStr = store.exportProgressJSON();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `execjs-progress-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Progress exported successfully!", "success");
  });

  // Import JSON
  btnImportTrigger.addEventListener("click", () => importFileInput.click());
  importFileInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const outcome = store.importProgressJSON(ev.target.result);
      if (outcome.success) {
        importStatusMsg.textContent = "Progress imported successfully!";
        importStatusMsg.style.color = "var(--status-pass)";
        renderDashboard();
        showToast("Progress restored from file!", "success");
      } else {
        importStatusMsg.textContent = `Import failed: ${outcome.error}`;
        importStatusMsg.style.color = "var(--status-fail)";
      }
    };
    reader.readAsText(file);
  });

  // Reset All Data
  btnResetAllData.addEventListener("click", () => {
    const ok = confirm("Are you sure you want to reset all your progress, streaks, and mistake records? This cannot be undone.");
    if (ok) {
      store.resetProgress();
      renderDashboard();
      modalSettings.classList.add("hidden");
      showToast("All progress data has been cleared.", "info");
    }
  });

  // Save AI Config
  btnSaveAiConfig.addEventListener("click", () => {
    aiGen.saveConfig({
      endpoint: aiEndpointInput.value.trim(),
      apiKey: aiKeyInput.value.trim()
    });
    aiSaveFeedback.textContent = "Settings saved to localStorage!";
    setTimeout(() => { aiSaveFeedback.textContent = ""; }, 2500);
    showToast("AI configuration saved.", "success");
  });

  // Global Toast Notification Helper
  function showToast(msg, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    let icon = "ℹ️";
    if (type === "success") icon = "✅";
    if (type === "warning") icon = "⚠️";
    if (type === "error") icon = "❌";

    toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(msg)}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // HTML Escape helper
  function escapeHtml(str) {
    if (typeof str !== "string") str = String(str);
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Simple Markdown Formatter (Bold, Code, Lists, Paragraphs)
  function formatMarkdown(text) {
    if (!text) return "";
    let html = escapeHtml(text);

    // Code blocks `code`
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Bold **bold**
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

    // Bullet lines starting with "- "
    const lines = html.split("\n");
    let inList = false;
    let out = [];

    for (let line of lines) {
      if (line.trim().startsWith("- ")) {
        if (!inList) {
          out.push("<ul>");
          inList = true;
        }
        out.push(`<li>${line.trim().substring(2)}</li>`);
      } else {
        if (inList) {
          out.push("</ul>");
          inList = false;
        }
        if (line.trim().length > 0) {
          out.push(`<p>${line}</p>`);
        }
      }
    }
    if (inList) out.push("</ul>");

    return out.join("");
  }

  // Setup Router Subscription
  router.onRoute(route => {
    if (route.view === "home") {
      renderDashboard();
      switchView("dashboard");
    } else if (route.view === "topic") {
      renderDashboard(route.topic);
      switchView("dashboard");
    } else if (route.view === "exercise") {
      // Ensure exercises are loaded for this topic & difficulty
      if (
        state.currentTopic !== route.topic ||
        state.currentDifficulty !== route.difficulty ||
        state.exerciseQueue.length === 0 ||
        state.isReviewMode
      ) {
        state.currentTopic = route.topic;
        state.currentDifficulty = route.difficulty;
        state.isReviewMode = false;
        state.exerciseQueue = adaptive.getExercises(route.topic, route.difficulty);
      }

      if (state.exerciseQueue.length === 0) {
        showToast("No exercises found for this category.", "error");
        router.navigate("#/");
        return;
      }

      const targetIdx = Math.min(Math.max(0, route.exerciseIndex), state.exerciseQueue.length - 1);
      loadExercise(targetIdx);
      switchView("exercise");
    }
  });

  // Initialize Router and trigger initial view based on location.hash
  router.init();
});
