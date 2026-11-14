create extension if not exists moddatetime;

alter table public.requests
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists handle_requests_updated_at on public.requests;

create trigger handle_requests_updated_at
  before update on public.requests
  for each row
  execute procedure moddatetime(updated_at);
