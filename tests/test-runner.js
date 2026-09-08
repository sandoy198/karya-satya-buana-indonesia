const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

class ClassList {
  constructor(element) {
    this.element = element;
    this.classes = new Set();
    const existing = element.getAttribute('class');
    if (existing) {
      existing.trim().split(/\s+/).forEach((cls) => {
        if (cls) this.classes.add(cls);
      });
    }
  }

  add(...classNames) {
    classNames.forEach((cls) => {
      if (cls) this.classes.add(cls);
    });
    this.sync();
  }

  remove(...classNames) {
    classNames.forEach((cls) => {
      this.classes.delete(cls);
    });
    this.sync();
  }

  toggle(className, force) {
    if (force !== undefined) {
      if (force) {
        this.classes.add(className);
      } else {
        this.classes.delete(className);
      }
    } else {
      if (this.classes.has(className)) {
        this.classes.delete(className);
      } else {
        this.classes.add(className);
      }
    }
    this.sync();
    return this.classes.has(className);
  }

  contains(className) {
    return this.classes.has(className);
  }

  sync() {
    const classString = Array.from(this.classes).join(' ');
    if (classString) {
      this.element.setAttribute('class', classString);
    } else {
      this.element.removeAttribute('class');
    }
  }
}

class DOMElement {
  constructor(tagName, attributes = {}) {
    this.tagName = tagName.toUpperCase();
    this.attributes = { ...attributes };
    this.children = [];
    this.parentNode = null;
    this.listeners = new Map();
    this.classList = new ClassList(this);
    this.style = {};
  }

  get id() {
    return this.getAttribute('id') || '';
  }

  set id(value) {
    this.setAttribute('id', value);
  }

  get className() {
    return this.getAttribute('class') || '';
  }

  set className(value) {
    this.setAttribute('class', value);
    this.classList = new ClassList(this);
  }

  get name() {
    return this.getAttribute('name') || '';
  }

  set name(value) {
    this.setAttribute('name', value);
  }

  get type() {
    return this.getAttribute('type') || '';
  }

  set type(value) {
    this.setAttribute('type', value);
  }

  get value() {
    if (this.tagName === 'SELECT') {
      if (this._value !== undefined) return this._value;
      const selectedOption = this.children.find((child) => child.tagName === 'OPTION' && child.hasAttribute('selected'));
      if (selectedOption) return selectedOption.value;
      const firstOption = this.children.find((child) => child.tagName === 'OPTION');
      return firstOption ? firstOption.value : '';
    }
    if (this._value !== undefined) return this._value;
    return this.getAttribute('value') || '';
  }

  set value(val) {
    this._value = String(val);
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(val) {
    if (val) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  get checked() {
    return this.hasAttribute('checked');
  }

  set checked(val) {
    if (val) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }
  }

  get textContent() {
    let text = '';
    for (const child of this.children) {
      if (typeof child === 'string') {
        text += child;
      } else if (child instanceof DOMElement) {
        text += child.textContent;
      }
    }
    return text;
  }

  set textContent(text) {
    this.children = [String(text)];
  }

  get innerHTML() {
    return this.children
      .map((child) => {
        if (typeof child === 'string') return child;
        return child.outerHTML;
      })
      .join('');
  }

  set innerHTML(html) {
    const parsed = parseHtmlFragment(html);
    this.children = parsed;
    parsed.forEach((node) => {
      if (node instanceof DOMElement) {
        node.parentNode = this;
      }
    });
  }

  get outerHTML() {
    const tag = this.tagName.toLowerCase();
    const attrs = Object.entries(this.attributes)
      .map(([k, v]) => (v === '' ? k : `${k}="${escapeAttr(v)}"`))
      .join(' ');
    const attrStr = attrs ? ` ${attrs}` : '';
    const voidTags = new Set(['img', 'input', 'meta', 'link', 'br', 'hr']);
    if (voidTags.has(tag)) {
      return `<${tag}${attrStr}>`;
    }
    return `<${tag}${attrStr}>${this.innerHTML}</${tag}>`;
  }

  getAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attributes, name.toLowerCase())
      ? this.attributes[name.toLowerCase()]
      : null;
  }

  setAttribute(name, value) {
    const key = name.toLowerCase();
    this.attributes[key] = String(value);
    if (key === 'class') {
      this.classList = new ClassList(this);
    }
  }

  removeAttribute(name) {
    const key = name.toLowerCase();
    delete this.attributes[key];
    if (key === 'class') {
      this.classList = new ClassList(this);
    }
  }

  hasAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attributes, name.toLowerCase());
  }

  appendChild(child) {
    if (child instanceof DOMElement) {
      child.parentNode = this;
    }
    this.children.push(child);
  }

  addEventListener(type, listener, options) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type).push({ listener, options });
  }

  removeEventListener(type, listener) {
    if (!this.listeners.has(type)) return;
    const filtered = this.listeners.get(type).filter((item) => item.listener !== listener);
    this.listeners.set(type, filtered);
  }

  dispatchEvent(event) {
    event.target = this;
    event.currentTarget = this;
    const list = this.listeners.get(event.type) || [];
    for (const item of list) {
      item.listener.call(this, event);
    }
    if (!event.propagationStopped && this.parentNode) {
      this.parentNode.dispatchEvent(event);
    }
    return !event.defaultPrevented;
  }

  click() {
    const event = {
      type: 'click',
      target: this,
      currentTarget: this,
      defaultPrevented: false,
      propagationStopped: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
      stopPropagation() {
        this.propagationStopped = true;
      },
    };
    this.dispatchEvent(event);
  }

  focus(options) {
    if (this.ownerDocument) {
      this.ownerDocument.activeElement = this;
    }
    const event = {
      type: 'focus',
      target: this,
      currentTarget: this,
      options,
      defaultPrevented: false,
      propagationStopped: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
      stopPropagation() {
        this.propagationStopped = true;
      },
    };
    this.dispatchEvent(event);
  }

  blur() {
    if (this.ownerDocument && this.ownerDocument.activeElement === this) {
      this.ownerDocument.activeElement = this.ownerDocument.body;
    }
    const event = {
      type: 'blur',
      target: this,
      currentTarget: this,
      defaultPrevented: false,
      propagationStopped: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
      stopPropagation() {
        this.propagationStopped = true;
      },
    };
    this.dispatchEvent(event);
  }

  closest(selector) {
    let current = this;
    while (current && current instanceof DOMElement) {
      if (matchesSimpleSelector(current, selector)) {
        return current;
      }
      current = current.parentNode;
    }
    return null;
  }

  contains(other) {
    if (!other) return false;
    if (this === other) return true;
    for (const child of this.children) {
      if (child instanceof DOMElement) {
        if (child.contains(other)) return true;
      }
    }
    return false;
  }

  getElementById(id) {
    for (const child of this.children) {
      if (child instanceof DOMElement) {
        if (child.getAttribute('id') === id) return child;
        const found = child.getElementById(id);
        if (found) return found;
      }
    }
    return null;
  }

  getElementsByTagName(tagName) {
    const results = [];
    const target = tagName.toUpperCase();
    for (const child of this.children) {
      if (child instanceof DOMElement) {
        if (target === '*' || child.tagName === target) {
          results.push(child);
        }
        results.push(...child.getElementsByTagName(target));
      }
    }
    return results;
  }

  getElementsByClassName(className) {
    const results = [];
    for (const child of this.children) {
      if (child instanceof DOMElement) {
        if (child.classList.contains(className)) {
          results.push(child);
        }
        results.push(...child.getElementsByClassName(className));
      }
    }
    return results;
  }

  querySelector(selector) {
    const list = this.querySelectorAll(selector);
    return list.length > 0 ? list[0] : null;
  }

  querySelectorAll(selector) {
    return querySelectorAllElement(this, selector);
  }

  reset() {
    if (this.tagName !== 'FORM') return;
    const inputs = this.querySelectorAll('input, select, textarea');
    inputs.forEach((input) => {
      if (input.tagName === 'SELECT') {
        input._value = '';
      } else if (input.getAttribute('type') === 'checkbox' || input.getAttribute('type') === 'radio') {
        input.checked = false;
      } else {
        input.value = '';
      }
    });
  }
}

function escapeAttr(val) {
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function parseAttributes(attrString) {
  const attrs = {};
  const regex = /([a-zA-Z0-9_\-:@.]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let match;
  while ((match = regex.exec(attrString)) !== null) {
    const name = match[1].toLowerCase();
    const value = match[2] !== undefined ? match[2] : match[3] !== undefined ? match[3] : match[4] !== undefined ? match[4] : '';
    attrs[name] = value;
  }
  return attrs;
}

function parseHtmlFragment(html) {
  const root = new DOMElement('fragment');
  const stack = [root];
  const tagRegex = /<!--[\s\S]*?-->|<(\/)?([a-zA-Z0-9\-]+)([^>]*)>|([^<]+)/g;
  const voidElements = new Set(['img', 'input', 'meta', 'link', 'br', 'hr', 'source', 'area', 'base', 'col', 'embed', 'param', 'track', 'wbr']);
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    const [raw, isClosing, tagName, attrString, textContent] = match;

    if (raw.startsWith('<!--')) {
      continue;
    }

    if (textContent !== undefined) {
      if (stack.length > 0) {
        stack[stack.length - 1].children.push(textContent);
      }
      continue;
    }

    if (isClosing) {
      const upper = tagName.toUpperCase();
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tagName === upper) {
          stack.splice(i);
          break;
        }
      }
      continue;
    }

    const attrs = parseAttributes(attrString || '');
    const element = new DOMElement(tagName, attrs);
    if (stack.length > 0) {
      element.parentNode = stack[stack.length - 1];
      stack[stack.length - 1].children.push(element);
    }

    const lowerTag = tagName.toLowerCase();
    if (!voidElements.has(lowerTag) && !attrString.endsWith('/')) {
      if (lowerTag === 'script' || lowerTag === 'style') {
        const closeTag = `</${lowerTag}>`;
        const startPos = tagRegex.lastIndex;
        const endPos = html.toLowerCase().indexOf(closeTag, startPos);
        if (endPos !== -1) {
          const bodyText = html.substring(startPos, endPos);
          element.children.push(bodyText);
          tagRegex.lastIndex = endPos + closeTag.length;
        }
      } else {
        stack.push(element);
      }
    }
  }

  return root.children;
}

function matchesSimpleSelector(element, selector) {
  const trimmed = selector.trim();
  if (trimmed === '*' || trimmed === '') return true;

  let remaining = trimmed;

  const tagMatch = remaining.match(/^([a-zA-Z0-9\-]+)/);
  if (tagMatch) {
    if (element.tagName !== tagMatch[1].toUpperCase()) return false;
    remaining = remaining.substring(tagMatch[0].length);
  }

  while (remaining.length > 0) {
    if (remaining.startsWith('#')) {
      const idMatch = remaining.match(/^#([a-zA-Z0-9_\-]+)/);
      if (!idMatch) return false;
      if (element.id !== idMatch[1]) return false;
      remaining = remaining.substring(idMatch[0].length);
    } else if (remaining.startsWith('.')) {
      const classMatch = remaining.match(/^\.([a-zA-Z0-9_\-]+)/);
      if (!classMatch) return false;
      if (!element.classList.contains(classMatch[1])) return false;
      remaining = remaining.substring(classMatch[0].length);
    } else if (remaining.startsWith('[')) {
      const attrMatch = remaining.match(/^\[([a-zA-Z0-9_\-]+)(?:([*^$]?=)(?:"([^"]*)"|'([^']*)'|([^\]]+)))?\]/);
      if (!attrMatch) return false;
      const [, attrName, operator, v1, v2, v3] = attrMatch;
      const val = v1 !== undefined ? v1 : v2 !== undefined ? v2 : v3 !== undefined ? v3 : undefined;
      if (!element.hasAttribute(attrName)) return false;
      if (operator !== undefined) {
        const attrVal = element.getAttribute(attrName);
        if (operator === '=' && attrVal !== val) return false;
        if (operator === '*=' && !attrVal.includes(val)) return false;
        if (operator === '^=' && !attrVal.startsWith(val)) return false;
        if (operator === '$=' && !attrVal.endsWith(val)) return false;
      }
      remaining = remaining.substring(attrMatch[0].length);
    } else if (remaining.startsWith(':')) {
      const pseudoMatch = remaining.match(/^:([a-zA-Z0-9_\-]+)/);
      if (!pseudoMatch) return false;
      const pseudo = pseudoMatch[1];
      if (pseudo === 'disabled' && !element.disabled) return false;
      if (pseudo === 'checked' && !element.checked) return false;
      remaining = remaining.substring(pseudoMatch[0].length);
    } else {
      return false;
    }
  }

  return true;
}

function querySelectorAllElement(root, selector) {
  const commaParts = selector.split(',').map((s) => s.trim());
  if (commaParts.length > 1) {
    const resultSet = new Set();
    commaParts.forEach((part) => {
      querySelectorAllElement(root, part).forEach((el) => resultSet.add(el));
    });
    return Array.from(resultSet);
  }

  const tokens = selector.trim().split(/\s+/);
  let candidates = getAllDescendantElements(root);

  let currentPool = candidates;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === '>') {
      const nextToken = tokens[++i];
      currentPool = currentPool.flatMap((parent) =>
        parent.children.filter((ch) => ch instanceof DOMElement && matchesSimpleSelector(ch, nextToken))
      );
    } else {
      if (i === 0) {
        currentPool = currentPool.filter((el) => matchesSimpleSelector(el, token));
      } else {
        const nextPool = [];
        for (const ancestor of currentPool) {
          const descendants = getAllDescendantElements(ancestor);
          descendants.forEach((desc) => {
            if (matchesSimpleSelector(desc, token) && !nextPool.includes(desc)) {
              nextPool.push(desc);
            }
          });
        }
        currentPool = nextPool;
      }
    }
  }

  return currentPool;
}

function getAllDescendantElements(node) {
  const result = [];
  if (!node.children) return result;
  for (const child of node.children) {
    if (child instanceof DOMElement) {
      result.push(child);
      result.push(...getAllDescendantElements(child));
    }
  }
  return result;
}

class DOMDocument {
  constructor(htmlContent) {
    this.htmlContent = htmlContent;
    this.nodes = parseHtmlFragment(htmlContent);
    this.activeElement = null;

    const allElements = [];
    const traverse = (node) => {
      if (node instanceof DOMElement) {
        node.ownerDocument = this;
        allElements.push(node);
        node.children.forEach(traverse);
      }
    };
    this.nodes.forEach(traverse);

    this.documentElement = allElements.find((el) => el.tagName === 'HTML') || null;
    this.head = allElements.find((el) => el.tagName === 'HEAD') || null;
    this.body = allElements.find((el) => el.tagName === 'BODY') || null;
    this.activeElement = this.body;
  }

  get title() {
    const titleEl = this.querySelector('title');
    return titleEl ? titleEl.textContent : '';
  }

  getElementById(id) {
    const all = getAllDescendantElements({ children: this.nodes });
    return all.find((el) => el.getAttribute('id') === id) || null;
  }

  querySelector(selector) {
    const all = this.querySelectorAll(selector);
    return all.length > 0 ? all[0] : null;
  }

  querySelectorAll(selector) {
    return querySelectorAllElement({ children: this.nodes }, selector);
  }

  getElementsByTagName(tagName) {
    const target = tagName.toUpperCase();
    const all = getAllDescendantElements({ children: this.nodes });
    return target === '*' ? all : all.filter((el) => el.tagName === target);
  }

  addEventListener(type, listener) {
    if (!this._listeners) this._listeners = new Map();
    if (!this._listeners.has(type)) this._listeners.set(type, []);
    this._listeners.get(type).push(listener);
  }

  removeEventListener(type, listener) {
    if (!this._listeners || !this._listeners.has(type)) return;
    this._listeners.set(
      type,
      this._listeners.get(type).filter((l) => l !== listener)
    );
  }

  dispatchEvent(event) {
    if (!this._listeners || !this._listeners.has(event.type)) return true;
    for (const listener of this._listeners.get(event.type)) {
      listener.call(this, event);
    }
    return !event.defaultPrevented;
  }
}

class DOMWindow {
  constructor(document) {
    this.document = document;
    this.innerWidth = 1280;
    this.innerHeight = 800;
    this.scrollY = 0;
    this.listeners = new Map();
    this.setTimeout = setTimeout;
    this.clearTimeout = clearTimeout;
    this.requestAnimationFrame = (fn) => setTimeout(fn, 0);
  }

  scrollTo(x, y) {
    this.scrollY = typeof x === 'object' ? x.top || 0 : y || 0;
    this.dispatchEvent({ type: 'scroll' });
  }

  setViewport(width, height) {
    this.innerWidth = width;
    this.innerHeight = height;
    this.dispatchEvent({ type: 'resize' });
  }

  addEventListener(type, listener, options) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type).push({ listener, options });
  }

  removeEventListener(type, listener) {
    if (!this.listeners.has(type)) return;
    this.listeners.set(
      type,
      this.listeners.get(type).filter((item) => item.listener !== listener)
    );
  }

  dispatchEvent(event) {
    const list = this.listeners.get(event.type) || [];
    for (const item of list) {
      item.listener.call(this, event);
    }
  }
}

class FormDataMock {
  constructor(formElement) {
    this.data = new Map();
    if (formElement) {
      const inputs = formElement.querySelectorAll('input, select, textarea');
      inputs.forEach((input) => {
        const name = input.name || input.getAttribute('name');
        if (!name) return;
        if (input.type === 'checkbox' || input.type === 'radio') {
          if (input.checked) this.data.set(name, input.value || 'on');
        } else {
          this.data.set(name, input.value || '');
        }
      });
    }
  }

  get(name) {
    return this.data.has(name) ? this.data.get(name) : null;
  }

  set(name, value) {
    this.data.set(name, String(value));
  }
}

class CSSRuleBook {
  constructor(cssContent) {
    this.rawContent = cssContent;
    this.variables = {};
    this.rules = [];
    this.mediaQueries = [];
    this.parseCSS(cssContent);
  }

  parseCSS(css) {
    const cleaned = css.replace(/\/\*[\s\S]*?\*\//g, '');
    const mediaRegex = /@media\s*([^{]+)\{([\s\S]*?\}\s*)\}/g;
    let match;
    let remaining = cleaned;

    while ((match = mediaRegex.exec(cleaned)) !== null) {
      const mediaQuery = match[1].trim();
      const mediaBlock = match[2].trim();
      this.mediaQueries.push({
        query: mediaQuery,
        rules: this.extractRules(mediaBlock),
      });
    }

    remaining = cleaned.replace(/@media\s*[^{]+\{[\s\S]*?\}\s*\}/g, '');
    this.rules = this.extractRules(remaining);

    const rootRule = this.rules.find((r) => r.selector === ':root');
    if (rootRule) {
      Object.entries(rootRule.declarations).forEach(([prop, val]) => {
        if (prop.startsWith('--')) {
          this.variables[prop] = val;
        }
      });
    }
  }

  extractRules(block) {
    const ruleRegex = /([^{]+)\{([^}]+)\}/g;
    const rules = [];
    let match;
    while ((match = ruleRegex.exec(block)) !== null) {
      const selector = match[1].trim();
      const declBlock = match[2].trim();
      const declarations = {};
      declBlock.split(';').forEach((decl) => {
        const colon = decl.indexOf(':');
        if (colon !== -1) {
          const prop = decl.substring(0, colon).trim().toLowerCase();
          const val = decl.substring(colon + 1).trim();
          declarations[prop] = val;
        }
      });
      rules.push({ selector, declarations });
    }
    return rules;
  }

  getRule(selector) {
    return this.rules.find((r) => r.selector.split(',').map((s) => s.trim()).includes(selector)) || null;
  }

  getDeclarations(selector) {
    const matching = this.rules.filter((r) =>
      r.selector.split(',').map((s) => s.trim()).includes(selector)
    );
    const combined = {};
    matching.forEach((r) => Object.assign(combined, r.declarations));
    return combined;
  }

  getMediaDeclarations(minWidth, selector) {
    const queries = this.mediaQueries.filter((mq) => mq.query.includes(`${minWidth}px`));
    if (queries.length === 0) return null;
    const combined = {};
    let found = false;
    queries.forEach((q) => {
      const matching = q.rules.filter((r) =>
        r.selector.split(',').map((s) => s.trim()).includes(selector)
      );
      if (matching.length > 0) {
        found = true;
        matching.forEach((r) => Object.assign(combined, r.declarations));
      }
    });
    return found ? combined : null;
  }
}

const formatValue = (val) => {
  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (typeof val === 'object') {
    if (val.tagName) return `<${val.tagName.toLowerCase()}${val.id ? '#' + val.id : ''}>`;
    try {
      return JSON.stringify(val);
    } catch {
      return '[Object]';
    }
  }
  return String(val);
};

class Expectation {
  constructor(actual, isNot = false) {
    this.actual = actual;
    this.isNot = isNot;
  }

  get not() {
    return new Expectation(this.actual, !this.isNot);
  }

  toBe(expected) {
    const pass = Object.is(this.actual, expected);
    this.assert(pass, `Expected ${formatValue(this.actual)} ${this.isNot ? 'not ' : ''}to be ${formatValue(expected)}`);
  }

  toEqual(expected) {
    let pass = false;
    try {
      pass = JSON.stringify(this.actual) === JSON.stringify(expected);
    } catch {
      pass = Object.is(this.actual, expected);
    }
    this.assert(pass, `Expected ${formatValue(this.actual)} ${this.isNot ? 'not ' : ''}to equal ${formatValue(expected)}`);
  }

  toBeNull() {
    const pass = this.actual === null;
    this.assert(pass, `Expected value ${this.isNot ? 'not ' : ''}to be null, received ${formatValue(this.actual)}`);
  }

  toBeDefined() {
    const pass = this.actual !== undefined;
    this.assert(pass, `Expected value ${this.isNot ? 'not ' : ''}to be defined`);
  }

  toBeUndefined() {
    const pass = this.actual === undefined;
    this.assert(pass, `Expected value ${this.isNot ? 'not ' : ''}to be undefined`);
  }

  toBeTruthy() {
    const pass = Boolean(this.actual);
    this.assert(pass, `Expected ${formatValue(this.actual)} ${this.isNot ? 'not ' : ''}to be truthy`);
  }

  toBeFalsy() {
    const pass = !this.actual;
    this.assert(pass, `Expected ${formatValue(this.actual)} ${this.isNot ? 'not ' : ''}to be falsy`);
  }

  toContain(substringOrItem) {
    let pass = false;
    if (typeof this.actual === 'string') {
      pass = this.actual.includes(substringOrItem);
    } else if (Array.isArray(this.actual)) {
      pass = this.actual.includes(substringOrItem);
    }
    this.assert(pass, `Expected ${formatValue(this.actual)} ${this.isNot ? 'not ' : ''}to contain ${formatValue(substringOrItem)}`);
  }

  toMatch(regex) {
    const pass = regex.test(String(this.actual));
    this.assert(pass, `Expected ${formatValue(this.actual)} ${this.isNot ? 'not ' : ''}to match ${regex}`);
  }

  toBeGreaterThan(number) {
    const pass = Number(this.actual) > number;
    this.assert(pass, `Expected ${formatValue(this.actual)} ${this.isNot ? 'not ' : ''}to be greater than ${number}`);
  }

  toBeGreaterThanOrEqual(number) {
    const pass = Number(this.actual) >= number;
    this.assert(pass, `Expected ${formatValue(this.actual)} ${this.isNot ? 'not ' : ''}to be greater than or equal to ${number}`);
  }

  toBeLessThan(number) {
    const pass = Number(this.actual) < number;
    this.assert(pass, `Expected ${formatValue(this.actual)} ${this.isNot ? 'not ' : ''}to be less than ${number}`);
  }

  toBeLessThanOrEqual(number) {
    const pass = Number(this.actual) <= number;
    this.assert(pass, `Expected ${formatValue(this.actual)} ${this.isNot ? 'not ' : ''}to be less than or equal to ${number}`);
  }

  toThrow(expected) {
    let threw = false;
    let err = null;
    try {
      if (typeof this.actual === 'function') {
        this.actual();
      }
    } catch (e) {
      threw = true;
      err = e;
    }
    if (this.isNot) {
      this.assert(!threw, `Expected function not to throw, but it threw: ${err && err.message ? err.message : err}`);
    } else {
      if (expected && threw) {
        if (typeof expected === 'string') {
          this.assert(String(err && err.message ? err.message : err).includes(expected), `Expected error to include "${expected}", got "${err && err.message ? err.message : err}"`);
        } else if (expected instanceof RegExp) {
          this.assert(expected.test(String(err && err.message ? err.message : err)), `Expected error to match ${expected}, got "${err && err.message ? err.message : err}"`);
        } else {
          this.assert(threw, `Expected function to throw, but it did not throw`);
        }
      } else {
        this.assert(threw, `Expected function to throw, but it did not throw`);
      }
    }
  }

  assert(condition, message) {
    const passed = this.isNot ? !condition : condition;
    if (!passed) {
      const error = new Error(message);
      error.isAssertionFailure = true;
      throw error;
    }
  }
}

class TestSuiteRunner {
  constructor() {
    this.suites = [];
    this.currentSuite = null;
    this.results = [];
  }

  describe(suiteName, callback) {
    const suite = {
      name: suiteName,
      tests: [],
      beforeEachHooks: [],
      afterEachHooks: [],
    };
    this.suites.push(suite);
    const previousSuite = this.currentSuite;
    this.currentSuite = suite;
    callback();
    this.currentSuite = previousSuite;
  }

  beforeEach(fn) {
    if (this.currentSuite) {
      this.currentSuite.beforeEachHooks.push(fn);
    }
  }

  afterEach(fn) {
    if (this.currentSuite) {
      this.currentSuite.afterEachHooks.push(fn);
    }
  }

  it(testName, fn) {
    if (!this.currentSuite) {
      this.describe('Default Suite', () => {
        this.it(testName, fn);
      });
      return;
    }
    this.currentSuite.tests.push({ name: testName, fn });
  }

  test(testName, fn) {
    this.it(testName, fn);
  }

  expect(actual) {
    return new Expectation(actual);
  }

  loadHtml() {
    const htmlPath = path.join(projectRoot, 'index.html');
    const content = fs.readFileSync(htmlPath, 'utf8');
    return new DOMDocument(content);
  }

  loadCss() {
    const cssPath = path.join(projectRoot, 'assets', 'css', 'style.css');
    const content = fs.readFileSync(cssPath, 'utf8');
    return new CSSRuleBook(content);
  }

  createDomEnvironment() {
    const document = this.loadHtml();
    const window = new DOMWindow(document);
    return { document, window, FormData: FormDataMock };
  }

  loadMainScript(env) {
    const jsPath = path.join(projectRoot, 'assets', 'js', 'main.js');
    const code = fs.readFileSync(jsPath, 'utf8');
    const vm = require('vm');
    const sandbox = {
      document: env.document,
      window: env.window,
      FormData: env.FormData || FormDataMock,
      setTimeout,
      clearTimeout,
      requestAnimationFrame: (fn) => setTimeout(fn, 0),
      Promise,
      Array,
      Object,
      String,
      Number,
      Boolean,
      RegExp,
      Set,
      Map,
      encodeURIComponent,
      decodeURIComponent,
    };
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);
    env.document.dispatchEvent({ type: 'DOMContentLoaded' });
    return sandbox;
  }

  async runAll(filter = {}) {
    let passedCount = 0;
    let failedCount = 0;
    const startTime = Date.now();

    console.log('\x1b[1m\x1b[36m============================================================\x1b[0m');
    console.log('\x1b[1m\x1b[36m  PT Karya Satya Buana Indonesia - E2E Verification Suite   \x1b[0m');
    console.log('\x1b[1m\x1b[36m============================================================\x1b[0m\n');

    for (const suite of this.suites) {
      if (filter.suite && !suite.name.toLowerCase().includes(filter.suite.toLowerCase())) {
        continue;
      }

      console.log(`\x1b[1m\x1b[34m▶ ${suite.name}\x1b[0m`);

      for (const testCase of suite.tests) {
        if (filter.test && !testCase.name.toLowerCase().includes(filter.test.toLowerCase())) {
          continue;
        }

        try {
          for (const hook of suite.beforeEachHooks) {
            await hook();
          }

          await testCase.fn();

          for (const hook of suite.afterEachHooks) {
            await hook();
          }

          console.log(`  \x1b[32m✔\x1b[0m ${testCase.name}`);
          passedCount++;
          this.results.push({ suite: suite.name, name: testCase.name, passed: true });
        } catch (error) {
          console.log(`  \x1b[31m✖\x1b[0m ${testCase.name}`);
          console.log(`    \x1b[31mError: ${error.message}\x1b[0m`);
          failedCount++;
          this.results.push({ suite: suite.name, name: testCase.name, passed: false, error: error.message });
        }
      }
      console.log('');
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const total = passedCount + failedCount;

    console.log('\x1b[1m------------------------------------------------------------\x1b[0m');
    console.log(`\x1b[1mTest Run Summary:\x1b[0m Total: ${total} | \x1b[32mPassed: ${passedCount}\x1b[0m | \x1b[31mFailed: ${failedCount}\x1b[0m | Duration: ${duration}s`);
    console.log('\x1b[1m------------------------------------------------------------\x1b[0m\n');

    return { total, passed: passedCount, failed: failedCount, duration, results: this.results };
  }
}

const runnerInstance = new TestSuiteRunner();

module.exports = {
  runner: runnerInstance,
  describe: (name, fn) => runnerInstance.describe(name, fn),
  it: (name, fn) => runnerInstance.it(name, fn),
  test: (name, fn) => runnerInstance.test(name, fn),
  beforeEach: (fn) => runnerInstance.beforeEach(fn),
  afterEach: (fn) => runnerInstance.afterEach(fn),
  expect: (actual) => runnerInstance.expect(actual),
  DOMElement,
  DOMDocument,
  DOMWindow,
  CSSRuleBook,
};

if (require.main === module) {
  const args = process.argv.slice(2);
  const suiteFilter = args.find((a) => a.startsWith('--suite='))?.split('=')[1];
  const tierFilter = args.find((a) => a.startsWith('--tier='))?.split('=')[1];

  const testsDir = path.join(projectRoot, 'tests');
  const filesToLoad = [];

  if (tierFilter) {
    const tierFile = `tier${tierFilter}`;
    const matched = fs.readdirSync(testsDir).find((f) => f.startsWith(tierFile) && f.endsWith('.js'));
    if (matched) filesToLoad.push(matched);
  } else {
    fs.readdirSync(testsDir)
      .filter((f) => f.endsWith('.test.js'))
      .forEach((f) => filesToLoad.push(f));
  }

  filesToLoad.sort().forEach((file) => {
    require(path.join(testsDir, file));
  });

  runnerInstance.runAll({ suite: suiteFilter }).then(({ failed }) => {
    process.exitCode = failed > 0 ? 1 : 0;
  });
}
