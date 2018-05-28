LPPlatform="undefined"==typeof LPPlatform?{}:LPPlatform,LPPlatform.requestFrameworkInitializer=function(e){return r=chrome.runtime.connect||parent.chrome.runtime.connect,t=e,(n=r("",{name:"requestPort"})).onMessage.addListener(t),function(e){n.postMessage(e)};var r,t,n};
//# sourceMappingURL=sourcemaps/platformRequestFramework.js.map
