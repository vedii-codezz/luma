-- Phase 2 only. No samples, analytics, embeddings or privileged signup triggers.
begin;

create schema if not exists app_private;
revoke all on schema app_private from public;
create function app_private.touch_updated_at() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  new.created_at := old.created_at;
  new.updated_at := now();
  return new;
end;
$$;
revoke all on function app_private.touch_updated_at() from public;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 1 and 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 120),
  description text not null default '' check (char_length(description) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id)
);
create unique index subjects_owner_name_unique on public.subjects(user_id, lower(btrim(name)));
create index subjects_owner_created on public.subjects(user_id, created_at);

create table public.concepts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid not null,
  parent_concept_id uuid,
  name text not null check (char_length(btrim(name)) between 1 and 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id, subject_id),
  foreign key (subject_id, user_id) references public.subjects(id, user_id) on delete cascade,
  foreign key (parent_concept_id, user_id, subject_id) references public.concepts(id, user_id, subject_id) on delete cascade,
  check (parent_concept_id is null or parent_concept_id <> id)
);
create index concepts_owner_subject on public.concepts(user_id, subject_id);
create index concepts_parent on public.concepts(parent_concept_id, user_id, subject_id);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid,
  title text not null check (char_length(btrim(title)) between 1 and 255),
  original_filename text not null check (char_length(original_filename) between 1 and 255),
  storage_path text not null unique,
  mime_type text not null check (mime_type = 'application/pdf'),
  file_size bigint not null check (file_size between 5 and 20971520),
  processing_status text not null default 'uploading' check (processing_status in ('uploading', 'pending', 'processing', 'ready', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (subject_id, user_id) references public.subjects(id, user_id) on delete set null (subject_id),
  check (storage_path = user_id::text || '/' || id::text || '/source.pdf')
);
create index documents_owner_created on public.documents(user_id, created_at);
create index documents_subject_owner on public.documents(subject_id, user_id);

create trigger profiles_updated before update on public.profiles for each row execute function app_private.touch_updated_at();
create trigger subjects_updated before update on public.subjects for each row execute function app_private.touch_updated_at();
create trigger concepts_updated before update on public.concepts for each row execute function app_private.touch_updated_at();
create trigger documents_updated before update on public.documents for each row execute function app_private.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.concepts enable row level security;
alter table public.documents enable row level security;

revoke all on public.profiles, public.subjects, public.concepts, public.documents from public, anon;
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.profiles, public.subjects, public.concepts, public.documents to authenticated;

create policy profiles_select on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy profiles_insert on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy profiles_update on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy profiles_delete on public.profiles for delete to authenticated using ((select auth.uid()) = id);

create policy subjects_select on public.subjects for select to authenticated using ((select auth.uid()) = user_id);
create policy subjects_insert on public.subjects for insert to authenticated with check ((select auth.uid()) = user_id);
create policy subjects_update on public.subjects for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy subjects_delete on public.subjects for delete to authenticated using ((select auth.uid()) = user_id);

create policy concepts_select on public.concepts for select to authenticated using ((select auth.uid()) = user_id);
create policy concepts_insert on public.concepts for insert to authenticated with check ((select auth.uid()) = user_id);
create policy concepts_update on public.concepts for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy concepts_delete on public.concepts for delete to authenticated using ((select auth.uid()) = user_id);

create policy documents_select on public.documents for select to authenticated using ((select auth.uid()) = user_id);
create policy documents_insert on public.documents for insert to authenticated with check ((select auth.uid()) = user_id);
create policy documents_update on public.documents for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy documents_delete on public.documents for delete to authenticated using ((select auth.uid()) = user_id);

-- Bucket ceiling is 20 MiB. The server MAX_UPLOAD_BYTES can impose a smaller limit.
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('study-materials', 'study-materials', false, 20971520, array['application/pdf']);

create policy study_materials_insert on storage.objects for insert to authenticated with check (
  bucket_id = 'study-materials'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and owner_id = (select auth.uid())::text
  and exists (select 1 from public.documents d where d.user_id = (select auth.uid()) and d.storage_path = name and d.processing_status = 'uploading')
);
create policy study_materials_select on storage.objects for select to authenticated using (
  bucket_id = 'study-materials' and (storage.foldername(name))[1] = (select auth.uid())::text and owner_id = (select auth.uid())::text
);
create policy study_materials_delete on storage.objects for delete to authenticated using (
  bucket_id = 'study-materials' and (storage.foldername(name))[1] = (select auth.uid())::text and owner_id = (select auth.uid())::text
);
-- No UPDATE policy: object replacement, move and upsert are intentionally unavailable.
commit;
