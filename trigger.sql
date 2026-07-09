-- Challenge
-- Complete the below trigger function and trigger object

-- trigger function
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_profiles (id, name, account_type)
  values (
    new.id,
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'account_type'
  );
  return new;
end;
$$;

-- trigger object
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();