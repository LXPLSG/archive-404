# Archive 404 · Coffee Menu PWA

Release: archive404-mystery-20 · 6 November 2026. Dependency-free static frontend with shared inventory, private admin pricing, browser favourites and offline cached browsing. This release includes the glass-cup brewing sequence, startup cleanup and the approved packet-to-bean mystery reveal.

## Run and test

Use Node.js 20 or newer. No package installation or build step is required.

```sh
npm run serve
npm test
```

Open http://localhost:4173, or use `PORT=4174 npm run serve`. Do not open index.html directly. The backend permits local development on ports 4173/4174 and the existing GitHub Pages origin. Browser favourites and offline caches belong to each origin; inventory belongs to the shared backend.

## Menu and brewing

- Two shelf slots appear above Others in Stock. Tap coffee names or stock cards for details. Hearts appear in details only.
- The faint two-bean header icon opens Surprise Me. Each draw includes up to two available shelf coffees and two random, distinct stock coffees. Each finalist has equal odds. Short groups show fewer choices. Tap the centre 404 control to spin. A paper packet unfolds to reveal a bean, then its selected coffee details open directly. Reopen Surprise Me for a fresh draw. Selection never consumes stock.
- Brew a cup opens a confirmation. Only a successful confirmed server transaction deducts one serving from the oldest available batch and records history.
- The transparent ink animation then plays for 5.6 seconds: beans, grinding, pour-over and a glass cup. Completion shows the coffee and remaining servings, with Back to menu and Undo brew. Skip animation and Escape are supported. Reduced motion shows static completion immediately.
- The last confirmed serving automatically archives the bean, preserving batches/history. Undo restores the serving and reverses automatic archive. If both shelf spaces have since filled, restoration returns it to stock.
- Replenishment reactivates automatically archived beans. Manually archived beans require Restore. Manual corrections to zero leave a finished record; they do not trigger automatic archive.

## Admin, storage and backups

Hold the landing-page Archive 404 wordmark for seven seconds, then sign in with the existing username/password. Keyboard users can focus the wordmark and press Alt+Enter. The gesture is a navigation shortcut; the backend independently checks authenticated admin membership. No public management link is shown.

Management supports reusable profiles, batches, initial/remaining servings, two shelf assignments, private prices per 100 g, replenishment, adjustments, archive/restore and history. Favourites belong to each browser/device. Prices and full history are admin-only.

Admin sessions stay in page memory and expire after 15 idle minutes or token expiry. Reload requires sign-in. Passwords/tokens never enter inventory backups or browser persistence. Existing owner setup is unchanged. Username-only accounts have no email recovery; lost credentials require a controlled operator reset.

Export downloads the admin collection as JSON, including private prices/history. Keep backups private. Import offers:

- **Add records:** retain existing balances/history, skip matching IDs, append new records. New coffees start in Others in Stock.
- **Replace all records:** explicit confirmation; replace shared inventory and retain a private pre-import restore point. Recovering that restore point currently requires the database operator.

Both modes update shared inventory for all visitors. Public snapshots exclude private fields. The original coffee-menu-pwa:v1 backup is retained; this release changes no storage keys or database schema.

## Loading, installation and offline use

Saved public inventory renders immediately, then refreshes. New visitors see a loading state until their first shared read. Read deadline: eight seconds. Writes retain their 20-second timeout and idempotent retry protection. A late read cannot roll back a newer mutation's cache revision. Full browser cache storage cannot turn an acknowledged write into a reported failure.

Versioned assets use the release cache immediately. Navigation tries the network for up to 2.5 seconds, then cached HTML. Offline shell: 24 entries, approximately 918 KB. Obsolete backgrounds are removed. Brewing artwork uses a 334 KB transparent atlas fetched when Brew is pressed; the mystery reveal uses a 466 KB atlas fetched when Surprise Me opens. Both use browser interpolation and stay out of initial loading. No external fonts/libraries load at startup.

Serve on HTTPS or localhost. Visit online first, then use Install app / Add to Home Screen (Safari: Share → Add to Home Screen). PNG home-screen icons and manifest are retained. Offline browsing uses the saved public menu; mutations and admin verification require connectivity. External coffee images may be unavailable offline. Safari controls its native status/toolbar backgrounds.

## Deployment and updates

Publish index.html, styles.css, manifest.webmanifest, sw.js, js/ and assets/ to the existing HTTPS origin/path. No build command. GitHub Pages hosts static files; the existing shared backend stays authoritative. See supabase/SETUP.md for backend operations; this frontend release needs no backend deployment.

Keep the same origin/path; do not clear site data. Reload online to receive the release. The worker removes only old app caches, leaving inventory/favourites/legacy backups intact. Never publish owner backup JSON, privileged credentials or temporary QA servers. Browser configuration contains public credentials only.

See QA-REPORT.md, CHANGELOG.md and assets/TEXTURE-NOTES.md. Physical iPhone installation and real-device timing remain manual checks. Local timing is not a guarantee of mobile network performance.
