#!/bin/sh
set -eu

# The browser test uses a disposable database and blocks all external requests.
task_e2e_dir=$(mktemp -d /tmp/fabric-e2e.XXXXXX)
touch "$task_e2e_dir/.fabric-test-owner"
task_app_pid=''
cleanup() {
  if [ -f "$task_e2e_dir/.fabric-test-owner" ]; then
    if [ -n "$task_app_pid" ]; then kill "$task_app_pid" 2>/dev/null || true; wait "$task_app_pid" 2>/dev/null || true; fi
    pg_ctl -D "$task_e2e_dir/data" -m immediate stop >/dev/null 2>&1 || true
    case "$task_e2e_dir" in /tmp/fabric-e2e.*) rm -rf "$task_e2e_dir" ;; esac
  fi
}
trap cleanup EXIT INT TERM

./node_modules/.bin/vite build --outDir "$task_e2e_dir/dist" >/dev/null
initdb -D "$task_e2e_dir/data" -A trust >/dev/null
pg_ctl -D "$task_e2e_dir/data" -o "-k $task_e2e_dir -h '' -p 55439" -w start >/dev/null
task_port=$(node -e "const s=require('node:net').createServer();s.listen(0,'127.0.0.1',()=>{console.log(s.address().port);s.close()})")
export PGHOST="$task_e2e_dir" PGPORT=55439 PGUSER="$(id -un)" PGPASSWORD=unused PGDATABASE=postgres
export ADMIN_PASSWORD='temporary-admin-password' SESSION_SECRET='temporary-session-secret-at-least-32-characters'
export PORT="$task_port" ALLOWED_ORIGINS="http://127.0.0.1:$task_port" UPLOAD_DIR="$task_e2e_dir/uploads" NODE_ENV=test STATIC_DIR="$task_e2e_dir/dist"
export E2E_BASE_URL="http://127.0.0.1:$task_port" E2E_ADMIN_PASSWORD="$ADMIN_PASSWORD"
node --import tsx server/index.ts > "$task_e2e_dir/server.log" 2>&1 &
task_app_pid=$!
ready=false
for attempt in $(seq 1 30); do
  if curl -fsS "$E2E_BASE_URL/api/health" >/dev/null 2>&1; then ready=true; break; fi
  sleep 1
done
if [ "$ready" != true ]; then cat "$task_e2e_dir/server.log"; exit 1; fi
./node_modules/.bin/playwright test --project=chromium

# Recreate the application process while retaining the same database and upload directory.
kill "$task_app_pid"
wait "$task_app_pid" 2>/dev/null || true
task_app_pid=''
node --import tsx server/index.ts > "$task_e2e_dir/server.log" 2>&1 &
task_app_pid=$!
ready=false
for attempt in $(seq 1 30); do
  if curl -fsS "$E2E_BASE_URL/api/health" >/dev/null 2>&1; then ready=true; break; fi
  sleep 1
done
if [ "$ready" != true ]; then cat "$task_e2e_dir/server.log"; exit 1; fi
node --input-type=module -e '
  const base = process.env.E2E_BASE_URL;
  const rows = await fetch(`${base}/api/content/artworks`).then((response) => response.json());
  const artwork = rows.find((row) => row.title === "Updated artwork");
  if (!artwork || !/^\/uploads\/[a-f0-9-]+\.png$/.test(artwork.image_url)) throw new Error("Updated artwork was not preserved");
  const image = await fetch(`${base}${artwork.image_url}`);
  if (!image.ok || (await image.arrayBuffer()).byteLength === 0) throw new Error("Uploaded image was not preserved");
  console.log("Restart persistence check passed.");
'
