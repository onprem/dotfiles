/* eslint-disable */(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

/* globals checkShareResource, getDocLink, i18nFormatDateTime, openSharePopup,
           setLinks, E */

"use strict";

let subscriptionsMap = Object.create(null);
let filtersMap = Object.create(null);
let collections = Object.create(null);
let acceptableAdsUrl = null;
let acceptableAdsPrivacyUrl = null;
let isCustomFiltersLoaded = false;
let additionalSubscriptions = [];
let {getMessage} = browser.i18n;
let {setElementText} = ext.i18n;
let customFilters = [];
let filterErrors = new Map([
  ["synchronize_invalid_url",
   "options_filterList_lastDownload_invalidURL"],
  ["synchronize_connection_error",
   "options_filterList_lastDownload_connectionError"],
  ["synchronize_invalid_data",
   "options_filterList_lastDownload_invalidData"],
  ["synchronize_checksum_mismatch",
   "options_filterList_lastDownload_checksumMismatch"]
]);
const timestampUI = Symbol();
const whitelistedDomainRegexp = /^@@\|\|([^/:]+)\^\$document$/;
// Period of time in milliseconds
const minuteInMs = 60000;
const hourInMs = 3600000;
const fullDayInMs = 86400000;

function Collection(details)
{
  this.details = details;
  this.items = [];
}

Collection.prototype._setEmpty = function(table, detail, removeEmpty)
{
  if (removeEmpty)
  {
    let placeholders = table.querySelectorAll(".empty-placeholder");
    for (let placeholder of placeholders)
      table.removeChild(placeholder);

    execAction(detail.removeEmptyAction, table);
  }
  else
  {
    let {emptyTexts = []} = detail;
    for (let text of emptyTexts)
    {
      let placeholder = document.createElement("li");
      placeholder.className = "empty-placeholder";
      placeholder.textContent = getMessage(text);
      table.appendChild(placeholder);
    }

    execAction(detail.setEmptyAction, table);
  }
};

Collection.prototype._createElementQuery = function(item)
{
  let access = (item.url || item.text).replace(/'/g, "\\'");
  return function(container)
  {
    return container.querySelector("[data-access='" + access + "']");
  };
};

Collection.prototype._getItemTitle = function(item, i)
{
  if (this.details[i].getTitleFunction)
    return this.details[i].getTitleFunction(item);
  return item.title || item.url || item.text;
};

Collection.prototype._sortItems = function()
{
  this.items.sort((a, b) =>
  {
    // Make sure that Acceptable Ads is always last, since it cannot be
    // disabled, but only be removed. That way it's grouped together with
    // the "Own filter list" which cannot be disabled either at the bottom
    // of the filter lists in the Advanced tab.
    if (isAcceptableAds(a.url))
      return 1;
    if (isAcceptableAds(b.url))
      return -1;

    // Make sure that newly added entries always appear on top in descending
    // chronological order
    let aTimestamp = a[timestampUI] || 0;
    let bTimestamp = b[timestampUI] || 0;
    if (aTimestamp || bTimestamp)
      return bTimestamp - aTimestamp;

    let aTitle = this._getItemTitle(a, 0).toLowerCase();
    let bTitle = this._getItemTitle(b, 0).toLowerCase();
    return aTitle.localeCompare(bTitle);
  });
};

Collection.prototype.addItem = function(item)
{
  if (this.items.indexOf(item) >= 0)
    return;

  this.items.push(item);
  this._sortItems();
  for (let j = 0; j < this.details.length; j++)
  {
    let detail = this.details[j];
    let table = E(detail.id);
    let template = table.querySelector("template");
    let listItem = document.createElement("li");
    listItem.appendChild(document.importNode(template.content, true));
    listItem.setAttribute("aria-label", this._getItemTitle(item, j));
    listItem.setAttribute("data-access", item.url || item.text);
    listItem.setAttribute("role", "section");

    let tooltip = listItem.querySelector("[data-tooltip]");
    if (tooltip)
    {
      let tooltipId = tooltip.getAttribute("data-tooltip");
      tooltipId = tooltipId.replace("%value%", item.recommended);
      if (getMessage(tooltipId))
      {
        tooltip.setAttribute("data-tooltip", tooltipId);
      }
    }

    for (let control of listItem.querySelectorAll(".control"))
    {
      if (control.hasAttribute("title"))
      {
        let titleValue = getMessage(control.getAttribute("title"));
        control.setAttribute("title", titleValue);
      }
    }

    this._setEmpty(table, detail, true);
    if (table.children.length > 0)
      table.insertBefore(listItem, table.children[this.items.indexOf(item)]);
    else
      table.appendChild(listItem);

    this.updateItem(item);
  }
  return length;
};

Collection.prototype.removeItem = function(item)
{
  let index = this.items.indexOf(item);
  if (index == -1)
    return;

  this.items.splice(index, 1);
  let getListElement = this._createElementQuery(item);
  for (let detail of this.details)
  {
    let table = E(detail.id);
    let element = getListElement(table);

    // Element gets removed so make sure to handle focus appropriately
    let control = element.querySelector(".control");
    if (control && control == document.activeElement)
    {
      if (!focusNextElement(element.parentElement, control))
      {
        // Fall back to next focusable element within same tab or dialog
        let focusableElement = element.parentElement;
        while (focusableElement)
        {
          if (focusableElement.classList.contains("tab-content") ||
              focusableElement.classList.contains("dialog-content"))
            break;

          focusableElement = focusableElement.parentElement;
        }
        focusNextElement(focusableElement || document, control);
      }
    }

    element.parentElement.removeChild(element);
    if (this.items.length == 0)
      this._setEmpty(table, detail);
  }
};

Collection.prototype.updateItem = function(item)
{
  let oldIndex = this.items.indexOf(item);
  this._sortItems();
  let access = (item.url || item.text).replace(/'/g, "\\'");
  for (let i = 0; i < this.details.length; i++)
  {
    let table = E(this.details[i].id);
    let element = table.querySelector("[data-access='" + access + "']");
    if (!element)
      continue;

    let title = this._getItemTitle(item, i);
    let displays = element.querySelectorAll("[data-display]");
    for (let j = 0; j < displays.length; j++)
    {
      if (item[displays[j].dataset.display])
        displays[j].textContent = item[displays[j].dataset.display];
      else
        displays[j].textContent = title;
    }

    element.setAttribute("aria-label", title);
    if (this.details[i].searchable)
      element.setAttribute("data-search", title.toLowerCase());
    let controls = element.querySelectorAll(".control[role='checkbox']");
    for (let control of controls)
    {
      control.setAttribute("aria-checked", item.disabled == false);
      if (isAcceptableAds(item.url) && this == collections.filterLists)
        control.disabled = !item.disabled;
    }
    if (additionalSubscriptions.includes(item.url))
    {
      element.classList.add("preconfigured");
      let disablePreconfigures =
        element.querySelectorAll("[data-disable~='preconfigured']");
      for (let disablePreconfigure of disablePreconfigures)
        disablePreconfigure.disabled = true;
    }

    let lastUpdateElement = element.querySelector(".last-update");
    if (lastUpdateElement)
    {
      let message = element.querySelector(".message");
      if (item.isDownloading)
      {
        let text = getMessage("options_filterList_lastDownload_inProgress");
        message.textContent = text;
        element.classList.add("show-message");
      }
      else if (item.downloadStatus != "synchronize_ok")
      {
        let error = filterErrors.get(item.downloadStatus);
        if (error)
          message.textContent = getMessage(error);
        else
          message.textContent = item.downloadStatus;
        element.classList.add("show-message");
      }
      else if (item.lastDownload > 0)
      {
        let lastUpdate = item.lastDownload * 1000;
        let sinceUpdate = Date.now() - lastUpdate;
        if (sinceUpdate > fullDayInMs)
        {
          let lastUpdateDate = new Date(item.lastDownload * 1000);
          let monthName = lastUpdateDate.toLocaleString(undefined,
            {month: "short"});
          let day = lastUpdateDate.getDate();
          day = day < 10 ? "0" + day : day;
          lastUpdateElement.textContent = day + " " + monthName + " " +
            lastUpdateDate.getFullYear();
        }
        else if (sinceUpdate > hourInMs)
        {
          lastUpdateElement.textContent =
            getMessage("options_filterList_hours");
        }
        else if (sinceUpdate > minuteInMs)
        {
          lastUpdateElement.textContent =
            getMessage("options_filterList_minutes");
        }
        else
        {
          lastUpdateElement.textContent =
            getMessage("options_filterList_now");
        }
        element.classList.remove("show-message");
      }
    }

    let websiteElement = element.querySelector(".context-menu .website");
    if (websiteElement)
    {
      if (item.homepage)
        websiteElement.setAttribute("href", item.homepage);
      else
        websiteElement.setAttribute("aria-hidden", true);
    }

    let sourceElement = element.querySelector(".context-menu .source");
    if (sourceElement)
      sourceElement.setAttribute("href", item.url);

    let newIndex = this.items.indexOf(item);
    if (oldIndex != newIndex)
      table.insertBefore(element, table.childNodes[newIndex]);
  }
};

Collection.prototype.clearAll = function()
{
  this.items = [];
  for (let detail of this.details)
  {
    let table = E(detail.id);
    let element = table.firstChild;
    while (element)
    {
      if (element.tagName == "LI" && !element.classList.contains("static"))
        table.removeChild(element);
      element = element.nextElementSibling;
    }

    this._setEmpty(table, detail);
  }
};

function focusNextElement(container, currentElement)
{
  let focusables = container.querySelectorAll("a, button, input, .control");
  focusables = Array.prototype.slice.call(focusables);
  let index = focusables.indexOf(currentElement);
  index += (index == focusables.length - 1) ? -1 : 1;

  let nextElement = focusables[index];
  if (!nextElement)
    return false;

  nextElement.focus();
  return true;
}

collections.protection = new Collection([
  {
    id: "recommend-protection-list-table"
  }
]);
collections.langs = new Collection([
  {
    id: "blocking-languages-table",
    emptyTexts: ["options_language_empty"],
    getTitleFunction: getLanguageTitle
  }
]);
collections.allLangs = new Collection([
  {
    id: "all-lang-table-add",
    emptyTexts: ["options_dialog_language_other_empty"],
    getTitleFunction: getLanguageTitle
  }
]);
collections.more = new Collection([
  {
    id: "more-list-table",
    setEmptyAction: "hide-more-filters-section",
    removeEmptyAction: "show-more-filters-section"
  }
]);
collections.whitelist = new Collection([
  {
    id: "whitelisting-table",
    emptyTexts: ["options_whitelist_empty_1", "options_whitelist_empty_2"]
  }
]);
collections.filterLists = new Collection([
  {
    id: "all-filter-lists-table",
    emptyTexts: ["options_filterList_empty"]
  }
]);

function addSubscription(subscription)
{
  let {disabled} = subscription;
  let collection = null;
  if (subscription.recommended)
  {
    if (subscription.recommended == "ads")
    {
      if (disabled == false)
        collection = collections.langs;

      collections.allLangs.addItem(subscription);
    }
    else
    {
      collection = collections.protection;
    }
  }
  else if (!isAcceptableAds(subscription.url) && disabled == false)
  {
    collection = collections.more;
  }

  if (collection)
    collection.addItem(subscription);

  subscriptionsMap[subscription.url] = subscription;
  updateTooltips();
}

function updateSubscription(subscription)
{
  for (let name in collections)
    collections[name].updateItem(subscription);

  if (subscription.recommended == "ads")
  {
    if (subscription.disabled)
      collections.langs.removeItem(subscription);
    else
      collections.langs.addItem(subscription);
  }
  else if (!subscription.recommended && !isAcceptableAds(subscription.url))
  {
    if (subscription.disabled == false)
    {
      collections.more.addItem(subscription);
      updateTooltips();
    }
    else
    {
      collections.more.removeItem(subscription);
    }
  }
}

function updateFilter(filter)
{
  let match = filter.text.match(whitelistedDomainRegexp);
  if (match && !filtersMap[filter.text])
  {
    filter.title = match[1];
    collections.whitelist.addItem(filter);
    if (isCustomFiltersLoaded)
    {
      let text = getMessage("options_whitelist_notification", [filter.title]);
      showNotification(text);
    }
  }
  else
  {
    customFilters.push(filter.text);
    if (isCustomFiltersLoaded)
      updateCustomFiltersUi();
  }

  filtersMap[filter.text] = filter;
}

function loadCustomFilters(filters)
{
  for (let filter of filters)
    updateFilter(filter);

  setCustomFiltersView("read");
}

function removeCustomFilter(text)
{
  let index = customFilters.indexOf(text);
  if (index >= 0)
    customFilters.splice(index, 1);

  updateCustomFiltersUi();
}

function updateCustomFiltersUi()
{
  let customFiltersListElement = E("custom-filters-raw");
  customFiltersListElement.value = customFilters.join("\n");
}

function getLanguageTitle(item)
{
  let title = item.specialization;
  if (item.originalTitle && item.originalTitle.indexOf("+EasyList") > -1)
    title += " + " + getMessage("options_english");
  return title;
}

function loadRecommendations()
{
  fetch("subscriptions.xml")
    .then((response) =>
    {
      return response.text();
    })
    .then((text) =>
    {
      let doc = new DOMParser().parseFromString(text, "application/xml");
      let elements = doc.documentElement.getElementsByTagName("subscription");
      for (let element of elements)
      {
        let type = element.getAttribute("type");
        let subscription = {
          disabled: true,
          downloadStatus: null,
          homepage: null,
          specialization: element.getAttribute("specialization"),
          originalTitle: element.getAttribute("title"),
          recommended: type,
          url: element.getAttribute("url")
        };

        if (subscription.recommended != "ads")
        {
          type = type.replace(/\W/g, "_");
          subscription.title = getMessage("common_feature_" +
                                          type + "_title");
        }

        addSubscription(subscription);
      }
    });
}

function findParentData(element, dataName, returnElement)
{
  element = element.closest(`[data-${dataName}]`);
  if (!element)
    return null;
  if (returnElement)
    return element;
  return element.getAttribute(`data-${dataName}`);
}

function sendMessageHandleErrors(message, onSuccess)
{
  browser.runtime.sendMessage(message, (errors) =>
  {
    if (errors.length > 0)
      alert(errors.join("\n"));
    else if (onSuccess)
      onSuccess();
  });
}

function switchTab(id)
{
  location.hash = id;
}

function execAction(action, element)
{
  if (element.getAttribute("aria-disabled") == "true")
    return;

  switch (action)
  {
    case "add-domain-exception":
      addWhitelistedDomain();
      break;
    case "add-language-subscription":
      addEnableSubscription(findParentData(element, "access", false));
      break;
    case "add-predefined-subscription": {
      let dialog = E("dialog-content-predefined");
      let title = dialog.querySelector("h3").textContent;
      let url = dialog.querySelector(".url").textContent;
      addEnableSubscription(url, title);
      closeDialog();
      break;
    }
    case "cancel-custom-filters":
      setCustomFiltersView("read");
      break;
    case "change-language-subscription":
      for (let key in subscriptionsMap)
      {
        let subscription = subscriptionsMap[key];
        let subscriptionType = subscription.recommended;
        if (subscriptionType == "ads" && subscription.disabled == false)
        {
          browser.runtime.sendMessage({
            type: "subscriptions.remove",
            url: subscription.url
          });
          browser.runtime.sendMessage({
            type: "subscriptions.add",
            url: findParentData(element, "access", false)
          });
          break;
        }
      }
      break;
    case "close-dialog":
      closeDialog();
      break;
    case "edit-custom-filters":
      setCustomFiltersView("write");
      break;
    case "hide-more-filters-section":
      E("more-filters").setAttribute("aria-hidden", true);
      break;
    case "hide-notification":
      hideNotification();
      break;
    case "import-subscription": {
      let url = E("blockingList-textbox").value;
      addEnableSubscription(url);
      closeDialog();
      break;
    }
    case "open-context-menu": {
      let listItem = findParentData(element, "access", true);
      if (listItem && !listItem.classList.contains("show-context-menu"))
        listItem.classList.add("show-context-menu");
      break;
    }
    case "open-dialog": {
      let dialog = findParentData(element, "dialog", false);
      openDialog(dialog);
      break;
    }
    case "remove-filter":
      browser.runtime.sendMessage({
        type: "filters.remove",
        text: findParentData(element, "access", false)
      });
      break;
    case "remove-subscription":
      browser.runtime.sendMessage({
        type: "subscriptions.remove",
        url: findParentData(element, "access", false)
      });
      break;
    case "save-custom-filters":
      sendMessageHandleErrors({
        type: "filters.importRaw",
        text: E("custom-filters-raw").value,
        removeExisting: true
      },
      () =>
      {
        setCustomFiltersView("read");
      });
      break;
    case "show-more-filters-section":
      E("more-filters").setAttribute("aria-hidden", false);
      break;
    case "switch-acceptable-ads":
      let value = element.value || element.dataset.value;
      // User check the checkbox
      let shouldCheck = element.getAttribute("aria-checked") != "true";
      let installAcceptableAds = false;
      let installAcceptableAdsPrivacy = false;
      // Acceptable Ads checkbox clicked
      if (value == "ads")
      {
        installAcceptableAds = shouldCheck;
      }
      // Privacy Friendly Acceptable Ads checkbox clicked
      else
      {
        installAcceptableAdsPrivacy = shouldCheck;
        installAcceptableAds = !shouldCheck;
      }

      browser.runtime.sendMessage({
        type: installAcceptableAds ? "subscriptions.add" :
          "subscriptions.remove",
        url: acceptableAdsUrl
      });
      browser.runtime.sendMessage({
        type: installAcceptableAdsPrivacy ? "subscriptions.add" :
          "subscriptions.remove",
        url: acceptableAdsPrivacyUrl
      });
      break;
    case "switch-tab":
      switchTab(element.getAttribute("href").substr(1));
      break;
    case "toggle-disable-subscription":
      browser.runtime.sendMessage({
        type: "subscriptions.toggle",
        keepInstalled: true,
        url: findParentData(element, "access", false)
      });
      break;
    case "toggle-pref":
      browser.runtime.sendMessage({
        type: "prefs.toggle",
        key: findParentData(element, "pref", false)
      });
      break;
    case "toggle-remove-subscription":
      let subscriptionUrl = findParentData(element, "access", false);
      if (element.getAttribute("aria-checked") == "true")
      {
        browser.runtime.sendMessage({
          type: "subscriptions.remove",
          url: subscriptionUrl
        });
      }
      else
        addEnableSubscription(subscriptionUrl);
      break;
    case "update-all-subscriptions":
      browser.runtime.sendMessage({
        type: "subscriptions.update"
      });
      break;
    case "update-subscription":
      browser.runtime.sendMessage({
        type: "subscriptions.update",
        url: findParentData(element, "access", false)
      });
      break;
    case "validate-import-subscription":
      let form = findParentData(element, "validation", true);
      if (!form)
        return;

      if (form.checkValidity())
      {
        addEnableSubscription(E("import-list-url").value,
          E("import-list-title").value);
        form.reset();
        closeDialog();
      }
      else
      {
        form.querySelector(":invalid").focus();
      }
      break;
  }
}

function setCustomFiltersView(mode)
{
  let customFiltersElement = E("custom-filters-raw");
  updateCustomFiltersUi();
  if (mode == "read")
  {
    customFiltersElement.disabled = true;
    if (!customFiltersElement.value)
    {
      setCustomFiltersView("empty");
      return;
    }
  }
  else if (mode == "write")
  {
    customFiltersElement.disabled = false;
  }

  E("custom-filters").dataset.mode = mode;
}

function onClick(e)
{
  let context = document.querySelector(".show-context-menu");
  if (context)
    context.classList.remove("show-context-menu");

  let actions = findParentData(e.target, "action", false);
  if (!actions)
    return;

  actions = actions.split(",");
  for (let action of actions)
  {
    execAction(action, e.target);
  }
}

function getKey(e)
{
  // e.keyCode has been deprecated so we attempt to use e.key
  if ("key" in e)
    return e.key;
  return getKey.keys[e.keyCode];
}
getKey.keys = {
  9: "Tab",
  13: "Enter",
  27: "Escape",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown"
};

function onKeyUp(e)
{
  let key = getKey(e);
  let element = document.activeElement;
  if (!key || !element)
    return;

  let container = findParentData(element, "action", true);
  if (!container || !container.hasAttribute("data-keys"))
    return;

  let keys = container.getAttribute("data-keys").split(" ");
  if (keys.indexOf(key) < 0)
    return;

  if (element.getAttribute("role") == "tab")
  {
    let parent = element.parentElement;
    if (key == "ArrowLeft" || key == "ArrowUp")
      parent = parent.previousElementSibling || container.lastElementChild;
    else if (key == "ArrowRight" || key == "ArrowDown")
      parent = parent.nextElementSibling || container.firstElementChild;
    element = parent.firstElementChild;
  }

  let actions = container.getAttribute("data-action").split(",");
  for (let action of actions)
  {
    execAction(action, element);
  }
}

function selectTabItem(tabId, container, focus)
{
  // Show tab content
  document.body.setAttribute("data-tab", tabId);

  // Select tab
  let tabList = container.querySelector("[role='tablist']");
  if (!tabList)
    return null;

  let previousTab = tabList.querySelector("[aria-selected]");
  previousTab.removeAttribute("aria-selected");
  previousTab.setAttribute("tabindex", -1);

  let tab = tabList.querySelector("a[href='#" + tabId + "']");
  tab.setAttribute("aria-selected", true);
  tab.setAttribute("tabindex", 0);

  let tabContentId = tab.getAttribute("aria-controls");
  let tabContent = document.getElementById(tabContentId);

  if (tab && focus)
    tab.focus();

  return tabContent;
}

function onHashChange()
{
  let hash = location.hash.substr(1);
  if (!hash)
    return;

  // Select tab and parent tabs
  let tabIds = hash.split("-");
  let tabContent = document.body;
  for (let i = 0; i < tabIds.length; i++)
  {
    let tabId = tabIds.slice(0, i + 1).join("-");
    tabContent = selectTabItem(tabId, tabContent, true);
    if (!tabContent)
      break;
  }
}

function onDOMLoaded()
{
  populateLists();

  // Initialize navigation sidebar
  browser.runtime.sendMessage({
    type: "app.get",
    what: "addonVersion"
  },
  (addonVersion) =>
  {
    E("abp-version").textContent = getMessage("options_dialog_about_version",
      [addonVersion]);
  });

  updateTooltips();

  // Initialize interactive UI elements
  document.body.addEventListener("click", onClick, false);
  document.body.addEventListener("keyup", onKeyUp, false);
  let exampleValue = getMessage("options_whitelist_placeholder_example",
    ["www.example.com"]);
  E("whitelisting-textbox").setAttribute("placeholder", exampleValue);
  E("whitelisting-textbox").addEventListener("keyup", (e) =>
  {
    E("whitelisting-add-button").disabled = !e.target.value;
  }, false);

  // General tab
  getDocLink("contribute", (link) =>
  {
    E("contribute").href = link;
  });
  getDocLink("acceptable_ads_criteria", (link) =>
  {
    setLinks("enable-acceptable-ads-description", link);
  });
  setElementText(E("tracking-warning-1"), "options_tracking_warning_1",
    [getMessage("common_feature_privacy_title"),
     getMessage("options_acceptableAds_ads_label")]);
  setElementText(E("tracking-warning-3"), "options_tracking_warning_3",
    [getMessage("options_acceptableAds_privacy_label")]);

  getDocLink("privacy_friendly_ads", (link) =>
  {
    E("enable-acceptable-ads-privacy-description").href = link;
  });
  getDocLink("adblock_plus_{browser}_dnt", url =>
  {
    setLinks("dnt", url);
  });

  // Whitelisted tab
  getDocLink("whitelist", (link) =>
  {
    E("whitelist-learn-more").href = link;
  });

  // Advanced tab
  let customize = document.querySelectorAll("#customize li[data-pref]");
  customize = Array.prototype.map.call(customize, (checkbox) =>
  {
    return checkbox.getAttribute("data-pref");
  });
  for (let key of customize)
  {
    getPref(key, (value) =>
    {
      onPrefMessage(key, value, true);
    });
  }
  browser.runtime.sendMessage({
    type: "app.get",
    what: "features"
  },
  (features) =>
  {
    hidePref("show_devtools_panel", !features.devToolsPanel);
  });

  getDocLink("filterdoc", (link) =>
  {
    E("link-filters").setAttribute("href", link);
  });

  getDocLink("subscriptions", (link) =>
  {
    E("filter-lists-learn-more").setAttribute("href", link);
  });

  E("custom-filters-raw").setAttribute("placeholder",
    getMessage("options_customFilters_edit_placeholder", ["/ads/track/*"]));

  // Help tab
  getDocLink("adblock_plus_report_bug", (link) =>
  {
    setLinks("report-bug", link);
  });
  getDocLink("{browser}_support", url =>
  {
    setLinks("visit-forum", url);
  });
  getDocLink("social_twitter", (link) =>
  {
    E("twitter").setAttribute("href", link);
  });
  getDocLink("social_facebook", (link) =>
  {
    E("facebook").setAttribute("href", link);
  });
  getDocLink("social_gplus", (link) =>
  {
    E("google-plus").setAttribute("href", link);
  });
  getDocLink("social_weibo", (link) =>
  {
    E("weibo").setAttribute("href", link);
  });

  E("dialog").addEventListener("keydown", function(e)
  {
    switch (getKey(e))
    {
      case "Escape":
        closeDialog();
        break;
      case "Tab":
        if (e.shiftKey)
        {
          if (e.target.classList.contains("focus-first"))
          {
            e.preventDefault();
            this.querySelector(".focus-last").focus();
          }
        }
        else if (e.target.classList.contains("focus-last"))
        {
          e.preventDefault();
          this.querySelector(".focus-first").focus();
        }
        break;
    }
  }, false);

  onHashChange();
}

let focusedBeforeDialog = null;
function openDialog(name)
{
  let dialog = E("dialog");
  dialog.setAttribute("aria-hidden", false);
  dialog.setAttribute("aria-labelledby", "dialog-title-" + name);
  document.body.setAttribute("data-dialog", name);

  let defaultFocus = document.querySelector(
    "#dialog-content-" + name + " .default-focus"
  );
  if (!defaultFocus)
    defaultFocus = dialog.querySelector(".focus-first");
  focusedBeforeDialog = document.activeElement;
  defaultFocus.focus();
}

function closeDialog()
{
  let dialog = E("dialog");
  dialog.setAttribute("aria-hidden", true);
  dialog.removeAttribute("aria-labelledby");
  document.body.removeAttribute("data-dialog");
  focusedBeforeDialog.focus();
}

function showNotification(text)
{
  E("notification").setAttribute("aria-hidden", false);
  E("notification-text").textContent = text;
  setTimeout(hideNotification, 3000);
}

function hideNotification()
{
  E("notification").setAttribute("aria-hidden", true);
  E("notification-text").textContent = "";
}

function setAcceptableAds()
{
  let acceptableAdsForm = E("acceptable-ads");
  let acceptableAds = E("acceptable-ads-allow");
  let acceptableAdsPrivacy = E("acceptable-ads-privacy-allow");
  acceptableAdsForm.classList.remove("show-dnt-notification");
  acceptableAds.setAttribute("aria-checked", false);
  acceptableAdsPrivacy.setAttribute("aria-checked", false);
  acceptableAdsPrivacy.setAttribute("tabindex", 0);
  if (acceptableAdsUrl in subscriptionsMap &&
      !subscriptionsMap[acceptableAdsUrl].disabled)
  {
    acceptableAds.setAttribute("aria-checked", true);
    acceptableAdsPrivacy.setAttribute("aria-disabled", false);
  }
  else if (acceptableAdsPrivacyUrl in subscriptionsMap &&
          !subscriptionsMap[acceptableAdsPrivacyUrl].disabled)
  {
    acceptableAds.setAttribute("aria-checked", true);
    acceptableAdsPrivacy.setAttribute("aria-checked", true);
    acceptableAdsPrivacy.setAttribute("aria-disabled", false);

    // Edge uses window instead of navigator.
    // Prefer navigator first since it's the standard.
    if ((navigator.doNotTrack || window.doNotTrack) != 1)
      acceptableAdsForm.classList.add("show-dnt-notification");
  }
  else
  {
    // Using aria-disabled in order to keep the focus
    acceptableAdsPrivacy.setAttribute("aria-disabled", true);
    acceptableAdsPrivacy.setAttribute("tabindex", -1);
  }
}

function isAcceptableAds(url)
{
  return url == acceptableAdsUrl || url == acceptableAdsPrivacyUrl;
}

function hasPrivacyConflict()
{
  let acceptableAdsList = subscriptionsMap[acceptableAdsUrl];
  let privacyList = null;
  for (let url in subscriptionsMap)
  {
    let subscription = subscriptionsMap[url];
    if (subscription.recommended == "privacy")
    {
      privacyList = subscription;
      break;
    }
  }
  return acceptableAdsList && acceptableAdsList.disabled == false &&
    privacyList && privacyList.disabled == false;
}

function setPrivacyConflict()
{
  let acceptableAdsForm = E("acceptable-ads");
  if (hasPrivacyConflict())
  {
    getPref("ui_warn_tracking", (showTrackingWarning) =>
    {
      acceptableAdsForm.classList.toggle("show-warning", showTrackingWarning);
    });
  }
  else
  {
    acceptableAdsForm.classList.remove("show-warning");
  }
}

function populateLists()
{
  subscriptionsMap = Object.create(null);
  filtersMap = Object.create(null);

  // Empty collections and lists
  for (let property in collections)
    collections[property].clearAll();

  setCustomFiltersView("empty");
  browser.runtime.sendMessage({
    type: "subscriptions.get",
    special: true
  },
  (subscriptions) =>
  {
    let customFilterPromises = subscriptions.map(getSubscriptionFilters);
    Promise.all(customFilterPromises).then((filters) =>
    {
      loadCustomFilters([].concat(...filters));
      isCustomFiltersLoaded = true;
    });
  });
  loadRecommendations();
  browser.runtime.sendMessage({
    type: "prefs.get",
    key: "subscriptions_exceptionsurl"
  },
  (url) =>
  {
    acceptableAdsUrl = url;

    browser.runtime.sendMessage({
      type: "prefs.get",
      key: "subscriptions_exceptionsurl_privacy"
    },
    (urlPrivacy) =>
    {
      acceptableAdsPrivacyUrl = urlPrivacy;

      getPref("additional_subscriptions", (subscriptionUrls) =>
      {
        additionalSubscriptions = subscriptionUrls;

        // Load user subscriptions
        browser.runtime.sendMessage({
          type: "subscriptions.get",
          downloadable: true
        },
        (subscriptions) =>
        {
          for (let subscription of subscriptions)
            onSubscriptionMessage("added", subscription);

          setAcceptableAds();
        });
      });
    });
  });
}

function addWhitelistedDomain()
{
  let domain = E("whitelisting-textbox");
  for (let whitelistItem of collections.whitelist.items)
  {
    if (whitelistItem.title == domain.value)
    {
      whitelistItem[timestampUI] = Date.now();
      collections.whitelist.updateItem(whitelistItem);
      domain.value = "";
      break;
    }
  }
  const value = domain.value.trim();
  if (value)
  {
    const host = /^https?:\/\//i.test(value) ? new URL(value).host : value;
    sendMessageHandleErrors({
      type: "filters.add",
      text: "@@||" + host.toLowerCase() + "^$document"
    });
  }

  domain.value = "";
  E("whitelisting-add-button").disabled = true;
}

function addEnableSubscription(url, title, homepage)
{
  let messageType = null;
  let knownSubscription = subscriptionsMap[url];
  if (knownSubscription && knownSubscription.disabled == true)
    messageType = "subscriptions.toggle";
  else
    messageType = "subscriptions.add";

  let message = {
    type: messageType,
    url
  };
  if (title)
    message.title = title;
  if (homepage)
    message.homepage = homepage;

  browser.runtime.sendMessage(message);
}

function onFilterMessage(action, filter)
{
  switch (action)
  {
    case "added":
      filter[timestampUI] = Date.now();
      updateFilter(filter);
      break;
    case "loaded":
      populateLists();
      break;
    case "removed":
      let knownFilter = filtersMap[filter.text];
      if (whitelistedDomainRegexp.test(knownFilter.text))
        collections.whitelist.removeItem(knownFilter);
      else
        removeCustomFilter(filter.text);

      delete filtersMap[filter.text];
      break;
  }
}

function onSubscriptionMessage(action, subscription)
{
  if (subscription.url in subscriptionsMap)
  {
    let knownSubscription = subscriptionsMap[subscription.url];
    for (let property in subscription)
    {
      if (property == "title" && knownSubscription.recommended)
        knownSubscription.originalTitle = subscription.title;
      else
        knownSubscription[property] = subscription[property];
    }
    subscription = knownSubscription;
  }
  switch (action)
  {
    case "disabled":
      updateSubscription(subscription);
      if (isAcceptableAds(subscription.url))
        setAcceptableAds();

      setPrivacyConflict();
      break;
    case "downloading":
    case "downloadStatus":
    case "homepage":
    case "lastDownload":
    case "title":
      updateSubscription(subscription);
      break;
    case "added":
      let {url} = subscription;
      // Handle custom subscription
      if (/^~user/.test(url))
      {
        loadCustomFilters(subscription.filters);
        return;
      }
      else if (url in subscriptionsMap)
        updateSubscription(subscription);
      else
        addSubscription(subscription);

      if (isAcceptableAds(url))
        setAcceptableAds();

      collections.filterLists.addItem(subscription);
      setPrivacyConflict();
      break;
    case "removed":
      if (subscription.recommended)
      {
        subscription.disabled = true;
        onSubscriptionMessage("disabled", subscription);
      }
      else
      {
        delete subscriptionsMap[subscription.url];
        if (isAcceptableAds(subscription.url))
        {
          setAcceptableAds();
        }
        else
        {
          collections.more.removeItem(subscription);
        }
      }

      collections.filterLists.removeItem(subscription);
      setPrivacyConflict();
      break;
  }
}

function getSubscriptionFilters(subscription)
{
  return browser.runtime.sendMessage({
    type: "filters.get",
    subscriptionUrl: subscription.url});
}

function hidePref(key, value)
{
  const element = getPrefElement(key);
  if (element)
    element.setAttribute("aria-hidden", value);
}

function getPrefElement(key)
{
  return document.querySelector("[data-pref='" + key + "']");
}

function getPref(key, callback)
{
  let checkPref = getPref.checks[key] || getPref.checkNone;
  checkPref((isActive) =>
  {
    if (!isActive)
    {
      hidePref(key, !isActive);
      return;
    }

    browser.runtime.sendMessage({
      type: "prefs.get",
      key
    }, callback);
  });
}

getPref.checkNone = function(callback)
{
  callback(true);
};

getPref.checks =
{
  notifications_ignoredcategories(callback)
  {
    getPref("notifications_showui", callback);
  }
};

function onPrefMessage(key, value, initial)
{
  switch (key)
  {
    case "notifications_ignoredcategories":
      value = value.indexOf("*") == -1;
      break;

    case "notifications_showui":
      hidePref("notifications_ignoredcategories", !value);
      break;
    case "ui_warn_tracking":
      setPrivacyConflict();
      break;
  }

  let checkbox = document.querySelector(
    "[data-pref='" + key + "'] button[role='checkbox']"
  );
  if (checkbox)
    checkbox.setAttribute("aria-checked", value);
}

function updateTooltips()
{
  let anchors = document.querySelectorAll(":not(.tooltip) > [data-tooltip]");
  for (let anchor of anchors)
  {
    let id = anchor.getAttribute("data-tooltip");

    let wrapper = document.createElement("div");
    wrapper.className = "icon tooltip";
    anchor.parentNode.replaceChild(wrapper, anchor);
    wrapper.appendChild(anchor);

    let tooltip = document.createElement("div");
    tooltip.setAttribute("role", "tooltip");

    let paragraph = document.createElement("p");
    paragraph.textContent = getMessage(id);
    tooltip.appendChild(paragraph);

    wrapper.appendChild(tooltip);
  }
}

let port = browser.runtime.connect({name: "ui"});

port.onMessage.addListener((message) =>
{
  switch (message.type)
  {
    case "app.respond":
      switch (message.action)
      {
        case "addSubscription":
          let subscription = message.args[0];
          let dialog = E("dialog-content-predefined");
          dialog.querySelector("h3").textContent = subscription.title || "";
          dialog.querySelector(".url").textContent = subscription.url;
          openDialog("predefined");
          break;
        case "focusSection":
          let section = message.args[0];
          if (section == "notifications")
          {
            section = "advanced";
            const elem = getPrefElement("notifications_ignoredcategories");
            elem.classList.add("highlight-animate");
            elem.querySelector("button").focus();
          }

          selectTabItem(section, document.body, false);
          break;
      }
      break;
    case "filters.respond":
      onFilterMessage(message.action, message.args[0]);
      break;
    case "prefs.respond":
      onPrefMessage(message.action, message.args[0], false);
      break;
    case "subscriptions.respond":
      onSubscriptionMessage(message.action, message.args[0]);
      break;
  }
});

port.postMessage({
  type: "app.listen",
  filter: ["addSubscription", "focusSection"]
});
port.postMessage({
  type: "filters.listen",
  filter: ["added", "loaded", "removed"]
});
port.postMessage({
  type: "prefs.listen",
  filter: ["notifications_ignoredcategories", "notifications_showui",
           "show_devtools_panel", "shouldShowBlockElementMenu",
           "ui_warn_tracking"]
});
port.postMessage({
  type: "subscriptions.listen",
  filter: ["added", "disabled", "homepage", "lastDownload", "removed",
           "title", "downloadStatus", "downloading"]
});

window.addEventListener("DOMContentLoaded", onDOMLoaded, false);
window.addEventListener("hashchange", onHashChange, false);

},{}]},{},[1]);
