# Tony & Maria: wedding invitation

A mobile-first invitation site. Plain HTML/CSS/JS with no build step: upload the files to any static host.

## Files

| File | What it is |
|---|---|
| `content.js` | **All wording and details** (names, date, venue, phones, events, story lines, English + Malayalam). This is the only file you normally edit. |
| `index.html` | Page structure. Edit only the link-preview tags at the top (title, description, `og:*`). |
| `tokens.css` / `styles.css` | Colours, type, layout (base styles are for phones, wider screens add room). |
| `app.js` | Behaviour: tap-to-open card, tilt, countdown, calendar, story zoom, map, RSVP, language toggle. |
| `apps-script.gs` | Free RSVP backend (Google Sheets). |
| `assets/` | Card images (WebP + JPEG), link-preview image, icons, optional music. |

## Editing content

Open `content.js`, change only the text between the quotes, then save and upload. Any Malayalam line left as `""` shows the English one instead. Lines marked ★ are draft Malayalam, so please read them with family. Map distances marked ⚠ are approximate.

- **Parents / house names:** fill in `families`. Empty lines stay hidden.
- **Betrothal:** uncomment the example block in `events` and add the real date and place.
- **Music:** put an `.mp3` in `assets/audio/` and set `music: "assets/audio/your-song.mp3"`. The Sound button in the header only appears once this is set, and guests tap it to play the music.

## Two sites: wedding and engagement

| Share this | Guests see |
|---|---|
| `https://your-domain/` | the **wedding** invitation (default) |
| `https://your-domain/engagement/` | the **engagement** invitation: bright, playful theme and confetti |

`/engagement/` is a tiny page with its own WhatsApp preview (`assets/og-engagement.jpg`) that forwards to `/?event=engagement`. Share the `/engagement/` link, because WhatsApp can't read the `?event=` part for its preview.

The engagement details live in `window.CONTENT.versions.engagement` at the bottom of `content.js`. Anything set there replaces the wedding value: date, countdown, events, venue, map, and any wording in `ui.en` / `ui.ml`. Everything not set is shared with the wedding site. The engagement RSVP leaves out the arrival and stay questions (`rsvpTravel: false`), sends `"event": "engagement"`, and the same Apps Script saves those answers to a separate **Engagement RSVPs** tab.

## RSVP

The form uses the same questions as the reference site: name, will you come, how many, when you'll arrive, where you'll stay (only for early arrivals), hotels (only for "hotel"), and a message. It POSTs JSON to `rsvpEndpoint` in `content.js`, sent as `Content-Type: text/plain` so the browser skips the CORS preflight:

```json
{ "name": "…", "attending": "yes|no", "guests": 2, "arrival": "wedding-day|day-before|few-days-early",
  "stay": "arrange|own|hotel|", "message": "…", "lang": "en|ml", "event": "wedding|engagement", "website": "" }
```

`website` is a honeypot field, so drop any submission where it's filled. Reply with `{"ok":true}`, or `{"ok":false,"closed":true}` once RSVPs are closed. Until `rsvpEndpoint` is set, pressing Send shows the error message.

`apps-script.gs` is a ready-made free backend (Google Sheets). To use it, paste it into Extensions → Apps Script, deploy it as a Web app (Execute as **Me**, access **Anyone**), and put the `/exec` URL into `rsvpEndpoint`.

To show nearby hotel cards when a guest picks "hotel", fill in `hotels` in `content.js`.

## Before sharing on WhatsApp

The preview tags in `index.html` and `engagement/index.html` point to `https://tonyantony300.github.io/invitation/`. If the site moves, update `og:url` and `og:image` in both files: WhatsApp needs the full image URL to show the preview card.

## Preview locally

```
python3 -m http.server 8000
```
Then open http://localhost:8000. Phone tilt and music only work on a real phone over https, so test them after uploading.
