/* ============================================================================
   app.js: the engine. Reads every word from content.js (window.CONTENT).
   GSAP is optional: if the CDN fails, every effect falls back to CSS.
   ========================================================================== */
(function(){
"use strict";
var C = window.CONTENT || {};
/* ---- which site: the wedding (default) or a version from content.js, e.g. ?event=engagement ---- */
var EVENT = (function(){
  var q = new URLSearchParams(location.search), v = q.get("event") || q.get("e") || "";
  if (!v && q.has("engagement")) v = "engagement";
  return (C.versions && C.versions[v]) ? v : "wedding";
})();
function merge(base, over){                      /* plain objects merge deeply; lists, values and the map replace */
  Object.keys(over).forEach(function(k){
    var b = base[k], o = over[k];
    if (k !== "map" && o && b && typeof o === "object" && typeof b === "object" && !Array.isArray(o) && !Array.isArray(b)) merge(b, o);
    else base[k] = o;
  });
  return base;
}
if (EVENT !== "wedding") merge(C, C.versions[EVENT]);
document.documentElement.setAttribute("data-event", EVENT);
if (C.pageTitle) document.title = C.pageTitle;
var UI = C.ui || {};
var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
var G = window.gsap, hasSplit = !!(G && window.SplitText && window.ScrollTrigger) && !reduced;
if (hasSplit) G.registerPlugin(window.ScrollTrigger, window.SplitText);
var $ = function(s, r){ return (r||document).querySelector(s); };
var $$ = function(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };
var ROMAN = ["I","II","III","IV","V","VI","VII","VIII"];
var TZ = "Asia/Kolkata";

/* ============================ language ============================ */
var LANGS = ["en","ml"], lang = C.defaultLang || "en";
try{ lang = localStorage.getItem("invite-lang") || lang; }catch(e){}
if (LANGS.indexOf(lang) < 0) lang = "en";

function dig(o, path){
  var v = o; path.split(".").forEach(function(k){ v = (v == null) ? v : v[k]; });
  return v == null ? "" : v;
}
/* the string AND the language it really came from; untranslated keys stay English */
function tl(key){
  var v = dig(UI[lang] || {}, key);
  if (v !== "") return { v:v, l:lang };
  return { v: dig(UI.en || {}, key), l:"en" };
}
function t(key){ return tl(key).v; }
function setT(el, key){ var r = tl(key); el.textContent = r.v; el.setAttribute("lang", r.l); return el; }
function el(tag, cls, key){ var e = document.createElement(tag); if (cls) e.className = cls; if (key) setT(e, key); return e; }
function loc(){ return lang === "ml" ? "ml-IN" : "en-IN"; }
function fmtDate(iso){ try{ return new Intl.DateTimeFormat(loc(), {weekday:"long", day:"numeric", month:"long", year:"numeric", timeZone:TZ}).format(new Date(iso)); }catch(e){ return iso.slice(0,10); } }
function fmtTime(iso){ try{ return new Intl.DateTimeFormat(loc(), {hour:"numeric", minute:"2-digit", timeZone:TZ}).format(new Date(iso)); }catch(e){ return iso.slice(11,16); } }

function applyLang(){
  revertSplits();
  document.documentElement.lang = lang;
  $$("[data-t]").forEach(function(n){ var r = tl(n.getAttribute("data-t")); if (r.v){ n.textContent = r.v; n.setAttribute("lang", r.l); } });
  $$("[data-t-html]").forEach(function(n){
    var r = tl(n.getAttribute("data-t-html"));
    if (r.v){ n.innerHTML = String(r.v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\n/g,"<br>"); n.setAttribute("lang", r.l); }
  });
  $$(".langs button").forEach(function(b){ var on = b.getAttribute("data-l") === lang; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
  fillFacts(); buildEvents(); buildMapLabels();
  makeSplits();
}
$$(".langs button").forEach(function(b){
  b.addEventListener("click", function(){
    lang = b.getAttribute("data-l");
    try{ localStorage.setItem("invite-lang", lang); }catch(e){}
    applyLang();
  });
});

/* ============================ facts ============================ */
var WA_ICON = '<svg class="wa" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 1 1-4.2 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8z"/><path fill="currentColor" d="M8.6 7.2c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.3.3-1 .9-1 2.3s1 2.7 1.2 2.9c.1.2 2 3.1 4.9 4.3 2.4.9 2.9.8 3.4.7.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3l-2-.9c-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.8-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2z"/></svg>';
function fillFacts(){
  $$("[data-names]").forEach(function(n){ n.textContent = C.namesLatin || ""; n.setAttribute("lang","en"); });
  $$("[data-date]").forEach(function(n){ n.textContent = C.date || ""; });
  $$("[data-groom]").forEach(function(n){ n.textContent = C.groom || ""; });
  $$("[data-bride]").forEach(function(n){ n.textContent = C.bride || ""; });
  $(".couple").classList.toggle("bride-first", !!C.brideFirst);
  ["groom","bride"].forEach(function(who){
    var f = (C.families || {})[who] || {}, box = $('[data-fam="'+who+'"]');
    if (!box) return;
    box.textContent = "";
    var lines = [f.parents, f.house, f.place].filter(Boolean);
    lines.forEach(function(line, i){
      if (i) box.appendChild(document.createElement("br"));
      var s = document.createElement(i === 0 ? "b" : "span"); s.textContent = line; box.appendChild(s);
    });
    var rel = box.previousElementSibling;           /* "Son of / Daughter of" only when parents are given */
    if (rel) rel.hidden = !f.parents;
    box.hidden = !lines.length;
  });
  var q = C.quote || {};
  $("#quoteText").textContent = q[lang] || q.en || "";
  $("#quoteText").setAttribute("lang", q[lang] ? lang : "en");
  $(".verse").hidden = !(q[lang] || q.en);
  $("#cdDate").textContent = C.weddingISO ? fmtDate(C.weddingISO) + " · " + fmtTime(C.weddingISO) : "";
  $$("[data-contacts]").forEach(function(box){
    box.textContent = "";
    (C.phones || []).forEach(function(p){
      if (!p.num) return;
      var a = document.createElement("a"); a.href = "https://wa.me/91" + p.num;   /* opens WhatsApp */
      a.target = "_blank"; a.rel = "noopener";
      a.innerHTML = WA_ICON;
      a.appendChild(document.createTextNode(p.name + " · +91 " + p.num.replace(/(\d{5})(\d{5})/, "$1 $2")));
      a.setAttribute("aria-label", "WhatsApp " + p.name + " +91 " + p.num);
      box.appendChild(a);
    });
    box.hidden = !box.children.length;
  });
}
$("#gmap").src = C.mapEmbed || "";
$("#mapLink").href = C.mapLink || "#";

/* ============================ events ============================ */
function upcoming(ev){ return new Date(ev.endISO || ev.startISO).getTime() > Date.now(); }
function buildEvents(){
  var box = $("#evList"); box.textContent = "";
  (C.events || []).forEach(function(ev, i){
    var a = el("article", "ev rv" + (upcoming(ev) ? "" : " past"));
    a.setAttribute("data-d", i);
    a.appendChild(el("p", "rn")).textContent = ROMAN[i];
    a.appendChild(el("h3", "", "ev." + ev.key + ".t"));
    a.appendChild(el("p", "sub", "ev." + ev.key + ".s"));
    a.appendChild(el("p", "when")).textContent = fmtDate(ev.startISO) + " · " + (ev.whenKey ? t(ev.whenKey) : fmtTime(ev.startISO));
    var w = a.appendChild(el("p", "where")); w.textContent = ev.venue || ""; w.setAttribute("lang","en");
    a.appendChild(el("p", "desc", "ev." + ev.key + ".p"));
    if (ev.map){
      var b = a.appendChild(el("a", "btn", "directions"));
      b.href = ev.map; b.target = "_blank"; b.rel = "noopener";
    }
    box.appendChild(a);
  });
  observeReveals(box);
}

/* ============================ countdown ============================ */
(function(){
  var target = new Date(C.weddingISO || 0).getTime(), last = {};
  var ids = { D:$("#cdD"), H:$("#cdH"), M:$("#cdM"), S:$("#cdS") };
  function pad(n){ return n < 10 ? "0" + n : "" + n; }
  function put(k, v){
    if (last[k] === v) return;
    var n = ids[k], old = n.querySelector("span:not(.out)");
    var s = document.createElement("span"); s.textContent = v;
    if (old && !reduced){
      old.className = "out"; s.className = "in";
      setTimeout(function(){ if (old.parentNode) old.parentNode.removeChild(old); }, 650);
    } else n.textContent = "";
    n.appendChild(s); last[k] = v;
  }
  function tick(){
    var d = Math.max(0, target - Date.now());
    put("D", String(Math.floor(d / 864e5)));
    put("H", pad(Math.floor(d / 36e5) % 24));
    put("M", pad(Math.floor(d / 6e4) % 60));
    put("S", pad(Math.floor(d / 1e3) % 60));
  }
  tick(); setInterval(tick, 1000);
})();

/* ============================ add to calendar ============================ */
(function(){
  var evs = C.events || [], first = evs.filter(function(e){ return e.key === "matrimony"; })[0] || evs[0];
  if (!first) { $(".cal").hidden = true; return; }
  var day = first.startISO.slice(0, 10);              /* the main day: its events only (a later ceremony isn't folded in) */
  var last = evs.filter(function(e){ return e.startISO.slice(0, 10) === day; }).pop() || first;
  function utc(iso){ return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
  var start = utc(first.startISO), end = utc(last.endISO || last.startISO);
  function title(){ return t("calTitle") || ("Wedding of " + (C.namesLatin || "")); }
  var where = first.venue + ", " + first.address;
  function details(){ return (C.mapLink || "") ; }
  $("#calGoogle").addEventListener("click", function(){
    this.href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent(title()) + "&dates=" + start + "/" + end +
      "&location=" + encodeURIComponent(where) + "&details=" + encodeURIComponent(details());
  });
  $("#calIcs").addEventListener("click", function(){
    var esc = function(s){ return String(s).replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n"); };
    var ics = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//invitation//EN","CALSCALE:GREGORIAN","BEGIN:VEVENT",
      "UID:" + start + "-wedding@invitation", "DTSTAMP:" + utc(new Date().toISOString()),
      "DTSTART:" + start, "DTEND:" + end, "SUMMARY:" + esc(title()), "LOCATION:" + esc(where),
      "DESCRIPTION:" + esc(details()), "END:VEVENT","END:VCALENDAR"].join("\r\n");
    var url = URL.createObjectURL(new Blob([ics], {type:"text/calendar;charset=utf-8"}));
    var a = document.createElement("a"); a.href = url; a.download = "wedding.ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(url); }, 4000);
  });
})();

/* ============================ illustrated map (to scale) ============================
   Real latitude/longitude from content.js → a 400 × 400 drawing (~25 km square,
   so one flat projection is accurate enough). Each site brings its own map.   */
var mapInner = $("#mapInner"), MAP = C.map, mapLabels = [], mapTexts = [];
(function buildMap(){
  if (!MAP || !MAP.venue){ $("#mapCard").hidden = true; return; }
  var B = MAP.bounds, S = 400;
  var P = function(a){ return [ (a[1] - B.west) / (B.east - B.west) * S, (B.north - a[0]) / (B.north - B.south) * S ]; };
  var f = function(n){ return n.toFixed(1); };
  function curve(pts){                              /* smooth line through points (Catmull-Rom → Bézier) */
    var p = pts.map(P), d = "M" + f(p[0][0]) + " " + f(p[0][1]);
    for (var i = 0; i < p.length - 1; i++){
      var p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
      d += " C" + f(p1[0] + (p2[0] - p0[0]) / 6) + " " + f(p1[1] + (p2[1] - p0[1]) / 6) + " " +
                  f(p2[0] - (p3[0] - p1[0]) / 6) + " " + f(p2[1] - (p3[1] - p1[1]) / 6) + " " + f(p2[0]) + " " + f(p2[1]);
    }
    return d;
  }
  function label(id, at, side, cls, gap){           /* a <text> beside a point; filled in per language later */
    var p = P(at), g = gap || 14, x = p[0], y = p[1], anchor = "middle";
    if (side === "left"){ x -= g; anchor = "end"; } else if (side === "above"){ y -= g; } else { x += g; anchor = "start"; }
    return '<text class="' + cls + '" id="' + id + '" x="' + f(x) + '" y="' + f(y) + '" text-anchor="' + anchor + '"></text>';
  }
  var kmW = (B.east - B.west) * 111.32 * Math.cos((B.north + B.south) / 2 * Math.PI / 180), km5 = S * 5 / kmW;
  var svg = '<svg viewBox="0 0 400 400" aria-hidden="true">';
  if (MAP.lake){
    var lk = MAP.lake;
    svg += '<path d="' + curve(lk) + ' L0 ' + f(P(lk[lk.length - 1])[1]) + ' L0 ' + f(P(lk[0])[1]) + ' Z" fill="#3D6E99" opacity=".15"/>' +
           '<path d="M8 300 q5 -4 10 0 t10 0 M10 330 q5 -4 10 0 t10 0 M6 360 q5 -4 10 0 t10 0" stroke="#3D6E99" stroke-width="1" fill="none" opacity=".45"/>' +
           '<text class="m-label" id="lab-lake" x="24" y="250" text-anchor="middle" transform="rotate(-80 24 250)" fill="#1E3A55"></text>';
    mapTexts.push(["#lab-lake", "lmLake"]);
  }
  if (MAP.rail) svg += '<path d="' + curve(MAP.rail) + '" stroke="#5A5045" stroke-width="3.2" fill="none" opacity=".7"/>' +
                       '<path d="' + curve(MAP.rail) + '" stroke="#FFFBF2" stroke-width="1.6" stroke-dasharray="5 5" fill="none"/>';
  var roads = (MAP.roads || []).slice().sort(function(a, b){ return (a.major ? 1 : 0) - (b.major ? 1 : 0); });
  roads.forEach(function(r, i){
    var d = curve(r.pts);
    svg += '<path d="' + d + '" stroke="' + (r.major ? "#D9B98A" : "#E6D3AE") + '" stroke-width="' + (r.major ? 9 : 6.5) + '" fill="none" stroke-linecap="round"/>' +
           '<path d="' + d + '" stroke="#5A5045" stroke-width="' + (r.major ? .8 : .7) + '" stroke-dasharray="' + (r.major ? "4 5" : "3 5") + '" fill="none"/>';
    if (r.name){                                     /* label along the road, on a copy that reads left to right */
      svg += '<path id="road' + i + '" d="' + (r.flip ? curve(r.pts.slice().reverse()) : d) + '" fill="none"/>' +
             '<text class="m-road" dy="-6"><textPath href="#road' + i + '" startOffset="' + (r.labelAt || "50%") + '" text-anchor="middle" id="lab-road' + i + '"></textPath></text>';
      mapTexts.push(["#lab-road" + i, r.name]);
    }
  });
  (MAP.routes || []).forEach(function(rt){ svg += '<path class="m-route" d="' + curve(rt) + '"/>'; });
  (MAP.towns || []).forEach(function(tw, i){
    var p = P(tw.at);
    svg += '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="2.6" fill="#26231F"/>' + label("lab-tw" + i, tw.at, tw.label, "m-town", 7);
    mapTexts.push(["#lab-tw" + i, tw.key]);
  });
  var vp = P(MAP.venue.at);                         /* the church */
  svg += '<g transform="translate(' + f(vp[0]) + ' ' + f(vp[1] - 24) + ')" stroke="#26231F" stroke-width="1.2" fill="#FFFBF2" stroke-linejoin="round">' +
         '<path d="M-8 12 V2 L0 -5 L8 2 V12Z"/><path d="M0 -5 V-12 M-3 -9 H3" fill="none"/><path d="M-2.2 12 V7 a2.2 2.2 0 0 1 4.4 0 V12" fill="none"/></g>';
  svg += '<g transform="translate(374 70)" fill="#26231F"><path d="M0 -14 L4 2 L0 -1 L-4 2Z"/><text y="16" text-anchor="middle" class="m-small">N</text></g>' +
         '<g transform="translate(' + f(388 - km5) + ' 380)" stroke="#26231F" stroke-width="1.2"><path d="M0 -4 V0 H' + f(km5) + ' V-4" fill="none"/>' +
         '<text x="' + f(km5 / 2) + '" y="-7" text-anchor="middle" class="m-small" stroke="none" fill="#26231F">5 km</text></g>';
  (MAP.exits || []).forEach(function(ex, i){        /* arrows where a road leaves the map */
    var p = P(ex.at);
    svg += '<g transform="translate(' + f(p[0]) + ' ' + f(p[1] + 18) + ') rotate(' + (ex.dir || 0) + ')"><path d="M0 0 V-18 M-5 -12 L0 -18 L5 -12" stroke="' + (ex.hotspot ? "#A93D2A" : "#5A5045") + '" stroke-width="2" fill="none" stroke-linecap="round"/></g>' +
           label("lab-ex" + i, [ex.at[0] - (B.north - B.south) * .01, ex.at[1]], ex.label, ex.hotspot ? "m-label" : "m-small", 12);
    mapTexts.push(["#lab-ex" + i, ex.key]);
  });
  /* tappable spots: the venue, the stations, and exits that have a tooltip */
  var spots = [ { l:MAP.venue, kind:"venue" } ]
    .concat((MAP.places || []).map(function(pl){ return { l:pl, kind:"train" }; }))
    .concat((MAP.exits || []).filter(function(ex){ return ex.hotspot; }).map(function(ex){ return { l:{ key:ex.hotspot, at:ex.at, dist:ex.dist }, kind:"air", nolabel:true }; }));
  spots.forEach(function(sp, i){ if (!sp.nolabel) svg += label("lab-s" + i, sp.l.at, sp.l.label, "m-label", 14); });
  mapInner.innerHTML = svg + "</svg>";
  $$(".m-route", mapInner).forEach(function(p, i){ p.style.setProperty("--len", Math.ceil(p.getTotalLength())); p.style.transitionDelay = (.3 + i * .45) + "s"; });

  spots.forEach(function(sp, i){
    var p = P(sp.l.at), isV = sp.kind === "venue", b = document.createElement(isV ? "a" : "button");
    b.className = "mspot " + sp.kind + (p[0] < 100 ? " edge-l" : p[0] > 300 ? " edge-r" : "") + (p[1] < 80 ? " below" : "");
    if (isV){ b.href = C.mapLink || "#"; b.target = "_blank"; b.rel = "noopener"; } else b.type = "button";
    b.style.left = (p[0] / S * 100) + "%"; b.style.top = (p[1] / S * 100) + "%";
    b.style.setProperty("--pd", (i * .7) + "s");
    b.innerHTML = '<i></i><span class="mtip"><span class="mt"></span><small></small></span>';
    b.addEventListener("click", function(e){
      if (isV) return;
      e.stopPropagation();
      var was = b.classList.contains("open");
      $$(".mspot", mapInner).forEach(function(o){ o.classList.remove("open"); });
      if (!was) b.classList.add("open");
    });
    mapInner.appendChild(b);
    mapLabels.push({ sp:sp, b:b, text:$("#lab-s" + i, mapInner) });
  });
  document.addEventListener("click", function(){ $$(".mspot", mapInner).forEach(function(o){ o.classList.remove("open"); }); });
})();
function svgLines(node, text){
  node.textContent = "";
  var lines = String(text).split("\n"), y0 = -(lines.length - 1) * 0.55;
  lines.forEach(function(line, i){
    var ts = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    ts.setAttribute("x", node.getAttribute("x")); ts.setAttribute("dy", (i === 0 ? y0 + 0.35 : 1.1) + "em");
    ts.textContent = line; node.appendChild(ts);
  });
}
function buildMapLabels(){
  if (!MAP) return;
  mapLabels.forEach(function(m){
    var l = m.sp.l, r = tl(l.key);
    var extra = l.dist || (m.sp.kind === "venue" ? t("tapDirections") : "");
    m.b.querySelector(".mt").textContent = r.v; m.b.querySelector(".mt").setAttribute("lang", r.l);
    m.b.querySelector("small").textContent = extra;
    m.b.setAttribute("aria-label", r.v + (extra ? ", " + extra : ""));
    if (m.text){
      var s = tl(l.short || l.key);
      svgLines(m.text, l.short ? s.v : String(s.v).replace(", ", "\n"));
      m.text.setAttribute("lang", s.l);
    }
  });
  mapTexts.forEach(function(p){ var n = $(p[0], mapInner); if (n) setT(n, p[1]); });
}

/* ============================ reveals ============================ */
var io = new IntersectionObserver(function(es){
  es.forEach(function(en){ if (en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } });
}, { threshold:.14, rootMargin:"0px 0px -4% 0px" });
function observeReveals(root){
  $$(".rv", root).forEach(function(e){
    if (e.classList.contains("in")) return;
    var d = e.getAttribute("data-d"); if (d) e.style.transitionDelay = (d * .15) + "s";
    io.observe(e);
  });
}

/* ---- headline line-reveals with SplitText (CSS .rv fallback without GSAP) ---- */
var splits = [];
function makeSplits(){
  $$("[data-split]").forEach(function(n){
    if (!hasSplit){ n.classList.add("rv"); if (!n.classList.contains("in")) io.observe(n); return; }
    n.classList.remove("rv"); n.classList.add("split-ready");
    if (n._done) return;
    var sp = window.SplitText.create(n, { type:"lines", mask:"lines" });
    var tw = G.from(sp.lines, { yPercent:110, opacity:0, duration:1.15, ease:"power3.out", stagger:.12,
      scrollTrigger:{ trigger:n, start:"top 90%", once:true }, onComplete:function(){ n._done = true; } });
    splits.push({ sp:sp, tw:tw });
  });
}
function revertSplits(){
  splits.forEach(function(s){ if (s.tw.scrollTrigger) s.tw.scrollTrigger.kill(); s.tw.kill(); s.sp.revert(); });
  splits = [];
}

/* ============================ scroll: nav, pill, hero turn ============================ */
var nav = $("#nav"), pill = $("#rsvpPill"), rsvpSec = $("#rsvp"), ticking = false;
function onScroll(){
  ticking = false;
  nav.classList.toggle("solid", scrollY > 40);
  nav.classList.toggle("away", heroCard.getBoundingClientRect().bottom > 0);   /* phones: header waits until the card has left */
  pill.classList.toggle("show", hero.getBoundingClientRect().bottom < innerHeight * .4 && rsvpSec.getBoundingClientRect().top > innerHeight * .8);
  heroOnScroll();
}
addEventListener("scroll", function(){ if (!ticking){ ticking = true; requestAnimationFrame(onScroll); } }, { passive:true });
addEventListener("resize", onScroll);

/* ============================ music ============================
   C.music = "generated" → an original piano piece composed here with Web Audio
   (no file, no copyright). C.music = "assets/audio/song.mp3" → that file.
   Browsers only allow sound after a tap, so it starts on the guest's first
   tap anywhere; the Sound button turns it off (remembered on this phone).  */
var bgm = $("#bgm"), soundBtn = $("#soundBtn"), soundOn = false, fader = null;
var GEN = C.music === "generated", FILE = C.music && !GEN;
if (FILE) bgm.src = C.music;
if (C.music) soundBtn.hidden = false;

var piece = (function(){
  var ctx, master, wet, timer, next = 0, bar = 0;
  var BPM = 64, BEAT = 60 / BPM, BAR = BEAT * 4;
  var hz = function(m){ return 440 * Math.pow(2, (m - 69) / 12); };
  /* F – C/E – Dm – B♭ – F – Am – B♭ – C, arpeggio tones per bar */
  var CH = [[53,60,65,69],[52,60,64,67],[50,57,62,65],[46,53,58,62],[53,60,65,69],[45,52,57,60],[46,53,58,62],[48,55,60,64]];
  /* two 8-bar phrases: [beat, midi, length in beats] */
  var MEL = [
    [[0,72,3],[3,69,1]], [[0,67,2],[2,64,1],[3,67,1]], [[0,65,2],[2,69,1],[3,74,1]], [[0,72,3],[3,70,1]],
    [[0,69,1.5],[1.5,72,.5],[2,77,2]], [[0,76,2],[2,72,1],[3,69,1]], [[0,74,1],[1,72,1],[2,70,1],[3,69,1]], [[0,67,4]],
    [[0,69,1],[1,72,1],[2,77,2]], [[0,76,1.5],[1.5,74,.5],[2,72,2]], [[0,69,1],[1,74,1],[2,77,2]], [[0,77,1],[1,74,1],[2,70,2]],
    [[0,72,2],[2,69,1],[3,72,1]], [[0,76,2],[2,74,1],[3,72,1]], [[0,74,2],[2,72,1],[3,70,1]], [[0,69,2],[2,67,2]]
  ];
  function reverb(){
    var len = ctx.sampleRate * 3.2, buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var c = 0; c < 2; c++){ var d = buf.getChannelData(c); for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    var cv = ctx.createConvolver(); cv.buffer = buf; return cv;
  }
  function piano(m, t, dur, vel, out){                    /* soft felt-piano-ish tone */
    var g = ctx.createGain(), lp = ctx.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.setValueAtTime(2600, t); lp.frequency.exponentialRampToValueAtTime(900, t + dur + 1.2);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vel, t + 0.012);
    g.gain.exponentialRampToValueAtTime(vel * 0.35, t + 0.35); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 1.6);
    [[1, "triangle", 1], [2, "sine", .32], [3, "sine", .08]].forEach(function(h){
      var o = ctx.createOscillator(), og = ctx.createGain();
      o.type = h[1]; o.frequency.value = hz(m) * h[0]; o.detune.value = (Math.random() - .5) * 6; og.gain.value = h[2];
      o.connect(og); og.connect(g); o.start(t); o.stop(t + dur + 1.7);
    });
    g.connect(lp); lp.connect(out);
  }
  function pad(ms, t, dur){
    var g = ctx.createGain(), lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 700;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.022, t + 1.2); g.gain.linearRampToValueAtTime(0.0001, t + dur + .8);
    ms.forEach(function(m){ var o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = hz(m); o.detune.value = (Math.random() - .5) * 10; o.connect(g); o.start(t); o.stop(t + dur + 1); });
    g.connect(lp); lp.connect(wet);
  }
  function schedule(){
    while (next < ctx.currentTime + 1.5){
      var n = bar % 16, ch = CH[n % 8], t = next;
      piano(ch[0] - 12, t, BAR * .9, .10, master);                                   /* bass */
      [0,1,2,3,2,1,2,3].forEach(function(ix, s){ piano(ch[ix], t + s * BEAT / 2, BEAT * .9, .045 + (s % 4 ? 0 : .015), master); });
      pad(ch.slice(1).map(function(m){ return m + 12; }), t, BAR);
      MEL[n].forEach(function(nt){ piano(nt[1], t + nt[0] * BEAT, nt[2] * BEAT, .16, master); });
      next += BAR; bar++;
    }
  }
  return {
    start: function(){
      if (!ctx){
        var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
        ctx = new AC(); master = ctx.createGain(); master.gain.value = 0;
        var comp = ctx.createDynamicsCompressor(), rv = reverb(), rvg = ctx.createGain(); wet = ctx.createGain();
        rvg.gain.value = .42; wet.gain.value = 1;
        master.connect(comp); master.connect(rv); wet.connect(rv); wet.connect(comp); rv.connect(rvg); rvg.connect(comp); comp.connect(ctx.destination);
        next = ctx.currentTime + .1;
      }
      ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime); master.gain.linearRampToValueAtTime(.55, ctx.currentTime + 2.5);
      clearInterval(timer); schedule(); timer = setInterval(schedule, 250);
      return true;
    },
    stop: function(){
      if (!ctx) return;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime); master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      setTimeout(function(){ if (!soundOn){ clearInterval(timer); ctx.suspend(); next = 0; } }, 1100);
      setTimeout(function(){ if (!soundOn && ctx) next = ctx.currentTime + .1; }, 1150);
    }
  };
})();

function fade(to, then){
  clearInterval(fader);
  fader = setInterval(function(){
    var v = bgm.volume + (to > bgm.volume ? .05 : -.05); v = Math.max(0, Math.min(.6, v)); bgm.volume = v;
    if (Math.abs(v - to) < .05){ bgm.volume = to; clearInterval(fader); if (then) then(); }
  }, 90);
}
function setSound(on){
  if (!C.music) return;
  soundOn = on; soundBtn.classList.toggle("on", on); soundBtn.setAttribute("aria-pressed", on);
  try{ localStorage.setItem("invite-sound", on ? "on" : "off"); }catch(e){}
  if (GEN){ if (on){ if (!piece.start()) setSound(false); } else piece.stop(); return; }
  if (on){ bgm.volume = 0; var p = bgm.play(); if (p && p.catch) p.catch(function(){ setSound(false); }); fade(.6); }
  else fade(0, function(){ bgm.pause(); });
}
soundBtn.addEventListener("click", function(){ setSound(!soundOn); });
(function(){                                     /* first tap anywhere starts the music (unless muted before) */
  if (!C.music) return;
  var muted = false; try{ muted = localStorage.getItem("invite-sound") === "off"; }catch(e){}
  if (muted) return;
  var first = function(e){
    document.removeEventListener("touchend", first, true); document.removeEventListener("click", first, true);
    if (soundBtn.contains(e.target) || soundOn) return;
    setSound(true);
  };
  document.addEventListener("touchend", first, true); document.addEventListener("click", first, true);
})();

/* ============================ hero tilt + foil ============================ */
var hero = $("#hero"), tilt = $("#tilt"), turn = $("#turn"), heroCard = $("#heroCard");
var tgt = { x:0, y:0, turn:0 }, cur = { x:0, y:0, turn:0 }, input = false, heroVisible = true, base = null, tiltOn = false;
if (reduced) hero.classList.add("static");
/* scroll progress through the tall hero → 0…180° turn (front picture → back picture) */
function heroOnScroll(){
  if (reduced) return;
  var span = hero.offsetHeight - innerHeight;
  var p = span > 0 ? Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / span)) : 0;
  var q = Math.max(0, Math.min(1, (p - .08) / .8));               /* hold briefly, turn, settle */
  tgt.turn = (q < .5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2) * 180;
  hero.classList.toggle("turned", p > .04);
}
function onOrient(e){
  if (e.beta == null) return;
  if (!base) base = { b:e.beta, g:e.gamma };
  input = true;
  tgt.x = Math.max(-10, Math.min(10, -(e.beta - base.b) * .35));
  tgt.y = Math.max(-10, Math.min(10, (e.gamma - base.g) * .4));
}
function startTilt(){
  if (tiltOn || reduced) return; tiltOn = true;
  new IntersectionObserver(function(es){ heroVisible = es[0].isIntersecting; }).observe(heroCard);
  if (matchMedia("(hover:hover) and (pointer:fine)").matches){
    $("#hero").addEventListener("pointermove", function(e){
      var r = heroCard.getBoundingClientRect();
      input = true;
      tgt.y = Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / (r.width))) * 12;
      tgt.x = -Math.max(-1, Math.min(1, (e.clientY - r.top - r.height / 2) / (r.height))) * 10;
    });
    $("#hero").addEventListener("pointerleave", function(){ input = false; });
  }
  (function loop(now){
    requestAnimationFrame(loop);
    if (!heroVisible) return;
    var x = tgt.x, y = tgt.y;
    if (!input){ x = Math.sin(now / 2600) * 3; y = Math.cos(now / 3300) * 4.5; }
    cur.x += (x - cur.x) * .08; cur.y += (y - cur.y) * .08; cur.turn += (tgt.turn - cur.turn) * .12;
    tilt.style.transform = "rotateX(" + cur.x.toFixed(2) + "deg) rotateY(" + cur.y.toFixed(2) + "deg)";
    var lift = Math.sin(cur.turn / 180 * Math.PI);                  /* card lifts toward you mid-turn */
    turn.style.transform = "rotateY(" + cur.turn.toFixed(2) + "deg) scale(" + (1 + lift * .06).toFixed(3) + ")";
    tilt.style.setProperty("--fx", (50 + cur.y * 5).toFixed(1) + "%");
    tilt.style.setProperty("--fy", (50 + cur.x * 5).toFixed(1) + "%");
  })(0);
}

/* ============================ motion permission + nav mark ============================ */
(function(){
  var brand = "";
  for (var i = 0; i < 24; i += 2) brand += '<path d="M-1.2 -6.5 L0 -11 L1.2 -6.5Z" transform="rotate(' + (i * 15) + ')"/>';
  $(".brand-rays").innerHTML = brand;
  if (!window.DeviceOrientationEvent || !matchMedia("(pointer:coarse)").matches || reduced) return;
  if (typeof DeviceOrientationEvent.requestPermission === "function"){
    /* iOS only grants motion inside a tap, so ask on the guest's first touch */
    var ask = function(){
      document.removeEventListener("touchend", ask);
      DeviceOrientationEvent.requestPermission().then(function(s){ if (s === "granted") addEventListener("deviceorientation", onOrient); }).catch(function(){});
    };
    document.addEventListener("touchend", ask);
  } else addEventListener("deviceorientation", onOrient);
})();

/* ============================ RSVP ============================
   Same questions as the reference: name, coming?, how many, arrival, stay
   (only when arriving early), hotels (only for "hotel"), message.
   POSTs JSON to C.rsvpEndpoint and expects {ok:true} | {ok:false, closed:true}. */
(function(){
  var form = $("#rsvpForm"), msg = $("#formMsg"), closed = $("#closed"), sealed = $("#sealed");
  function close(key){ form.hidden = true; closed.hidden = false; $("#closedMsg").setAttribute("data-t", key); setT($("#closedMsg"), key); }
  if (new Date().toISOString().slice(0, 10) > (C.rsvpDeadlineISO || "9999")) close("closedMsg");

  /* nearby stays from content.js */
  var grid = $("#hgrid"), hs = C.hotels || [];
  hs.forEach(function(h){
    var a = el("a", "hcard"); a.href = h.map || "#"; a.target = "_blank"; a.rel = "noopener";
    a.appendChild(el("b")).textContent = h.name;
    a.appendChild(el("span", "harea")).textContent = h.area || "";
    var row = a.appendChild(el("span", "hrow"));
    row.appendChild(el("span", "hdist")).textContent = h.dist || "";
    row.appendChild(el("span", "hprice")).textContent = h.price || "";
    grid.appendChild(a);
  });

  var g = 1, gN = $("#gN");
  $("#gUp").onclick = function(){ g = Math.min(50, g + 1); gN.textContent = g; };
  $("#gDown").onclick = function(){ g = Math.max(1, g - 1); gN.textContent = g; };
  function val(n){ var i = form.querySelector("input[name=" + n + "]:checked"); return i ? i.value : ""; }
  function sync(){
    var travel = C.rsvpTravel !== false;
    var yes = val("attending") === "yes", early = travel && yes && val("arrival") !== "wedding-day";
    $("#guestsField").classList.toggle("open", yes);
    $("#arriveField").classList.toggle("open", travel && yes);
    $("#stayField").classList.toggle("open", early);
    $("#hotelList").classList.toggle("open", early && val("stay") === "hotel" && hs.length > 0);
  }
  $$("input[name=attending], input[name=arrival], input[name=stay]", form).forEach(function(r){ r.addEventListener("change", sync); });
  sync();

  function say(key, kind){ setT(msg, key); msg.className = kind || ""; }
  form.addEventListener("submit", function(e){
    e.preventDefault();
    var name = $("#fname"); name.classList.remove("bad");
    if (!name.value.trim()){                        /* say so, don't just turn the line red */
      name.classList.add("bad"); name.focus(); say("fNameNeeded", "warn");
      name.addEventListener("input", function(){ name.classList.remove("bad"); msg.textContent = ""; }, { once:true });
      return;
    }
    if (!C.rsvpEndpoint){ say("errMsg", "warn"); return; }
    var send = $("#sendBtn"); setT(send, "fSending"); send.disabled = true; send.classList.add("busy");
    say("fSendingNote", "info");
    var att = val("attending"), arr = val("arrival"), yes = att === "yes";
    var payload = {
      name: name.value.trim(), attending: att, guests: yes ? g : 0,
      arrival: (yes && C.rsvpTravel !== false) ? arr : "",
      stay: (yes && C.rsvpTravel !== false && arr !== "wedding-day") ? val("stay") : "",
      message: $("#fmsg").value.trim(), lang: lang, event: EVENT, website: form.website.value
    };
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function(){ if (ctl) ctl.abort(); }, 20000);   /* never leave a guest waiting forever */
    fetch(C.rsvpEndpoint, { method:"POST", headers:{ "Content-Type":"text/plain;charset=utf-8" }, body:JSON.stringify(payload), signal: ctl ? ctl.signal : undefined })
      .then(function(r){ return r.text().then(function(txt){
        try{ return JSON.parse(txt); }catch(err){ throw new Error("RSVP reply was not JSON (HTTP " + r.status + "): " + txt.slice(0, 120)); }
      }); })
      .then(function(j){
        if (j && j.ok){
          form.reset(); g = 1; gN.textContent = "1"; sync(); msg.textContent = "";
          form.hidden = true; sealed.hidden = false;
          requestAnimationFrame(function(){ sealed.classList.add("show"); });
          sealed.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block:"center" });
        } else if (j && j.closed) close("closedMsg");
        else throw new Error("RSVP script answered: " + JSON.stringify(j));
      })
      .catch(function(err){ console.warn("[rsvp]", err && err.message || err); say(err && err.name === "AbortError" ? "errSlow" : "errMsg", "warn"); })
      .then(function(){ clearTimeout(timer); setT(send, "fSend"); send.disabled = false; send.classList.remove("busy"); });
  });
})();

/* ============================ confetti (engagement) ============================ */
function confetti(n){
  if (reduced) return;
  var cv = document.createElement("canvas"); cv.id = "confetti"; document.body.appendChild(cv);
  var dpr = Math.min(devicePixelRatio || 1, 2), w = innerWidth, h = innerHeight;
  cv.width = w * dpr; cv.height = h * dpr; var x = cv.getContext("2d"); x.scale(dpr, dpr);
  var cols = ["#E5266E", "#FFB627", "#0E8C82", "#5B2A86", "#2E86DE", "#FFC6DA"], ps = [];
  for (var i = 0; i < (n || 140); i++) ps.push({ x:Math.random() * w, y:-20 - Math.random() * h * .6, s:5 + Math.random() * 7,
    vy:1.6 + Math.random() * 2.4, sw:Math.random() * 6.28, r:Math.random() * 6.28, vr:(Math.random() - .5) * .2, c:cols[i % cols.length], heart:i % 9 === 0 });
  var t0 = performance.now();
  (function frame(now){
    var k = (now - t0) / 4200; x.clearRect(0, 0, w, h);
    ps.forEach(function(p){
      p.y += p.vy; p.sw += .04; p.r += p.vr; p.x += Math.sin(p.sw) * .9;
      x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.globalAlpha = Math.max(0, 1 - Math.max(0, k - .7) / .3); x.fillStyle = p.c;
      if (p.heart){ x.font = (p.s * 2.2) + "px serif"; x.fillText("♥", -p.s, p.s); }
      else x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      x.restore();
    });
    if (k < 1) requestAnimationFrame(frame); else cv.remove();
  })(t0);
}
if (EVENT === "engagement"){
  setTimeout(function(){ confetti(150); }, 700);
  $("#sealed").addEventListener("animationstart", function(){ confetti(90); }, { once:true });
}

/* ============================ boot ============================ */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
applyLang();
requestAnimationFrame(function(){ document.body.classList.add("opened"); });
startTilt();
observeReveals(document);
onScroll();
if (document.fonts && document.fonts.ready && hasSplit){
  document.fonts.ready.then(function(){ revertSplits(); makeSplits(); window.ScrollTrigger.refresh(); });
}
})();
