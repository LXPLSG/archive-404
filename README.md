# Archive 404 · Coffee Menu PWA

An editorial coffee menu and local inventory tracker. This release implements the approved two-card Archive 404 composition and the subsequent request to automatically archive a bean after its last serving is brewed.

## Run and test

Requires Node.js 18 or newer, with no package installation needed.

```sh
npm run serve
```

Open http://localhost:4173. To use another port, run `PORT=4174 npm run serve`. Keep using the same host and port as your existing collection: browser storage belongs to that origin. Opening a different port or switching between localhost and 127.0.0.1 creates a separate collection.

```sh
npm test
```

Do not open index.html directly. Module loading and service workers require a web server.

## Use the menu

- The two shelf slots appear above Others in Stock. Tap a coffee name or stock label for its full details.
- Tap a heart to toggle a favourite. The detail screen contains links to Favourites and Manage inventory.
- The very faint two-bean icon at the upper right opens Surprise Me. Every available, non-archived bean has an equal chance, irrespective of shelf assignment or serving count. Drawing never consumes stock.
- Brew a cup opens a confirmation. Confirming records exactly one serving from the oldest available batch. The action cannot consume an archived or depleted bean.
- **Last serving:** when the total across all active batches reaches zero through a confirmed brew, the profile automatically moves to archive. Its batches and history remain saved. The confirmation and completion message explain this.
- Undo restores the serving and reverses that automatic archive. If both shelf places have since been filled, it returns to Others in Stock and explains this in the completion message. An intentional later archive is respected.
- Replenishing an automatically archived bean reactivates it. When its old shelf place is unavailable, it returns to stock. Manually archived profiles still require Restore.

Existing zero-serving records are not retrospectively archived. A manual stock correction to zero also remains a finished record; automatic archiving is triggered specifically by the last confirmed brew.

## Inventory and backups

Open Manage inventory from a coffee's detail screen, or append `#admin` to the app URL. The Inventory management link also becomes visible when reached by keyboard. The address L13 - W105/W106 remains on this secondary screen.

**Hidden landing-page access:** press and hold the Archive 404 title for about one second to open Inventory. A regular tap still returns home. Keyboard users can focus the title and press Alt+Enter, or use the Inventory management link. This gesture is a navigation shortcut, not authentication.

Create and edit reusable bean profiles, set initial servings, add replenishment batches, correct remaining counts, review history, and archive/restore profiles. At most two non-archived profiles may be assigned to the shelf. Legacy excess assignments are retained and flagged for correction; they are never silently overwritten or reassigned.

Price per 100 g and currency appear only in Inventory. They are omitted from the public menu, detail view and wheel. **This local version has no sign-in security:** local storage and full backups contain the price information. Hiding a field from the menu is not server-side privacy.

Export backup downloads all profiles, batches and history as JSON, including favourites, prices and automatic archive metadata. Import replaces the current collection; export first if you need to retain it. The original `coffee-menu-pwa:v1` storage key and schema version remain unchanged. No data migration or reset is needed.

## Install and offline use

Serve over HTTPS, or localhost for development. Visit online first so the application files can be cached. Then use your browser's Install app / Add to Home Screen option; on iOS Safari use Share → Add to Home Screen. Exact installation UI depends on the browser. The existing SVG app icon is retained; native-device installation remains a release check.

The service worker tries the network first and falls back to cached app files. It never clears local inventory. External coffee image URLs may not be available offline. No additional fonts or libraries are downloaded at startup.

## Update an existing installation

Export a backup, replace the app files **on the same origin and path**, then open online and reload to obtain release `archive404-approved-2`. Do not clear site data. The worker removes obsolete app-file caches only, leaving inventory storage intact. If startup fails, the app displays a retry panel instead of a blank screen.

## Hosting

The active app is a static site. Publish index.html, styles.css, manifest.webmanifest, sw.js, and the js/ and assets/ directories to an HTTPS static host, keeping their relative paths. There is no build command. You may deploy the full project as well, but the tests and backend drafts are not needed by the static site.

**Shared public go-live remains pending:** this release still uses per-browser local storage and unauthenticated inventory controls. It does not activate Supabase sync or admin authentication. Before a shared deployment, finish and validate authentication, server-side inventory permissions, private pricing and the initial data transfer. The supabase/ directory preserves earlier backend work; it is not called by the active application. Never put a privileged key in browser code.

The asynchronous repository interface in js/storage.js remains the integration boundary for a future authenticated backend. A deployment alone does not transfer the collection between browser origins or devices; export/import is the current transfer mechanism.

See CHANGELOG.md and QA-REPORT.md for this release's changes, verified checks and limits.
