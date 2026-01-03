-- Create departments table for better organization
create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  manager_id uuid references auth.users(id),
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.departments enable row level security;

-- RLS Policies - all authenticated users can view departments
create policy "Authenticated users can view departments"
  on public.departments for select
  using (auth.uid() is not null);

create policy "Admins can manage departments"
  on public.departments for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Insert default departments
insert into public.departments (name, description) values
  ('Engineering', 'Software development and technical teams'),
  ('Human Resources', 'HR and people operations'),
  ('Sales', 'Sales and business development'),
  ('Marketing', 'Marketing and communications'),
  ('Finance', 'Finance and accounting'),
  ('Operations', 'General operations')
on conflict (name) do nothing;
