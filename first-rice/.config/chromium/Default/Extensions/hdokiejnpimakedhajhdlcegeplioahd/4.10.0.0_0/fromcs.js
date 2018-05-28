function hasNever(e,a,t,i){"undefined"!=typeof g_neverurls&&null!==g_neverurls||(g_neverurls={});var l=lpcanonizeUrl(e),n=l;if(l.length>0&&"/"==l.charAt(l.length-1)&&(l=l.substring(0,l.length-1)),g_neverurls[t]&&g_neverurls[t].length>0){for(var r=!1,s=0;g_neverurls[t]&&s<g_neverurls[t].length;s++){if((o=g_neverurls[t][s])==a||o==l){r=!0;break}}if(!r)return!0}for(s=0;g_neverurls[i]&&s<g_neverurls[i].length;s++){var o=g_neverurls[i][s],d=LPTools.createUrlPattern(o);if(-1!==o.indexOf("*")&&d&&d.test(n)||o==a||o==l||o==n)return!0}return!1}function hasNeverAutologin(e,a){return hasNever(e,a,"onlyautologins","neverautologins")}function hasNeverFormFill(e,a){return hasNever(e,a,"onlyformfills","neverformfills")}function hasNeverSave(e,a){return hasNever(e,a,"onlyaccounts","neveraccounts")}function hasNeverShowIcon(e,a){return hasNever(e,a,"onlyshowicons","nevershowicons")}function hasNeverGenerate(e,a){return hasNever(e,a,"onlygenerates","nevergenerates")}function hasNeverEnableLP(e,a){return hasNever(e,a,"onlyenablelp","neverenablelp")}function hasNeverMPReuse(e,a){return hasNever(e,a,"onlympwreuse","nevermpwreuse")}var g_accessibility_enabled=-1;function handleFill(e,a){var t=!1,i=null;if(!(lploggedin&&null==grid_getdata("active")||skiplogin()))return!1;if(void 0===a||!a)return!1;if(!check_for_frame_mismatch_ok(e,a.fromiframe,gs("Are you sure you want LastPass to fill your information into this site:"),a.cmd))return!1;if(g_fillfield_did_fillbest[e.toString()]=!1,"autofillaid"==a.cmd||"autologinaid"==a.cmd){var l=a.aid;if(g_last_launch[l]=(new Date).getTime(),void 0!==g_sites[l]){var n="autologinaid"==a.cmd,r=!0,s=get_record(l);a.no_manualfill_on_saveall&&s.save_all&&(r=!1),a.from_iframe&&!s.save_all&&(r=!0);var o=!!a.from_iframe;return g_fillfield_confirm_perfield={},fill({tabid:e,acct:g_sites[l],docid:null,submit:n,doconfirm:!n,docnum:"all",allowforce:!0,skip_pwprotect:!1,manualfill:r,automaticallyFill:null,skip_basicauth:null,from_iframe:o,desc:a.cmd,source:a.source}),!0}return!1}if(void 0===a.url)return!1;void 0!==a.username_val&&(g_username_vals[a.url]=a.username_val);var d=a.url,c=lp_gettld_url(d),u=0;if(null===a.aid||void 0===a.aid){var f=getcsinfo(e,g_CS_tops[e]);f&&(u=f.lastfill_aid)>0&&console_warn("initiating fill without aid but PRIOR FILL was done for "+u)}if(lp_url_is_lastpass(d))return!1;if(void 0!==g_launches[e]&&g_launches[e]||null!=g_pending_launch&&(g_launches[e]=g_pending_launch),void 0!==g_launches[e]&&g_launches[e]){l=g_launches[e];if(void 0!==g_sites[l]){s=get_record(l);if(g_fillfield_confirm_perfield={},check_ident_aid(l)&&compare_tlds(c,lp_gettld_url(g_sites[l].url))){if(is_guiless())fill({tabid:e,acct:s,docid:null,submit:!1,doconfirm:!1,docnum:"all",allowforce:!0,skip_pwprotect:!1,manualfill:!1,automaticallyFill:!1,desc:"FILL_F2"});else{o=!!a.from_iframe;fill({tabid:e,acct:s,docid:null,submit:!0,doconfirm:!1,docnum:a.docnum,allowforce:!1,skip_pwprotect:!0,manualfill:null,automaticallyFill:null,skip_basicauth:null,from_iframe:o,desc:"FILL_F3"}),i=l}void 0!==a.numpass&&a.numpass>0?(g_launches[e]=null,g_pending_launch=null):setTimeout(function(){g_launches[e]=null,g_pending_launch=null},1e3)}}}var _=getsites(c);_=reorderOnURL(_,d,!0),void 0!==a.username_val&&a.username_val&&(given_username_in_accts(_,a.username_val,d)||(_=new Array)),hasNeverAutologin(d,c)&&(_=new Array);var g=a.topurl!=d?lp_gettld_url(a.topurl):"";for(var m in""!=g&&hasNeverAutologin(a.topurl,g)&&(_=new Array),_){try{islastpass&&g_ischrome&&!g_isedge&&1==_[m].basic_auth&&g_accessibility_enabled<=0&&0==lpGetPref("basicauthnever",0)&&(g_is_mac&&have_binary_function("accessibility_enabled")?call_binary_function("accessibility_enabled",function(e){0==(g_accessibility_enabled=e?1:0)&&setTimeout(function(){get_selected_tab(null,function(e){sendCS(gettabid(e),{cmd:"showbasicauthnotification",needbinary:0,text:gs("In order for LastPass to fill into basic authentication dialogs, you need to enable access for assistive devices."),do_40notify:g_40notify})})},100)}):!g_is_win&&!g_is_mac||have_binary()||(g_accessibility_enabled=0,setTimeout(function(){get_selected_tab(null,function(e){sendCS(gettabid(e),{cmd:"showbasicauthnotification",needbinary:1,text:gs("In order for LastPass to fill into basic authentication dialogs, you need to install the binary version of LastPass for Chrome."),do_40notify:g_40notify})})},100)))}catch(e){}var h=!1;l=_[m].aid;if(check_ident_aid(l))if(void 0!==g_sites[l])if((s=get_record(l))&&(s.never_autofill&&(h=!0),(s.pwprotect||g_prompts.login_site_prompt)&&(h=!0),!s.genpw&&(0!=s.fields.length||""!=s.username))){if(0==s.url.indexOf("https://")&&0!=d.indexOf("https://")&&(h=!0),g_fillfield_confirm_perfield={},0==parseInt(lpGetPref("automaticallyFill",1))&&0==parseInt(lpGetPref("highlightFields",1))&&(h=!0),!h){if(i&&i!=l){verbose_log("did_launched_aid != aid "+i+"!="+l);continue}if(u>0&&l!=u){console_warn("IGNORING non-aid fill; would fill and override previous fill "+l+"!="+u);continue}var p=!s.save_all;p&&(void 0===g_fillfieldsmatches[d]&&(g_fillfieldsmatches[d]=new Array),g_fillfieldsmatches[d][g_fillfieldsmatches[d].length]=s,g_fillfieldsmatchescurridx[d]=0);var v=parseInt(lpGetPref("automaticallyFill",1));fill({tabid:e,acct:s,docid:a.docid,submit:null,doconfirm:p,docnum:a.docnum,allowforce:null,skip_pwprotect:!0,manualfill:null,automaticallyFill:v,desc:"FILL_F4"})}0!=lpGetPref("showFillNotificationBar",1)&&(get_selected_tab(null,function(t){sendCS(e,{cmd:"showfillnotification",text:gs("LastPass has filled your login information into the form on this page."),sites:cache_usernames(_),docnum:a.docnum,do_40notify:g_40notify})}),t=!0);break}}return t||0!=lpGetPref("showNotificationsAfterClick",1)||checkgenpwfillforms(e,d),!0}function checkWeakDuplicateBreached(e,a,t){g_showweakdupalerts&&qualifyForWeakCheck(getpasswordfromacct(e))&&(g_ischrome||g_issafari||g_isfirefoxsdk)&&(0!=g_disablepwalerts||void 0!==e.noalert&&"1"==e.noalert||getWeakAndDuplicateIds(g_username_hash,g_username,function(i){var l=null!=e.sharedfromaid&&""!=e.sharedfromaid&&"0"!=e.sharedfromaid&&"null"!=e.sharedfromaid?1:0,n=issharedfolder(g_shares,e.group),r=!checkreadonly(n,!0),s=l||r||"1"!=e.pwch?0:1;isBreachedSite(e)?(g_notification_type="lpalert",g_badgedata={cmd:"notification",type:"lpalert"},g_notification_data={cmd:"notification",type:"lpalert",data:{lpa_title:gs("This site was affected by a breach!"),lpa_msg:gs("The account you are logging into was either hacked or was reusing a password a password from a site that was hacked. You should take action now to change this password"),lpa_secondary_msg:gs("Use the Security Challenge to see other affected sites"),lpa_onclicktext:gs("Change Passwords Now"),lpa_onclickurl:base_url+"misc_challenge.php?breachid="+e.breached}},set_badge(g_notification_data,a),drawIconAtRotation(0)):isDuplicateSite(i[0],e.aid)?(g_notification_type="alert",g_notification_data={cmd:"notification",type:"alert",aid:e.aid,name:e.name,username:getusernamefromacct(e),alerttype:"duplicate",tld:t,tabid:a,pwch:s},set_badge(g_notification_data,a),drawIconAtRotation(0)):isWeakPassword(i[1],e.aid)&&(g_notification_type="alert",g_notification_data={cmd:"notification",type:"alert",aid:e.aid,name:e.name,username:getusernamefromacct(e),alerttype:"weak",tld:t,tabid:a,pwch:s},set_badge(g_notification_data,a),drawIconAtRotation(0))}))}function checkgenpwfillforms(e,a,t){var i=lp_gettld_url(a),l=1!=lpGetPref("showGenerateNotifications",1)||hasNeverGenerate(a,i),n=1!=lpGetPref("showFormFillNotifications",1)||hasNeverFormFill(a,i),r=new Array;if(do_experimental_popupfill){for(var s=0;s<g_formfills.length;s++)check_ident_ffid(g_formfills[s].ffid)&&(r[r.length]=g_formfills[s]);0==r.length&&(n=!0);var o={cmd:"checkgenpwfillforms",nevergenerate:l,neverformfill:n,sites:cache_usernames(reorderOnURL(getsites(i),a,!0,!0)),formfills:LPJSON.stringify(r),active:g_popupfill_last_active[e],activefieldid:g_popupfill_last_active_fieldid[e]};t||(o.ff=g_cachedffdat),sendCS(e,o,"all")}else{if(!n){for(s=0;s<g_formfills.length;s++)check_ident_ffid(g_formfills[s].ffid)&&(r[r.length]=g_formfills[s]);0==r.length&&(n=!0)}if(!l||!n){o={cmd:"checkgenpwfillforms",nevergenerate:l,neverformfill:n,sites:cache_usernames(reorderOnURL(getsites(i),a,!0,!0)),formfills:LPJSON.stringify(r)};t||(o.ff=g_cachedffdat),sendCS(e,o,"all")}}}function cache_usernames(e){for(var a in e)e[a].useusername=getusernamefromacct(e[a]);return LPJSON.stringify(e)}function handleNever(e,a){handleNeverURL(a)}function handleNeverURL(e){if("neverautofill"==e.cmd){var a=e.aid;if(void 0===g_sites[a])return;g_sites[a].never_autofill=!0,g_sites[a].autologin=!1;var t="aid="+en(a);lpMakeRequest(base_url+"set_never_autofill.php",t,null,null)}else if("neverdomain"==e.cmd||"neverpage"==e.cmd){var i="neverdomain"==e.cmd?lp_gettld_url(e.url):lpcanonizeUrl(e.url);t="url="+en(AES.url2hex(i));void 0!==e.fromsave&&e.fromsave?g_neverurls.neveraccounts.push(i):void 0!==e.fromgenerate&&e.fromgenerate?(t+="&type=1",g_neverurls.nevergenerates.push(i)):void 0!==e.fromformfill&&e.fromformfill?(t+="&type=2",g_neverurls.neverformfills.push(i)):void 0!==e.fromshowicons&&e.fromshowicons?(t+="&type=6",g_neverurls.nevershowicons.push(i)):void 0!==e.neverforall&&e.neverforall?(g_neverurls.neveraccounts.push(i),g_neverurls.nevergenerates.push(i),g_neverurls.neverformfills.push(i),g_neverurls.neverautologins.push(i),g_neverurls.nevershowicons.push(i),t+="&type=7"):void 0!==e.neverenablelp&&e.neverenablelp?(g_neverurls.neverenablelp.push(i),t+="&type=8"):(t+="&type=3",g_neverurls.neverautologins.push(i)),lpMakeRequest(base_url+"add_never.php",t,null,null)}g_local_accts_version++,rewritelocalfile()}function handleSave(e,a){var t=!1;if(g_cpwbot&&CPWbot_bg&&e==CPWbot_bg.get_pwchangetabid())return L("handleSave(tab:"+e+", state="+CPWbot_bg.g_pwchangestate+")"),console_log("Skipping save because driving a password change"),!1;var i=get_ff_translation("ff_currpass_regexp");if("undefined"==typeof SAVEALLFORMSUBMITS){if(!lploggedin)return!1;if(lp_url_is_lastpass(a.url,!0))return!1;if(lp_url_is_lastpassext(a.url))return!1}for(var l=a.formdata.split("\n"),n=!1,r=!1,s=null,o="",d="",c=new Array,u=new Array,f=function(e){for(var a={pwcount:0,textcount:0,pwseencount:0,textseencount:0,hiddencount:0},t=0;t<e.length;t++){var i=e[t],l=i.split("\t");if(4==l.length||5==l.length){decodeURIComponent(l[2]);var n=l[3];"password"==n?a.pwcount++:"hidden"==n?a.hiddencount++:W(n)&&a.textcount++,"password"==n&&(l.length<5||l.length>=5&&"seen"==l[4])?a.pwseencount++:W(n)&&(l.length<5||l.length>=5&&"seen"==l[4])&&a.textseencount++}}return a}(l),_=0;_<l.length;_++){if(4==(N=l[_].split("\t")).length||5==N.length){var g=decodeURIComponent(N[2]),m=N[3],h=!0;if(n&&N.length>=5&&"notseen"==N[4]&&(h=!1),(!n||!r)&&W(m)&&g.length>0&&(h&&(o=g,n=!0),0==r&&void 0!==SpecialSites[lpcanonizeUrl(a.url)]&&(r=!0)),!("password"==m&&N.length>=5&&"notseen"==N[4]&&f.pwcount>1&&f.pwseencount>0)&&"password"==m&&(h||0==r)){var p=decodeURIComponent(N[1]);if(c[u.length]={name:p,value:g},u[u.length]=g,!r&&g.length&&(d=g,r=!0),null==s){var v=new RegExp(i,"i");p&&(p==a.current_pw_field_name||v.exec(p))&&(s=u.length-1)}}}}if(r){a.username=o,a.password=d,!n&&u.length>1&&u[0]!=u[1]&&null==s&&(a.username=u[0],a.password=u[1]);var y=lp_gettld_url(a.url);a.tld=y;var w=null,b=!1,S="",k="";u.length>1&&u[u.length-1]==u[u.length-2]&&""!=u[u.length-1]&&c[u.length-1].name!=c[u.length-2].name?(b=!0,S=u[u.length-1],w=1,3==u.length&&u[0]!=u[1]&&u[1]==u[2]&&(k=u[0])):u.length>1&&u[0]==u[1]&&""!=u[0]&&c[0].name!=c[1].name?(b=!0,S=u[0],w=2):u.length>1&&u[0]!=u[1]&&""!=u[0]&&null!=s&&(0==s&&2==u.length?(S=u[1],w=3):1==s&&2==u.length?(S=u[0],w=4):(S="",w=6));var x=b||null!=s&&S,C=new Array;if(x){C=getsites(y,!0);if(a.createacct=2==u.length||array_length(C)>0,a.createacct){var P="",A="",F="",j="";for(_=0;_<l.length;_++){var N;if(4==(N=l[_].split("\t")).length||5==N.length){m=N[3];if(""==P&&W(m)&&""!=N[1]&&""!=N[2]){p=decodeURIComponent(N[1]);var T=get_ff_translation("ff_username_regexp");if(""!=T)(v=new RegExp(T,"i")).exec(p)&&(P=p,A=decodeURIComponent(N[2]))}if(""==F&&W(m)&&""!=N[1]&&""!=N[2]){p=decodeURIComponent(N[1]);var q=get_ff_translation("ff_email_regexp");if(""!=q)(v=new RegExp(q,"i")).exec(p)&&(F=p,j=decodeURIComponent(N[2]))}if(""!=P&&""!=F)break}}""==P&&(P=F,A=j),a.username_field=P,""!=A&&(a.username=A)}}if(x&&array_length(C)>0){verbose_log("looking for newpw="+(g_show_pw_in_logs||g_isadmin?S:"REDACTED")+" tld="+y+" in g_didchangepw");var U=void 0!==g_didchangepw[SHA256(S+y)]&&g_didchangepw[SHA256(S+y)]>(new Date).getTime()-6e5;if(verbose_log("already processed pw ="+(g_show_pw_in_logs||g_isadmin?S:"REDACTED")+" tld="+y+" is "+U),!U&&(g_notification_type="change",a.newpw=S,a.oldpw=k,g_notification_data=a,LPContentScriptFeatures.new_save_site||sendTS({cmd:"notification",type:"change"}),t=!0,0!=lpGetPref("showChangeNotificationBar",1))){var I=C;if(a.sitecount=array_length(I),1==array_length(I))for(var _ in I){a.singleaid=_,M=gs("LastPass detected a password change for user:")+" "+of(getusernamefromacct(g_sites[_]));break}else M=gs("LastPass detected a password change for domain:")+" "+of(y);sendCS(e,{cmd:"showchangenotification",text:M,notificationdata:a,do_40notify:g_40notify}),g_persistent_notifications[e]={cmd:"showchangenotification",text:M,notificationdata:a,do_40notify:g_40notify},write_history({cmd:"showchangenotification",aid:a.singleaid,spin:w,tld:a.tld,url:a.url,msg:M})}}else{if(hasNeverSave(a.url,y)||(void 0!==a.topdocurl&&hasNeverSave(a.topdocurl),lp_gettld_url(a.topdocurl)))return!1;var D=reorderOnURL(getsites(y),a.url);for(var R in D)if(check_ident_aid(R.aid)&&void 0!==g_sites[R.aid]){var E=get_record(R.aid),O=getusernamefromacct(E),G=getpasswordfromacct(E);if(g_show_pw_in_logs,(!n||o==lpmdec_acct(E.username,!0,E,g_shares)||value_is_masked(o)||o==O)&&(d==lpmdec_acct(E.password,!0,E,g_shares)||d==G)||E.save_all&&isMatch(E,n,o,d)||o==lpmdec_acct(E.username,!0,E,g_shares)&&""==d)return!1;if(n&&(o==lpmdec_acct(E.username,!0,E,g_shares)||value_is_masked(o)||o==O)&&u&&2==u.length&&(u[0]==lpmdec_acct(E.password,!0,E,g_shares)||u[1]==lpmdec_acct(E.password,!0,E,g_shares))&&(d===u[0]||d===u[1]))return!1}if(g_notification_type="save",g_notification_data=a,0==lpGetPref("showSaveSiteNotifications",0)||LPContentScriptFeatures.new_save_site||(sendTS({cmd:"notification",type:"save"}),t=!0),0!=lpGetPref("showSaveNotificationBar",1)&&lpCheckAddSite(a.username,a.password,y)){var M=gs("Should LastPass remember this password?");g_persistent_notifications[e]={cmd:"showaddnotification",text:M,notificationdata:LPJSON.stringify(a),do_40notify:g_40notify,tutorialData:IntroTutorial.getState()};var z="streetscape.com"==y?"all":null;sendCS(e,{cmd:"showaddnotification",text:M,notificationdata:LPJSON.stringify(a),do_40notify:g_40notify,tutorialData:IntroTutorial.getState()},z),write_history({cmd:"showaddnotification",username:a.username,tld:y,url:a.url,msg:M,spin:null}),t=!0}}}return t;function W(e){if(!e)return!1;var a,t=["text","email","tel","url"];for(a in t)if(t.hasOwnProperty(a)&&e==t[a])return!0;return!1}}function lpCheckAddSite(e,a,t){var i=lp_get_gmt_timestamp(),l=new Array;for(var n in g_rejectedaddsites){i>(r=g_rejectedaddsites[n]).rejectedTime+600&&(l[l.length]=n)}for(n=l.length-1;n>=0;n--)g_rejectedaddsites.splice(l[n],1);for(var n in g_rejectedaddsites){var r;if((r=g_rejectedaddsites[n]).username==e&&lpdec(r.encryptedPassword)==a&&compare_tlds(r.tld,t))return!1}return!0}var lastupdatefields="";function handleUpdateFields(e,a){if(LPContentScriptFeatures.new_save_site)return!1;var t=a.aid,i=g_sites[t];if(!i)return!1;var l=issharedfolder(g_shares,i.group);if(!checkreadonly(l,!0))return!1;var n=new Array,r=[],s=updateAndEncryptData(a.formdata,n,r,i),o=SHA256(s);if(o==lastupdatefields)return!1;lastupdatefields=o,update_username_from_fields_if(i,n);for(var d=i.fields.length-1;d>=0;d--)i.fields[d].otherfield||"1"==i.fields[d].otherlogin||i.fields.splice(d,1);for(d=0;d<n.length;d++)i.fields[i.fields.length]=n[d];g_local_accts_version++,rewritelocalfile();var c="data="+en(bin2hex(s))+"&ref="+en(url2hex(a.url))+"&updatefields=1&aid="+en(t);return c+=0==l?"":"&sharedfolderid="+en(l.id),i.postdata=c,i.posturl=base_url+"gm_deliver.php",i.newvalues=r,updateFieldsFromSubmit(c,i),!0}function handleAddUrid(e,a){if(LPContentScriptFeatures.new_save_site)return!1;var t=a.aid,i=g_sites[t],l=issharedfolder(g_shares,i.group);if(checkreadonly(l,!0)){for(var n=new Array,r=0;r<i.fields.length;r++)"1"!=i.fields[r].otherlogin||lp_in_array(i.fields[r].urid,n)||(n[n.length]=i.fields[r].urid);if(!(n.length>=10)){var s=new Array,o=[],d=updateAndEncryptData(a.formdata,s,o,i);update_username_from_fields_if(i,s);for(r=0;r<s.length;r++)s[r].otherlogin="1",s[r].url=url2hex(a.url),i.fields[i.fields.length]=s[r];g_local_accts_version++,rewritelocalfile();var c="data="+en(bin2hex(d))+"&ref="+en(url2hex(a.url))+"&addurid=1&aid="+en(t);c+=0==l?"":"&sharedfolderid="+en(l.id),i.postdata=c,i.posturl=base_url+"gm_deliver.php",i.newvalues=o,updateFieldsFromSubmit(c,i)}}}function update_username_from_fields_if(e,a){for(var t=get_ff_translation("ff_combineddummy_regexp"),i=new RegExp(t,"i"),l=0,n="",r=0;r<a.length;r++)if("text"==a[r].type||"email"==a[r].type||"tel"==a[r].type||"url"==a[r].type){if(i.exec(a[r].name)||i.exec(a[r].id)||"answer"==a[r].id||"answer"==a[r].name)continue;if(n=a[r].value,++l>=2)break}if(1==l&&""!=n){var s=0;for(r=0;r<e.fields.length;r++)if(!e.fields[r].otherfield&&("text"==e.fields[r].type||"email"==e.fields[r].type||"tel"==e.fields[r].type||"url"==e.fields[r].type)){s++;break}0==s&&(e.username=n,e.unencryptedUsername=lpdec_acct(crypto_btoa(e.username),e,g_shares))}}function handleSaveAll(e,a){a.save_all=1,g_site_data=a,VaultToggle.useVault4_0()?LPPlatform.openTabDialog("site",{saveAllData:a}):openURL(getchromeurl("site.html"))}function isMatch(e,a,t,i){for(var l=!a,n=!1,r=0;r<e.fields.length;r++)if("text"==e.fields[r].type||"password"==e.fields[r].type||"email"==e.fields[r].type||"tel"==e.fields[r].type||"url"==e.fields[r].type){var s=lpmdec_acct(e.fields[r].value,!0,e,g_shares);"text"!=e.fields[r].type&&"email"!=e.fields[r].type&&"tel"!=e.fields[r].type&&"url"!=e.fields[r].type||t!=s||(l=!0),"password"==e.fields[r].type&&i==s&&(n=!0)}return!(!l||!n)}var g_reqindex=0;function fill(e){var a=e.tabid,t=e.acct;if(null==a||!t)return!1;var i=e.docid,l=e.submit,n=e.doconfirm,r=e.docnum,s=e.allowforce,o=e.skip_pwprotect,d=e.skip_basicauth,c=e.from_iframe,u=e.desc,f=e.source,_=e.manualfill;_||(_=!1);var g=e.automaticallyFill;void 0!==g&&null!=g||(g=1),write_history({cmd:u,tabid:a,docnum:r,aid:t.aid,submit:l,doconfirm:n,allowforce:s}),verbose_log("tabid="+a+"\nacct.aid="+t.aid+"\ndocid="+i+"\nsubmit="+l+"\ndoconfirm="+n+"\ndocnum="+r+"\nallowforce="+s+"\nskip_pwprotect="+o+"\nmanualfill="+_+"\nautomaticallyFill="+g+"\nskip_basicauth="+d+"\nfrom_iframe="+c+"\ndesc="+u);if(_||!IntroTutorial.getState().enabled){var m=!1,h=!1,p=!1,v=0;if(!o&&(t.pwprotect||g_prompts.login_site_prompt))return console_log("FILL : Showing Security Prompt"),void security_prompt(function(e){setTimeout(function(){var e=get_record(t.aid);fill({tabid:a,acct:e,docid:i,submit:l,doconfirm:n,docnum:r,allowforce:s,skip_pwprotect:!0,manualfill:_,automaticallyFill:null,skip_basicauth:null,from_iframe:c,desc:"fill_PW"})},100)},null,null,!0,t.aid,!0);get_selected_tab(null,function(e){if(!d&&g&&(s||1==t.basic_auth)&&gettabid(e)==a&&g_ischrome&&have_binary_function("fill_basicauth")){var y=getusernamefromacct(t),w=getpasswordfromacct(t);if(""!=y||""!=w){write_history({cmd:"check_autologin1",tabid:a,aid:t.aid,submit:b});var b=check_autologin(l,t),S=lp_gettld_url(t.url),k=lp_gettld_url(g_basicauth_origurl);return compare_tlds(S,k)&&(S=k),void call_binary_function("fill_basicauth",y,w,!!s,S,!!b,function(e){e?g_basicauth_found=!1:fill({tabid:a,acct:t,docid:i,submit:l,doconfirm:n,docnum:r,allowforce:s,skip_pwprotect:o,manualfill:_,automaticallyFill:g,skip_basicauth:!0,desc:"FILLBASIC",source:f})})}}is_guiless()&&(g=1),update_cs_lastfill_aid(a,t.aid);S=t.tld;customjs_has_humanize(t.aid)&&(m=!0),customjs_has_v2humanize(t.aid)&&(h=!0),customjs_has_force_fillbest(t.aid)&&(p=!0);var x=t.fields,L=x.length?x.length:0;n=1==n?1:0,s=s?1:0,c=c?1:0;var C=null!=t.sharedfromaid&&""!=t.sharedfromaid&&"0"!=t.sharedfromaid&&"null"!=t.sharedfromaid?1:0;if(0==L&&!s&&customjs_has_userpass_overrides(t.aid)&&(s=!0),0!=L){for(var P=0,A=0,F=0;F<x.length;F++)x[F]&&("text"!=x[F].type&&"email"!=x[F].type&&"tel"!=x[F].type||A++,"password"==x[F].type&&P++);var j=!t.save_all&&0==P;j||void 0===SpecialSites[lpcanonizeUrl(t.url)]||t.save_all||(j=!0);var N=[];for(F=0;F<x.length;F++)if(x[F])if(t.save_all||1!=n||"password"==x[F].type||s||j){var T=x[F],q=T.value,U=T.type;if((void 0===t.captcha_id||""==t.captcha_id||t.captcha_id!=T.name||"text"!=U)&&("text"!=U&&"password"!=U&&"email"!=U&&"tel"!=U&&"textarea"!=U&&"url"!=U||(q=lpmdec_acct(q,!0,t,g_shares)),""==T.name||void 0===N[T.name+q+T.type]))if(N[T.name+q+T.type]=1,""!=q&&null!==q||("text"!=U&&"email"!=U&&"tel"!=U||1!=A?"password"==U&&1==P&&(q=getpasswordfromacct(t)):q=getusernamefromacct(t)),""!=q&&null!==q){verbose_log("Sending FillRequest: "+F+"\ntype="+U+"\nname="+T.name+"\nvalue=<hidden>");var I=!!(void 0!==g_launches[a]&&g_launches[a]&&g_launches[a]==t.aid&&"undefined"!=typeof g_last_launch&&void 0!==g_last_launch[t.aid]&&(new Date).getTime()-g_last_launch[t.aid]<=25e3),D={from:"fillfield_A",index:g_reqindex,time:(new Date).getTime(),uniqid:Math.floor(1e8*Math.random())};++g_reqindex,m&&v++,fillfieldCS(a,r,t.aid,{reqinfo:D,docid:i,sharedsite:C,automaticallyFill:g,is_launch:I,manualfill:_,name:T.name,value:q,type:U,checked:T.checked,otherfield:T.otherfield,doconfirm:n||t.save_all&&"password"==U?1:2,allowforce:s,from_iframe:c,humanize:m,v2humanize:h,delayquants:v,force_fillbest:p,originator:u},l)}else verbose_log("value is empty, will not fill "+T.name)}else verbose_log("initial fill attempt on page, skipping non-password "+x[F].name)}else if(s){console_log("no fields. finding best match "+getusernamefromacct(t)+" and <hidden>");I=!!(void 0!==g_launches[a]&&g_launches[a]&&g_launches[a]==t.aid&&"undefined"!=typeof g_last_launch&&void 0!==g_last_launch[t.aid]&&(new Date).getTime()-g_last_launch[t.aid]<=25e3);console_log("Sending fillbest from A reqindex="+g_reqindex);D={from:"fillbest_A",index:g_reqindex,time:(new Date).getTime(),uniqid:Math.floor(1e8*Math.random())};++g_reqindex,fillbestCS(a,r,t.aid,{reqinfo:D,docid:i,updatefields:1,addurid:0,sharedsite:C,automaticallyFill:g,is_launch:I,humanize:m})}if(s&&logLoginAndCheckWeakPassword(a,t,f),1!=n){b=check_autologin(l,t);if("undefined"!=typeof AUTOSUBMIT&&(b=!0),write_history({cmd:"check_autologin2",tabid:a,aid:t.aid,submit:b,docnum:r}),"string"==typeof t.custom_js&&""!=t.custom_js&&sendCS(a,{cmd:"run_custom_js",docid:i,custom_js:t.custom_js,username:getusernamefromacct(t),password:lpmdec_acct(t.password,!0,t,g_shares),onlyfill:b?0:1,loc:3},r),"string"!=typeof t.custom_js||-1==t.custom_js.indexOf("lpdontsubmit"))if(b)submitCS(a,r,t.aid,{docid:i,humanize:m,delayquants:v})}})}}function logLoginAndCheckWeakPassword(e,a,t){get_all_windows({populate:!0},function(i){for(var l=0;l<i.length;l++)for(var n=0;n<get_tabs_length(i[l]);n++){var r=get_tabs(i[l])[n];gettabid(r)==e&&(checkWeakDuplicateBreached(a,e,lp_gettld_url(gettaburl(r))),(g_loglogins||LPISLOC)&&void 0===g_loggedLogins[a.aid]&&(g_loggedLogins[a.aid]="1",loglogintab(a.aid,r,t,a.autologin?1:0)))}})}function showpageoverlay(e){sendCS(e,{cmd:"showoverlay",urlprefix:getchromeurl("",!0)})}function check_autologin(e,a){var t=!1;if(e)t=!0;else if(a.autologin){var i=(new Date).getTime(),l=parseInt(lpGetPref("autoautoVal",25));(isNaN(l)||""==l||l<=0)&&(l=25);var n=i-1e3*l;void 0===a.last_auto_login||isNaN(a.last_auto_login)||a.last_auto_login<n?(console_log("Launching autologin"),a.last_auto_login=i,t=!0):(write_history({cmd:"check_autologin",msg:sprintf("last autologin to %s was too soon, %s < %s, pref=%d seconds",lp_gettld_url(a.url),new Date(a.last_auto_login).toUTCString(),new Date(n).toUTCString(),l)}),console_log("last autologin too soon!"))}return t}function fillfieldsconfirm(e){if(!e||!lploggedin)return!1;var a=e.url,t=void 0!==e.topurl?e.topurl:"",i=lp_gettld_url(a),l=e.result,n=e.aid,r=e.docid,s=e.tabid,o=e.doconfirm,d=!!e.from_iframe,c=e.manualfill,u=e.allowforce,f=!1,_=void 0!==e.automaticallyFill?e.automaticallyFill:1,g=e.force_fillbest,m=e.source,h=e.name;if(!(C=get_record(n)))return!1;if(h&&(g_fillfield_confirm_perfield[h]=!!l),(hasNeverAutologin(a,i)||t&&t!=a&&hasNeverAutologin(t,i))&&(f=!0),l){if(g_do_totp){var p=getusernamefromacct(C);""!=p&&(g_usercache[i]=p)}if(logLoginAndCheckWeakPassword(s,C,m),2==o)return d&&c&&!f&&sendCS(s,{cmd:"conditionalforcefill",reqinfo:w,username:getusernamefromacct(C),password:getpasswordfromacct(C),aid:C.aid,sharedsite:v,automaticallyFill:_,from_iframe:d},e.docnum),!0}if(f)return!1;var v=null!=C.sharedfromaid&&""!=C.sharedfromaid&&"0"!=C.sharedfromaid&&"null"!=C.sharedfromaid?1:0;if(C.save_all){if(!l&&sufficient_condition_fill_saveall(C))return console.log("sufficient successful fills, ignoring failed fill result on saveall fill"),!0;if(!l||c){var y=!!(void 0!==g_launches[s]&&g_launches[s]&&g_launches[s]==C.aid&&"undefined"!=typeof g_last_launch&&void 0!==g_last_launch[C.aid]&&(new Date).getTime()-g_last_launch[C.aid]<=25e3);console_log("Sending fillbest from B reqindex="+g_reqindex);var w={from:"fillbest_B",index:g_reqindex,time:(new Date).getTime(),uniqid:Math.floor(1e8*Math.random())};++g_reqindex,fillbestCS(s,e.docnum,C.aid,{reqinfo:w,docid:r,updatefields:0,addurid:0,sharedsite:v,automaticallyFill:_,is_launch:y,saveall:!!C.saveall})}}else if(l){if(C=get_record(n))u=!0;u=null,c=null;d&&e.manualfill&&(c=!0,u=!0);var b=!1;fill({tabid:s,acct:C,docid:r,submit:null,doconfirm:!1,docnum:e.docnum,allowforce:u,skip_pwprotect:!0,manualfill:c,automaticallyFill:_,skip_basicauth:b,from_iframe:d,desc:"FILL_F5"}),delete g_fillfieldsmatches[a],delete g_fillfieldsmatchescurridx[a]}else if(e.allowforce||g&&!g_fillfield_did_fillbest[s.toString()]&&!sufficient_condition_fill_nonsaveall(C)){g&&(g_fillfield_did_fillbest[s.toString()]=!0);y=!!(void 0!==g_launches[s]&&g_launches[s]&&g_launches[s]==C.aid&&"undefined"!=typeof g_last_launch&&void 0!==g_last_launch[C.aid]&&(new Date).getTime()-g_last_launch[C.aid]<=25e3);console_log("Sending fillbest from C reqindex="+g_reqindex);w={from:"fillbest_C",index:g_reqindex,time:(new Date).getTime(),uniqid:Math.floor(1e8*Math.random())};++g_reqindex,fillbestCS(s,e.docnum,n,{reqinfo:w,docid:r,updatefields:0,addurid:c?1:0,sharedsite:v,automaticallyFill:_,is_launch:y,force_fillbest:g})}else{var S=g_fillfieldsmatches[a];if(S)for(var k=!1,x=0;x<S.length;x++){var L=S[x].aid;if(k){var C;if(C=g_sites[L])b=!1;return void fill({tabid:s,acct:C,docid:r,submit:null,doconfirm:!0,docnum:e.docnum,allowforce:null,skip_pwprotect:!0,manualfill:null,automaticallyFill:_,skip_basicauth:b,from_iframe:d,desc:"FILL_F6"})}x==g_fillfieldsmatchescurridx[a]&&(g_fillfieldsmatchescurridx[a]++,k=!0)}delete g_fillfieldsmatches[a],delete g_fillfieldsmatchescurridx[a]}return!0}function web2plug(e){if("2"==e.rsa){g_local_key=AES.hex2bin(e.key),g_local_key_hex=e.key,g_local_key_hash=SHA256(g_local_key),rsa_userchangedpassword();var a=opendb();createDataTable(a),a&&!LPISLOC&&(g_indexeddb?a.transaction("LastPassData","readwrite").objectStore("LastPassData").delete(g_username_hash+"_accts"):a.transaction(function(e){e.executeSql("DELETE FROM LastPassData WHERE username_hash=? AND type=?",[db_prepend(g_username_hash),"accts"],function(e,a){},function(e,a){console_log(a)})})),lpWriteKeyFile()}else""!=g_username&&null!=g_username&&g_username!=e.username?loggedOut(!1,"web2plug"):(g_local_key=AES.hex2bin(e.key),g_local_key_hex=e.key,g_local_key_hash=SHA256(g_local_key),lpWriteKeyFile())}function recover(e,a,t,i){var l=lpParseUri(a),n=l.directory,r=l.file;""!=(n=n.replace(new RegExp("^/~[^/]*"),""))&&"/"!=n&&"/sso/"!=n||"recover.php"==r&&confirm(gs("You have requested to use a One Time Password for account recovery. Are you sure you want to continue?"))&&GetOTPHash(null,e,t,i)}function loginfromwebsite(e){if(""!=e.wxusername&&""!=e.keyhex){var a=opendb();if(createSavedLoginsTable(a),a){1==e.rememberemail?(L("remembering email"),set_default_login_username(e.wxusername)):L("not remembering email");var t=function(t,i){if(i.rows.length>0){var l=i.rows.item(0).password,n=function(t){var l=get_key_iterations(e.wxusername);make_lp_key_iterations(e.wxusername,t,l,function(t){if(AES.bin2hex(t)!=e.keyhex)if(g_indexeddb){var l=i.rows.item(0);l.password="",a.transaction("LastPassSavedLogins2","readwrite").objectStore("LastPassSavedLogins2").put(l)}else a.transaction(function(a){a.executeSql("UPDATE LastPassSavedLogins2 SET password = '' WHERE username = ?",[e.wxusername],function(e,a){},function(e,a){console_log(a)})})})};1==i.rows.item(0).protected?unprotect_data(l,!1,n):2==i.rows.item(0).protected&&n(lpdec(l,AES.hex2bin(SHA256(e.wxusername))))}};if(g_indexeddb){var i={rows:{item:function(e){return this[e]},length:0}};a.transaction("LastPassSavedLogins2","readonly").objectStore("LastPassSavedLogins2").openCursor(IDBKeyRange.only(e.wxusername)).onsuccess=function(e){e.target.result&&""!=e.target.result.value.password&&(i.rows[i.rows.length]=e.target.result.value,i.rows.length++),t(0,i)}}else a.transaction(function(a){a.executeSql("SELECT * FROM LastPassSavedLogins2 WHERE username = ? AND password != ''",[e.wxusername],t,function(e,a){})})}""!=e.wxsessid&&(lp_phpsessid=e.wxsessid);var l=AES.hex2bin(e.keyhex),n=null!=g_local_key?AES.bin2hex(g_local_key):"";lploggedin&&g_username==e.wxusername&&n==e.keyhex||(lploggedin&&g_username==e.wxusername?(g_local_key=l,g_local_key_hex=e.keyhex,g_local_key_hash=SHA256(g_local_key)):(lploggedin&&""!=g_username&&loggedOut(!1,"differentuser"),g_local_key=l,g_local_key_hex=e.keyhex,g_local_key_hash=SHA256(g_local_key),lpWriteKeyFile(),LP.lplogincheck(!0,null,e.wxusername,e.wxhash)))}else lploggedin||LP.lplogincheck(!0)}function reorderOnURL(e,a,t,i){var l=lpParseUri(a),n=lpcanonizeUrl(a,l),r="string"==typeof l.path?l.path.split("/"):new Array,s=lp_gettld_url(a),o=new Array;for(var d in e)if(check_ident_aid(d)){var c=g_sites[d];if(void 0!==c&&void 0!==c.url&&(c.save_all||!t||""!=c.unencryptedUsername||""!=c.password)&&(!i||accthaspassword(c))){var u=lpParseUri(c.url);c.realmmatch=(a==g_basicauth_url||a==g_basicauth_origurl)&&(lpmdec_acct(c.realm_data,!0,c,g_shares)==g_basicauth_realm||g_basicauth_found&&""==g_basicauth_realm&&1==c.basic_auth),c.servermatch=l.host==u.host,c.portmatch=compare_ports(l,u),c.serverportmatch=c.servermatch&&c.portmatch?1:0,c.usernamematch=void 0!==g_username_vals[a]&&""!=g_username_vals[a]&&(g_username_vals[a]==c.unencryptedUsername||is_equivalent_email(g_username_vals[a],c.unencryptedUsername,a,c.url)),c.urlmatch=lpcanonizeUrl(c.url)==n;var f,_="string"==typeof u.path?u.path.split("/"):new Array;for(f=0;f<r.length&&f<_.length&&_[f]==r[f];f++);c.pathlevelmatch=f,c.fieldmatchcount=0,o.push(c)}}o.sort(lp_aids_sort_func);var g="string"==typeof l.path?l.path:"";return o=checkurlrules(g_urlrules,o,s,g,l.host,g_sites,get_port(l))}function lp_aids_sort_func(e,a){return e.realmmatch!=a.realmmatch?e.realmmatch?-1:1:e.usernamematch!=a.usernamematch?e.usernamematch?-1:1:e.fav!=a.fav?"1"==e.fav?-1:1:e.urlmatch!=a.urlmatch?e.urlmatch?-1:1:e.serverportmatch&&a.serverportmatch&&e.pathlevelmatch!=a.pathlevelmatch?e.pathlevelmatch>a.pathlevelmatch?-1:1:e.serverportmatch!=a.serverportmatch?e.serverportmatch?-1:1:e.servermatch!=a.servermatch?e.servermatch?-1:1:e.fieldmatchcount!=a.fieldmatchcount?e.fieldmatchcount>a.fieldmatchcount?-1:1:e.last_touch!=a.last_touch?e.last_touch>a.last_touch?-1:1:e.name!=a.name?e.name<a.name?-1:1:0}function lp_sort_case_insensitive_name(e,a){return(e=e.name.toLowerCase())<(a=a.name.toLowerCase())?-1:1}function launchautologin(e,a){if(check_ident_aid(e)){var t=g_sites[e];t&&(a||!t.pwprotect&&!g_prompts.login_site_prompt?(g_last_launch[t.aid]=(new Date).getTime(),openURL(t.url,function(e,a){g_launches[gettabid(e)]=a},t.aid)):t.pwprotect&&needs_secure_reprompt(t)?security_prompt(function(){launchautologin(e,!0)},null,null,!0,t.aid,!1):security_prompt(function(){launchautologin(e,!0)}))}}function is_max_frames_exceeded(e,a){var t=10;if(null==a)return!0;try{var i=g_CS_tops[e],l=g_CS[e][i],n="";n=g_ischrome&&l?lp_gettld_url(l.sender.tab.url):lp_gettld_url(gettaburl(l)),void 0===i?L("still waiting for topdoc to register for [tab:"+e+"] tld="+n):L("topdoc="+i+" tld="+n),n&&"dailykos.com"==n&&(t=40)}catch(e){console.error("is_max_frames_exceeded: "+e)}if(debug){var r=count_cs_for_tabid(e);r>0&&console.warn("is_max_frames_exceeded: CS table count="+r+", global g_CS_count="+g_CS_count[e]),dumpinfo_for_tabid(e)}return g_skip_ad_frames&&(t=25),a[e]>t}function fillbestCS(e,a,t,i){"number"==typeof t&&(t=t.toString());var l=get_record(t);update_cs_lastfill_aid(e,t);var n=null;return!(void 0===e||!l)&&(i||(i={aid:t}),i.cmd="fillbest",void 0===i.clearfilledfieldsonlogoff&&(i.clearfilledfieldsonlogoff=lpGetPref("clearfilledfieldsonlogoff",0)),void 0===i.realurl&&(i.realurl=l.url),l.save_all&&(n=get_SAED_username_password_fields(l)),void 0===i.username&&(l.save_all&&n&&n.length>0?i.username=n[0]:i.username=getusernamefromacct(l)),void 0===i.password&&(l.save_all&&n&&n.length>0?i.password=n[1]:i.password=getpasswordfromacct(l)),void 0===i.custom_js&&(i.custom_js=l.custom_js),void 0===i.domains&&(i.domains=getacceptabletlds(l.url)),void 0===i.is_launch&&(i.is_launch=!!(void 0!==g_launches[e]&&g_launches[e]&&g_launches[e]==l.aid&&"undefined"!=typeof g_last_launch&&void 0!==g_last_launch[l.aid]&&(new Date).getTime()-g_last_launch[l.aid]<=25e3)),void 0===i.automaticallyFill&&(i.automaticallyFill=1),void 0===i.updatefields&&(i.updatefields=0),void 0===i.addurid&&(i.addurid=0),void 0===i.aid&&(i.aid=t),void 0===i.sharedsite&&(i.sharedsite=null!=l.sharedfromaid&&""!=l.sharedfromaid&&"0"!=l.sharedfromaid&&"null"!=l.sharedfromaid?1:0),void 0===i.dontfillautocompleteoff&&(i.dontfillautocompleteoff=getInt(lpGetPref("dontfillautocompleteoff",0))),void 0===i.saveall&&(i.saveall=!!l.saveall),void 0===i.topurl&&(i.topurl=get_top_url(e,a)),write_history({cmd:"fillbestCS",tabid:e,docnum:a,aid:t,username:i.username,force_fillbest:i.force_fillbest,custom_js:i.custom_js}),sendCS(e,i,a),!0)}function fillfieldCS(e,a,t,i,l){"number"==typeof t&&(t=t.toString());var n=get_record(t);return!(void 0===e||!n)&&(i||(i={aid:t}),i.cmd="fillfield",void 0===i.clearfilledfieldsonlogoff&&(i.clearfilledfieldsonlogoff=lpGetPref("clearfilledfieldsonlogoff",0)),void 0===i.dontfillautocompleteoff&&(i.dontfillautocompleteoff=getInt(lpGetPref("dontfillautocompleteoff",0))),void 0===i.realurl&&(i.realurl=n.url),void 0===i.aid&&(i.aid=t),void 0===i.tabid&&(i.tabid=e),void 0===i.custom_js&&(i.custom_js=n.custom_js),void 0===i.domains&&(i.domains=getacceptabletlds(n.url)),void 0===i.is_launch&&(i.is_launch=!!(void 0!==g_launches[e]&&g_launches[e]&&g_launches[e]==n.aid&&"undefined"!=typeof g_last_launch&&void 0!==g_last_launch[n.aid]&&(new Date).getTime()-g_last_launch[n.aid]<=25e3)),void 0===i.automaticallyFill&&(i.automaticallyFill=1),void 0===i.from_iframe&&(i.from_iframe=0),void 0===i.formname&&(i.formname=""),void 0===i.type&&(i.type="text"),void 0===i.doconfirm&&(i.doconfirm=2),void 0!==i.delayquants&&parseInt(i.delayquants)||(i.delayquants=0),void 0===i.topurl&&(i.topurl=get_top_url(e,a)),""!=n.custom_js&&(i.username=getusernamefromacct(n),i.password=getpasswordfromacct(n),i.onlyfill=l?0:1),void 0===i.name||void 0===i.value?(console_error("missing required fields!"),!1):(write_history({cmd:"fillfieldCS",tabid:e,docnum:a,aid:i.aid,name:i.name,custom_js:i.custom_js,manualfill:i.manualfill,is_launch:i.is_launch,originator:i.originator,delay:i.humanize?i.delayquants:null}),i.humanize&&i.delayquants?setTimeout(function(){sendCS(e,i,a)},i.delayquants*HUMANIZE_DELAY_QUANTUM):sendCS(e,i,a),!0))}function submitCS(e,a,t,i){"number"==typeof t&&(t=t.toString());var l=get_record(t);if(void 0===e||!l)return!1;var n=void 0!==l.submit_id?l.submit_id:"",r=void 0!==l.submit_html?l.submit_html:"",s=void 0!==l.submit_js?l.submit_js:"";return i||(i={aid:t}),i.cmd="submit",void 0===i.aid&&(i.aid=t),void 0===i.custom_js&&(i.custom_js=l.custom_js),void 0===i.submit_id&&(i.submit_id=n),void 0===i.submit_html&&(i.submit_html=r),void 0===i.submit_js&&(i.submit_js=s),void 0!==i.delayquants&&parseInt(i.delayquants)||(i.delayquants=0),is_guiless()&&"bankofamerica.com"==lp_gettld_url(l.url)?pass:(write_history({cmd:"submitCS",tabid:e,docnum:a,aid:t,submit_id:n,submit_js:s,delay:i.humanize?i.delayquants:null}),i.humanize&&i.delayquants?setTimeout(function(){sendCS(e,i,a)},i.delayquants*HUMANIZE_DELAY_QUANTUM):sendCS(e,i,a)),!0}function customjs_has_humanize(e){var a=get_record(e);return!!a&&("string"==typeof a.custom_js&&a.custom_js.indexOf("lphumanize")>=0)}function customjs_has_v2humanize(e){var a=get_record(e);return!!a&&("string"==typeof a.custom_js&&a.custom_js.indexOf("lpv2humanize=1")>=0)}function customjs_has_dontsubmit(e){var a=get_record(e);return!!a&&("string"==typeof a.custom_js&&a.custom_js.indexOf("lpdontsubmit")>=0)}function check_for_frame_mismatch_ok(e,a,t,i){if(!t||null==e)return!1;var l=0;return void 0!==a&&a&&(l=a),!(l&&!frame_and_topdoc_has_same_domain(e)&&(ftd_report_error(e,i||"unknown"),!lpConfirmYesNo(t+"\n\n"+lp_gettld_url(ftd_get_frameparenturl(e)))))}function set_casper_active_tab(e,a){if(g_iscasper&&e){var t=g_CS[g_CS_tops[a]];e.casper_activeTab=t}return!0}function get_casper_active_tab(e){return g_iscasper&&e&&e.casper_activeTab?e.casper_activeTab:null}function count_fillfield_confirms(){var e,a=0;for(e in Object.keys(g_fillfield_confirm_perfield))!0===g_fillfield_confirm_perfield[e]&&a++;return a}function sufficient_condition_fill_saveall(e){if(!e)return!1;var a,t=null,i=null;if(count_fillfield_confirms()>=3){for(a in e.fields)if(e.fields.hasOwnProperty(a)&&e.fields[a]&&("text"==e.fields[a].type||"email"==e.fields[a].type||"tel"==e.fields[a].type)&&""!=e.fields[a].value){t=e.fields[a].name;break}for(a in e.fields)if(e.fields.hasOwnProperty(a)&&e.fields[a]&&"password"==e.fields[a].type&&""!=e.fields[a].value){i=e.fields[a].name;break}if(t&&i)return!0}return!1}function customjs_has_force_fillbest(e){var a=get_record(e);return!!a&&("string"==typeof a.custom_js&&a.custom_js.indexOf("__lpforcefillbest")>=0)}function sufficient_condition_fill_nonsaveall(e){if(!e)return!1;var a=null,t=null;return!!(count_fillfield_confirms()>=2&&(a=getusernamefromacct(e),t=getpasswordfromacct(e),a&&t))}function customjs_has_userpass_overrides(e){var a=get_record(e);return!!a&&("string"==typeof a.custom_js&&(a.custom_js.indexOf("lpcurrpass")>=0||a.custom_js.indexOf("lpcurruser")>=0))}function clearformsCS(e,a){return!!e&&(void 0!==a&&null!==a||(a="all"),write_history({cmd:"clearformsCS",tabid:e,docnum:a}),sendCS(e,{cmd:"clearforms"},a),!0)}function given_username_in_accts(e,a,t){var i=null;if(!e)return!1;if(!a)return!0;for(var l=0;l<e.length;l++)if(i=e[l]){if(a==i.unencryptedUsername)return!0;if(is_equivalent_email(a,i.unencryptedUsername,t,t))return!0}return!1}
//# sourceMappingURL=sourcemaps/fromcs.js.map