-- Run only against a new disposable database: this script changes and deletes rows.
\set ON_ERROR_STOP on
\ir ../../database/001_schema.sql
\ir ../../database/002_seed.sql

DO $$
BEGIN
  IF (SELECT count(*) FROM events) <> 3 OR
     (SELECT count(*) FROM artworks) <> 5 OR
     (SELECT count(*) FROM urban_interventions) <> 4 OR
     (SELECT count(*) FROM event_posts) <> 1 OR
     (SELECT header_label FROM exhibition_info WHERE id = 1) <> 'BERLIN 2025' OR
     (SELECT link_url FROM events WHERE exhibition_group = 'next') <> '#about-the-event' THEN
    RAISE EXCEPTION 'Initial seed does not match the static content inventory';
  END IF;
END $$;

UPDATE artworks SET title = 'Edited' WHERE position = 1;
DELETE FROM urban_interventions WHERE position = 1;
\ir ../../database/002_seed.sql

DO $$
BEGIN
  IF (SELECT count(*) FROM events) <> 3 OR
     (SELECT count(*) FROM artworks) <> 5 OR
     (SELECT count(*) FROM urban_interventions) <> 3 OR
     (SELECT count(*) FROM event_posts) <> 1 OR
     (SELECT title FROM artworks WHERE position = 1) <> 'Edited' THEN
    RAISE EXCEPTION 'A repeated seed overwrote edits or recreated deleted data';
  END IF;
END $$;
