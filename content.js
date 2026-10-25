/* ============================================================================
   content.js: EVERYTHING YOU CAN EDIT
   ----------------------------------------------------------------------------
   All names, dates, places and wording on the site live in this one file.
     1. Open it in any text editor.
     2. Change ONLY the text between the quotation marks "  ".
     3. Save and upload this one file again.
   index.html, styles.css and app.js never need to change for a content edit.
   (Only exception: the link-preview tags at the top of index.html. WhatsApp
   reads those directly, so update the names/domain there once as well.)

   Rules:
   • Keep every quote " and comma , exactly where they are.
   • To write a quote mark inside text, write \" (backslash then quote).
   • \n inside a text makes a new line.
   • A Malayalam line left as "" falls back to English automatically.
   • Lines marked ★ are drafts. Please read them with family and adjust.

   Lines marked ⚠ still need checking (map distances).
   ========================================================================== */

window.CONTENT = {

  /* ---- which language shows first ---- */
  defaultLang: "en",                     // "en" or "ml"

  /* ---- the couple & the day (same in every language) ---- */
  groom:       "Tony Antony",
  bride:       "Maria Sabu",
  namesLatin:  "Tony & Maria",           // the big script names, always Latin
  date:        "23 · 01 · 2027",
  weddingISO:  "2027-01-23T11:15:00+05:30",   // drives the countdown
  rsvpDeadlineISO: "2027-01-15",              // form closes after this day

  /* RSVP: the URL the form POSTs to (JSON, Content-Type text/plain).
     It should answer {ok:true}, or {ok:false, closed:true} after the deadline. */
  rsvpEndpoint: "https://script.google.com/macros/s/AKfycbzeshIxSarjo1ayyxWn56VtwdOIjbG0PPGiY9xJ2F8QKD2AtQY0nAghfzhEWQUua_6Xcw/exec",

  /* Music: "generated" = our own soft piano piece, made in the browser.
     Or put an .mp3 in assets/audio/ and write its path, e.g. "assets/audio/song.mp3".
     "" = no music (the Sound button is hidden).
     It starts on the guest's first tap; the Sound button turns it off. */
  music: "generated",

  /* contact numbers: 10 digits, no +91 (added automatically). Tapping one
     opens a WhatsApp chat. Empty list = contacts hidden.
     e.g. { name: "Tony", num: "9800000001" }                          */
  phones: [
    { name: "Tony",  num: "9447109991" },
    { name: "Maria", num: "9747507432" }
  ],

  /* ---- families (shown under each name). Leave "" to hide a line ----
     e.g. parents: "Mr. Antony … & Mrs. …", house: "… House", place: "…"  */
  families: {
    groom: { parents: "", house: "", place: "" },
    bride: { parents: "", house: "", place: "" }
  },

  /* ---- a line under the names (leave ml "" to fall back to English) ---- */
  quote: {
    en:  "Two hearts, one home, a lifetime of laughter.",
    ml:  "രണ്ട് ഹൃദയങ്ങൾ, ഒരു വീട്, ഒരു ജീവിതം നിറയെ ചിരി."           /* ★ */
  },

  /* ---- the events (titles & descriptions are in ui below) ----
     key must stay "betrothal", "matrimony" or "reception".
     Remove a whole { … } block to hide that event.                       */
  events: [
    /* to show the betrothal, add a block like this (with real date & place):
    { key: "betrothal", startISO: "2027-01-03T15:00:00+05:30", endISO: "2027-01-03T17:00:00+05:30",
      venue: "…", address: "…", map: "https://www.google.com/maps/search/?api=1&query=…" },  */
    { key: "matrimony", startISO: "2027-01-23T11:15:00+05:30", endISO: "2027-01-23T12:45:00+05:30",
      venue: "St. Mary's Church, Kalathoor",  address: "PGCV+2QR, Kalathoor, Kerala 686633",
      map: "https://www.google.com/maps/dir/?api=1&destination=PGCV%2B2QR+Kalathoor+Kerala+686633" },
    { key: "reception", startISO: "2027-01-23T12:45:00+05:30", endISO: "2027-01-23T15:00:00+05:30",
      venue: "Parish Hall, St. Mary's Church, Kalathoor",  address: "PGCV+2QR, Kalathoor, Kerala 686633",
      map: "https://www.google.com/maps/dir/?api=1&destination=PGCV%2B2QR+Kalathoor+Kerala+686633" }
  ],

  /* ---- maps (St. Mary's Church, Kalathoor · plus code PGCV+2QR) ---- */
  mapEmbed: "https://www.google.com/maps?q=PGCV%2B2QR+Kalathoor+Kerala+686633&output=embed",
  mapLink:  "https://www.google.com/maps/dir/?api=1&destination=PGCV%2B2QR+Kalathoor+Kerala+686633",

  /* ---- nearby stays, shown in the RSVP when a guest picks "hotel" ----
     Empty list = the hotel cards are not shown.  e.g.
     { name:"…", area:"…", dist:"4 km · 8 min", price:"≈ ₹2,500", map:"https://maps.google.com/?q=…" } */
  hotels: [
  ],

  /* ---- the illustrated map, drawn to scale from real coordinates ----
     Points are [latitude, longitude] (from OpenStreetMap / the plus code).
     bounds   the area shown (≈ 25 × 25 km)
     venue    the church; places = tappable stations; towns = small labels
     roads    drawn lines (major = wider); routes = the red lines that draw in
     exits    arrows where a road leaves the map (e.g. to the airport)
     label    "left" | "right" | "above"     ⚠ road times are estimates. */
  map: {
    bounds: { north: 9.800, south: 9.570, west: 76.420, east: 76.650 },
    venue:  { key: "lmVenue", at: [9.7201, 76.5444], label: "right" },
    places: [
      { key: "lmEttumanoor", short: "mEttumanoor", at: [9.6751, 76.5460], dist: "≈ 7 km · 15 min", label: "left" },
      { key: "lmKottayam",   short: "mKottayam",   at: [9.5950, 76.5310], dist: "≈ 17 km · 35 min", label: "left" }
    ],
    towns: [
      { key: "twKuravilangad",  at: [9.7573, 76.5616], label: "right" },
      { key: "twEttumanoor",    at: [9.6705, 76.5578], label: "right" },
      { key: "twKottayam",      at: [9.5916, 76.5222], label: "right" },
      { key: "twKuruppanthara", at: [9.7412, 76.5172], label: "left"  },
      { key: "twThalayolaparambu", at: [9.7856, 76.4475], label: "right" }
    ],
    roads: [
      /* Ettumanoor–Ernakulam Road (SH 15): Ettumanoor → Kothanalloor → Kuruppanthara → Thalayolaparambu */
      { name: "mEkmRoad", flip: true, labelAt: "42%",
        pts: [[9.6705,76.5578],[9.6900,76.5420],[9.7060,76.5320],[9.7226,76.5238],[9.7412,76.5172],[9.7600,76.4900],[9.7856,76.4475],[9.8000,76.4300]] },
      /* MC Road: Kottayam → Ettumanoor → Kalathoor → Kuravilangad → (towards Cochin) */
      { name: "mMcRoad", major: true, labelAt: "18%",
        pts: [[9.5916,76.5222],[9.6100,76.5300],[9.6400,76.5450],[9.6705,76.5578],[9.6950,76.5560],[9.7200,76.5530],[9.7573,76.5616],[9.7800,76.5700],[9.8000,76.5780]] }
    ],
    rail:   [[9.5700,76.5350],[9.5950,76.5310],[9.6350,76.5400],[9.6751,76.5460],[9.7050,76.5230],[9.7297,76.5038],[9.7650,76.4750],[9.8000,76.4500]],
    lake:   [[9.5700,76.4200],[9.5700,76.4480],[9.6000,76.4380],[9.6400,76.4300],[9.6800,76.4260],[9.7200,76.4200]],
    routes: [
      [[9.8000,76.5780],[9.7800,76.5700],[9.7573,76.5616],[9.7200,76.5530],[9.7201,76.5444]],                                   /* from the airport */
      [[9.6751,76.5460],[9.6705,76.5578],[9.6950,76.5560],[9.7200,76.5530],[9.7201,76.5444]],                                   /* from Ettumanoor station */
      [[9.5950,76.5310],[9.6100,76.5300],[9.6400,76.5450],[9.6705,76.5578],[9.6950,76.5560],[9.7200,76.5530],[9.7201,76.5444]]  /* from Kottayam station */
    ],
    exits: [
      { key: "mAirport", hotspot: "lmAirport", dist: "≈ 70 km · 1 h 45 min", at: [9.7975, 76.5775], dir: 0, label: "left" },
      { key: "mToEkm", at: [9.7975, 76.4330], dir: -45, label: "right" }
    ]
  },

  /* ---- every visible label, per language ---- */
  ui: {
    en: {
      langName:   "English",
      nav:        { events:"Events", travel:"Getting There", rsvp:"RSVP" },
      sound:      "Sound",
      rsvpPill:   "RSVP",


      heroEyebrow:  "The Wedding of",
      heroMarrying: "are getting married",
      cardWord:     "Wedding",                 // on the bottom of the hero cards
      scrollCue:    "You are invited",

      inviteEyebrow: "Together with our families",
      inviteIntro:   "We're delighted to invite you to celebrate the wedding of",
      sonOf:         "Son of",
      daughterOf:    "Daughter of",
      inviteSolicit: "Bless us with your presence",

      countEyebrow: "Until the Day",
      countdown:    { days:"days", hours:"hours", mins:"minutes", secs:"seconds" },
      calAdd:       "Add to calendar",
      calGoogle:    "Google Calendar",
      calIcs:       "Apple / Outlook",
      calTitle:     "Wedding of Tony & Maria",

      evEyebrow: "The Celebrations",
      evTitle:   "The Big Day",
      ev: {
        betrothal: { t:"Betrothal", s:"Manasammatham", p:"The day we made it official, with our families." },
        matrimony: { t:"The Wedding", s:"Ceremony", p:"Where we say yes, in front of the people we love most." },
        reception: { t:"Reception", s:"Lunch & Celebration", p:"Stay for lunch, good food and even better company." }
      },
      directions: "Directions",

      trEyebrow: "Finding Us",
      trTitle:   "Getting to Kalathoor",
      trNote:    "Drawn to scale. Tap a place.",
      trAirT:    "By air",
      trAirP:    "Cochin International Airport (COK) is about 70 km away, roughly 1 h 45 min by road along the MC Road through Perumbavoor, Muvattupuzha and Kuravilangad.",
      trTrainT:  "By train",
      trTrainP:  "Ettumanoor (ETM) is the nearest station, about 7 km and 15 minutes away by taxi. Kottayam (KTYM), where nearly every train stops, is about 17 km, around 35 minutes.",
      trRoadT:   "By road",
      trRoadP:   "The church is close to the MC Road between Ettumanoor and Kuravilangad, about 3 km south of Kuravilangad town.",
      lmAirport:    "Cochin International Airport",
      lmEttumanoor: "Ettumanoor Railway Station (ETM)",
      lmKottayam:   "Kottayam Railway Station (KTYM)",
      lmVenue:      "St. Mary's Church, Kalathoor",
      mEttumanoor:  "Ettumanoor\nStation",
      mKottayam:    "Kottayam\nStation",
      mAirport:     "To Cochin Airport",
      twKuravilangad:"Kuravilangad",
      twEttumanoor: "Ettumanoor",
      twKottayam:   "Kottayam",
      twKuruppanthara:"Kuruppanthara",
      twThalayolaparambu:"Thalayolaparambu",
      mEkmRoad:     "Ernakulam Road",
      mToEkm:       "To Ernakulam",
      mMcRoad:      "MC Road",
      mRail:        "Railway",
      tapDirections:"Tap for directions",
      lmLake:       "Vembanad Lake",
      mapCta:    "Open in Google Maps",

      rsEyebrow: "Kindly Respond",
      rsTitle:   "Will You Be There?",
      rsLead:    "Kindly let us know by the 15th of January. A note is all we need: who is coming and how many.",
      fName:     "Your name",
      fAttending:"Will you come?",
      fYes:      "Joyfully, yes",
      fNo:       "Sadly, cannot",
      fGuests:   "How many of you?",
      fArrive:   "When will you arrive?",
      aDay:      "On the wedding day",
      aBefore:   "The day before",
      aEarly:    "A few days early",
      fStay:     "Where will you stay?",
      sArrange:  "Kindly arrange a stay for us",
      sOwn:      "With family or friends nearby",
      sHotel:    "We'll book a hotel nearby",
      hotelsNote:"Stays near the church. Tap one for directions.",
      fMessage:  "A message (optional)",
      fSend:     "Send",
      fSending:  "Sending…",
      fSendingNote: "Sending your reply, this takes a few seconds…",
      fNameNeeded: "Please write your name first.",
      errSlow:   "This is taking too long. Please check your connection and try again.",
      okMsg:     "Thank you! We have you down, and we can't wait to see you.",
      errMsg:    "Something went wrong. Please try again, or message us directly.",
      closedMsg: "RSVPs have closed. Please call or message us, we'd still love to know.",
      noForm:    "Please call or message us to let us know",
      contact:   "Call or message",

      footTag:   "Happily ever after, snacks included.",
      madeWith:  "With love, from our families"
    },

    /* --------------------------- MALAYALAM --------------------------- */
    ml: {
      langName:   "മലയാളം",
      nav:        { events:"ചടങ്ങുകൾ", travel:"എത്തിച്ചേരാൻ", rsvp:"മറുപടി" },
      sound:      "സംഗീതം",
      rsvpPill:   "മറുപടി",


      heroEyebrow:  "വിവാഹം",
      heroMarrying: "വിവാഹിതരാകുന്നു",
      cardWord:     "വിവാഹം",
      scrollCue:    "നിങ്ങൾ ക്ഷണിക്കപ്പെട്ടിരിക്കുന്നു",

      inviteEyebrow: "കുടുംബാംഗങ്ങളോടൊപ്പം",
      inviteIntro:   "ഈ വിവാഹ ആഘോഷത്തിലേക്ക് നിങ്ങളെ സന്തോഷത്തോടെ ക്ഷണിക്കുന്നു",
      sonOf:         "മകൻ",
      daughterOf:    "മകൾ",
      inviteSolicit: "നിങ്ങളുടെ സാന്നിധ്യത്താൽ ഞങ്ങളെ അനുഗ്രഹിക്കുക",

      countEyebrow: "ആ ദിവസത്തിലേക്ക്",
      countdown:    { days:"ദിവസം", hours:"മണിക്കൂർ", mins:"മിനിറ്റ്", secs:"സെക്കൻഡ്" },
      calAdd:       "കലണ്ടറിൽ ചേർക്കുക",
      calGoogle:    "Google Calendar",
      calIcs:       "Apple / Outlook",
      calTitle:     "",

      evEyebrow: "ചടങ്ങുകൾ",
      evTitle:   "ആ സുദിനം",                         /* ★ */
      ev: {
        betrothal: { t:"മനസ്സമ്മതം", s:"Betrothal", p:"കുടുംബങ്ങളോടൊപ്പം ഞങ്ങൾ ഔദ്യോഗികമാക്കിയ ദിവസം." },
        matrimony: { t:"വിവാഹം", s:"Ceremony", p:"ഞങ്ങൾ ഏറ്റവും സ്നേഹിക്കുന്നവരുടെ മുന്നിൽ ഞങ്ങൾ 'സമ്മതം' പറയുന്ന നിമിഷം." },
        reception: { t:"സ്നേഹവിരുന്ന്", s:"Reception", p:"നല്ല ഭക്ഷണവും അതിലും നല്ല കൂട്ടുമായി ഉച്ചവിരുന്നിൽ പങ്കുചേരുക." }
      },
      directions: "വഴി",

      trEyebrow: "ഞങ്ങളെ കണ്ടെത്താൻ",
      trTitle:   "കളത്തൂരിലേക്ക്",
      trNote:    "അളവനുസരിച്ച് വരച്ചത്. ഒരു സ്ഥലം തൊടുക.",
      trAirT:    "വിമാനമാർഗ്ഗം",
      trAirP:    "കൊച്ചി അന്താരാഷ്ട്ര വിമാനത്താവളത്തിൽ (COK) നിന്ന് ഏകദേശം 70 കി.മീ. പെരുമ്പാവൂർ, മൂവാറ്റുപുഴ, കുറവിലങ്ങാട് വഴി എം.സി. റോഡിലൂടെ ഏകദേശം 1 മണിക്കൂർ 45 മിനിറ്റ്.",
      trTrainT:  "ട്രെയിൻ മാർഗ്ഗം",
      trTrainP:  "ഏറ്റവും അടുത്തുള്ളത് ഏറ്റുമാനൂർ (ETM) സ്റ്റേഷൻ, ഏകദേശം 7 കി.മീ, ടാക്സിയിൽ 15 മിനിറ്റ്. മിക്കവാറും എല്ലാ ട്രെയിനുകളും നിർത്തുന്ന കോട്ടയം (KTYM) ഏകദേശം 17 കി.മീ, 35 മിനിറ്റ്.",
      trRoadT:   "റോഡ് മാർഗ്ഗം",
      trRoadP:   "ഏറ്റുമാനൂരിനും കുറവിലങ്ങാടിനും ഇടയിൽ എം.സി. റോഡിനടുത്ത്, കുറവിലങ്ങാട് ടൗണിൽ നിന്ന് ഏകദേശം 3 കി.മീ തെക്ക്.",
      lmAirport:    "കൊച്ചി അന്താരാഷ്ട്ര വിമാനത്താവളം",
      lmEttumanoor: "ഏറ്റുമാനൂർ റെയിൽവേ സ്റ്റേഷൻ (ETM)",
      lmKottayam:   "കോട്ടയം റെയിൽവേ സ്റ്റേഷൻ (KTYM)",
      mEttumanoor:  "ഏറ്റുമാനൂർ\nസ്റ്റേഷൻ",
      mKottayam:    "കോട്ടയം\nസ്റ്റേഷൻ",
      mAirport:     "കൊച്ചി വിമാനത്താവളത്തിലേക്ക്",
      twKuravilangad:"കുറവിലങ്ങാട്",
      twEttumanoor: "ഏറ്റുമാനൂർ",
      twKottayam:   "കോട്ടയം",
      twKuruppanthara:"കുറുപ്പന്തറ",
      twThalayolaparambu:"തലയോലപ്പറമ്പ്",
      mEkmRoad:     "എറണാകുളം റോഡ്",
      mToEkm:       "എറണാകുളത്തേക്ക്",
      mMcRoad:      "എം.സി. റോഡ്",
      mRail:        "റെയിൽപ്പാത",
      lmVenue:      "സെന്റ് മേരീസ് ദേവാലയം, കളത്തൂർ",
      tapDirections:"വഴി അറിയാൻ തൊടുക",
      lmLake:       "വേമ്പനാട് കായൽ",
      mapCta:    "ഗൂഗിൾ മാപ്പിൽ തുറക്കുക",

      rsEyebrow: "മറുപടി അറിയിക്കുക",
      rsTitle:   "നിങ്ങൾ വരുമോ?",
      rsLead:    "ജനുവരി 15-ന് മുൻപ് ഞങ്ങളെ അറിയിക്കുമല്ലോ: ആരൊക്കെ വരുന്നു, എത്ര പേർ, അത്രമാത്രം.",
      fName:     "നിങ്ങളുടെ പേര്",
      fAttending:"നിങ്ങൾ വരുമോ?",
      fYes:      "സന്തോഷത്തോടെ, വരുന്നു",
      fNo:       "ഖേദപൂർവ്വം, സാധിക്കില്ല",
      fGuests:   "എത്ര പേർ?",
      fArrive:   "എപ്പോൾ എത്തും?",
      aDay:      "വിവാഹദിവസം",
      aBefore:   "തലേദിവസം",
      aEarly:    "കുറച്ച് ദിവസം മുൻപ്",
      fStay:     "എവിടെ താമസിക്കും?",
      sArrange:  "ഞങ്ങൾക്ക് താമസം ഒരുക്കിത്തരണം",
      sOwn:      "അടുത്തുള്ള ബന്ധുക്കളോടൊപ്പം",
      sHotel:    "ഞങ്ങൾ ഹോട്ടൽ ബുക്ക് ചെയ്തുകൊള്ളാം",
      hotelsNote:"ദേവാലയത്തിന് സമീപമുള്ള താമസസൗകര്യങ്ങൾ. വഴി അറിയാൻ തൊടുക.",
      fMessage:  "ഒരു സന്ദേശം (നിർബന്ധമല്ല)",
      fSend:     "അയയ്ക്കുക",
      fSending:  "അയയ്ക്കുന്നു…",
      fSendingNote: "നിങ്ങളുടെ മറുപടി അയയ്ക്കുന്നു, കുറച്ച് നിമിഷങ്ങൾ…",
      fNameNeeded: "ദയവായി ആദ്യം നിങ്ങളുടെ പേര് എഴുതുക.",
      errSlow:   "സമയം കൂടുതൽ എടുക്കുന്നു. ഇന്റർനെറ്റ് കണക്ഷൻ പരിശോധിച്ച് വീണ്ടും ശ്രമിക്കുക.",
      okMsg:     "നന്ദി! നിങ്ങളുടെ മറുപടി ലഭിച്ചു, കാണാൻ കാത്തിരിക്കുന്നു.",
      errMsg:    "എന്തോ പിഴവ് സംഭവിച്ചു. വീണ്ടും ശ്രമിക്കുക, അല്ലെങ്കിൽ നേരിട്ട് സന്ദേശം അയയ്ക്കുക.",
      closedMsg: "മറുപടി സ്വീകരിക്കുന്നത് അവസാനിച്ചു. ദയവായി ഞങ്ങളെ വിളിക്കുക.",
      noForm:    "ദയവായി ഞങ്ങളെ വിളിച്ചോ സന്ദേശം അയച്ചോ അറിയിക്കുക",
      contact:   "വിളിക്കുക / സന്ദേശം അയയ്ക്കുക",

      footTag:   "എന്നെന്നും സന്തോഷത്തോടെ, കൂടെ കുറച്ച് പലഹാരവും.",   /* ★ */
      madeWith:  "സ്നേഹപൂർവ്വം, ഞങ്ങളുടെ കുടുംബങ്ങൾ"
    }
  }
};

/* ============================================================================
   THE ENGAGEMENT VERSION
   ----------------------------------------------------------------------------
   Share it as  https://your-domain/engagement/   (or  /?event=engagement).
   Anything written here REPLACES the wedding value above; everything you
   leave out stays the same as the wedding site. Lists (events, phones…) are
   replaced as a whole. It also gets its own bright theme and its own RSVP tab.

   Engagement: 19 January 2027, 5:30 pm, St. John the Baptist's Syro Malabar
   Forane Church, Nedumkunnam (plus code 6JXRGM44+9H), then the reception in
   the parish hall. Madhuram Veppu: 20 January 2027, 6 pm, at Maria's home.
   ========================================================================== */
window.CONTENT.versions = {
  engagement: {
    pageTitle:  "Maria & Tony · Engagement · 19 January 2027",
    namesLatin: "Maria & Tony",         /* the bride's name first on the engagement site */
    brideFirst: true,                   /* Maria's block before Tony's in the invitation */
    phones: [
      { name: "Maria", num: "9747507432" },
      { name: "Tony",  num: "9447109991" }
    ],
    date:       "19 · 01 · 2027",
    weddingISO: "2027-01-19T17:30:00+05:30",           /* drives the countdown */
    rsvpDeadlineISO: "2027-01-14",                      /* ⚠ please confirm */
    /* rsvpEndpoint is shared with the wedding: the same Apps Script saves these
       answers to its own "Engagement RSVPs" tab. Add rsvpEndpoint: "…" here only
       if you want a completely separate form backend. */
    rsvpTravel: false,         /* no "when will you arrive / where will you stay" questions */

    /* whenKey (optional) shows that label instead of a clock time, e.g. "After the engagement" */
    events: [
      { key: "betrothal", startISO: "2027-01-19T17:30:00+05:30", endISO: "2027-01-19T18:45:00+05:30",
        venue: "St. John the Baptist's Syro Malabar Forane Church, Nedumkunnam",
        address: "Karukachal Manimala Rd, Nedumkunnam, Kerala 686542",
        map: "https://www.google.com/maps/dir/?api=1&destination=GM44%2B9H+Nedumkunnam+Kerala+686542" },
      { key: "engReception", startISO: "2027-01-19T18:45:00+05:30", endISO: "2027-01-19T21:00:00+05:30", whenKey: "afterEngagement",
        venue: "Parish Hall, St. John the Baptist's Forane Church, Nedumkunnam",
        address: "Karukachal Manimala Rd, Nedumkunnam, Kerala 686542",
        map: "https://www.google.com/maps/dir/?api=1&destination=GM44%2B9H+Nedumkunnam+Kerala+686542" },
      { key: "madhuram", startISO: "2027-01-20T18:00:00+05:30", endISO: "2027-01-20T20:00:00+05:30",
        venue: "Maria's home, Nedumkunnam",
        address: "Nedumkunnam, Kerala",
        map: "https://maps.app.goo.gl/WzVdJZaX9Yxi7zVWA" }
    ],

    mapEmbed: "https://www.google.com/maps?q=GM44%2B9H+Nedumkunnam+Kerala+686542&output=embed",
    mapLink:  "https://www.google.com/maps/dir/?api=1&destination=GM44%2B9H+Nedumkunnam+Kerala+686542",

    /* Nedumkunnam, drawn to scale. Church from its plus code 6JXRGM44+9H. */
    map: {
      bounds: { north: 9.640, south: 9.400, west: 76.515, east: 76.757 },
      venue:  { key: "lmVenue", short: "mVenue", at: [9.5059, 76.6564], label: "right" },
      places: [
        { key: "lmChanganassery", short: "mChanganassery", at: [9.4484, 76.5494], dist: "≈ 17 km · 35 min", label: "right" },
        { key: "lmKottayam",      short: "mKottayam",      at: [9.5950, 76.5310], dist: "≈ 24 km · 45 min", label: "right" }
      ],
      towns: [
        { key: "twKarukachal",  at: [9.5012, 76.6384], label: "left"  },
        { key: "twManimala",    at: [9.4942, 76.7502], label: "left"  },
        { key: "twPampady",     at: [9.5656, 76.6444], label: "right" },
        { key: "twKangazha",    at: [9.5339, 76.6713], label: "right" }
      ],
      roads: [
        /* Changanassery → Karukachal */
        { pts: [[9.4465,76.5403],[9.4620,76.5700],[9.4800,76.6000],[9.5012,76.6384]] },
        /* Pampady → Karukachal */
        { pts: [[9.5656,76.6444],[9.5350,76.6410],[9.5012,76.6384]] },
        /* Karukachal–Manimala Road, through Nedumkunnam */
        { pts: [[9.5012,76.6384],[9.5060,76.6520],[9.5096,76.6658],[9.5040,76.6786],[9.4942,76.7502]] },
        /* K.K. Road (Kottayam–Kumily): Kottayam → Pampady → (towards Ponkunnam) */
        { name: "mKkRoad", major: true, labelAt: "84%", pts: [[9.5916,76.5222],[9.5850,76.5600],[9.5750,76.6000],[9.5656,76.6444],[9.5600,76.7000],[9.5520,76.7570]] },
        /* MC Road: Changanassery → Kottayam → (towards Cochin) */
        { name: "mMcRoad", major: true, labelAt: "28%", pts: [[9.4000,76.5520],[9.4465,76.5403],[9.4900,76.5350],[9.5300,76.5320],[9.5916,76.5222],[9.6400,76.5370]] }
      ],
      rail:   [[9.4000,76.5650],[9.4484,76.5494],[9.5000,76.5450],[9.5500,76.5350],[9.5950,76.5310],[9.6400,76.5450]],
      routes: [
        [[9.4484,76.5494],[9.4620,76.5700],[9.4800,76.6000],[9.5012,76.6384],[9.5060,76.6520],[9.5059,76.6564]],                                     /* from Changanassery station */
        [[9.5950,76.5310],[9.5850,76.5600],[9.5750,76.6000],[9.5656,76.6444],[9.5350,76.6410],[9.5012,76.6384],[9.5060,76.6520],[9.5059,76.6564]]  /* from Kottayam station */
      ],
      exits: [
        { key: "mAirport", hotspot: "lmAirport", dist: "≈ 100 km · 2 h 45 min", at: [9.6350, 76.5355], dir: 0, label: "right" }
      ]
    },

    ui: {
      en: {
        cardWord:     "Engagement",
        inviteIntro:  "We're thrilled to invite you to celebrate the engagement of",
        countEyebrow: "Until we make it official",
        calTitle:     "Engagement of Maria & Tony",
        evEyebrow:    "The Celebrations",
        evTitle:      "Two Happy Days",
        afterEngagement: "After the engagement",
        ev: {
          betrothal:    { t:"The Engagement", s:"Manasammatham", p:"The day we make it official, with family, friends and plenty of cake." },
          engReception: { t:"Reception", s:"Dinner & Celebration", p:"Straight after the engagement, join us at the parish hall for dinner and a lot of happy noise." },
          madhuram:     { t:"Madhuram Veppu", s:"The Sweet Ceremony", p:"An evening of sweets, blessings and family at Maria's home." }
        },
        trTitle:      "Getting to Nedumkunnam",
        trAirP:       "Cochin International Airport (COK) is about 100 km away, roughly 2 h 45 min by road: the MC Road to Kottayam, then the K.K. Road through Pampady.",
        trTrainP:     "Changanassery (CGY) is the nearest station, about 17 km and 35 minutes by taxi. Kottayam (KTYM) is about 24 km, around 45 minutes.",
        trRoadP:      "The church is on the Karukachal–Manimala Road in Nedumkunnam, about 2 km east of Karukachal.",
        lmVenue:      "St. John the Baptist's Forane Church, Nedumkunnam",
        mVenue:       "St. John's Church\nNedumkunnam",
        lmChanganassery: "Changanassery Railway Station (CGY)",
        mChanganassery:  "Changanassery\nStation",
        twKarukachal: "Karukachal", twNedumkunnam: "Nedumkunnam", twManimala: "Manimala", twPampady: "Pampady", twKangazha: "Kangazha",
        mKkRoad:      "K.K. Road",
        mKmRoad:      "Manimala Road",
        rsLead:       "Let us know by the 14th of January: who is coming and how many.",
        footTag:      "Step one: say yes. Step two: snacks."
      },
      ml: {
        cardWord:     "മനസ്സമ്മതം",
        inviteIntro:  "ഈ മനസ്സമ്മത ആഘോഷത്തിലേക്ക് നിങ്ങളെ സന്തോഷത്തോടെ ക്ഷണിക്കുന്നു",
        countEyebrow: "ആ ദിവസത്തിലേക്ക്",
        calTitle:     "",
        evEyebrow:    "ആഘോഷങ്ങൾ",
        evTitle:      "സന്തോഷത്തിന്റെ രണ്ട് ദിനങ്ങൾ",                    /* ★ */
        afterEngagement: "മനസ്സമ്മതത്തിന് ശേഷം",
        ev: {
          betrothal:    { t:"മനസ്സമ്മതം", s:"Engagement", p:"കുടുംബവും സുഹൃത്തുക്കളും ഒത്തിരി കേക്കുമായി ഞങ്ങൾ ഔദ്യോഗികമാക്കുന്ന ദിവസം." },
          engReception: { t:"സ്നേഹവിരുന്ന്", s:"Reception", p:"മനസ്സമ്മതത്തിന് ശേഷം പാരിഷ് ഹാളിൽ അത്താഴവിരുന്നിൽ ഞങ്ങളോടൊപ്പം ചേരുക." },
          madhuram:     { t:"മധുരം വെപ്പ്", s:"Madhuram Veppu", p:"മരിയയുടെ വീട്ടിൽ മധുരവും ആശംസകളും കുടുംബവുമായി ഒരു സന്ധ്യ." }
        },
        trTitle:      "നെടുംകുന്നത്തേക്ക്",
        trAirP:       "കൊച്ചി അന്താരാഷ്ട്ര വിമാനത്താവളത്തിൽ (COK) നിന്ന് ഏകദേശം 100 കി.മീ: എം.സി. റോഡിലൂടെ കോട്ടയം, പിന്നെ കെ.കെ. റോഡിലൂടെ പാമ്പാടി വഴി, ഏകദേശം 2 മണിക്കൂർ 45 മിനിറ്റ്.",
        trTrainP:     "ഏറ്റവും അടുത്തുള്ളത് ചങ്ങനാശ്ശേരി (CGY) സ്റ്റേഷൻ, ഏകദേശം 17 കി.മീ, ടാക്സിയിൽ 35 മിനിറ്റ്. കോട്ടയം (KTYM) ഏകദേശം 24 കി.മീ, 45 മിനിറ്റ്.",
        trRoadP:      "കറുകച്ചാൽ–മണിമല റോഡിൽ നെടുംകുന്നത്ത്, കറുകച്ചാലിൽ നിന്ന് ഏകദേശം 2 കി.മീ കിഴക്ക്.",
        lmVenue:      "സെന്റ് ജോൺ ദ ബാപ്റ്റിസ്റ്റ് ഫൊറോന പള്ളി, നെടുംകുന്നം",
        mVenue:       "സെന്റ് ജോൺസ് പള്ളി\nനെടുംകുന്നം",
        lmChanganassery: "ചങ്ങനാശ്ശേരി റെയിൽവേ സ്റ്റേഷൻ (CGY)",
        mChanganassery:  "ചങ്ങനാശ്ശേരി\nസ്റ്റേഷൻ",
        twKarukachal: "കറുകച്ചാൽ", twNedumkunnam: "നെടുംകുന്നം", twManimala: "മണിമല", twPampady: "പാമ്പാടി", twKangazha: "കങ്ങഴ",
        mKkRoad:      "കെ.കെ. റോഡ്",
        mKmRoad:      "മണിമല റോഡ്",
        rsLead:       "ജനുവരി 14-ന് മുൻപ് അറിയിക്കുമല്ലോ: ആരൊക്കെ, എത്ര പേർ.",
        footTag:      "ഒന്നാം ഘട്ടം: സമ്മതം. രണ്ടാം ഘട്ടം: പലഹാരം."          /* ★ */
      }
    }
  }
};
