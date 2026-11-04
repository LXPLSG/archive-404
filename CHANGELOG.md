# Archive 404 · Approved UI release

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
