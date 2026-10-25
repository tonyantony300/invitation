/* ============================================================================
   apps-script.gs: free RSVP backend (Google Sheets + Apps Script)
   1. Create a Google Sheet (tabs "RSVPs" / "Engagement RSVPs" are made for you)
   2. Extensions → Apps Script → paste this whole file → Save
   3. Deploy → New deployment → type "Web app"
        Execute as: Me      Who has access: Anyone
   4. Copy the URL ending in /exec into content.js → rsvpEndpoint
   Re-deploy (Manage deployments → edit → new version) after any change here.
   ========================================================================== */
/* one script for both sites: each answer lands in its own tab */
const SITES = {
  wedding:    { tab: "RSVPs",            deadline: "2027-01-15" },   // keep in step with content.js
  engagement: { tab: "Engagement RSVPs", deadline: "2027-01-14" }    // keep in step with content.js
};
const NOTIFY   = "";                      // optional: your email for a note per RSVP

/* opening the /exec URL in a browser shows this: proof the deployment is live */
function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true, service: "rsvp", sites: Object.keys(SITES) }))
                       .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const out = o => ContentService.createTextOutput(JSON.stringify(o))
                     .setMimeType(ContentService.MimeType.JSON);
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.website) return out({ ok: true });                       // honeypot: bots get a fake "ok"
    const site = SITES[d.event] || SITES.wedding;
    const today = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd");
    if (today > site.deadline) return out({ ok: false, closed: true });
    if (!d.name || String(d.name).length > 120) return out({ ok: false });

    const safe = v => { v = String(v == null ? "" : v).slice(0, 1000); return /^[=+\-@]/.test(v) ? "'" + v : v; };
    const lock = LockService.getScriptLock(); lock.waitLock(10000);
    try {
      const book = SpreadsheetApp.getActive();
      const sheet = book.getSheetByName(site.tab) || book.insertSheet(site.tab);
      if (sheet.getLastRow() === 0)
        sheet.appendRow(["Time", "Name", "Attending", "Guests", "Arrival", "Stay", "Message", "Language"]);
      sheet.appendRow([new Date(), safe(d.name), safe(d.attending), Number(d.guests) || 0,
                       safe(d.arrival), safe(d.stay), safe(d.message), safe(d.lang)]);
    } finally { lock.releaseLock(); }

    if (NOTIFY) MailApp.sendEmail(NOTIFY, (d.event === "engagement" ? "Engagement RSVP: " : "RSVP: ") + d.name + " (" + d.attending + ", " + (d.guests || 0) + ")",
                                  JSON.stringify(d, null, 2));
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false });
  }
}
