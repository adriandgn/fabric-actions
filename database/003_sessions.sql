BEGIN;

CREATE TABLE IF NOT EXISTS user_sessions (
  sid varchar PRIMARY KEY,
  sess json NOT NULL,
  expire timestamp(6) NOT NULL
);
CREATE INDEX IF NOT EXISTS user_sessions_expire_idx ON user_sessions (expire);
INSERT INTO schema_migrations (version) VALUES ('003_sessions') ON CONFLICT DO NOTHING;

COMMIT;
