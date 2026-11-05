-- Keep the previous collection privately before each explicit backup import.
create table coffee_private.inventory_import_restore_points (
 revision bigint primary key, payload jsonb not null, created_at timestamptz not null default now()
);
alter table coffee_private.inventory_import_restore_points enable row level security;
revoke all on coffee_private.inventory_import_restore_points from public,anon,authenticated;
grant all on coffee_private.inventory_import_restore_points to service_role;
create or replace function public.archive404_inventory_commit(p_id uuid,p_fingerprint text,p_revision bigint,p_state jsonb,p_result jsonb) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare current_revision bigint; previous coffee_private.inventory_requests%rowtype;
begin
 select revision into current_revision from coffee_private.shared_inventory where id for update;
 select * into previous from coffee_private.inventory_requests where id=p_id;
 if found then
   if previous.fingerprint<>p_fingerprint then raise exception 'Request ID already used'; end if;
   return previous.result;
 end if;
 if current_revision<>p_revision then return null; end if;
 if p_result->>'action'='import' then
   insert into coffee_private.inventory_import_restore_points(revision,payload)
   select revision,payload from coffee_private.shared_inventory where id on conflict do nothing;
 end if;
 update coffee_private.shared_inventory set payload=p_state,revision=revision+1,initialized=true,updated_at=now() where id;
 insert into coffee_private.inventory_requests(id,fingerprint,result) values(p_id,p_fingerprint,p_result);
 return p_result;
end $$;
revoke all on function public.archive404_inventory_commit(uuid,text,bigint,jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.archive404_inventory_commit(uuid,text,bigint,jsonb,jsonb) to service_role;
