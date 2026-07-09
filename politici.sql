-- Policy for reps to only add their own deals

drop policy if exists "Reps can only add their own deals" on public.sales_deals;

create policy "Reps can only add their own deals"
on public.sales_deals
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.user_profiles
    where user_profiles.id = auth.uid()
    and user_profiles.account_type = 'sales_rep'
  )
);

-- Admins to add anyone's deals

drop policy if exists "Admins can add anyone's deals" on public.sales_deals;

create policy "Admins can add anyone's deals"
on public.sales_deals
for insert
to authenticated
with check (
  exists (
    select 1 from public.user_profiles
    where user_profiles.id = auth.uid()
    and user_profiles.account_type = 'admin'
  )
);