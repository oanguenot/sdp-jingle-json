!function(n){if("function"==typeof bootstrap)bootstrap("sjj",n);else if("object"==typeof exports)module.exports=n();else if("function"==typeof define&&define.amd)define(n);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeSJJ=n}else"undefined"!=typeof window?window.SJJ=n():global.SJJ=n()}(function(){return function(n,r,t){function e(t,s){if(!r[t]){if(!n[t]){var a="function"==typeof require&&require;if(!s&&a)return a(t,!0);if(i)return i(t,!0);throw new Error("Cannot find module '"+t+"'")}var o=r[t]={exports:{}};n[t][0].call(o.exports,function(r){var i=n[t][1][r];return e(i?i:r)},o,o.exports)}return r[t].exports}for(var i="function"==typeof require&&require,s=0;s<t.length;s++)e(t[s]);return e}({1:[function(n,r,t){var e=n("./lib/tosdp"),i=n("./lib/tojson");t.toSessionSDP=e.toSessionSDP,t.toMediaSDP=e.toMediaSDP,t.toCandidateSDP=e.toCandidateSDP,t.toSessionJSON=i.toSessionJSON,t.toMediaJSON=i.toMediaJSON,t.toCandidateJSON=i.toCandidateJSON},{"./lib/tojson":3,"./lib/tosdp":4}],2:[function(n,r,t){t.findLine=function(n,r,t){for(var e=n.length,i=0;i<r.length;i++)if(r[i].substr(0,e)===n)return r[i];if(!t)return!1;for(var s=0;s<t.length;s++)if(t[s].substr(0,e)===n)return t[s];return!1},t.findLines=function(n,r){for(var t=[],e=n.length,i=0;i<r.length;i++)r[i].substr(0,e)===n&&t.push(r[i]);return t},t.mline=function(n){for(var r=n.substr(2).split(" "),t={media:r[0],port:r[1],proto:r[2],formats:[]},e=3;e<r.length;e++)r[e]&&t.formats.push(r[e]);return t},t.rtpmap=function(n){var r=n.substr(9).split(" "),t={id:r.shift()};return r=r[0].split("/"),t.name=r[0],t.clockrate=r[1],t.channels=3==r.length?r[2]:"1",t},t.fmtp=function(n){for(var r,t,e,i=n.substr(n.indexOf(" ")+1).split(";"),s=[],a=0;a<i.length;a++)r=i[a].split("="),t=r[0].trim(),e=r[1],t&&e?s.push({key:t,value:e}):t&&s.push({key:"",value:t});return s},t.crypto=function(n){var r=n.substr(9).split(" "),t={tag:r[0],cipherSuite:r[1],keyParams:r[2],sessionParams:r.slice(3).join(" ")};return t},t.fingerprint=function(n){var r=n.substr(14).split(" ");return{hash:r[0],value:r[1]}},t.extmap=function(n){var r=n.substr(9).split(" "),t={},e=r.shift(),i=e.indexOf("/");return i>=0?(t.id=e.substr(0,i),t.senders=e.substr(i)):(t.id=e,t.senders="sendrecv"),t.uri=r.shift(),t},t.rtcpfb=function(n){var r=n.substr(10).split(" "),t={};return t.id=r.shift(),t.type=r.shift(),"trr-int"===t.type?t.value=r.shift():t.subtype=r.shift(),t.parameters=r,t},t.candidate=function(n){for(var r=n.substring(12).split(" "),t={foundation:r[0],component:r[1],protocol:r[2].toLowerCase(),priority:r[3],ip:r[4],port:r[5],type:r[7]},e=8;e<r.length;e+=2)"raddr"===r[e]?t.relAddr=r[e+1]:"rport"===r[e]?t.relPort=r[e+1]:"generation"===r[e]&&(t.generation=r[e+1]);return t.network="1",t},t.ssrc=function(n){for(var r,t,e=[],i={},s=0;s<n.length;s++){r=n[s].substr(7).split(" "),t=r.shift(),r=r.join(" ").split(":");var a=r.shift(),o=r.join(":")||null;i[t]||(i[t]={}),i[t][a]=o}for(t in i){var p=i[t];p.ssrc=t,e.push(p)}return e},t.grouping=function(n){for(var r,t=[],e=0;e<n.length;e++)r=n[e].substr(8).split(" "),t.push({semantics:r.shift(),contents:r});return t}},{}],3:[function(n,r,t){var e=n("./parsers"),i=Math.random();t.toSessionJSON=function(n,r){for(var i=n.split("\r\nm="),s=1;s<i.length;s++)i[s]="m="+i[s],s!==i.length-1&&(i[s]+="\r\n");var a=i.shift()+"\r\n",o=a.split("\r\n"),p={},u=[];i.forEach(function(n){u.push(t.toMediaJSON(n,a,r))}),p.contents=u;var f=e.findLines("a=group:",o);return f.length&&(p.groupings=e.grouping(f)),p},t.toMediaJSON=function(n,r,i){var s=n.split("\r\n"),a=r.split("\r\n"),o=e.mline(s[0]),p={creator:i,name:o.media,description:{descType:"rtp",media:o.media,formats:[],payloads:[],encryption:[],feedback:[],headerExtensions:[]},transport:{transType:"iceUdp"}},u=p.description,f=p.transport,c=e.findLine("a=ssrc:",s);c&&(u.ssrc=c.substr(7).split(" ")[0]);var d=e.findLine("a=mid:",s);d&&(p.name=d.substr(6)),e.findLine("a=sendrecv",s,a)?p.senders="both":e.findLine("a=sendonly",s,a)?p.senders="initiator":e.findLine("a=recvonly",s,a)?p.senders="responder":e.findLine("a=inactive",s,a)&&(p.senders="none");var h=e.findLines("a=rtpmap:",s);h.forEach(function(n){var r=e.rtpmap(n);r.feedback=[];var t=e.findLines("a=fmtp:"+r.id,s);t.forEach(function(n){r.parameters=e.fmtp(n)});var i=e.findLines("a=rtcp-fb:"+r.id,s);i.forEach(function(n){r.feedback.push(e.rtcpfb(n))}),u.payloads.push(r),u.formats.push(r.id)});var l=e.findLines("a=crypto:",s,a);l.forEach(function(n){u.encryption.push(e.crypto(n))}),e.findLine("a=rtcp-mux",s)&&(u.mux=!0);var v=e.findLines("a=rtcp-fb:*",s);v.forEach(function(n){u.feedback.push(e.rtcpfb(n))});var m=e.findLines("a=extmap:",s);m.forEach(function(n){var r=e.extmap(n),t={sendonly:"responder",recvonly:"initiator",sendrecv:"both",inactive:"none"};r.senders=t[r.senders],u.headerExtensions.push(r)});var b=e.findLines("a=ssrc:",s);b.length&&(u.ssrcs=e.ssrc(b));var y=e.findLine("a=fingerprint:",s,a);y&&(f.fingerprint=e.fingerprint(y));var g=e.findLine("a=ice-ufrag:",s,a),S=e.findLine("a=ice-pwd:",s,a);if(g&&S){f.ufrag=g.substr(12),f.pwd=S.substr(10),f.candidates=[];var P=e.findLines("a=candidate:",s,a);P.forEach(function(n){f.candidates.push(t.toCandidateJSON(n))})}return p},t.toCandidateJSON=function(n){var r=e.candidate(n);return r.id=(i++).toString(36).substr(0,12),r}},{"./parsers":2}],4:[function(n,r,t){var e={initiator:"sendonly",responder:"recvonly",both:"sendrecv",none:"inactive",sendonly:"initator",recvonly:"responder",sendrecv:"both",inactive:"none"};t.toSessionSDP=function(n){var r=["v=0","o=- "+(n.sid||Date.now())+" 2 IN IP4 0.0.0.0","s=-","t=0 0"],e=n.groupings||[];e.forEach(function(n){r.push("a=group:"+n.semantics+" "+n.contents.join(" "))});var i=n.contents||[];return i.forEach(function(n){r.push(t.toMediaSDP(n))}),r.join("\r\n")+"\r\n"},t.toMediaSDP=function(n){var r=[],i=n.description,s=n.transport,a=[i.media,"1"];if(i.encryption&&i.encryption.length>0||s&&s.fingerprint?a.push("RTP/SAVPF"):a.push("RTP/AVPF"),a.push(i.formats.join(" ")),r.push("m="+a.join(" ")),r.push("c=IN IP4 0.0.0.0"),r.push("a=rtcp:1 IN IP4 0.0.0.0"),s&&(s.ufrag&&r.push("a=ice-ufrag:"+s.ufrag),s.pwd&&r.push("a=ice-pwd:"+s.pwd),s.fingerprint)){var o=s.fingerprint;r.push("a=fingerprint:"+o.hash+" "+o.value)}r.push("a="+(e[n.senders]||"sendrecv")),r.push("a=mid:"+n.name),i.mux&&r.push("a=rtcp-mux");var p=i.encryption||[];p.forEach(function(n){r.push("a=crypto:"+n.tag+" "+n.cipherSuite+" "+n.keyParams+" "+n.sessionParams)});var u=i.payloads||[];u.forEach(function(n){var t="a=rtpmap:"+n.id+" "+n.name+"/"+n.clockrate;if(n.channels&&"1"!=n.channels&&(t+="/"+n.channels),r.push(t),n.parameters&&n.parameters.length){var e=["a=fmtp:"+n.id];n.parameters.forEach(function(n){e.push((n.key?n.key+"=":"")+n.value)}),r.push(e.join(" "))}n.feedback&&n.feedback.forEach(function(t){"trr-int"===t.type?r.push("a=rtcp-fb:"+n.id+" trr-int "+t.value?t.value:"0"):r.push("a=rtcp-fb:"+n.id+" "+t.type+(t.subtype?" "+t.subtype:""))})}),i.feedback&&i.feedback.forEach(function(n){"trr-int"===n.type?r.push(n.value):r.push("a=rtcp-fb:* "+n.type+(n.subtype?" "+n.subtype:""))});var f=i.headerExtensions||[];f.forEach(function(n){r.push("a=extmap:"+n.id+(n.senders?"/"+e[n.senders]:"")+" "+n.uri)});var c=i.ssrcs||[];c.forEach(function(n){for(var t in n)"ssrc"!=t&&r.push("a=ssrc:"+n.ssrc+" "+t+(n[t]?":"+n[t]:""))});var d=s.candidates||[];return d.forEach(function(n){r.push(t.toCandidateSDP(n))}),r.join("\r\n")},t.toCandidateSDP=function(n){var r=[];r.push(n.foundation),r.push(n.component),r.push(n.protocol),r.push(n.priority),r.push(n.ip),r.push(n.port);var t=n.type;return r.push("type"),r.push(t),("srflx"===t||"prflx"===t||"relay"===t)&&n.relAddr&&n.relPort&&(r.push("raddr"),r.push(n.relAddr),r.push("rport"),r.push(n.relPort)),r.push("generation"),r.push(n.generation||"0"),"a=candidate:"+r.join(" ")}},{}]},{},[1])(1)});