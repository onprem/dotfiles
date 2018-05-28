
with (
(function (globalContext) {
    if (typeof Proxy !== 'function') {
        return globalContext;
    }
    var hasOwnProperty = function(object, property) {
      if (object) {
        return Object.prototype.hasOwnProperty.call(object, property) || object.hasOwnProperty(property);
      }
      return false;
    };
    var isGlobalProperty = function(property) {
      var value = globalContext[property];
      if (hasOwnProperty(globalContext, property)) {
          return !(value instanceof Element || value instanceof HTMLCollection) || Object.getOwnPropertyNames(globalContext).includes(property);
      } else {
        return (typeof(EventTarget) !== 'undefined' && hasOwnProperty(EventTarget.prototype, property)) ||
               (typeof(ContentScriptGlobalScope) !== 'undefined' && hasOwnProperty(ContentScriptGlobalScope.prototype, property));
      }
    };
    var proxiedFunctions = Object.create(null);
    var proxy = new Proxy(Object.create(null), {
        get: function (target, property, receiver) {
            var isProxiedFunction = Object.prototype.hasOwnProperty.call(proxiedFunctions, property);

            if (property === Symbol.unscopables || !(isGlobalProperty(property) || isProxiedFunction)) {
                return void 0;
            }

            var value = isProxiedFunction ? proxiedFunctions[property] : globalContext[property];

            if (!isProxiedFunction && typeof(value) === 'function' && /^[a-z]/.test(property)) {
                value = proxiedFunctions[property] = new Proxy(value, {
                    construct: function (target, argumentsList, newTarget) {
                        return Reflect.construct(target, argumentsList, newTarget);
                    },
                    apply: function (target, thisArg, argumentsList) {
                        return Reflect.apply(target, thisArg === proxy ? globalContext : thisArg, argumentsList);
                    }
                });
            }

            return value;
        },
        set: function (target, property, value) {
            globalContext[property] = value;
            delete proxiedFunctions[property];
        },
        has: function () {
            return true;
        }
    });
    return proxy;
})(this)
) {

var oneMinuteSignupMessageType={ResetRequestScript:"ResetRequestScript",ResetScript:"ResetScript",LogoutScript:"LogoutScript",UserInformationNeeded:"UserInformationNeeded",NavigateToTab:"NavigateToTab",SaveDiscoveredApps:"SaveDiscoveredApps",Done:"Done",Error:"Error",Log:"Log",SavedToVault:"SavedToVault",GetToken:"GetToken",LaunchApplication:"LaunchApplication",CloseTab:"CloseTab",GetOauthToken:"getOauthToken",ReceivedOauthToken:"token"};chrome.runtime.onMessage.addListener(function(e){e.fromExtension=!0,window.postMessage(e,"https://i2-ui-prod.service.lastpass.com")});var version=0;chrome.runtime.getManifest&&(version=chrome.runtime.getManifest().version),document.body.setAttribute("lastpass-extension-id",chrome.runtime.id||"0"),document.body.setAttribute("lastpass-extension-version",version),window.addEventListener("message",function(e){var t;e.origin===window.location.origin&&(t=e.data.type,Object.values(oneMinuteSignupMessageType).indexOf(t)>=0)&&(e.data.fromExtension||chrome.runtime.sendMessage(e.data,function(e){}))});

}
//# sourceMappingURL=sourcemaps/1minsignup/chrome/websiteConnector.js.map
