-- Preserve v1 profiles, batches and history without lossy schema translation.
-- The existing normalized tables are empty and remain untouched.
create table coffee_private.shared_inventory (
 id boolean primary key default true check(id), revision bigint not null default 0,
 payload jsonb not null default '{"schemaVersion":1,"profiles":[],"batches":[],"history":[]}'::jsonb,
 initialized boolean not null default false, updated_at timestamptz not null default now()
);
create table coffee_private.inventory_requests (
 id uuid primary key, fingerprint text not null, result jsonb not null,
 created_at timestamptz not null default now()
);
alter table coffee_private.shared_inventory enable row level security;
alter table coffee_private.inventory_requests enable row level security;
revoke all on coffee_private.shared_inventory,coffee_private.inventory_requests from public,anon,authenticated;
grant all on coffee_private.shared_inventory,coffee_private.inventory_requests to service_role;
insert into coffee_private.shared_inventory(id) values(true);
create function public.archive404_inventory_read() returns jsonb language sql security invoker set search_path='' as $$
 select jsonb_build_object('revision',revision,'state',payload,'initialized',initialized) from coffee_private.shared_inventory where id;
$$;
create function public.archive404_inventory_request(p_id uuid) returns jsonb language sql security invoker set search_path='' as $$
 select jsonb_build_object('fingerprint',fingerprint,'result',result) from coffee_private.inventory_requests where id=p_id;
$$;
create function public.archive404_inventory_commit(p_id uuid,p_fingerprint text,p_revision bigint,p_state jsonb,p_result jsonb) returns jsonb
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
 update coffee_private.shared_inventory set payload=p_state,revision=revision+1,initialized=true,updated_at=now() where id;
 insert into coffee_private.inventory_requests(id,fingerprint,result) values(p_id,p_fingerprint,p_result);
 return p_result;
end $$;
revoke all on function public.archive404_inventory_read(),public.archive404_inventory_request(uuid),public.archive404_inventory_commit(uuid,text,bigint,jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.archive404_inventory_read(),public.archive404_inventory_request(uuid),public.archive404_inventory_commit(uuid,text,bigint,jsonb,jsonb) to service_role;
