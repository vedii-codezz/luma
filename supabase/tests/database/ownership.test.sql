-- Run against a disposable, migrated local Supabase stack; all fixtures roll back.
begin;
create extension if not exists pgtap with schema extensions;
select no_plan();

insert into auth.users(id, email) values
 ('10000000-0000-4000-8000-000000000001', 'luma-a@example.invalid'),
 ('10000000-0000-4000-8000-000000000002', 'luma-b@example.invalid');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
insert into public.profiles(id, display_name) values ('10000000-0000-4000-8000-000000000002', 'B');
insert into public.subjects(id,user_id,name) values ('20000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002','B subject');
insert into public.concepts(id,user_id,subject_id,name) values ('30000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000002','B concept');
insert into public.documents(id,user_id,subject_id,title,original_filename,storage_path,mime_type,file_size) values
 ('40000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000002','B PDF','b.pdf','10000000-0000-4000-8000-000000000002/40000000-0000-4000-8000-000000000002/source.pdf','application/pdf',12);

select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
insert into public.profiles(id, display_name) values ('10000000-0000-4000-8000-000000000001', 'A');
insert into public.subjects(id,user_id,name) values ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','A subject');
insert into public.concepts(id,user_id,subject_id,name) values ('30000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','A concept');
insert into public.documents(id,user_id,subject_id,title,original_filename,storage_path,mime_type,file_size) values
 ('40000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','A PDF','a.pdf','10000000-0000-4000-8000-000000000001/40000000-0000-4000-8000-000000000001/source.pdf','application/pdf',12);

select is((select count(*) from public.profiles), 1::bigint, 'A cannot select B profile');
select is((select count(*) from public.subjects), 1::bigint, 'A cannot select B subject');
select is((select count(*) from public.concepts), 1::bigint, 'A cannot select B concept');
select is((select count(*) from public.documents), 1::bigint, 'A cannot select B document');

with changed as (update public.profiles set display_name='stolen' where id='10000000-0000-4000-8000-000000000002' returning id) select is((select count(*) from changed), 0::bigint, 'A cannot update B profile');
with changed as (update public.subjects set name='stolen' where user_id='10000000-0000-4000-8000-000000000002' returning id) select is((select count(*) from changed), 0::bigint, 'A cannot update B subject');
with changed as (update public.concepts set name='stolen' where user_id='10000000-0000-4000-8000-000000000002' returning id) select is((select count(*) from changed), 0::bigint, 'A cannot update B concept');
with changed as (update public.documents set title='stolen' where user_id='10000000-0000-4000-8000-000000000002' returning id) select is((select count(*) from changed), 0::bigint, 'A cannot update B document');

with changed as (delete from public.profiles where id='10000000-0000-4000-8000-000000000002' returning id) select is((select count(*) from changed), 0::bigint, 'A cannot delete B profile');
with changed as (delete from public.subjects where user_id='10000000-0000-4000-8000-000000000002' returning id) select is((select count(*) from changed), 0::bigint, 'A cannot delete B subject');
with changed as (delete from public.concepts where user_id='10000000-0000-4000-8000-000000000002' returning id) select is((select count(*) from changed), 0::bigint, 'A cannot delete B concept');
with changed as (delete from public.documents where user_id='10000000-0000-4000-8000-000000000002' returning id) select is((select count(*) from changed), 0::bigint, 'A cannot delete B document');

select throws_ok($$insert into public.profiles(id,display_name) values ('10000000-0000-4000-8000-000000000002','forged')$$,'42501',null,'Cannot insert another owner profile');
select throws_ok($$insert into public.subjects(user_id,name) values ('10000000-0000-4000-8000-000000000002','forged')$$,'42501',null,'Cannot insert another owner subject');
select throws_ok($$insert into public.concepts(user_id,subject_id,name) values ('10000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000002','forged')$$,'42501',null,'Cannot insert another owner concept');
select throws_ok($$insert into public.documents(id,user_id,title,original_filename,storage_path,mime_type,file_size) values ('40000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000002','forged','x.pdf','10000000-0000-4000-8000-000000000002/40000000-0000-4000-8000-000000000003/source.pdf','application/pdf',12)$$,'42501',null,'Cannot insert another owner document');

select throws_ok($$update public.profiles set id='10000000-0000-4000-8000-000000000002' where id='10000000-0000-4000-8000-000000000001'$$,'42501',null,'Cannot transfer profile ownership');
select throws_ok($$update public.subjects set user_id='10000000-0000-4000-8000-000000000002' where id='20000000-0000-4000-8000-000000000001'$$,'42501',null,'Cannot transfer subject ownership');
select throws_ok($$update public.concepts set user_id='10000000-0000-4000-8000-000000000002' where id='30000000-0000-4000-8000-000000000001'$$,'42501',null,'Cannot transfer concept ownership');
select throws_ok($$update public.documents set user_id='10000000-0000-4000-8000-000000000002',storage_path='10000000-0000-4000-8000-000000000002/40000000-0000-4000-8000-000000000001/source.pdf' where id='40000000-0000-4000-8000-000000000001'$$,'42501',null,'Cannot transfer document ownership');

select throws_ok($$insert into public.concepts(user_id,subject_id,name) values ('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002','wrong subject')$$,'23503',null,'Concept cannot reference B subject');
select throws_ok($$update public.concepts set parent_concept_id='30000000-0000-4000-8000-000000000002' where id='30000000-0000-4000-8000-000000000001'$$,'23503',null,'Concept cannot reference B parent');
select throws_ok($$update public.documents set subject_id='20000000-0000-4000-8000-000000000002' where id='40000000-0000-4000-8000-000000000001'$$,'23503',null,'Document cannot reference B subject');
select lives_ok($$update public.subjects set description='updated by owner' where id='20000000-0000-4000-8000-000000000001'$$,'Owner can update subject');
select lives_ok($$delete from public.subjects where id='20000000-0000-4000-8000-000000000001'$$,'Owner can delete subject');
select is((select count(*) from public.concepts),0::bigint,'Subject deletion cascades concepts');
select is((select subject_id from public.documents where id='40000000-0000-4000-8000-000000000001'),null::uuid,'Subject deletion preserves unassigned documents');

set local role anon;
select set_config('request.jwt.claims','{"role":"anon"}',true);
select throws_ok('select * from public.profiles','42501',null,'Anonymous cannot read profiles');
select throws_ok('select * from public.subjects','42501',null,'Anonymous cannot read subjects');
select throws_ok('select * from public.concepts','42501',null,'Anonymous cannot read concepts');
select throws_ok('select * from public.documents','42501',null,'Anonymous cannot read documents');
reset role;
select is((select public from storage.buckets where id='study-materials'),false,'Study bucket is private');
select is((select count(*) from pg_policies where schemaname='storage' and tablename='objects' and policyname like 'study_materials_%' and cmd='UPDATE'),0::bigint,'No overwrite policy');
select * from finish();
rollback;
