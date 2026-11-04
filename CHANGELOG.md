# Archive 404 · Approved UI release

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
