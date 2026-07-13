
-- ============================================================
-- 1-2. Tabel nou: sales_reps
-- ============================================================
create table if not exists public.sales_reps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  linked_user_id uuid references public.user_profiles(id),
  created_at timestamptz not null default now()
);

-- ============================================================
-- 3. Migrare nume distincte din sales_deals in sales_reps
-- ============================================================
insert into public.sales_reps (name)
select distinct coalesce(up.name, sd.name) as display_name
from public.sales_deals sd
left join public.user_profiles up on up.id = sd.user_id
where coalesce(up.name, sd.name) is not null
  and not exists (
    select 1
    from public.sales_reps sr
    where sr.name = coalesce(up.name, sd.name)
  );

-- ============================================================
-- 4. Legare linked_user_id acolo unde numele se potriveste
--    cu un cont real din user_profiles
-- ============================================================
update public.sales_reps sr
set linked_user_id = up.id
from public.user_profiles up
where sr.name = up.name
  and sr.linked_user_id is null;

-- ============================================================
-- 5. Coloana noua sales_rep_id in sales_deals
-- ============================================================
alter table public.sales_deals
  add column if not exists sales_rep_id uuid references public.sales_reps(id);

-- ============================================================
-- 6. Backfill sales_rep_id pentru deal-urile existente
-- ============================================================
update public.sales_deals sd
set sales_rep_id = (
  select sr.id
  from public.sales_reps sr
  where sr.name = coalesce(
    (select up.name from public.user_profiles up where up.id = sd.user_id),
    sd.name
  )
  limit 1
)
where sd.sales_rep_id is null;