-- Create attendance table for clock in/out records
create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  clock_in timestamp with time zone not null,
  clock_out timestamp with time zone,
  date date not null,
  work_hours decimal(5,2),
  status text default 'active' check (status in ('active', 'completed')),
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create index for faster queries
create index if not exists idx_attendance_user_date on public.attendance(user_id, date);
create index if not exists idx_attendance_date on public.attendance(date);

-- Enable RLS
alter table public.attendance enable row level security;

-- RLS Policies for attendance
create policy "Users can view their own attendance"
  on public.attendance for select
  using (auth.uid() = user_id);

create policy "Admins can view all attendance"
  on public.attendance for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Users can insert their own attendance"
  on public.attendance for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own attendance"
  on public.attendance for update
  using (auth.uid() = user_id);

-- Function to calculate work hours
create or replace function public.calculate_work_hours()
returns trigger
language plpgsql
as $$
begin
  if new.clock_out is not null then
    new.work_hours := extract(epoch from (new.clock_out - new.clock_in)) / 3600;
    new.status := 'completed';
  end if;
  return new;
end;
$$;

-- Trigger to auto-calculate work hours
drop trigger if exists calculate_work_hours_trigger on public.attendance;
create trigger calculate_work_hours_trigger
  before insert or update on public.attendance
  for each row
  execute function public.calculate_work_hours();
