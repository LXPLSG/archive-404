# Archive 404 QA report

Safari focus follow-up · archive404-focus-8: scoped outline suppression to #app:focus. Browser verification explicitly focused the main container and confirmed outline-style:none, then moved keyboard focus to a button and confirmed its solid focus outline remained. All three service-worker tests passed after updating the stylesheet release URL and cache. No JavaScript business logic or inventory records changed. Physical iPhone Safari verification remains a device check.

Touch access follow-up · archive404-touch-7: 47 automated checks pass, including eight new touch/pointer tests for the exact seven-second threshold, short taps, small finger movement, scrolling cancellation, touch cancellation, multi-touch, backgrounding, pointer capture, trailing clicks and keyboard access. Bean presentation assertions confirm there is no management link in details. A local browser hold of 7.25 seconds opened admin sign-in and stayed there after release; the bean detail view retained its profile information, Brew and Favourites without Manage inventory. No stock or credentials were changed. These tests do not substitute for a physical iPhone touch test; that remains a device verification limit.

Setup continuity follow-up · archive404-auth-6: reproduced setup becoming normal sign-in after reload while Supabase still had zero users/admins and an unused setup ticket. Fixed route retention until successful setup, added a non-consuming setup readiness check, prevented native form navigation, and made pending/error states explicit. Added setup-route, read-only readiness and expires_in compatibility tests; 39 automated checks pass. Local browser verification confirmed the real unused owner link is valid, Create admin account becomes enabled, and the setup screen survives a reload. A normal invalid login displayed a progress state then a visible credential error without a page navigation. A real owner's successful enrollment still requires the owner to enter the password themselves.

## Authentication release · archive404-auth-5 · 4 November 2026

36 automated checks passed. New tests cover the 7000 ms hold threshold, session expiration and idle locking, failed/offline verification, invalid session responses, explicit admin membership, setup capability requirements, credential rejection, origin checks, and sign-out during a pending authorization check. Backend authentication tests use mocks and do not create production accounts.

Local browser checks: direct #admin shows sign-in without inventory data; a 1.5-second hold stays on the menu; a 7.25-second hold opens sign-in. A deliberately invalid login was rejected by the deployed Supabase service. Existing menu records remained 8/5/6 servings. No inventory changes were made.

Live database setup verification ran in a transaction: service-role setup succeeded for a synthetic verified user; anonymous and authenticated clients could not execute the enrollment function. All test changes were rolled back. Supabase security advisors returned no findings. The deployed Edge Function is ACTIVE.

Owner account creation and a successful real-owner login require the owner to choose the password on the setup page. Those steps cannot be marked passed before the owner completes them. Physical iOS touch testing, shared database inventory sync and email-free password recovery remain limitations. This gate controls the app's management interface; it does not encrypt existing local storage or prevent someone controlling that browser from reading/modifying its local files.

Earlier release results below are historical; the current admin sign-in and seven-second hold supersede the earlier unprotected 0.9-second entry.

Hidden entry follow-up (4 November 2026): local browser tests verified a 1.2-second title press opens Inventory, a normal click returns to the menu, and focused Alt+Enter opens Inventory. All 26 regression tests passed. No inventory mutation was performed. Title selection/callout is suppressed only on the wordmark; no visible navigation was added. Physical iOS long-press behavior remains a device check.

Texture follow-up (4 November 2026): reduced the pale overlay to 45–50% and visually checked the running mobile page. Computed browser styles confirmed the new opacity and the same frost-dial.png asset. Inventory still displayed 8/5/6 servings. Only background styling and the app-file cache identifier changed; no inventory mutations were made. Preview: ../archive-404-stronger-texture.jpg.

Date: 4 November 2026 · Release archive404-approved-2

## Data protection

Browser mutations used the isolated 127.0.0.1:4174 origin and synthetic QA beans. The existing localhost:4174 collection was inspected and photographed without inventory mutations: Ethiopia Guji 8, Colombia Huila 5, Kenya Kirinyaga 6. No inventory reset, storage-key change or production database mutation was performed for this release.

## Automated checks

`npm test`: **26 passed, 0 failed**. JavaScript syntax check passed.

Coverage includes active-batch totals, oldest-batch consumption, archive/depleted guards, no second brew at zero, exactly-once undo, correction history, equal wheel selection slots across both shelf groups, non-consuming draws, prices/favourites backup round trip, shelf capacity, HTML escaping, omission of private prices and empty optional metadata, empty/populated composition, six card zones, online cache replacement, offline navigation fallback and restricted cache cleanup.

Automatic archive checks: only the aggregate last serving triggers archive; exhausting one batch while another has stock does not. Batches/history are retained, input state is not mutated, Undo restores the bean once, a newly full shelf sends it back to stock, and a subsequent intentional archive is respected. Manual zero corrections do not trigger automatic archive.

## Browser workflow results

| Check | Outcome |
| --- | --- |
| Empty inventory imported through UI | Pass: two designed empty shelf slots; no invented beans |
| Populated fixture imported through UI | Pass: active, depleted and archived records retained |
| Create profile with initial servings and price | Pass: 3 initial servings and SGD 18.50/100 g saved |
| Edit profile | Pass: roaster field saved and shown in details |
| Third shelf assignment | Pass: rejected with explanation; form retained |
| Move shelf bean to reserve and reserve bean to shelf, then back | Pass |
| Favourite toggle | Pass: pressed state and saved favourite retained after reload |
| Open stock details | Pass: no stock deduction; empty fields and private price omitted |
| Cancel brew | Pass: count unchanged |
| Confirm brew | Pass: 1 deducted; transaction visible in history |
| Auto-archive final serving | Pass: confirmation explains archive; profile shows 0/Archived after reload |
| Undo automatic archive | Pass: profile active with 1 serving restored |
| Replenish auto-archived profile | Pass: reactivated with 2 servings in a new batch |
| Manual adjustment | Pass: remaining total and history updated |
| Cancel manual archive | Pass: profile unchanged |
| Archive/restore depleted bean | Pass: archived row stays accessible and can be restored |
| Hidden Surprise Me | Pass: opens modal; shelf and reserve entries both listed with equal odds |
| Exclude finished/archived from draw | Pass |
| Spin result | Pass: result revealed; all serving counts unchanged |
| Persistence after reload | Pass: new profiles, stock, favourites, history and archive status retained |
| Browser errors on final menu | No captured error entries |

## Responsive and visual checks

Inspected the final mobile page and checked long names, a long processing description and a three-digit serving count at widths 320, 390, 768 and 1280. Both shelf cards had equal measured heights at every width; shared grid rows align the process, inventory and action zones. No shelf descendant overflow was detected. No horizontal page overflow was detected. The page remains centered and capped on desktop.

Mobile preview: ../archive-404-mobile.jpg. It uses the pre-existing collection, not the mockup's sample coffees. The main menu has no persistent navigation, address subtitle, stock badges or favourite filter. The original Snowflake asset remains visible around the cards. The secret control has an accessible name and visible keyboard focus. Reduced-motion styling and shortened wheel animation are implemented; a physical assistive-technology audit was not performed.

## Limits and remaining release work

- The serif rendering uses licensed system fonts and varies by device. The mountain graphics are original vector interpretations; this is not an exact bitmap or font extraction from the reference. Final owner visual sign-off is still appropriate.
- Automated service-worker tests verify offline fallback; an actual airplane-mode install/reopen on physical iPhone/iPad was not performed. The existing SVG icon is retained; native install/icon behavior needs that device check.
- Duplicate prevention is covered by the UI submission guard, domain no-stock guard and single-page browser workflow. A simultaneous multi-device stress test is not applicable to the active local-only repository; cross-tab contention was not separately exercised.
- Export/import data structure is covered by automated tests and UI import was exercised. The browser's final download/save dialog was not separately exercised in this release.
- Supabase authentication/sync and shared public hosting remain inactive and unvalidated for go-live. Inventory access is not secured by hiding the management link; local price data is in backups/storage.
- Clearing browser data or moving to another origin loses access to that origin's local collection unless transferred by backup. Deploy updates on the same origin and keep backups.
- Existing finished records are not retrospectively archived. Older backups and excess legacy shelf assignments are preserved, with an Inventory warning for assignments above the new limit.
