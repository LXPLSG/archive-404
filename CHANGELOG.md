# Release · archive404-mystery-20 · 6 November 2026

- Approved Higgsfield packet-to-bean mystery reveal, followed directly by coffee details with favourite and Brew actions.
- Glass-cup brewing animation/completion and Undo, retained from the approved review build.
- Cached startup, cache-first versioned assets, bounded navigation/read delays, complete offline import closure, late-read protection and on-demand animation assets.
- Cleaned superseded material files/styles, redundant result UI and contradictory documentation. No inventory, auth, database or storage-key reset.
- 71 automated checks passed; browser workflow verification used disposable local inventory.

# Wheel reveal · archive404-reveal-19 · 6 November 2026

Enhanced the existing Higgsfield emblem reveal: one-second ink strokes, soft expanding ring, coffee name after 0.85 seconds, actions after 1.45 seconds. The winning wheel emblem remains prominent while others dim. No extra media downloads, inventory changes or selection-rule changes. Reduced-motion override retained. Local review only; not published.

# Brew preview and performance cleanup · archive404-brew-18 · 6 November 2026

- Original brewing sequence with only the cup changed to glass; transparent 5.6-second playback, skip/reduced motion and completion with Undo.
- Cached public inventory renders before refresh; shorter read deadline and stale-read protection.
- Cache-first static assets, bounded navigation wait, retired 4.5 MB of obsolete materials, on-demand 334 KB animation.
- Removed unused imports/CSS/assets and stale documentation; existing auth, inventory, favourites and storage keys retained.
- Local review only; not published. 66 tests pass.

# Archive 404 · Approved UI release

Higgsfield materials and reveal · archive404-higgs-17 · 5 November 2026: generated coordinated snow-white crystalline, ivory washi and lighter graphite/gold materials with Higgsfield, plus four original vector wheel emblems. Added a reduced-motion-aware animated result reveal. Wheel uses the two shelf coffees and two random stock coffees; centre tapping spins and re-spins. The compact phone layout shows all four finalists before the result replaces the list. Inventory, authentication and import logic are unchanged.

Wheel update · archive404-wheel-15 · 5 November 2026: each draw contains up to two available shelf coffees and two distinct, uniformly sampled stock coffees. Each finalist has equal selection odds. Removed the lower prompt, spin button and explanatory footer; the accessible centre 404 button now starts the wheel. Tapping it after a result samples a fresh stock pair and immediately spins again. Selection never deducts stock. When either group has fewer than two available coffees, the wheel uses the available choices without moving or inventing stock.

Shared inventory · archive404-shared-14 · 5 November 2026:
- Connected public browsing, admin editing, replenishment, adjustment, archive/restore, imports and brews to one shared Supabase inventory.
- Kept existing domain rules on both server and browser; added atomic revision checks, server-side final-serving validation, request idempotency and guest undo capabilities.
- Isolated personal favourites and private prices/history; retained original local backups and public offline browsing.
- Added Add records and Replace all records import choices, duplicate skipping, explicit confirmation and private pre-import restore points.
- Loaded the owner-supplied inventory without fabricating shelf assignments.
- Removed decorative left strokes from stock cards and balanced their horizontal padding.

Hidden entry follow-up · archive404-hidden-13: removed Manage inventory from Favourites and removed the header's public management shortcut. The seven-second wordmark hold now launches management only while on the landing menu. Existing admin authentication, authenticated routes and keyboard equivalent remain intact. No stored records changed.

Compact details · archive404-details-12: removed favourite controls from coffee cards and management rows; kept the toggle beside Brew in the coffee detail view. Reserved the header corner for Close. Reduced label spacing and typography on phone detail dialogs, with an additional short-screen layout. Full content remains available, with scrolling retained for unusually long records or enlarged text. No inventory calculation, storage or authentication changes.

Monogram and address · archive404-monogram-11: added the small centred address L13 - W105/W106 beneath the wordmark. Replaced the cup icon with the selected ivory 404 monogram on textured graphite. Added 180px Apple touch, 192px PWA and 512px maskable PNG icons, updated manifest and offline cache. Inventory, authentication and seven-second title hold remain unchanged.

Reference landscape follow-up · archive404-landscape-10: replaced the dark card's procedural cloudy grain and angular artwork with a standalone reference-guided charcoal landscape image. Applied a gentle lightening layer as requested. Kept all content, card grids, button colours and stock logic unchanged. The Snowflake background still fills the webpage; Safari's native status and toolbar areas are outside the textured page canvas.

Surface texture fix · archive404-textures-9 · 4 November 2026: added visible ivory paper grain to shelf and stock cards and a soft charcoal material texture to the dark shelf card. Preserved the existing palette, mountain artwork, grid, buttons and inventory logic. Extended the original Snowflake background to the document root, with dynamic viewport height and safe-area spacing. Added both SVG textures to offline caching.

Safari focus fix · archive404-focus-8 · 4 November 2026: suppressed the browser outline only on the focusable main content container, preventing blue lines around the menu after returning from admin. Kept focus styling for links, buttons and form controls. No inventory, authentication, layout or texture changes.

Touch access fix · archive404-touch-7 · 4 November 2026:
- Replaced the fragile hold handler with touch-specific handling that suppresses native link previews, tolerates small finger movement and retains the exact seven-second threshold.
- Added pointer capture for mouse/pen, release/cancellation handling and suppression of the trailing click that could return to the menu.
- Preserved normal short taps, keyboard access, authentication and inventory records.
- Removed Manage inventory from bean details as requested.
- Added eight gesture regression tests; all 47 tests pass.

Setup continuity fix · archive404-auth-6 · 4 November 2026:
- Kept the private setup fragment until account creation succeeds so a reload does not discard enrollment.
- Added read-only setup-link verification before enabling Create admin account.
- Captured auth submissions once at document level; disabled native URL submissions and added explicit signing-in/creating-account progress. Failed requests retain the form and a visible error.
- Corrected username pattern escaping for modern browsers and supported token responses containing expires_in without expires_at.
- 39 automated checks pass. No inventory or existing credentials were changed.

Admin authentication · archive404-auth-5 · 4 November 2026:
- Changed title hold from 0.9 seconds to seven seconds; shorter holds do not launch admin.
- Added username/password sign-in, private one-time owner setup, Sign out, in-memory sessions and 15-minute idle locking. Management actions recheck admin membership online.
- Deployed archive404-auth with server-only privileged credentials and explicit admin verification. Fixed the earlier setup function's database permissions with a private, service-only function.
- Preserved all local inventory and public menu/brewing behavior. Shared inventory sync remains separate work.
- Added authentication and setup tests; all 36 tests pass, including sign-out during a pending authorization check.

Hidden Inventory entry · 4 November 2026: hold the landing-page wordmark for 0.9 seconds, or focus it and use Alt+Enter. Short taps retain home navigation; movement, cancellation or leaving the title cancels the hold. No visible header control added.

Texture update · 4 November 2026: reduced the pale background overlay from approximately 66–71% opacity to 45–50%, revealing more of the same Snowflake texture. Card colours, typography, layout and inventory behavior remain unchanged. Updated the service-worker cache for delivery.

Release: archive404-approved-2 · 4 November 2026

- Replaced Room 404 interface branding with Archive 404 and retained the address in Inventory.
- Rebuilt the approved composition as responsive HTML/CSS: centered serif wordmark, two shelf slots and compact stock labels. Reused the existing Snowflake background asset.
- Added original lightweight ivory and charcoal mountain SVG detailing. No mockup screenshot is used as a page background.
- Aligned both shelf cards through six shared grid rows; retained distinct paper/charcoal surfaces and brown/cream Brew buttons.
- Replaced the visible Surprise Me button with faint outlined beans and an accessible 48-pixel target. Its modal retains equal odds for all available beans, including reserve stock.
- Preserved favourites, private-in-menu pricing, reusable profiles, stock batches, history, corrections, replenishment, archive/restore and backups.
- Added a two-profile shelf limit, confirmed brewing and archive actions, a submission guard and serialized brew commits where the browser supports Web Locks.
- Implemented the latest requested rule: a confirmed final serving automatically archives the bean. Undo reverses that automatic archive; replenishment reactivates it without losing history. Full shelves return reactivated beans to Others in Stock.
- Preserved the storage key and version. Existing zero-serving records are not bulk changed.
- Updated cached app-file release identifiers and manifest branding; retained the existing PWA icon.
- Added tests for public presentation, shelf limits, automatic archiving and its edge cases.
