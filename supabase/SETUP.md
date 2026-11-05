# Supabase database status

## Shared inventory update · 5 November 2026

The PWA is now connected through `archive404-inventory` with `verify_jwt=true`. Active shared data is in `coffee_private.shared_inventory`; the earlier empty normalized tables remain unchanged. The gateway reuses the existing v1 business rules, authorizes management via the established admin membership, and exposes only allowlisted public fields. Service-role-only invoker RPCs perform revision-checked atomic commits and record retry IDs. Private import restore points preserve the previous collection. See README for current deployment and import instructions. Earlier statements that the repository remains local are superseded.


## Authentication update · 4 November 2026

The archive404-auth Edge Function is now deployed (version 1, ACTIVE). It accepts login/setup requests without a pre-existing JWT, then validates passwords through Supabase Auth and verifies explicit membership in coffee_private.admin_users. Session checks validate the user through Auth and recheck that membership. Browser configuration contains only the publishable project key. Privileged credentials are read from the server environment.

Migration 20261104060742_admin_setup_privileges was applied to fix the earlier service-role setup path. Its private enrollment function is executable only by service_role, validates a one-time capability and a verified Auth user, and is called through an invoker wrapper. A transactional setup test passed and was rolled back. Security advisors returned no findings.

The owner must create the account through the private setup link; no owner password has been chosen by the implementation agent. The static application now gates Inventory with this service. The inventory repository itself remains local and has not been migrated to Supabase. Earlier notes below about sign-in being unimplemented are superseded by this section; shared stock/database integration remains pending.

Created and verified on 3 November 2026.

- Organisation: LXPL
- Project: Coffee Menu
- Project ID: `qucyegqtgdnigcmpfrlw`
- Region: Singapore (`ap-southeast-1`)
- Dashboard: https://supabase.com/dashboard/project/qucyegqtgdnigcmpfrlw
- Applied migrations: `coffee_inventory_with_private_prices`, `private_mutation_implementation`
- Live SQL tests: `tests/access_and_inventory.sql` passed, with all fixtures rolled back.
- Supabase security advisory check after migrations: no findings.

## Tables and access

| Table | Purpose | Access |
| --- | --- | --- |
| `bean_profiles` | Reusable coffee descriptions, shelf state, archive state | Public reads of unarchived profiles; admin writes |
| `stock_batches` | Purchase/roast dates, initial and remaining servings | Public reads of unarchived stock; admin inserts and archive changes |
| `bean_prices` | Optional price per 100 g and currency | Admin only; separate from public profile data |
| `consumption_events` | Brew, adjustment, and undo ledger | Admin reads; writes through the stock function only |
| `favourites` | Account-specific saved coffees | Each signed-in user reads/writes only their own favourites |
| `coffee_private.admin_users` | Approved admin identities | No client access or self-enrolment |

All six tables have Row Level Security enabled. Stock changes use `coffee_change_stock` with a client-generated request UUID, authorisation checks, transaction locks, and retry protection. Public callers cannot overwrite balances. Private prices are absent from the public catalogue table.

## Not yet connected to the PWA

The delivered PWA still runs in local mode. Creating this database does not automatically migrate or sync browser data. No demonstration coffees, purchase prices, user records, or browser backups were imported into production.

The next implementation stage is:

1. Add Supabase Auth sign-in to the application. Signing into the Supabase dashboard does not create an application user.
2. Verify the owner's application account and explicitly add its Auth user ID to `coffee_private.admin_users` through an authorised server-side operation. Do not allow the first visitor to claim admin.
3. Implement a Supabase repository with explicit public reads, admin-only price fetches, and stock changes through the RPC. Do not use whole-state load/save overwrites for concurrent stock updates.
4. Keep guest favourites in local storage; merge them with the account's `favourites` after login. Do not upload every visitor's favourites as a shared flag on the bean profile.
5. Export the owner's browser backup, validate it, then import profiles, batches, prices, history, and account favourites through an admin-authorised migration. Preserve local IDs and serving balances.
6. Keep cached public browsing available offline; require a connection for stock mutations initially. Never cache admin price API responses in the public service worker cache.
7. Test public versus admin access through actual API sessions, two-device final-serving consumption, migration, sign-out cleanup, and PWA installation before hosting the shared app.

Use only the project's publishable API key in browser configuration. Never place service-role keys or database passwords in this project.
