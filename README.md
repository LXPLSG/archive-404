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
- Tap a heart to toggle a favourite. The detail screen contains a link to Favourites. Management is accessed through the hidden title gesture.
- The very faint two-bean icon at the upper right opens Surprise Me. Every available, non-archived bean has an equal chance, irrespective of shelf assignment or serving count. Drawing never consumes stock.
- Brew a cup opens a confirmation. Confirming records exactly one serving from the oldest available batch. The action cannot consume an archived or depleted bean.
- **Last serving:** when the total across all active batches reaches zero through a confirmed brew, the profile automatically moves to archive. Its batches and history remain saved. The confirmation and completion message explain this.
- Undo restores the serving and reverses that automatic archive. If both shelf places have since been filled, it returns to Others in Stock and explains this in the completion message. An intentional later archive is respected.
- Replenishing an automatically archived bean reactivates it. When its old shelf place is unavailable, it returns to stock. Manually archived profiles still require Restore.

Existing zero-serving records are not retrospectively archived. A manual stock correction to zero also remains a finished record; automatic archiving is triggered specifically by the last confirmed brew.

## Inventory and backups

Press and hold the Archive 404 title for seven seconds, or append `#admin` to the app URL, to open admin sign-in. Bean details no longer include a Manage inventory link. The Inventory management link also becomes visible when reached by keyboard. The address L13 - W105/W106 remains on the secondary Inventory screen.

**Hidden landing-page access:** press and hold the Archive 404 title for seven seconds to open admin sign-in. A regular tap still returns home. Keyboard users can focus the title and press Alt+Enter, or use the Inventory management link. The gesture is a navigation shortcut; username/password authentication is a separate step.

**Admin account:** the owner receives a single-use setup link, valid for 24 hours, to choose a username and password (at least 12 characters). The link is not included in source code or backups. Usernames are 3–32 characters, starting with a letter; letters, numbers, dots, hyphens and underscores are supported. No email address is needed in the app. After setup, reopen admin and sign in with that username/password. There is no public registration or self-assignment of admin permissions.

Authentication uses the deployed Supabase archive404-auth service, which validates the user and an explicit admin membership. Sessions stay in page memory, lock after 15 idle minutes or token expiry, and are lost on reload. Inventory access and management actions require an online verification. Use Sign out to lock the management screen. Passwords and session tokens are never written to inventory backups or local storage. Username-only accounts do not have email password recovery; contact the project owner for a controlled reset if the password is lost.

Create and edit reusable bean profiles, set initial servings, add replenishment batches, correct remaining counts, review history, and archive/restore profiles. At most two non-archived profiles may be assigned to the shelf. Legacy excess assignments are retained and flagged for correction; they are never silently overwritten or reassigned.

Price per 100 g and currency appear only in signed-in Inventory. They are omitted from the public menu, detail view and wheel. **Inventory storage remains local:** price information is still in this browser's storage and full backups, accessible to someone with control of that browser. This sign-in gate does not convert existing local data into an encrypted or authenticated cloud database.

Export backup downloads all profiles, batches and history as JSON, including favourites, prices and automatic archive metadata. Import replaces the current collection; export first if you need to retain it. The original `coffee-menu-pwa:v1` storage key and schema version remain unchanged. No data migration or reset is needed.

## Install and offline use

Serve over HTTPS, or localhost for development. Visit online first so the application files can be cached. Then use your browser's Install app / Add to Home Screen option; on iOS Safari use Share → Add to Home Screen. Exact installation UI depends on the browser. The existing SVG app icon is retained; native-device installation remains a release check.

The service worker tries the network first and falls back to cached app files. It never clears local inventory. External coffee image URLs may not be available offline. No additional fonts or libraries are downloaded at startup.

## Update an existing installation

Export a backup, replace the app files **on the same origin and path**, then open online and reload to obtain release `archive404-approved-2`. Do not clear site data. The worker removes obsolete app-file caches only, leaving inventory storage intact. If startup fails, the app displays a retry panel instead of a blank screen.

## Hosting

The active app is a static site. Publish index.html, styles.css, manifest.webmanifest, sw.js, and the js/ and assets/ directories to an HTTPS static host, keeping their relative paths. There is no build command. You may deploy the full project as well, but the tests and backend drafts are not needed by the static site.

**Shared inventory sync remains pending:** this release uses per-browser local storage, with Supabase username/password authentication for the management screen. It does not upload or synchronize inventory. Before using a shared stock ledger, connect the repository to the protected database and validate private pricing and the initial data transfer. The active authentication service source is supabase/functions/archive404-auth/index.js; the downloadable package also preserves prior backend migrations and drafts. Never put a privileged key in browser code.

The asynchronous repository interface in js/storage.js remains the integration boundary for a future authenticated backend. A deployment alone does not transfer the collection between browser origins or devices; export/import is the current transfer mechanism.

See CHANGELOG.md and QA-REPORT.md for this release's changes, verified checks and limits.
# Shared inventory release · 5 November 2026

The hosted app now uses Supabase shared inventory through the `archive404-inventory` Edge Function. GitHub Pages serves the app files; it is not the inventory database. Favourites remain private to each browser/device. Menus refresh on opening/focus and approximately every 10 seconds while visible; refresh immediately to force a new read.

Admin access remains a seven-second hold on the landing-page wordmark followed by username/password sign-in. Import backup now offers **Add records** (keep existing profiles, balances and history; skip matching IDs; put new coffees in Others in Stock) and **Replace all records** (explicit confirmation; previous shared collection retained as a private restore point). Both publish changes for everyone. Exports from Inventory contain the full admin collection, including private prices and history; keep those files private.

The owner-provided `coffee-menu-updated-2026-11-04.json` was loaded into shared storage: 15 profiles, 15 batches, 85 remaining servings. The backup has no shelf assignments; none were invented. The data file itself is not part of the source repository or downloadable project.

Original `coffee-menu-pwa:v1` local data is retained without overwriting it. Public offline browsing uses a separate cache with no private prices/history. Brewing, imports and management changes require a connection; failed network requests are not queued as local stock changes. Request IDs make a retried brew idempotent. A guest can undo its own recent brew using a private, unpredictable request capability. Admins can review the full history and undo eligible events.

Deployment details: deploy the two migration files dated 20261105, then the Edge Function (with `verify_jwt = true`) and its adjacent `domain.js`, and finally the static files. Only public publishable/visitor credentials are in browser source; service credentials remain server environment variables. The existing normalized tables remain untouched and empty. The active collection uses the backward-compatible v1 JSON model in `coffee_private.shared_inventory`, with a revision compare-and-swap transaction and private request/restore-point tables. This avoids dropping legacy fields during migration. Raw database RPCs and tables are service-role-only; the gateway validates admin membership and returns a public field allowlist to guests.

Restoring an import restore point is currently an administrator/operator database operation; there is no self-service restore-point browser UI. Guest favourites do not sync across devices. Physical iOS installation and a real-owner sign-in after this release still require device verification; no owner password was entered or changed during implementation.

Earlier local-first notes below describe previous releases and are superseded by this section.

