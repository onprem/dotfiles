/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 * This file is part of Adblock Plus <https://adblockplus.org/>,
 * Copyright (C) 2006-present eyeo GmbH
 *
 * Adblock Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Adblock Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adblock Plus.  If not, see <http://www.gnu.org/licenses/>.
 */



/**
 * Converts raw text into a regular expression string
 * @param {string} text the string to convert
 * @return {string} regular expression representation of the text
 */
function textToRegExp(text)
{
  return text.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}

exports.textToRegExp = textToRegExp;

/**
 * Converts filter text into regular expression string
 * @param {string} text as in Filter()
 * @return {string} regular expression representation of filter text
 */
function filterToRegExp(text)
{
  return text
    // remove multiple wildcards
    .replace(/\*+/g, "*")
    // remove anchors following separator placeholder
    .replace(/\^\|$/, "^")
    // escape special symbols
    .replace(/\W/g, "\\$&")
    // replace wildcards by .*
    .replace(/\\\*/g, ".*")
    // process separator placeholders (all ANSI characters but alphanumeric
    // characters and _%.-)
    .replace(/\\\^/g, "(?:[\\x00-\\x24\\x26-\\x2C\\x2F\\x3A-\\x40\\x5B-\\x5E\\x60\\x7B-\\x7F]|$)")
    // process extended anchor at expression start
    .replace(/^\\\|\\\|/, "^[\\w\\-]+:\\/+(?!\\/)(?:[^\\/]+\\.)?")
    // process anchor at expression start
    .replace(/^\\\|/, "^")
    // process anchor at expression end
    .replace(/\\\|$/, "$")
    // remove leading wildcards
    .replace(/^(\.\*)/, "")
    // remove trailing wildcards
    .replace(/(\.\*)$/, "");
}

exports.filterToRegExp = filterToRegExp;

function splitSelector(selector)
{
  if (selector.indexOf(",") == -1)
    return [selector];

  let selectors = [];
  let start = 0;
  let level = 0;
  let sep = "";

  for (let i = 0; i < selector.length; i++)
  {
    let chr = selector[i];

    if (chr == "\\")        // ignore escaped characters
      i++;
    else if (chr == sep)    // don't split within quoted text
      sep = "";             // e.g. [attr=","]
    else if (sep == "")
    {
      if (chr == '"' || chr == "'")
        sep = chr;
      else if (chr == "(")  // don't split between parentheses
        level++;            // e.g. :matches(div,span)
      else if (chr == ")")
        level = Math.max(0, level - 1);
      else if (chr == "," && level == 0)
      {
        selectors.push(selector.substring(start, i));
        start = i + 1;
      }
    }
  }

  selectors.push(selector.substring(start));
  return selectors;
}

exports.splitSelector = splitSelector;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(2);
module.exports = __webpack_require__(5);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 * This file is part of Adblock Plus <https://adblockplus.org/>,
 * Copyright (C) 2006-present eyeo GmbH
 *
 * Adblock Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Adblock Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adblock Plus.  If not, see <http://www.gnu.org/licenses/>.
 */



let {splitSelector} = __webpack_require__(0);
let {ElemHideEmulation} =
  __webpack_require__(3);

// This variable is also used by our other content scripts.
let elemhide;

const typeMap = new Map([
  ["img", "IMAGE"],
  ["input", "IMAGE"],
  ["picture", "IMAGE"],
  ["audio", "MEDIA"],
  ["video", "MEDIA"],
  ["frame", "SUBDOCUMENT"],
  ["iframe", "SUBDOCUMENT"],
  ["object", "OBJECT"],
  ["embed", "OBJECT"]
]);

let collapsingSelectors = new Set();

function getURLsFromObjectElement(element)
{
  let url = element.getAttribute("data");
  if (url)
    return [url];

  for (let child of element.children)
  {
    if (child.localName != "param")
      continue;

    let name = child.getAttribute("name");
    if (name != "movie" &&  // Adobe Flash
        name != "source" && // Silverlight
        name != "src" &&    // Real Media + Quicktime
        name != "FileName") // Windows Media
      continue;

    let value = child.getAttribute("value");
    if (!value)
      continue;

    return [value];
  }

  return [];
}

function getURLsFromAttributes(element)
{
  let urls = [];

  if (element.src)
    urls.push(element.src);

  if (element.srcset)
  {
    for (let candidate of element.srcset.split(","))
    {
      let url = candidate.trim().replace(/\s+\S+$/, "");
      if (url)
        urls.push(url);
    }
  }

  return urls;
}

function getURLsFromMediaElement(element)
{
  let urls = getURLsFromAttributes(element);

  for (let child of element.children)
  {
    if (child.localName == "source" || child.localName == "track")
      urls.push(...getURLsFromAttributes(child));
  }

  if (element.poster)
    urls.push(element.poster);

  return urls;
}

function getURLsFromElement(element)
{
  let urls;
  switch (element.localName)
  {
    case "object":
      urls = getURLsFromObjectElement(element);
      break;

    case "video":
    case "audio":
    case "picture":
      urls = getURLsFromMediaElement(element);
      break;

    default:
      urls = getURLsFromAttributes(element);
      break;
  }

  for (let i = 0; i < urls.length; i++)
  {
    if (/^(?!https?:)[\w-]+:/i.test(urls[i]))
      urls.splice(i--, 1);
  }

  return urls;
}

function isCollapsibleMediaElement(element, mediatype)
{
  if (mediatype != "MEDIA")
    return false;

  if (!element.getAttribute("src"))
    return false;

  for (let child of element.children)
  {
    // If the <video> or <audio> element contains any <source> or <track>
    // children, we cannot address it in CSS by the source URL; in that case we
    // don't "collapse" it using a CSS selector but rather hide it directly by
    // setting the style="..." attribute.
    if (child.localName == "source" || child.localName == "track")
      return false;
  }

  return true;
}

function collapseMediaElement(element, srcValue)
{
  if (!srcValue)
    return;

  let selector = element.localName + "[src=" + CSS.escape(srcValue) + "]";

  // Adding selectors is expensive so do it only if we really have a new
  // selector.
  if (!collapsingSelectors.has(selector))
  {
    collapsingSelectors.add(selector);
    elemhide.addSelectors([selector], null, "collapsing", true);
  }
}

function hideElement(element)
{
  function doHide()
  {
    let propertyName = "display";
    let propertyValue = "none";
    if (element.localName == "frame")
    {
      propertyName = "visibility";
      propertyValue = "hidden";
    }

    if (element.style.getPropertyValue(propertyName) != propertyValue ||
        element.style.getPropertyPriority(propertyName) != "important")
      element.style.setProperty(propertyName, propertyValue, "important");
  }

  doHide();

  new MutationObserver(doHide).observe(
    element, {
      attributes: true,
      attributeFilter: ["style"]
    }
  );
}

function checkCollapse(element)
{
  let mediatype = typeMap.get(element.localName);
  if (!mediatype)
    return;

  let urls = getURLsFromElement(element);
  if (urls.length == 0)
    return;

  let collapsibleMediaElement = isCollapsibleMediaElement(element, mediatype);

  // Save the value of the src attribute because it can change between now and
  // when we get the response from the background page.
  let srcValue = collapsibleMediaElement ? element.getAttribute("src") : null;

  browser.runtime.sendMessage(
    {
      type: "filters.collapse",
      urls,
      mediatype,
      baseURL: document.location.href
    },
    collapse =>
    {
      if (collapse)
      {
        if (collapsibleMediaElement)
          collapseMediaElement(element, srcValue);
        else
          hideElement(element);
      }
    }
  );
}

function checkSitekey()
{
  let attr = document.documentElement.getAttribute("data-adblockkey");
  if (attr)
    browser.runtime.sendMessage({type: "filters.addKey", token: attr});
}

function ElementHidingTracer()
{
  this.selectors = [];
  this.changedNodes = [];
  this.timeout = null;
  this.observer = new MutationObserver(this.observe.bind(this));
  this.trace = this.trace.bind(this);

  if (document.readyState == "loading")
    document.addEventListener("DOMContentLoaded", this.trace);
  else
    this.trace();
}
ElementHidingTracer.prototype = {
  addSelectors(selectors, filters)
  {
    let pairs = selectors.map((sel, i) => [sel, filters && filters[i]]);

    if (document.readyState != "loading")
      this.checkNodes([document], pairs);

    this.selectors.push(...pairs);
  },

  checkNodes(nodes, pairs)
  {
    let selectors = [];
    let filters = [];

    for (let [selector, filter] of pairs)
    {
      nodes: for (let node of nodes)
      {
        for (let element of node.querySelectorAll(selector))
        {
          // Only consider selectors that actually have an effect on the
          // computed styles, and aren't overridden by rules with higher
          // priority, or haven't been circumvented in a different way.
          if (getComputedStyle(element).display == "none")
          {
            // For regular element hiding, we don't know the exact filter,
            // but the background page can find it with the given selector.
            // In case of element hiding emulation, the generated selector
            // we got here is different from the selector part of the filter,
            // but in this case we can send the whole filter text instead.
            if (filter)
              filters.push(filter);
            else
              selectors.push(selector);

            break nodes;
          }
        }
      }
    }

    if (selectors.length > 0 || filters.length > 0)
    {
      browser.runtime.sendMessage({
        type: "devtools.traceElemHide",
        selectors, filters
      });
    }
  },

  onTimeout()
  {
    this.checkNodes(this.changedNodes, this.selectors);
    this.changedNodes = [];
    this.timeout = null;
  },

  observe(mutations)
  {
    // Forget previously changed nodes that are no longer in the DOM.
    for (let i = 0; i < this.changedNodes.length; i++)
    {
      if (!document.contains(this.changedNodes[i]))
        this.changedNodes.splice(i--, 1);
    }

    for (let mutation of mutations)
    {
      let node = mutation.target;

      // Ignore mutations of nodes that aren't in the DOM anymore.
      if (!document.contains(node))
        continue;

      // Since querySelectorAll() doesn't consider the root itself
      // and since CSS selectors can also match siblings, we have
      // to consider the parent node for attribute mutations.
      if (mutation.type == "attributes")
        node = node.parentNode;

      let addNode = true;
      for (let i = 0; i < this.changedNodes.length; i++)
      {
        let previouslyChangedNode = this.changedNodes[i];

        // If we are already going to check an ancestor of this node,
        // we can ignore this node, since it will be considered anyway
        // when checking one of its ancestors.
        if (previouslyChangedNode.contains(node))
        {
          addNode = false;
          break;
        }

        // If this node is an ancestor of a node that previously changed,
        // we can ignore that node, since it will be considered anyway
        // when checking one of its ancestors.
        if (node.contains(previouslyChangedNode))
          this.changedNodes.splice(i--, 1);
      }

      if (addNode)
        this.changedNodes.push(node);
    }

    // Check only nodes whose descendants have changed, and not more often
    // than once a second. Otherwise large pages with a lot of DOM mutations
    // (like YouTube) freeze when the devtools panel is active.
    if (this.timeout == null)
      this.timeout = setTimeout(this.onTimeout.bind(this), 1000);
  },

  trace()
  {
    this.checkNodes([document], this.selectors);

    this.observer.observe(
      document,
      {
        childList: true,
        attributes: true,
        subtree: true
      }
    );
  },

  disconnect()
  {
    document.removeEventListener("DOMContentLoaded", this.trace);
    this.observer.disconnect();
    clearTimeout(this.timeout);
  }
};

function ElemHide()
{
  this.shadow = this.createShadowTree();
  this.styles = new Map();
  this.tracer = null;
  this.inline = true;
  this.inlineEmulated = true;

  this.elemHideEmulation = new ElemHideEmulation(
    this.addSelectors.bind(this),
    this.hideElements.bind(this)
  );
}
ElemHide.prototype = {
  selectorGroupSize: 1024,

  createShadowTree()
  {
    // Use Shadow DOM if available as to not mess with with web pages that
    // rely on the order of their own <style> tags (#309). However, creating
    // a shadow root breaks running CSS transitions. So we have to create
    // the shadow root before transistions might start (#452).
    if (!("createShadowRoot" in document.documentElement))
      return null;

    // Both Firefox and Chrome 66+ support user style sheets, so we can avoid
    // creating an unnecessary shadow root on these platforms.
    let match = /\bChrome\/(\d+)/.exec(navigator.userAgent);
    if (!match || match[1] >= 66)
      return null;

    // Using shadow DOM causes issues on some Google websites,
    // including Google Docs, Gmail and Blogger (#1770, #2602, #2687).
    if (/\.(?:google|blogger)\.com$/.test(document.domain))
      return null;

    // Finally since some users have both AdBlock and Adblock Plus installed we
    // have to consider how the two extensions interact. For example we want to
    // avoid creating the shadowRoot twice.
    let shadow = document.documentElement.shadowRoot ||
                 document.documentElement.createShadowRoot();
    shadow.appendChild(document.createElement("content"));

    return shadow;
  },

  addSelectorsInline(selectors, groupName, appendOnly = false)
  {
    let style = this.styles.get(groupName);

    if (style && !appendOnly)
    {
      while (style.sheet.cssRules.length > 0)
        style.sheet.deleteRule(0);
    }

    if (selectors.length == 0)
      return;

    if (!style)
    {
      // Create <style> element lazily, only if we add styles. Add it to
      // the shadow DOM if possible. Otherwise fallback to the <head> or
      // <html> element. If we have injected a style element before that
      // has been removed (the sheet property is null), create a new one.
      style = document.createElement("style");
      (this.shadow || document.head ||
                      document.documentElement).appendChild(style);

      // It can happen that the frame already navigated to a different
      // document while we were waiting for the background page to respond.
      // In that case the sheet property will stay null, after addind the
      // <style> element to the shadow DOM.
      if (!style.sheet)
        return;

      this.styles.set(groupName, style);
    }

    // If using shadow DOM, we have to add the ::content pseudo-element
    // before each selector, in order to match elements within the
    // insertion point.
    let preparedSelectors = [];
    if (this.shadow)
    {
      for (let selector of selectors)
      {
        let subSelectors = splitSelector(selector);
        for (let subSelector of subSelectors)
          preparedSelectors.push("::content " + subSelector);
      }
    }
    else
    {
      preparedSelectors = selectors;
    }

    // Chromium's Blink engine supports only up to 8,192 simple selectors, and
    // even fewer compound selectors, in a rule. The exact number of selectors
    // that would work depends on their sizes (e.g. "#foo .bar" has a
    // size of 2). Since we don't know the sizes of the selectors here, we
    // simply split them into groups of 1,024, based on the reasonable
    // assumption that the average selector won't have a size greater than 8.
    // The alternative would be to calculate the sizes of the selectors and
    // divide them up accordingly, but this approach is more efficient and has
    // worked well in practice. In theory this could still lead to some
    // selectors not working on Chromium, but it is highly unlikely.
    // See issue #6298 and https://crbug.com/804179
    for (let i = 0; i < preparedSelectors.length; i += this.selectorGroupSize)
    {
      let selector = preparedSelectors.slice(
        i, i + this.selectorGroupSize
      ).join(", ");
      style.sheet.insertRule(selector + "{display: none !important;}",
                             style.sheet.cssRules.length);
    }
  },

  addSelectors(selectors, filters, groupName = "emulated", appendOnly = false)
  {
    if (this.inline || this.inlineEmulated)
    {
      // Insert the style rules inline if we have been instructed by the
      // background page to do so. This is usually the case, except on platforms
      // that do support user stylesheets via the browser.tabs.insertCSS API
      // (Firefox 53 onwards for now and possibly Chrome in the near future).
      // Once all supported platforms have implemented this API, we can remove
      // the code below. See issue #5090.
      // Related Chrome and Firefox issues:
      // https://bugs.chromium.org/p/chromium/issues/detail?id=632009
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1310026
      this.addSelectorsInline(selectors, groupName, appendOnly);
    }
    else
    {
      browser.runtime.sendMessage({
        type: "elemhide.injectSelectors",
        selectors,
        groupName,
        appendOnly
      });
    }

    // Only trace selectors that are based directly on hiding filters
    // (i.e. leave out collapsing selectors).
    if (this.tracer && groupName != "collapsing")
      this.tracer.addSelectors(selectors, filters);
  },

  hideElements(elements, filters)
  {
    for (let element of elements)
      hideElement(element);

    if (this.tracer)
    {
      browser.runtime.sendMessage({
        type: "devtools.traceElemHide",
        selectors: [],
        filters
      });
    }
  },

  apply()
  {
    browser.runtime.sendMessage({type: "elemhide.getSelectors"}, response =>
    {
      if (this.tracer)
        this.tracer.disconnect();
      this.tracer = null;

      if (response.trace)
        this.tracer = new ElementHidingTracer();

      this.inline = response.inline;
      this.inlineEmulated = !!response.inlineEmulated;

      if (this.inline)
        this.addSelectorsInline(response.selectors, "standard");

      if (this.tracer)
        this.tracer.addSelectors(response.selectors);

      // Prefer CSS selectors for -abp-has and -abp-contains unless the
      // background page has asked us to use inline styles.
      this.elemHideEmulation.useInlineStyles = this.inline ||
                                               this.inlineEmulated;

      this.elemHideEmulation.apply(response.emulatedPatterns);
    });
  }
};

if (document instanceof HTMLDocument)
{
  checkSitekey();

  elemhide = new ElemHide();
  elemhide.apply();

  document.addEventListener("error", event =>
  {
    checkCollapse(event.target);
  }, true);

  document.addEventListener("load", event =>
  {
    let element = event.target;
    if (/^i?frame$/.test(element.localName))
      checkCollapse(element);
  }, true);
}

window.checkCollapse = checkCollapse;
window.elemhide = elemhide;
window.typeMap = typeMap;
window.getURLsFromElement = getURLsFromElement;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 * This file is part of Adblock Plus <https://adblockplus.org/>,
 * Copyright (C) 2006-present eyeo GmbH
 *
 * Adblock Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Adblock Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adblock Plus.  If not, see <http://www.gnu.org/licenses/>.
 */



const {textToRegExp, filterToRegExp, splitSelector} = __webpack_require__(0);
const {indexOf} = __webpack_require__(4);

let MIN_INVOCATION_INTERVAL = 3000;
const MAX_SYNCHRONOUS_PROCESSING_TIME = 50;
const abpSelectorRegexp = /:-abp-([\w-]+)\(/i;

function getCachedPropertyValue(object, name, defaultValueFunc = () => {})
{
  let value = object[name];
  if (typeof value == "undefined")
    Object.defineProperty(object, name, {value: value = defaultValueFunc()});
  return value;
}

/** Return position of node from parent.
 * @param {Node} node the node to find the position of.
 * @return {number} One-based index like for :nth-child(), or 0 on error.
 */
function positionInParent(node)
{
  return indexOf(node.parentNode.children, node) + 1;
}

function makeSelector(node, selector = "")
{
  if (node == null)
    return null;
  if (!node.parentElement)
  {
    let newSelector = ":root";
    if (selector)
      newSelector += " > " + selector;
    return newSelector;
  }
  let idx = positionInParent(node);
  if (idx > 0)
  {
    let newSelector = `${node.tagName}:nth-child(${idx})`;
    if (selector)
      newSelector += " > " + selector;
    return makeSelector(node.parentElement, newSelector);
  }

  return selector;
}

function parseSelectorContent(content, startIndex)
{
  let parens = 1;
  let quote = null;
  let i = startIndex;
  for (; i < content.length; i++)
  {
    let c = content[i];
    if (c == "\\")
    {
      // Ignore escaped characters
      i++;
    }
    else if (quote)
    {
      if (c == quote)
        quote = null;
    }
    else if (c == "'" || c == '"')
      quote = c;
    else if (c == "(")
      parens++;
    else if (c == ")")
    {
      parens--;
      if (parens == 0)
        break;
    }
  }

  if (parens > 0)
    return null;
  return {text: content.substring(startIndex, i), end: i};
}

/** Stringified style objects
 * @typedef {Object} StringifiedStyle
 * @property {string} style CSS style represented by a string.
 * @property {string[]} subSelectors selectors the CSS properties apply to.
 */

/**
 * Produce a string representation of the stylesheet entry.
 * @param {CSSStyleRule} rule the CSS style rule.
 * @return {StringifiedStyle} the stringified style.
 */
function stringifyStyle(rule)
{
  let styles = [];
  for (let i = 0; i < rule.style.length; i++)
  {
    let property = rule.style.item(i);
    let value = rule.style.getPropertyValue(property);
    let priority = rule.style.getPropertyPriority(property);
    styles.push(`${property}: ${value}${priority ? " !" + priority : ""};`);
  }
  styles.sort();
  return {
    style: styles.join(" "),
    subSelectors: splitSelector(rule.selectorText)
  };
}

let scopeSupported = null;

function tryQuerySelector(subtree, selector, all)
{
  let elements = null;
  try
  {
    elements = all ? subtree.querySelectorAll(selector) :
      subtree.querySelector(selector);
    scopeSupported = true;
  }
  catch (e)
  {
    // Edge doesn't support ":scope"
    scopeSupported = false;
  }
  return elements;
}

/**
 * Query selector. If it is relative, will try :scope.
 * @param {Node} subtree the element to query selector
 * @param {string} selector the selector to query
 * @param {bool} [all=false] true to perform querySelectorAll()
 * @returns {?(Node|NodeList)} result of the query. null in case of error.
 */
function scopedQuerySelector(subtree, selector, all)
{
  if (selector[0] == ">")
  {
    selector = ":scope" + selector;
    if (scopeSupported)
    {
      return all ? subtree.querySelectorAll(selector) :
        subtree.querySelector(selector);
    }
    if (scopeSupported == null)
      return tryQuerySelector(subtree, selector, all);
    return null;
  }
  return all ? subtree.querySelectorAll(selector) :
    subtree.querySelector(selector);
}

function scopedQuerySelectorAll(subtree, selector)
{
  return scopedQuerySelector(subtree, selector, true);
}

const regexpRegexp = /^\/(.*)\/([im]*)$/;

/**
 * Make a regular expression from a text argument. If it can be parsed as a
 * regular expression, parse it and the flags.
 * @param {string} text the text argument.
 * @return {?RegExp} a RegExp object or null in case of error.
 */
function makeRegExpParameter(text)
{
  let [, pattern, flags] =
      regexpRegexp.exec(text) || [undefined, textToRegExp(text)];

  try
  {
    return new RegExp(pattern, flags);
  }
  catch (e)
  {
  }
  return null;
}

function* evaluate(chain, index, prefix, subtree, styles)
{
  if (index >= chain.length)
  {
    yield prefix;
    return;
  }
  for (let [selector, element] of
       chain[index].getSelectors(prefix, subtree, styles))
  {
    if (selector == null)
      yield null;
    else
      yield* evaluate(chain, index + 1, selector, element, styles);
  }
  // Just in case the getSelectors() generator above had to run some heavy
  // document.querySelectorAll() call which didn't produce any results, make
  // sure there is at least one point where execution can pause.
  yield null;
}

function PlainSelector(selector)
{
  this._selector = selector;
  this.maybeDependsOnAttributes = /[#.]|\[.+\]/.test(selector);
}

PlainSelector.prototype = {
  /**
   * Generator function returning a pair of selector
   * string and subtree.
   * @param {string} prefix the prefix for the selector.
   * @param {Node} subtree the subtree we work on.
   * @param {StringifiedStyle[]} styles the stringified style objects.
   */
  *getSelectors(prefix, subtree, styles)
  {
    yield [prefix + this._selector, subtree];
  }
};

const incompletePrefixRegexp = /[\s>+~]$/;

function HasSelector(selectors)
{
  this._innerSelectors = selectors;
}

HasSelector.prototype = {
  requiresHiding: true,
  dependsOnDOM: true,

  get dependsOnStyles()
  {
    return this._innerSelectors.some(selector => selector.dependsOnStyles);
  },

  get dependsOnCharacterData()
  {
    return this._innerSelectors.some(
      selector => selector.dependsOnCharacterData
    );
  },

  get maybeDependsOnAttributes()
  {
    return this._innerSelectors.some(
      selector => selector.maybeDependsOnAttributes
    );
  },

  *getSelectors(prefix, subtree, styles)
  {
    for (let element of this.getElements(prefix, subtree, styles))
      yield [makeSelector(element), element];
  },

  /**
   * Generator function returning selected elements.
   * @param {string} prefix the prefix for the selector.
   * @param {Node} subtree the subtree we work on.
   * @param {StringifiedStyle[]} styles the stringified style objects.
   */
  *getElements(prefix, subtree, styles)
  {
    let actualPrefix = (!prefix || incompletePrefixRegexp.test(prefix)) ?
        prefix + "*" : prefix;
    let elements = scopedQuerySelectorAll(subtree, actualPrefix);
    if (elements)
    {
      for (let element of elements)
      {
        let iter = evaluate(this._innerSelectors, 0, "", element, styles);
        for (let selector of iter)
        {
          if (selector == null)
            yield null;
          else if (scopedQuerySelector(element, selector))
            yield element;
        }
        yield null;
      }
    }
  }
};

function ContainsSelector(textContent)
{
  this._regexp = makeRegExpParameter(textContent);
}

ContainsSelector.prototype = {
  requiresHiding: true,
  dependsOnDOM: true,
  dependsOnCharacterData: true,

  *getSelectors(prefix, subtree, styles)
  {
    for (let element of this.getElements(prefix, subtree, styles))
      yield [makeSelector(element), subtree];
  },

  *getElements(prefix, subtree, styles)
  {
    let actualPrefix = (!prefix || incompletePrefixRegexp.test(prefix)) ?
        prefix + "*" : prefix;

    let elements = scopedQuerySelectorAll(subtree, actualPrefix);

    if (elements)
    {
      let lastRoot = null;
      for (let element of elements)
      {
        // For a filter like div:-abp-contains(Hello) and a subtree like
        // <div id="a"><div id="b"><div id="c">Hello</div></div></div>
        // we're only interested in div#a
        if (lastRoot && lastRoot.contains(element))
        {
          yield null;
          continue;
        }

        lastRoot = element;

        if (this._regexp && this._regexp.test(element.textContent))
          yield element;
        else
          yield null;
      }
    }
  }
};

function PropsSelector(propertyExpression)
{
  let regexpString;
  if (propertyExpression.length >= 2 && propertyExpression[0] == "/" &&
      propertyExpression[propertyExpression.length - 1] == "/")
  {
    regexpString = propertyExpression.slice(1, -1)
      .replace("\\7B ", "{").replace("\\7D ", "}");
  }
  else
    regexpString = filterToRegExp(propertyExpression);

  this._regexp = new RegExp(regexpString, "i");
}

PropsSelector.prototype = {
  preferHideWithSelector: true,
  dependsOnStyles: true,

  *findPropsSelectors(styles, prefix, regexp)
  {
    for (let style of styles)
      if (regexp.test(style.style))
        for (let subSelector of style.subSelectors)
        {
          if (subSelector.startsWith("*") &&
              !incompletePrefixRegexp.test(prefix))
          {
            subSelector = subSelector.substr(1);
          }
          let idx = subSelector.lastIndexOf("::");
          if (idx != -1)
            subSelector = subSelector.substr(0, idx);
          yield prefix + subSelector;
        }
  },

  *getSelectors(prefix, subtree, styles)
  {
    for (let selector of this.findPropsSelectors(styles, prefix, this._regexp))
      yield [selector, subtree];
  }
};

function Pattern(selectors, text)
{
  this.selectors = selectors;
  this.text = text;
}

Pattern.prototype = {
  isSelectorHidingOnlyPattern()
  {
    return getCachedPropertyValue(
      this, "_selectorHidingOnlyPattern",
      () => this.selectors.some(selector => selector.preferHideWithSelector) &&
            !this.selectors.some(selector => selector.requiresHiding)
    );
  },

  get dependsOnStyles()
  {
    return getCachedPropertyValue(
      this, "_dependsOnStyles",
      () => this.selectors.some(selector => selector.dependsOnStyles)
    );
  },

  get dependsOnDOM()
  {
    return getCachedPropertyValue(
      this, "_dependsOnDOM",
      () => this.selectors.some(selector => selector.dependsOnDOM)
    );
  },

  get dependsOnStylesAndDOM()
  {
    return getCachedPropertyValue(
      this, "_dependsOnStylesAndDOM",
      () => this.selectors.some(selector => selector.dependsOnStyles &&
                                            selector.dependsOnDOM)
    );
  },

  get maybeDependsOnAttributes()
  {
    // Observe changes to attributes if either there's a plain selector that
    // looks like an ID selector, class selector, or attribute selector in one
    // of the patterns (e.g. "a[href='https://example.com/']")
    // or there's a properties selector nested inside a has selector
    // (e.g. "div:-abp-has(:-abp-properties(color: blue))")
    return getCachedPropertyValue(
      this, "_maybeDependsOnAttributes",
      () => this.selectors.some(
              selector => selector.maybeDependsOnAttributes ||
                          (selector instanceof HasSelector &&
                           selector.dependsOnStyles)
            )
    );
  },

  get dependsOnCharacterData()
  {
    // Observe changes to character data only if there's a contains selector in
    // one of the patterns.
    return getCachedPropertyValue(
      this, "_dependsOnCharacterData",
      () => this.selectors.some(selector => selector.dependsOnCharacterData)
    );
  }
};

function filterPatterns(patterns, {stylesheets, mutations})
{
  if (!stylesheets && !mutations)
    return patterns.slice();

  return patterns.filter(
    pattern => (stylesheets && pattern.dependsOnStyles) ||
               (mutations && pattern.dependsOnDOM)
  );
}

function shouldObserveAttributes(patterns)
{
  return patterns.some(pattern => pattern.maybeDependsOnAttributes);
}

function shouldObserveCharacterData(patterns)
{
  return patterns.some(pattern => pattern.dependsOnCharacterData);
}

function ElemHideEmulation(addSelectorsFunc, hideElemsFunc)
{
  this.document = document;
  this.addSelectorsFunc = addSelectorsFunc;
  this.hideElemsFunc = hideElemsFunc;
  this.observer = new MutationObserver(this.observe.bind(this));
  this.useInlineStyles = true;
}

ElemHideEmulation.prototype = {
  isSameOrigin(stylesheet)
  {
    try
    {
      return new URL(stylesheet.href).origin == this.document.location.origin;
    }
    catch (e)
    {
      // Invalid URL, assume that it is first-party.
      return true;
    }
  },

  /** Parse the selector
   * @param {string} selector the selector to parse
   * @return {Array} selectors is an array of objects,
   * or null in case of errors.
   */
  parseSelector(selector)
  {
    if (selector.length == 0)
      return [];

    let match = abpSelectorRegexp.exec(selector);
    if (!match)
      return [new PlainSelector(selector)];

    let selectors = [];
    if (match.index > 0)
      selectors.push(new PlainSelector(selector.substr(0, match.index)));

    let startIndex = match.index + match[0].length;
    let content = parseSelectorContent(selector, startIndex);
    if (!content)
    {
      console.error(new SyntaxError("Failed to parse Adblock Plus " +
                                    `selector ${selector} ` +
                                    "due to unmatched parentheses."));
      return null;
    }
    if (match[1] == "properties")
      selectors.push(new PropsSelector(content.text));
    else if (match[1] == "has")
    {
      let hasSelectors = this.parseSelector(content.text);
      if (hasSelectors == null)
        return null;
      selectors.push(new HasSelector(hasSelectors));
    }
    else if (match[1] == "contains")
      selectors.push(new ContainsSelector(content.text));
    else
    {
      // this is an error, can't parse selector.
      console.error(new SyntaxError("Failed to parse Adblock Plus " +
                                    `selector ${selector}, invalid ` +
                                    `pseudo-class :-abp-${match[1]}().`));
      return null;
    }

    let suffix = this.parseSelector(selector.substr(content.end + 1));
    if (suffix == null)
      return null;

    selectors.push(...suffix);

    if (selectors.length == 1 && selectors[0] instanceof ContainsSelector)
    {
      console.error(new SyntaxError("Failed to parse Adblock Plus " +
                                    `selector ${selector}, can't ` +
                                    "have a lonely :-abp-contains()."));
      return null;
    }
    return selectors;
  },

  /**
   * Processes the current document and applies all rules to it.
   * @param {CSSStyleSheet[]} [stylesheets]
   *    The list of new stylesheets that have been added to the document and
   *    made reprocessing necessary. This parameter shouldn't be passed in for
   *    the initial processing, all of document's stylesheets will be considered
   *    then and all rules, including the ones not dependent on styles.
   * @param {MutationRecord[]} [mutations]
   *    The list of DOM mutations that have been applied to the document and
   *    made reprocessing necessary. This parameter shouldn't be passed in for
   *    the initial processing, the entire document will be considered
   *    then and all rules, including the ones not dependent on the DOM.
   * @param {function} [done]
   *    Callback to call when done.
   */
  _addSelectors(stylesheets, mutations, done)
  {
    let patterns = filterPatterns(this.patterns, {stylesheets, mutations});

    let selectors = [];
    let selectorFilters = [];

    let elements = [];
    let elementFilters = [];

    let cssStyles = [];

    // If neither any style sheets nor any DOM mutations have been specified,
    // do full processing.
    if (!stylesheets && !mutations)
      stylesheets = this.document.styleSheets;

    // If there are any DOM mutations and any of the patterns depends on both
    // style sheets and the DOM (e.g. -abp-has(-abp-properties)), find all the
    // rules in every style sheet in the document, because we need to run
    // querySelectorAll afterwards. On the other hand, if we only have patterns
    // that depend on either styles or DOM both not both
    // (e.g. -abp-properties or -abp-contains), we can skip this part.
    if (mutations && patterns.some(pattern => pattern.dependsOnStylesAndDOM))
      stylesheets = this.document.styleSheets;

    for (let stylesheet of stylesheets || [])
    {
      // Explicitly ignore third-party stylesheets to ensure consistent behavior
      // between Firefox and Chrome.
      if (!this.isSameOrigin(stylesheet))
        continue;

      let rules;
      try
      {
        rules = stylesheet.cssRules;
      }
      catch (e)
      {
        // On Firefox, there is a chance that an InvalidAccessError
        // get thrown when accessing cssRules. Just skip the stylesheet
        // in that case.
        // See https://searchfox.org/mozilla-central/rev/f65d7528e34ef1a7665b4a1a7b7cdb1388fcd3aa/layout/style/StyleSheet.cpp#699
        continue;
      }

      if (!rules)
        continue;

      for (let rule of rules)
      {
        if (rule.type != rule.STYLE_RULE)
          continue;

        cssStyles.push(stringifyStyle(rule));
      }
    }

    let pattern = null;
    let generator = null;

    let processPatterns = () =>
    {
      let cycleStart = performance.now();

      if (!pattern)
      {
        if (!patterns.length)
        {
          if (selectors.length > 0)
            this.addSelectorsFunc(selectors, selectorFilters);
          if (elements.length > 0)
            this.hideElemsFunc(elements, elementFilters);
          if (typeof done == "function")
            done();
          return;
        }

        pattern = patterns.shift();

        generator = evaluate(pattern.selectors, 0, "",
                             this.document, cssStyles);
      }
      for (let selector of generator)
      {
        if (selector != null)
        {
          if (!this.useInlineStyles ||
              pattern.isSelectorHidingOnlyPattern())
          {
            selectors.push(selector);
            selectorFilters.push(pattern.text);
          }
          else
          {
            for (let element of this.document.querySelectorAll(selector))
            {
              elements.push(element);
              elementFilters.push(pattern.text);
            }
          }
        }
        if (performance.now() - cycleStart > MAX_SYNCHRONOUS_PROCESSING_TIME)
        {
          setTimeout(processPatterns, 0);
          return;
        }
      }
      pattern = null;
      return processPatterns();
    };

    processPatterns();
  },

  // This property is only used in the tests
  // to shorten the invocation interval
  get MIN_INVOCATION_INTERVAL()
  {
    return MIN_INVOCATION_INTERVAL;
  },

  set MIN_INVOCATION_INTERVAL(interval)
  {
    MIN_INVOCATION_INTERVAL = interval;
  },

  _filteringInProgress: false,
  _lastInvocation: -MIN_INVOCATION_INTERVAL,
  _scheduledProcessing: null,

  /**
   * Re-run filtering either immediately or queued.
   * @param {CSSStyleSheet[]} [stylesheets]
   *    new stylesheets to be processed. This parameter should be omitted
   *    for full reprocessing.
   * @param {MutationRecord[]} [mutations]
   *    new DOM mutations to be processed. This parameter should be omitted
   *    for full reprocessing.
   */
  queueFiltering(stylesheets, mutations)
  {
    let completion = () =>
    {
      this._lastInvocation = performance.now();
      this._filteringInProgress = false;
      if (this._scheduledProcessing)
      {
        let params = Object.assign({}, this._scheduledProcessing);
        this._scheduledProcessing = null;
        this.queueFiltering(params.stylesheets, params.mutations);
      }
    };

    if (this._scheduledProcessing)
    {
      if (!stylesheets && !mutations)
      {
        this._scheduledProcessing = {};
      }
      else if (this._scheduledProcessing.stylesheets ||
               this._scheduledProcessing.mutations)
      {
        if (stylesheets)
        {
          if (!this._scheduledProcessing.stylesheets)
            this._scheduledProcessing.stylesheets = [];
          this._scheduledProcessing.stylesheets.push(...stylesheets);
        }
        if (mutations)
        {
          if (!this._scheduledProcessing.mutations)
            this._scheduledProcessing.mutations = [];
          this._scheduledProcessing.mutations.push(...mutations);
        }
      }
    }
    else if (this._filteringInProgress)
    {
      this._scheduledProcessing = {stylesheets, mutations};
    }
    else if (performance.now() - this._lastInvocation < MIN_INVOCATION_INTERVAL)
    {
      this._scheduledProcessing = {stylesheets, mutations};
      setTimeout(() =>
      {
        let params = Object.assign({}, this._scheduledProcessing);
        this._filteringInProgress = true;
        this._scheduledProcessing = null;
        this._addSelectors(params.stylesheets, params.mutations, completion);
      },
      MIN_INVOCATION_INTERVAL - (performance.now() - this._lastInvocation));
    }
    else if (this.document.readyState == "loading")
    {
      this._scheduledProcessing = {stylesheets, mutations};
      let handler = () =>
      {
        this.document.removeEventListener("DOMContentLoaded", handler);
        let params = Object.assign({}, this._scheduledProcessing);
        this._filteringInProgress = true;
        this._scheduledProcessing = null;
        this._addSelectors(params.stylesheets, params.mutations, completion);
      };
      this.document.addEventListener("DOMContentLoaded", handler);
    }
    else
    {
      this._filteringInProgress = true;
      this._addSelectors(stylesheets, mutations, completion);
    }
  },

  onLoad(event)
  {
    let stylesheet = event.target.sheet;
    if (stylesheet)
      this.queueFiltering([stylesheet]);
  },

  observe(mutations)
  {
    this.queueFiltering(null, mutations);
  },

  apply(patterns)
  {
    this.patterns = [];
    for (let pattern of patterns)
    {
      let selectors = this.parseSelector(pattern.selector);
      if (selectors != null && selectors.length > 0)
        this.patterns.push(new Pattern(selectors, pattern.text));
    }

    if (this.patterns.length > 0)
    {
      this.queueFiltering();
      this.observer.observe(
        this.document,
        {
          childList: true,
          attributes: shouldObserveAttributes(this.patterns),
          characterData: shouldObserveCharacterData(this.patterns),
          subtree: true
        }
      );
      this.document.addEventListener("load", this.onLoad.bind(this), true);
    }
  }
};

exports.ElemHideEmulation = ElemHideEmulation;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 * This file is part of Adblock Plus <https://adblockplus.org/>,
 * Copyright (C) 2006-present eyeo GmbH
 *
 * Adblock Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Adblock Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adblock Plus.  If not, see <http://www.gnu.org/licenses/>.
 */



function desc(properties)
{
  let descriptor = {};
  let keys = Object.keys(properties);

  for (let key of keys)
    descriptor[key] = Object.getOwnPropertyDescriptor(properties, key);

  return descriptor;
}
exports.desc = desc;

function extend(cls, properties)
{
  return Object.create(cls.prototype, desc(properties));
}
exports.extend = extend;

function findIndex(iterable, callback, thisArg)
{
  let index = 0;
  for (let item of iterable)
  {
    if (callback.call(thisArg, item))
      return index;

    index++;
  }

  return -1;
}
exports.findIndex = findIndex;

function indexOf(iterable, searchElement)
{
  return findIndex(iterable, item => item === searchElement);
}
exports.indexOf = indexOf;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 * This file is part of Adblock Plus <https://adblockplus.org/>,
 * Copyright (C) 2006-present eyeo GmbH
 *
 * Adblock Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Adblock Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adblock Plus.  If not, see <http://www.gnu.org/licenses/>.
 */



let randomEventName = "abp-request-" + Math.random().toString(36).substr(2);

// Proxy "should we block?" messages from checkRequest inside the injected
// code to the background page and back again.
document.addEventListener(randomEventName, event =>
{
  let {url} = event.detail;

  browser.runtime.sendMessage({
    type: "request.blockedByRTCWrapper",
    url
  }, block =>
  {
    document.dispatchEvent(new CustomEvent(
      randomEventName + "-" + url, {detail: block}
    ));
  });
});

function injected(eventName, injectedIntoContentWindow)
{
  let checkRequest;

  /*
   * Frame context wrapper
   *
   * For some edge-cases Chrome will not run content scripts inside of frames.
   * Website have started to abuse this fact to access unwrapped APIs via a
   * frame's contentWindow (#4586, 5207). Therefore until Chrome runs content
   * scripts consistently for all frames we must take care to (re)inject our
   * wrappers when the contentWindow is accessed.
   */
  let injectedToString = Function.prototype.toString.bind(injected);
  let injectedFrames = new WeakSet();
  let injectedFramesAdd = WeakSet.prototype.add.bind(injectedFrames);
  let injectedFramesHas = WeakSet.prototype.has.bind(injectedFrames);

  function injectIntoContentWindow(contentWindow)
  {
    if (contentWindow && !injectedFramesHas(contentWindow))
    {
      injectedFramesAdd(contentWindow);
      try
      {
        contentWindow[eventName] = checkRequest;
        contentWindow.eval(
          "(" + injectedToString() + ")('" + eventName + "', true);"
        );
        delete contentWindow[eventName];
      }
      catch (e) {}
    }
  }

  for (let element of [HTMLFrameElement, HTMLIFrameElement, HTMLObjectElement])
  {
    let contentDocumentDesc = Object.getOwnPropertyDescriptor(
      element.prototype, "contentDocument"
    );
    let contentWindowDesc = Object.getOwnPropertyDescriptor(
      element.prototype, "contentWindow"
    );

    // Apparently in HTMLObjectElement.prototype.contentWindow does not exist
    // in older versions of Chrome such as 42.
    if (!contentWindowDesc)
      continue;

    let getContentDocument = Function.prototype.call.bind(
      contentDocumentDesc.get
    );
    let getContentWindow = Function.prototype.call.bind(
      contentWindowDesc.get
    );

    contentWindowDesc.get = function()
    {
      let contentWindow = getContentWindow(this);
      injectIntoContentWindow(contentWindow);
      return contentWindow;
    };
    contentDocumentDesc.get = function()
    {
      injectIntoContentWindow(getContentWindow(this));
      return getContentDocument(this);
    };
    Object.defineProperty(element.prototype, "contentWindow",
                          contentWindowDesc);
    Object.defineProperty(element.prototype, "contentDocument",
                          contentDocumentDesc);
  }

  /*
   * Shadow root getter wrapper
   *
   * After creating our shadowRoot we must wrap the getter to prevent the
   * website from accessing it (#4191, #4298). This is required as a
   * workaround for the lack of user style support in Chrome.
   * See https://bugs.chromium.org/p/chromium/issues/detail?id=632009&desc=2
   */
  if ("shadowRoot" in Element.prototype)
  {
    let ourShadowRoot = document.documentElement.shadowRoot;
    if (ourShadowRoot)
    {
      let desc = Object.getOwnPropertyDescriptor(Element.prototype,
                                                 "shadowRoot");
      let shadowRoot = Function.prototype.call.bind(desc.get);

      Object.defineProperty(Element.prototype, "shadowRoot", {
        configurable: true, enumerable: true, get()
        {
          let thisShadow = shadowRoot(this);
          return thisShadow == ourShadowRoot ? null : thisShadow;
        }
      });
    }
  }

  /*
   * RTCPeerConnection wrapper
   *
   * The webRequest API in Chrome does not yet allow the blocking of
   * WebRTC connections.
   * See https://bugs.chromium.org/p/chromium/issues/detail?id=707683
   */
  let RealCustomEvent = window.CustomEvent;

  // If we've been injected into a frame via contentWindow then we can simply
  // grab the copy of checkRequest left for us by the parent document. Otherwise
  // we need to set it up now, along with the event handling functions.
  if (injectedIntoContentWindow)
    checkRequest = window[eventName];
  else
  {
    let addEventListener = document.addEventListener.bind(document);
    let dispatchEvent = document.dispatchEvent.bind(document);
    let removeEventListener = document.removeEventListener.bind(document);
    checkRequest = (url, callback) =>
    {
      let incomingEventName = eventName + "-" + url;

      function listener(event)
      {
        callback(event.detail);
        removeEventListener(incomingEventName, listener);
      }
      addEventListener(incomingEventName, listener);

      dispatchEvent(new RealCustomEvent(eventName, {detail: {url}}));
    };
  }

  // Only to be called before the page's code, not hardened.
  function copyProperties(src, dest, properties)
  {
    for (let name of properties)
    {
      if (src.hasOwnProperty(name))
      {
        Object.defineProperty(dest, name,
                              Object.getOwnPropertyDescriptor(src, name));
      }
    }
  }

  let RealRTCPeerConnection = window.RTCPeerConnection ||
                              window.webkitRTCPeerConnection;

  // Firefox has the option (media.peerconnection.enabled) to disable WebRTC
  // in which case RealRTCPeerConnection is undefined.
  if (typeof RealRTCPeerConnection != "undefined")
  {
    let closeRTCPeerConnection = Function.prototype.call.bind(
      RealRTCPeerConnection.prototype.close
    );
    let RealArray = Array;
    let RealString = String;
    let {create: createObject, defineProperty} = Object;

    let normalizeUrl = url =>
    {
      if (typeof url != "undefined")
        return RealString(url);
    };

    let safeCopyArray = (originalArray, transform) =>
    {
      if (originalArray == null || typeof originalArray != "object")
        return originalArray;

      let safeArray = RealArray(originalArray.length);
      for (let i = 0; i < safeArray.length; i++)
      {
        defineProperty(safeArray, i, {
          configurable: false, enumerable: false, writable: false,
          value: transform(originalArray[i])
        });
      }
      defineProperty(safeArray, "length", {
        configurable: false, enumerable: false, writable: false,
        value: safeArray.length
      });
      return safeArray;
    };

    // It would be much easier to use the .getConfiguration method to obtain
    // the normalized and safe configuration from the RTCPeerConnection
    // instance. Unfortunately its not implemented as of Chrome unstable 59.
    // See https://www.chromestatus.com/feature/5271355306016768
    let protectConfiguration = configuration =>
    {
      if (configuration == null || typeof configuration != "object")
        return configuration;

      let iceServers = safeCopyArray(
        configuration.iceServers,
        iceServer =>
        {
          let {url, urls} = iceServer;

          // RTCPeerConnection doesn't iterate through pseudo Arrays of urls.
          if (typeof urls != "undefined" && !(urls instanceof RealArray))
            urls = [urls];

          return createObject(iceServer, {
            url: {
              configurable: false, enumerable: false, writable: false,
              value: normalizeUrl(url)
            },
            urls: {
              configurable: false, enumerable: false, writable: false,
              value: safeCopyArray(urls, normalizeUrl)
            }
          });
        }
      );

      return createObject(configuration, {
        iceServers: {
          configurable: false, enumerable: false, writable: false,
          value: iceServers
        }
      });
    };

    let checkUrl = (peerconnection, url) =>
    {
      checkRequest(url, blocked =>
      {
        if (blocked)
        {
          // Calling .close() throws if already closed.
          try
          {
            closeRTCPeerConnection(peerconnection);
          }
          catch (e) {}
        }
      });
    };

    let checkConfiguration = (peerconnection, configuration) =>
    {
      if (configuration && configuration.iceServers)
      {
        for (let i = 0; i < configuration.iceServers.length; i++)
        {
          let iceServer = configuration.iceServers[i];
          if (iceServer)
          {
            if (iceServer.url)
              checkUrl(peerconnection, iceServer.url);

            if (iceServer.urls)
            {
              for (let j = 0; j < iceServer.urls.length; j++)
                checkUrl(peerconnection, iceServer.urls[j]);
            }
          }
        }
      }
    };

    // Chrome unstable (tested with 59) has already implemented
    // setConfiguration, so we need to wrap that if it exists too.
    // https://www.chromestatus.com/feature/5596193748942848
    if (RealRTCPeerConnection.prototype.setConfiguration)
    {
      let realSetConfiguration = Function.prototype.call.bind(
        RealRTCPeerConnection.prototype.setConfiguration
      );

      RealRTCPeerConnection.prototype.setConfiguration = function(configuration)
      {
        configuration = protectConfiguration(configuration);

        // Call the real method first, so that validates the configuration for
        // us. Also we might as well since checkRequest is asynchronous anyway.
        realSetConfiguration(this, configuration);
        checkConfiguration(this, configuration);
      };
    }

    let WrappedRTCPeerConnection = function(...args)
    {
      if (!(this instanceof WrappedRTCPeerConnection))
        return RealRTCPeerConnection();

      let configuration = protectConfiguration(args[0]);

      // Since the old webkitRTCPeerConnection constructor takes an optional
      // second argument we need to take care to pass that through. Necessary
      // for older versions of Chrome such as 49.
      let constraints = undefined;
      if (args.length > 1)
        constraints = args[1];

      let peerconnection = new RealRTCPeerConnection(configuration,
                                                     constraints);
      checkConfiguration(peerconnection, configuration);
      return peerconnection;
    };

    WrappedRTCPeerConnection.prototype = RealRTCPeerConnection.prototype;

    let boundWrappedRTCPeerConnection = WrappedRTCPeerConnection.bind();
    copyProperties(RealRTCPeerConnection, boundWrappedRTCPeerConnection,
                   ["generateCertificate", "name", "prototype"]);
    RealRTCPeerConnection.prototype.constructor = boundWrappedRTCPeerConnection;

    if ("RTCPeerConnection" in window)
      window.RTCPeerConnection = boundWrappedRTCPeerConnection;
    if ("webkitRTCPeerConnection" in window)
      window.webkitRTCPeerConnection = boundWrappedRTCPeerConnection;
  }
}

if (document instanceof HTMLDocument)
{
  let sandbox = window.frameElement &&
                window.frameElement.getAttribute("sandbox");

  if (typeof sandbox != "string" || /(^|\s)allow-scripts(\s|$)/i.test(sandbox))
  {
    let script = document.createElement("script");
    script.type = "application/javascript";
    script.async = false;
    // Firefox 58 only bypasses site CSPs when assigning to 'src'.
    let url = URL.createObjectURL(new Blob([
      "(" + injected + ")('" + randomEventName + "');"
    ]));
    script.src = url;
    document.documentElement.appendChild(script);
    document.documentElement.removeChild(script);
    URL.revokeObjectURL(url);
  }
}


/***/ })
/******/ ]);
//# sourceMappingURL=include.preload.js.map