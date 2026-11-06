# Release QA · archive404-mystery-20 · 6 November 2026

71 automated checks pass, covering inventory/undo/idempotency, auth, import modes, personal favourites, wheel eligibility, animation timing/cancellation/reduced motion, cache race protection and the complete offline startup import graph.

Browser verification on isolated test inventory:
- Wheel opens with two shelf and two stock candidates. The closed packet unfolds to reveal the coffee bean; then the wheel closes and the selected coffee detail opens directly. There is no return to the wheel result screen. Selection alone leaves stock unchanged.
- Confirmed brew from the revealed detail deducts one serving, reaches glass-cup completion, and Undo restores the serving. Cancellation, skip and last-serving archive/undo were also verified in the prior review run.
- Closing during mystery playback cancels it; reopening shows a clean draw. A fresh direct wheel URL waits for inventory before opening and correctly includes all four test choices.
- Saved menu appeared in 150 ms against a deliberately delayed six-second local read endpoint in the prior review run. First uncached visitors still need a backend response.
- Completion fits at 390 × 844 and 320 × 568, as recorded below. No physical iPhone timing/install test or real-owner login was performed.

Performance/cleanup:
- 24 offline shell entries, 940,067 bytes; all paths exist. Exact module query versions are tested recursively, and the duplicated domain import was eliminated.
- Both animation atlases load on interaction rather than initial navigation: brew 334,372 bytes; mystery 466,254 bytes. The mystery atlas has 16 distinct transparent frames, rendered with interpolation over 3.6 seconds.
- Removed 4,532,165 bytes of superseded materials and obsolete wheel-result CSS/logic. Public menu renders from saved state before sync; stale reads and storage quota errors cannot roll back acknowledged mutations.
- Source and cache keys updated together. No database/account changes, data reset, additional package dependency, or production stock mutation. Prior reports below describe historical review builds.

# Wheel reveal QA · archive404-reveal-19 · 6 November 2026

66 tests pass. Browser verified with two shelf and two stock test coffees: symbol appears before coffee name/actions; SVG strokes use the emblem-ink animation; name delay 0.85 s and action delay 1.45 s. Centre re-spin resets and replays the result. Counts remained 4/3/6/8 without consumption. At 390 × 844, result fits with 714 px content/visible and no horizontal overflow. No new image download, backend change or production data mutation. Reduced motion is covered by the existing global animation override. This is a local review build, not deployed.

# Brew preview and performance cleanup · archive404-brew-18 · 6 November 2026

Status: local review build; not published. No production inventory was modified.

- 66 automated tests pass: stock, last-serving archive, undo, duplicate/lost-request protection, auth, import modes, privacy, wheel selection, animation timeline and offline cache handling.
- Browser at 390 × 844: confirmed brew changes test stock from 4 to 3 exactly once, plays the transparent sequence, and shows the correct coffee/count. Undo restores 4; Cancel leaves stock unchanged. Skip reaches the same completion. Last-serving completion states archive; Undo restores availability. Completion fits without scrolling at 390 × 844 (554 px content/visible) and 320 × 568 (463 px content/visible); no horizontal overflow.
- With a deliberately delayed six-second inventory endpoint, cached menu was visible 150 ms after reload locally. This is a repeat-visit measurement, not a first-visit or physical-phone performance guarantee.
- All 23 offline shell entries exist: 937,879 bytes. Removed 4,532,165 bytes of obsolete backgrounds (about 83% reduction versus the corresponding previous set). Cache-first versioned assets, navigation fallback and missing-module safeguards pass.
- Selected original sequence retained; only cup regions replaced with generated glass artwork. GIF verification: 97 frames / 5,600 ms, transparency in every frame, zero changes outside cup regions compared with the selected slow preview. Runtime uses a transparent 16-keyframe atlas (334,372 bytes), loaded on demand.
- Protected cache revision against late reads, avoided repaint after concurrent user activity, and prevented quota failure obscuring a successful server mutation. Corrupt optional cached favourites do not prevent cached menu reads.
- Removed unused texture pseudo-elements, wheel pseudo-button styles, imports/assets and contradictory old documentation. No schema, account, storage-key or production inventory migration.

Limitations: first uncached visits still need the backend response. Physical iPhone timing/install was not retested. Offline cache behaviour is regression-tested; physical device network loss was not simulated this iteration. Owner credentials were not used for admin login. Reports below are historical.

# Archive 404 QA report

Final Higgsfield release checks: all 61 regression checks pass; all 29 offline assets exist. At 390 × 844, all four finalists are visible before spinning, and a tested reveal fitted the dialog without internal scrolling (754px content / 754px visible). The generated JPEG materials total approximately 760 KB. The vector asset was checked for scripts, embedded raster images and external references before its paths were used. Visual testing confirmed the page, ivory and lighter charcoal treatments behind the real shared collection.

Higgsfield visual update · archive404-higgs-17: replaced page and card materials with original generated assets and used generated Mountain/Blossom/Crescent/Snow crystal vector paths on the wheel, legend and result. Tested centre spinning, fresh-pair re-spins, four-symbol mapping and the coffee-reveal animation. Existing reduced-motion CSS disables all reveal transitions/animations. No brew was confirmed; stock remained unchanged. The wheel-only release's 61 regression checks apply; final visual and offline asset checks are recorded with the delivered release.

Wheel update · archive404-wheel-15: all 61 tests pass. Added deterministic checks for 2+2 composition, all equally likely stock pairs, equal winner index slots, distinct choices, unavailable exclusions, short groups and unchanged stock. Browser testing verified the centre button spins, produces a result with a separate Brew action and re-spins with a fresh pair. The two shelf coffees remain in the draw; stock pairs changed between draws. No brews were confirmed during these checks.

## Shared inventory · archive404-shared-14 · 5 November 2026

59 automated checks pass. New tests cover two-client visibility, concurrent last-serving attempts, duplicate request replay, lost-response retries, stale admin writes, server validation, guest undo ownership, automatic archive/undo, private price redaction, local favourites isolation, legacy backup preservation, offline public browsing, import append/replace and matching-ID skips. Backend and browser domain sources are verified identical.

Live Supabase transaction tests verified compare-and-swap rejection of stale writes, idempotent commit replay, private import restore-point creation and denial of anonymous raw state access; all test changes were rolled back. The production Edge Function keeps the platform JWT check enabled and checks explicit admin membership for management writes. Anonymous read returned 200; anonymous save/import returned 403. No test brews were made against the owner's real stock.

The owner-authorised backup was validated and committed to the initially empty shared collection: 15 profiles, 15 batches, 85 remaining servings, no consumption history and no shelf assignments. Prices remain in private state only. Original browser storage is not reset. Browser integration uses a disposable local harness; admin Add records was confirmed through the UI and the new coffee appeared in a separate-origin visitor session with the original stock retained. Replace semantics are covered by automated tests and database restore-point verification.

Security advisors: three informational RLS-without-policy notices on deliberately service-only private tables (all client privileges revoked), plus the pre-existing leaked-password protection warning. Remediation reference for the existing Auth setting: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection . No authentication setting was weakened. Restore-point recovery is operator-only; offline stock mutation is intentionally unavailable. Real-owner login and physical iPhone testing were not performed by the agent.


Hidden-entry verification: 11 hold-handler/service-worker checks passed. Browser tests confirmed that a 7.25-second hold on Favourites does not launch admin, while the same hold on the landing menu opens Admin sign in and remains there after release. Favourites and the header contain no management link. No stock or credentials changed.

Hidden entry follow-up · archive404-hidden-13: removed public admin anchors from Favourites and the header. Landing-menu-only hold callback preserves the existing seven-second handler and authentication. Direct admin routes continue to require sign-in; hiding navigation is not an additional security boundary.

Compact details · archive404-details-12: all 47 automated regression checks passed. Kenya Kirinyaga's complete fields, dates, stock summary, brewing notes, Brew, favourite and favourites link fit without internal scrolling at 390 × 700 and 320 × 640. Close and favourite occupy separate header/footer areas. Verified zero shelf-card heart controls. Favourite toggled on/off successfully and returned to its original state. Brew opened the existing confirmation; cancelled without stock deduction. Long records and enlarged accessibility text retain scrolling rather than clipping content. Physical iPhone verification remains a device check.

Monogram release validation: 11 relevant service-worker and hidden-access tests passed. All 22 offline assets exist; PNG signatures and dimensions verified. Phone (390px) and tablet (768px) checks found no overflow; address sits 12px below the wordmark. The normal title link and hidden hold target remain the existing anchor.

Monogram/address · archive404-monogram-11: phone preview confirms centred address under the wordmark. The monogram artwork stays inside the maskable safe circle. PNG assets are provided at 180, 192 and 512 pixels; HTML explicitly links the Apple touch icon and manifest lists both PWA sizes. All icon files are included in offline caching. Actual iPhone Home Screen installation is a physical-device check; existing installed shortcuts may retain their previous icon.

Reference landscape follow-up · archive404-landscape-10: visually checked the lighter charcoal material, organic gold seam and mountain ridge on the 390 × 844 phone preview. The generated asset contains no text or controls; all interface elements remain live HTML. Native Safari status/toolbar regions are not part of the webpage texture and require physical-device verification. No stock or authentication changes were made.

Release verification: all 47 automated regression checks passed. All 19 offline assets exist. Responsive checks at 390 × 844, 768 × 1024 and 1280 × 900 found no horizontal overflow and equal shelf-card heights. Saved inventory remained 8/5/6 servings throughout these visual checks.

Surface texture follow-up · archive404-textures-9: phone preview at 390 × 844 shows visible paper grain on ivory cards, continuous charcoal texture, equal shelf-card heights and no horizontal overflow. The original frost-dial.png now covers the document root; body is transparent with dynamic viewport height and safe-area padding. No storage keys, records, authentication or serving logic changed. Safari's native toolbar is browser-controlled and cannot be guaranteed to display the webpage texture; physical iPhone Safari remains a device check.

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
