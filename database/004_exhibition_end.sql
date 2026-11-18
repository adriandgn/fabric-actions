BEGIN;
ALTER TABLE events ADD COLUMN IF NOT EXISTS end_date date;
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS month integer CHECK (month BETWEEN 1 AND 12);
ALTER TABLE urban_interventions ADD COLUMN IF NOT EXISTS month integer CHECK (month BETWEEN 1 AND 12);
ALTER TABLE urban_interventions ADD COLUMN IF NOT EXISTS year integer CHECK (year BETWEEN 1 AND 9999);
INSERT INTO schema_migrations (version) VALUES ('004_exhibition_end') ON CONFLICT DO NOTHING;
COMMIT;
