#!/bin/sh
set -eu

# All resources belong to a unique disposable Compose project with test-only secrets.
task_compose_dir=$(mktemp -d /tmp/fabric-compose.XXXXXX)
touch "$task_compose_dir/.fabric-test-owner"
task_project="fabric-check-$(date +%s)-$$"
cleanup() {
  if [ -f "$task_compose_dir/.fabric-test-owner" ]; then
    case "$task_project" in fabric-check-*) docker compose -p "$task_project" --env-file "$task_compose_dir/env" -f compose.yaml -f "$task_compose_dir/override.yaml" down --volumes --remove-orphans --rmi local >/dev/null 2>&1 || true ;; esac
    case "$task_compose_dir" in /tmp/fabric-compose.*) rm -rf "$task_compose_dir" ;; esac
  fi
}
trap cleanup EXIT INT TERM

task_port=$(node -e "const s=require('node:net').createServer();s.listen(0,'127.0.0.1',()=>{console.log(s.address().port);s.close()})")
export POSTGRES_PASSWORD='temporary-database-password' ADMIN_PASSWORD='temporary-admin-password'
export SESSION_SECRET='temporary-session-secret-at-least-32-characters'
export ALLOWED_ORIGINS="http://127.0.0.1:$task_port" BREVO_API_KEY='' BREVO_LIST_ID=''
export E2E_BASE_URL="http://127.0.0.1:$task_port" E2E_ADMIN_PASSWORD="$ADMIN_PASSWORD"
printf '%s\n' '# All test variables are exported by the test script.' > "$task_compose_dir/env"
cat > "$task_compose_dir/override.yaml" <<EOF
services:
  app:
    environment:
      NODE_ENV: test
    ports:
      - "127.0.0.1:$task_port:3000"
EOF

docker compose -p "$task_project" --env-file "$task_compose_dir/env" -f compose.yaml -f "$task_compose_dir/override.yaml" config --quiet
if ! docker compose -p "$task_project" --env-file "$task_compose_dir/env" -f compose.yaml -f "$task_compose_dir/override.yaml" up --build -d --wait --wait-timeout 180; then
  docker compose -p "$task_project" --env-file "$task_compose_dir/env" -f compose.yaml -f "$task_compose_dir/override.yaml" logs --tail 60
  exit 1
fi
./node_modules/.bin/playwright test --project=chromium
docker compose -p "$task_project" --env-file "$task_compose_dir/env" -f compose.yaml -f "$task_compose_dir/override.yaml" up -d --no-build --force-recreate --wait --wait-timeout 120
ready=false
for attempt in $(seq 1 60); do
  if curl -fsS "$E2E_BASE_URL/api/health" >/dev/null 2>&1; then ready=true; break; fi
  sleep 1
done
if [ "$ready" != true ]; then
  docker compose -p "$task_project" --env-file "$task_compose_dir/env" -f compose.yaml -f "$task_compose_dir/override.yaml" logs --tail 60
  exit 1
fi
node --input-type=module -e '
  const base = process.env.E2E_BASE_URL;
  const rows = await fetch(`${base}/api/content/artworks`).then((response) => response.json());
  const artwork = rows.find((row) => row.title === "Updated artwork");
  if (!artwork || !/^\/uploads\/[a-f0-9-]+\.png$/.test(artwork.image_url)) throw new Error("Updated artwork was not preserved");
  const image = await fetch(`${base}${artwork.image_url}`);
  if (!image.ok || (await image.arrayBuffer()).byteLength === 0) throw new Error("Uploaded image was not preserved");
  console.log("Compose database and image volume persistence passed.");
'
