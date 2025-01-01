-- Drop the end_time column and add duration column
alter table public.events 
    drop column end_time,
    add column duration interval not null default '1 hour';
