// js/autocomplete.js
// VS Code style intelligent autocomplete suggestion engine for the JavaScript code editor.

class CodeSuggest {
  constructor(textarea, container) {
    this.textarea = textarea;
    this.container = container || textarea.parentElement;
    this.widget = null;
    this.mirrorDiv = null;
    this.activeSuggestions = [];
    this.selectedIndex = 0;
    this.isOpen = false;
    this.currentWord = "";
    this.currentWordStart = 0;

    this.initDictionary();
    this.createWidget();
    this.createMirror();
    this.bindEvents();
  }

  initDictionary() {
    this.items = [
      // Common keywords
      { label: "console", type: "variable", detail: "Console API", snippet: "console" },
      { label: "const", type: "keyword", detail: "Declare constant", snippet: "const " },
      { label: "let", type: "keyword", detail: "Declare variable", snippet: "let " },
      { label: "function", type: "keyword", detail: "Function declaration", snippet: "function ${1:name}(${2:params}) {\n  ${0}\n}" },
      { label: "return", type: "keyword", detail: "Return statement", snippet: "return " },
      { label: "if", type: "keyword", detail: "If statement", snippet: "if (${1:condition}) {\n  ${0}\n}" },
      { label: "else", type: "keyword", detail: "Else statement", snippet: "else {\n  ${0}\n}" },
      { label: "for", type: "keyword", detail: "For loop", snippet: "for (let ${1:i} = 0; ${1:i} < ${2:array}.length; ${1:i}++) {\n  ${0}\n}" },
      { label: "forof", type: "snippet", detail: "For...of loop", snippet: "for (const ${1:item} of ${2:iterable}) {\n  ${0}\n}" },
      { label: "while", type: "keyword", detail: "While loop", snippet: "while (${1:condition}) {\n  ${0}\n}" },
      { label: "try", type: "keyword", detail: "Try/catch block", snippet: "try {\n  ${1}\n} catch (${2:err}) {\n  ${0}\n}" },
      { label: "finally", type: "keyword", detail: "Finally block", snippet: "finally {\n  ${0}\n}" },
      { label: "throw", type: "keyword", detail: "Throw error", snippet: "throw new Error(\"${1:message}\");" },
      { label: "typeof", type: "keyword", detail: "Typeof operator", snippet: "typeof " },
      { label: "instanceof", type: "keyword", detail: "Instanceof operator", snippet: "instanceof " },
      { label: "new", type: "keyword", detail: "New operator", snippet: "new " },
      { label: "switch", type: "keyword", detail: "Switch statement", snippet: "switch (${1:key}) {\n  case ${2:value}:\n    ${0}\n    break;\n  default:\n    break;\n}" },
      { label: "break", type: "keyword", detail: "Break statement", snippet: "break;" },
      { label: "continue", type: "keyword", detail: "Continue statement", snippet: "continue;" },

      // Globals & Objects
      { label: "Math", type: "variable", detail: "Math utilities", snippet: "Math" },
      { label: "Date", type: "class", detail: "Date constructor", snippet: "Date" },
      { label: "JSON", type: "variable", detail: "JSON utilities", snippet: "JSON" },
      { label: "Array", type: "class", detail: "Array constructor", snippet: "Array" },
      { label: "Object", type: "class", detail: "Object constructor", snippet: "Object" },
      { label: "String", type: "class", detail: "String constructor", snippet: "String" },
      { label: "Number", type: "class", detail: "Number constructor", snippet: "Number" },
      { label: "Boolean", type: "class", detail: "Boolean constructor", snippet: "Boolean" },
      { label: "Error", type: "class", detail: "Error constructor", snippet: "Error" },
      { label: "TypeError", type: "class", detail: "TypeError constructor", snippet: "TypeError" },
      { label: "RangeError", type: "class", detail: "RangeError constructor", snippet: "RangeError" },
      { label: "document", type: "variable", detail: "DOM Document", snippet: "document" },
      { label: "window", type: "variable", detail: "Window object", snippet: "window" },
      { label: "parseInt", type: "function", detail: "parseInt(string, radix)", snippet: "parseInt(${1:string}, 10)" },
      { label: "parseFloat", type: "function", detail: "parseFloat(string)", snippet: "parseFloat(${1:string})" },
      { label: "isNaN", type: "function", detail: "isNaN(number)", snippet: "isNaN(${1:value})" },
      { label: "isFinite", type: "function", detail: "isFinite(number)", snippet: "isFinite(${1:value})" },

      // Console methods
      { label: "log", type: "method", detail: "console.log(...data)", snippet: "log(${0})" },
      { label: "error", type: "method", detail: "console.error(...data)", snippet: "error(${0})" },
      { label: "warn", type: "method", detail: "console.warn(...data)", snippet: "warn(${0})" },
      { label: "table", type: "method", detail: "console.table(tabularData)", snippet: "table(${0})" },

      // Array methods & props
      { label: "length", type: "property", detail: "Collection length", snippet: "length" },
      { label: "map", type: "method", detail: "array.map(callback)", snippet: "map(${1:item} => ${0})" },
      { label: "filter", type: "method", detail: "array.filter(predicate)", snippet: "filter(${1:item} => ${0})" },
      { label: "reduce", type: "method", detail: "array.reduce(reducer, init)", snippet: "reduce((${1:acc}, ${2:curr}) => ${0}, ${3:initial})" },
      { label: "forEach", type: "method", detail: "array.forEach(callback)", snippet: "forEach(${1:item} => {\n  ${0}\n})" },
      { label: "find", type: "method", detail: "array.find(predicate)", snippet: "find(${1:item} => ${0})" },
      { label: "findIndex", type: "method", detail: "array.findIndex(predicate)", snippet: "findIndex(${1:item} => ${0})" },
      { label: "some", type: "method", detail: "array.some(predicate)", snippet: "some(${1:item} => ${0})" },
      { label: "every", type: "method", detail: "array.every(predicate)", snippet: "every(${1:item} => ${0})" },
      { label: "includes", type: "method", detail: "array.includes(element)", snippet: "includes(${0})" },
      { label: "indexOf", type: "method", detail: "array.indexOf(search)", snippet: "indexOf(${0})" },
      { label: "slice", type: "method", detail: "array.slice(start, end)", snippet: "slice(${1:start}, ${2:end})" },
      { label: "splice", type: "method", detail: "array.splice(start, count)", snippet: "splice(${1:start}, ${2:count})" },
      { label: "push", type: "method", detail: "array.push(...items)", snippet: "push(${0})" },
      { label: "pop", type: "method", detail: "array.pop()", snippet: "pop()" },
      { label: "shift", type: "method", detail: "array.shift()", snippet: "shift()" },
      { label: "unshift", type: "method", detail: "array.unshift(...items)", snippet: "unshift(${0})" },
      { label: "concat", type: "method", detail: "array.concat(...arrays)", snippet: "concat(${0})" },
      { label: "join", type: "method", detail: "array.join(separator)", snippet: "join(\"${1:,}\")" },
      { label: "reverse", type: "method", detail: "array.reverse()", snippet: "reverse()" },
      { label: "sort", type: "method", detail: "array.sort(comparator)", snippet: "sort((${1:a}, ${2:b}) => ${0})" },

      // Object methods
      { label: "keys", type: "method", detail: "Object.keys(obj)", snippet: "keys(${0})" },
      { label: "values", type: "method", detail: "Object.values(obj)", snippet: "values(${0})" },
      { label: "entries", type: "method", detail: "Object.entries(obj)", snippet: "entries(${0})" },
      { label: "assign", type: "method", detail: "Object.assign(target, ...sources)", snippet: "assign(${0})" },
      { label: "hasOwnProperty", type: "method", detail: "obj.hasOwnProperty(prop)", snippet: "hasOwnProperty(${0})" },

      // String methods
      { label: "split", type: "method", detail: "string.split(separator)", snippet: "split(\"${1:}\")" },
      { label: "trim", type: "method", detail: "string.trim()", snippet: "trim()" },
      { label: "toLowerCase", type: "method", detail: "string.toLowerCase()", snippet: "toLowerCase()" },
      { label: "toUpperCase", type: "method", detail: "string.toUpperCase()", snippet: "toUpperCase()" },
      { label: "replace", type: "method", detail: "string.replace(pattern, replacement)", snippet: "replace(${1:pattern}, ${2:replacement})" },
      { label: "replaceAll", type: "method", detail: "string.replaceAll(pattern, replacement)", snippet: "replaceAll(${1:pattern}, ${2:replacement})" },
      { label: "startsWith", type: "method", detail: "string.startsWith(prefix)", snippet: "startsWith(\"${0}\")" },
      { label: "endsWith", type: "method", detail: "string.endsWith(suffix)", snippet: "endsWith(\"${0}\")" },
      { label: "padStart", type: "method", detail: "string.padStart(targetLength, padString)", snippet: "padStart(${1:2}, \"${2:0}\")" },
      { label: "padEnd", type: "method", detail: "string.padEnd(targetLength, padString)", snippet: "padEnd(${1:2}, \"${2: }\")" },

      // Math methods
      { label: "floor", type: "method", detail: "Math.floor(x)", snippet: "floor(${0})" },
      { label: "ceil", type: "method", detail: "Math.ceil(x)", snippet: "ceil(${0})" },
      { label: "round", type: "method", detail: "Math.round(x)", snippet: "round(${0})" },
      { label: "abs", type: "method", detail: "Math.abs(x)", snippet: "abs(${0})" },
      { label: "min", type: "method", detail: "Math.min(...values)", snippet: "min(${0})" },
      { label: "max", type: "method", detail: "Math.max(...values)", snippet: "max(${0})" },
      { label: "random", type: "method", detail: "Math.random()", snippet: "random()" },

      // Date methods
      { label: "getFullYear", type: "method", detail: "date.getFullYear()", snippet: "getFullYear()" },
      { label: "getMonth", type: "method", detail: "date.getMonth()", snippet: "getMonth()" },
      { label: "getDate", type: "method", detail: "date.getDate()", snippet: "getDate()" },
      { label: "getDay", type: "method", detail: "date.getDay()", snippet: "getDay()" },
      { label: "getTime", type: "method", detail: "date.getTime()", snippet: "getTime()" },
      { label: "toISOString", type: "method", detail: "date.toISOString()", snippet: "toISOString()" },
      { label: "getUTCFullYear", type: "method", detail: "date.getUTCFullYear()", snippet: "getUTCFullYear()" },
      { label: "getUTCMonth", type: "method", detail: "date.getUTCMonth()", snippet: "getUTCMonth()" },
      { label: "getUTCDate", type: "method", detail: "date.getUTCDate()", snippet: "getUTCDate()" },
      { label: "getUTCDay", type: "method", detail: "date.getUTCDay()", snippet: "getUTCDay()" },

      // DOM methods & properties
      { label: "getElementById", type: "method", detail: "document.getElementById(id)", snippet: "getElementById(\"${1:id}\")" },
      { label: "querySelector", type: "method", detail: "document.querySelector(selector)", snippet: "querySelector(\"${1:selector}\")" },
      { label: "querySelectorAll", type: "method", detail: "document.querySelectorAll(selector)", snippet: "querySelectorAll(\"${1:selector}\")" },
      { label: "createElement", type: "method", detail: "document.createElement(tagName)", snippet: "createElement(\"${1:div}\")" },
      { label: "appendChild", type: "method", detail: "node.appendChild(child)", snippet: "appendChild(${1:child})" },
      { label: "classList", type: "property", detail: "element.classList", snippet: "classList" },
      { label: "setAttribute", type: "method", detail: "element.setAttribute(name, value)", snippet: "setAttribute(\"${1:attr}\", \"${2:val}\")" },
      { label: "getAttribute", type: "method", detail: "element.getAttribute(name)", snippet: "getAttribute(\"${1:attr}\")" },
      { label: "textContent", type: "property", detail: "element.textContent", snippet: "textContent" },
      { label: "innerHTML", type: "property", detail: "element.innerHTML", snippet: "innerHTML" },
      { label: "value", type: "property", detail: "input.value", snippet: "value" },
      { label: "disabled", type: "property", detail: "element.disabled", snippet: "disabled" },
      { label: "contains", type: "method", detail: "classList.contains(token)", snippet: "contains(\"${1:class}\")" },
      { label: "toggle", type: "method", detail: "classList.toggle(token)", snippet: "toggle(\"${1:class}\")" },
      { label: "add", type: "method", detail: "classList.add(token)", snippet: "add(\"${1:class}\")" },
      { label: "remove", type: "method", detail: "classList.remove(token)", snippet: "remove(\"${1:class}\")" },

      // Popular snippets
      { label: "clg", type: "snippet", detail: "console.log() snippet", snippet: "console.log(${0});" },
      { label: "fn", type: "snippet", detail: "function declaration snippet", snippet: "function ${1:name}(${2:params}) {\n  ${0}\n}" }
    ];
  }

  createWidget() {
    this.widget = document.createElement("div");
    this.widget.className = "suggest-widget hidden";
    this.container.appendChild(this.widget);
  }

  createMirror() {
    this.mirrorDiv = document.createElement("div");
    this.mirrorDiv.className = "textarea-mirror";
    document.body.appendChild(this.mirrorDiv);
  }

  bindEvents() {
    // Input event to show suggestions
    this.textarea.addEventListener("input", () => this.handleInput());

    // Navigation and commit keys
    this.textarea.addEventListener("keydown", (e) => this.handleKeyDown(e));

    // Blur / click out to close
    this.textarea.addEventListener("blur", () => {
      // Delay so clicks on suggestion list register
      setTimeout(() => this.close(), 150);
    });

    this.textarea.addEventListener("click", () => this.handleInput());
  }

  handleInput() {
    const cursorPos = this.textarea.selectionStart;
    const text = this.textarea.value;

    // Scan backward to find current identifier/word
    let start = cursorPos;
    while (start > 0 && /[a-zA-Z0-9_$]/.test(text[start - 1])) {
      start--;
    }

    const word = text.slice(start, cursorPos);
    this.currentWord = word;
    this.currentWordStart = start;

    if (word.length === 0) {
      // Check if previous char is '.'
      if (cursorPos > 0 && text[cursorPos - 1] === ".") {
        this.filterAndShow("");
      } else {
        this.close();
      }
      return;
    }

    this.filterAndShow(word);
  }

  filterAndShow(query) {
    const q = query.toLowerCase();

    // Prioritize exact prefix match, then fuzzy substring match
    const prefixMatches = [];
    const substringMatches = [];

    for (const item of this.items) {
      const labelLower = item.label.toLowerCase();
      if (labelLower.startsWith(q)) {
        prefixMatches.push(item);
      } else if (q.length > 1 && labelLower.includes(q)) {
        substringMatches.push(item);
      }
    }

    this.activeSuggestions = [...prefixMatches, ...substringMatches].slice(0, 10);

    if (this.activeSuggestions.length === 0) {
      this.close();
      return;
    }

    this.selectedIndex = 0;
    this.renderSuggestions(query);
    this.positionWidget();
    this.open();
  }

  renderSuggestions(query) {
    this.widget.innerHTML = "";

    this.activeSuggestions.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = `suggest-item ${index === this.selectedIndex ? "selected" : ""}`;

      // Type icon indicator
      const icon = document.createElement("span");
      icon.className = `suggest-icon type-${item.type}`;
      icon.textContent = this.getTypeBadge(item.type);

      // Label with highlighted match
      const label = document.createElement("span");
      label.className = "suggest-label";
      label.innerHTML = this.highlightMatch(item.label, query);

      // Detail text
      const detail = document.createElement("span");
      detail.className = "suggest-detail";
      detail.textContent = item.detail;

      row.appendChild(icon);
      row.appendChild(label);
      row.appendChild(detail);

      // Click to insert
      row.addEventListener("mousedown", (e) => {
        e.preventDefault();
        this.insertSuggestion(item);
      });

      this.widget.appendChild(row);
    });
  }

  getTypeBadge(type) {
    switch (type) {
      case "keyword": return "k";
      case "method": return "m";
      case "property": return "p";
      case "variable": return "v";
      case "class": return "c";
      case "snippet": return "s";
      default: return "•";
    }
  }

  highlightMatch(label, query) {
    if (!query) return label;
    const idx = label.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return label;
    const match = label.substring(idx, idx + query.length);
    return `${label.substring(0, idx)}<strong>${match}</strong>${label.substring(idx + query.length)}`;
  }

  positionWidget() {
    const coords = this.getCaretCoordinates();
    const containerRect = this.container.getBoundingClientRect();
    const gutterWidth = 44; // editor gutter width

    // Relative to container
    let top = coords.top - containerRect.top + 22;
    let left = coords.left - containerRect.left;

    // Constrain within container bounds
    if (left < gutterWidth + 8) left = gutterWidth + 8;
    if (left + 300 > containerRect.width) {
      left = Math.max(gutterWidth, containerRect.width - 320);
    }

    // If bottom exceeds container, flip upward
    if (top + 180 > containerRect.height) {
      top = Math.max(10, top - 200);
    }

    this.widget.style.top = `${top}px`;
    this.widget.style.left = `${left}px`;
  }

  getCaretCoordinates() {
    // Copy computed styles from textarea to mirrorDiv
    const style = window.getComputedStyle(this.textarea);
    const properties = [
      "boxSizing", "width", "height", "overflowX", "overflowY",
      "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth",
      "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
      "fontStyle", "fontVariant", "fontWeight", "fontStretch", "fontSize",
      "fontSizeAdjust", "lineHeight", "fontFamily", "textAlign", "textTransform",
      "textIndent", "textDecoration", "letterSpacing", "wordSpacing", "tabSize"
    ];

    properties.forEach(prop => {
      this.mirrorDiv.style[prop] = style[prop];
    });

    const textareaRect = this.textarea.getBoundingClientRect();
    this.mirrorDiv.style.position = "absolute";
    this.mirrorDiv.style.top = `${textareaRect.top + window.scrollY}px`;
    this.mirrorDiv.style.left = `${textareaRect.left + window.scrollX}px`;
    this.mirrorDiv.style.visibility = "hidden";
    this.mirrorDiv.style.whiteSpace = "pre-wrap";
    this.mirrorDiv.style.wordWrap = "break-word";

    // Text before caret
    const textBefore = this.textarea.value.substring(0, this.textarea.selectionStart);
    this.mirrorDiv.textContent = textBefore;

    // Marker span
    const span = document.createElement("span");
    span.textContent = "|";
    this.mirrorDiv.appendChild(span);

    const spanRect = span.getBoundingClientRect();
    return {
      top: spanRect.top - this.textarea.scrollTop,
      left: spanRect.left - this.textarea.scrollLeft
    };
  }

  handleKeyDown(e) {
    if (!this.isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      this.selectedIndex = (this.selectedIndex + 1) % this.activeSuggestions.length;
      this.updateSelectionUI();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      this.selectedIndex = (this.selectedIndex - 1 + this.activeSuggestions.length) % this.activeSuggestions.length;
      this.updateSelectionUI();
    } else if (e.key === "Enter" || e.key === "Tab") {
      // Don't intercept if Ctrl/Cmd is held (which is Run Tests)
      if (e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      const chosen = this.activeSuggestions[this.selectedIndex];
      if (chosen) {
        this.insertSuggestion(chosen);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      this.close();
    }
  }

  updateSelectionUI() {
    const rows = this.widget.querySelectorAll(".suggest-item");
    rows.forEach((row, i) => {
      row.classList.toggle("selected", i === this.selectedIndex);
      if (i === this.selectedIndex) {
        row.scrollIntoView({ block: "nearest" });
      }
    });
  }

  insertSuggestion(item) {
    const text = this.textarea.value;
    const start = this.currentWordStart;
    const end = this.textarea.selectionStart;

    // Clean snippet placeholders if present (e.g. ${1:name} -> name)
    let snippet = item.snippet || item.label;
    let finalCursorOffset = -1;

    // Find first tabstop ${1:...} or ${0}
    const match0 = snippet.match(/\$\{0\}/);
    const match1 = snippet.match(/\$\{\d+:([^}]+)\}/);

    let cleanSnippet = snippet
      .replace(/\$\{\d+:([^}]+)\}/g, "$1")
      .replace(/\$\{0\}/g, "");

    const before = text.substring(0, start);
    const after = text.substring(end);

    this.textarea.value = before + cleanSnippet + after;

    // Position cursor
    const newCursor = start + cleanSnippet.length;
    this.textarea.selectionStart = this.textarea.selectionEnd = newCursor;
    this.textarea.focus();

    // Trigger input event to update line numbers
    this.textarea.dispatchEvent(new Event("input"));

    this.close();
  }

  open() {
    this.isOpen = true;
    this.widget.classList.remove("hidden");
  }

  close() {
    this.isOpen = false;
    if (this.widget) {
      this.widget.classList.add("hidden");
    }
  }
}

// Global attachment
if (typeof window !== "undefined") {
  window.CodeSuggest = CodeSuggest;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = CodeSuggest;
}
