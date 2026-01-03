-- Create leave_requests table
create table if not exists public.leave_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  leave_type text not null check (leave_type in ('sick', 'vacation', 'personal', 'other')),
  start_date date not null,
  end_date date not null,
  days_count integer not null,
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  approved_by uuid references auth.users(id),
  approved_at timestamp with time zone,
  rejection_reason text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes
create index if not exists idx_leave_requests_user on public.leave_requests(user_id);
create index if not exists idx_leave_requests_status on public.leave_requests(status);
create index if not exists idx_leave_requests_dates on public.leave_requests(start_date, end_date);

-- Enable RLS
alter table public.leave_requests enable row level security;

-- RLS Policies for leave_requests
create policy "Users can view their own leave requests"
  on public.leave_requests for select
  using (auth.uid() = user_id);

create policy "Admins can view all leave requests"
  on public.leave_requests for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Users can insert their own leave requests"
  on public.leave_requests for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own pending leave requests"
  on public.leave_requests for update
  using (auth.uid() = user_id and status = 'pending');

create policy "Admins can update any leave request"
  on public.leave_requests for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Function to calculate days count
create or replace function public.calculate_leave_days()
returns trigger
language plpgsql
as $$
begin
  new.days_count := (new.end_date - new.start_date) + 1;
  new.updated_at := now();
  return new;
end;
$$;

-- Trigger to auto-calculate days
drop trigger if exists calculate_leave_days_trigger on public.leave_requests;
create trigger calculate_leave_days_trigger
  before insert or update on public.leave_requests
  for each row
  execute function public.calculate_leave_days();
