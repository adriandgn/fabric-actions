#!/bin/sh
set -eu

# This creates an isolated disposable cluster; it never uses the configured production database.
task_pg_dir=$(mktemp -d /tmp/fabric-test.XXXXXX)
touch "$task_pg_dir/.fabric-test-owner"
cleanup() {
  if [ -f "$task_pg_dir/.fabric-test-owner" ]; then
    pg_ctl -D "$task_pg_dir/data" -m immediate stop >/dev/null 2>&1 || true
    case "$task_pg_dir" in /tmp/fabric-test.*) rm -rf "$task_pg_dir" ;; esac
  fi
}
trap cleanup EXIT INT TERM

initdb -D "$task_pg_dir/data" -A trust >/dev/null
pg_ctl -D "$task_pg_dir/data" -o "-k $task_pg_dir -h '' -p 55439" -w start >/dev/null
export PGHOST="$task_pg_dir" PGPORT=55439 PGUSER="$(id -un)"

createdb fabric_seed
PGDATABASE=fabric_seed psql -v ON_ERROR_STOP=1 -f tests/integration/seed.sql >/dev/null
createdb fabric_content
PGDATABASE=fabric_content psql -v ON_ERROR_STOP=1 -f database/001_schema.sql -f database/002_seed.sql >/dev/null
PGDATABASE=fabric_content node --import tsx --test server/content.postgres.test.ts
createdb fabric_sessions
PGDATABASE=fabric_sessions psql -v ON_ERROR_STOP=1 -f database/001_schema.sql -f database/003_sessions.sql >/dev/null
PGDATABASE=fabric_sessions node --import tsx --test server/session.postgres.test.ts
createdb fabric_migrations
PGDATABASE=fabric_migrations node --import tsx --test server/migrate.postgres.test.ts
printf '%s\n' 'PostgreSQL integration checks passed.'
