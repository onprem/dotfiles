var g_ipctarget=null,g_websiteeventtarget=null;function forward_website_event_response(e){for(var t=0;t<parent.frames.length;t++)if(parent.frames[t].document.getElementById("lpwebsiteeventform")&&"function"==typeof parent.frames[t].website_event_callback){parent.frames[t].website_event_callback(e);break}}this.website_event=function(){var e=document.getElementById("eventtype").value;"function"==typeof lpdbg&&lpdbg("vault","new vault got website event: "+e);var t="function"==typeof getBG?getBG():bg,a={cmd:e,url:t.base_url,callback:website_event_callback};switch(e){case"refresh":a.from=document.getElementById("eventdata1").value,a.type=document.getElementById("eventdata2").value;break;case"logout":case"logoff":case"clearcache":break;case"keyweb2plug":a.cmd="web2plug",a.key=document.getElementById("eventdata1").value,a.username=document.getElementById("eventdata2").value,a.rsa=document.getElementById("eventdata3").value;break;case"checkmultifactorsupport":a.type=document.getElementById("eventdata1").value;break;case"setupsinglefactor":a.type=document.getElementById("eventdata1").value,a.username=document.getElementById("eventdata2").value,a.password=document.getElementById("eventdata3").value,a.silent=document.getElementById("eventdata5").value,"1"!=document.getElementById("eventdata5").value&&g_websiteeventtarget&&g_websiteeventtarget.source.postMessage({cmd:e,result:"working"},g_websiteeventtarget.origin);break;case"rsadecrypt":a.sharerpublickeyhex=document.getElementById("eventdata1").value,a.sharekeyenchexsig=document.getElementById("eventdata2").value,a.sharekeyenchex=document.getElementById("eventdata3").value,a.sharekeyhex=document.getElementById("eventdata4").value;break;case"request_native_messaging":break;default:return void console.error("got unsupported website event on new vault: "+e)}t.processCS(null,a,null)},this.website_event_callback=function(e){if("function"==typeof lpdbg&&lpdbg("vault","new vault got website event callback: "+e.cmd),"checkmultifactorsupport"==e.cmd){if(!document.getElementById("lpwebsiteeventform"))return void forward_website_event_response(e);document.getElementById("eventdata4").value=e.type,document.getElementById("eventdata3").value=e.result,g_websiteeventtarget&&g_websiteeventtarget.source.postMessage(e,g_websiteeventtarget.origin)}else if("setupsinglefactor"==e.cmd){if(!document.getElementById("lpwebsiteeventform"))return void forward_website_event_response(e);document.getElementById("eventdata4").value=e.result,g_websiteeventtarget&&g_websiteeventtarget.source.postMessage(e,g_websiteeventtarget.origin)}else"ipcgotdata"==e.cmd&&g_ipctarget.source.postMessage(e,g_ipctarget.origin)};
//# sourceMappingURL=sourcemaps/website_event.js.map
