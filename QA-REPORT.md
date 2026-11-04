# Archive 404 QA report

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
