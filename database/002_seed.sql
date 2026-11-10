BEGIN;

-- A single marker ensures reruns preserve edits and deliberate deletions.
-- Serialize concurrent startups before checking the marker.
SELECT pg_advisory_xact_lock(hashtext('fabric-actions:002_seed'));
INSERT INTO exhibition_info (id, last_exhibition, header_label, next_exhibition, next_exhibition_date, next_exhibition_address)
SELECT 1, 'LATEST EXHIBITION - CULTURAL THREADS', 'BERLIN 2025', 'NEXT EXHIBITION', 'JULY 3 | 13:00 - 19:00', 'RARE Collective Shop - Berlin, Kopernikusstraße 21, 10245 Berlin'
WHERE NOT EXISTS (SELECT 1 FROM schema_migrations WHERE version = '002_seed')
ON CONFLICT (id) DO NOTHING;

INSERT INTO events (title, exhibition_group, position, link_url)
SELECT seed.title, seed.exhibition_group, seed.position, seed.link_url
FROM (VALUES
  ('BERLIN FASHION WEEK - RARE COLLECTIVE', 'next', 1, '#about-the-event'),
  ('CULTURAL THREADS', 'latest', 1, NULL),
  ('URBAN TEXTILE INTERVENTIONS', 'latest', 2, NULL)
) AS seed(title, exhibition_group, position, link_url)
WHERE NOT EXISTS (SELECT 1 FROM schema_migrations WHERE version = '002_seed');

INSERT INTO artworks (title, description, image_url, position)
SELECT seed.title, seed.description, seed.image_url, seed.position
FROM (VALUES
  ('Prêt-Art-porter, Dress on a frame', 'Framed yet wearable dress, 165 x 64 cm', '/img/studio-1.png', 1),
  ('Urban Spill 1', 'Garments sewn on canvas, 118 x 78 cm', '/img/studio-2.png', 2),
  ('Urban Spill 2', 'Garments sewn on canvas, 78 x 50 cm', '/img/studio-3.png', 3),
  ('Fatberg Stalactite', 'Hanging textiles and shoes installation, 140 × 30 cm', '/img/studio-4.png', 4),
  ('10 Years of Therapy I & II', 'Mixed media, 150 × 60 cm each', '/img/studio-5.jpg', 5)
) AS seed(title, description, image_url, position)
WHERE NOT EXISTS (SELECT 1 FROM schema_migrations WHERE version = '002_seed');

INSERT INTO urban_interventions (title, date, image_url, position)
SELECT seed.title, seed.date, seed.image_url, seed.position
FROM (VALUES
  ('Your trash, my treasure', 'MAY 29', '/img/501291506_17844186738497041_8104670190827784702_n.jpg', 1),
  ('Your trash, my treasure', 'MAY 30', '/img/501445643_17844178728497041_2990602597438234993_n.jpg', 2),
  ('Fabric Remnants', 'JUNE 1', '/img/501947555_17844181419497041_7567780357535951913_n.jpg', 3),
  ('Crawling clothes in white, red and blue.', 'JUNE 2', '/img/503053513_17844825306497041_6652826205093340109_n.jpg', 4)
) AS seed(title, date, image_url, position)
WHERE NOT EXISTS (SELECT 1 FROM schema_migrations WHERE version = '002_seed');

INSERT INTO event_posts (title, content, position)
SELECT 'SOFT LANDING - RARE FASHION WEEK EVENT', $content$
<p>Wind down after hours with style, rhythm, and one-of-a-kind creations.<br><br>For Fashion Week, RARE invites you to a styling event like no other—an immersive journey through texture, rhythm, and transformation.</p>
<p>✨ Flying Fashion ✨ An evening of spinning silhouettes, dreamy soundscapes, and upcycled design. Experience unique creations in motion as we explore the intersection of sound, movement, and fashion. Why should fashion remain confined by gravity? Step into a space where garments float, sound sways, and time seems to slow.</p>
<p>🌀 Featuring pieces by:<br>Everyday Pieces, Fade Out Label, Tata Christiane, and Therapy Recycle &amp; Exorcise—designers who reshape the familiar into the fantastical.</p>
<p>🎶 Music by <a href="https://www.instagram.com/maquepereyra/" target="_blank" rel="noopener noreferrer">@maquepereyra</a> – CHOKA co-founder and multidisciplinary artist from Bolivia. Her DJ sets are a ride for pleasure and perreo, for dancing pegadito and transforming rage into sweat, joy, and sexiness. Expect hypnotic blends of cumbia, reggaeton, dembow, and Bolivian roots.</p>
<p>🛍️ Don’t miss:<br>– New collections &amp; designer meet-up<br>– Our Sale Corner featuring samples, archive pieces &amp; special prices<br>– Drinks<br>– Good Vibes</p>
<p>Join us for a Fashion Week evening that glides between energy and ease. Don’t miss this unique Fashion Week evening at RARE. Open to all, just show up! We wait for you.</p>
<p>Experience the creative power of immigrant voices in fashion — from bold aesthetics to business insight.</p>
$content$, 1
WHERE NOT EXISTS (SELECT 1 FROM schema_migrations WHERE version = '002_seed');

INSERT INTO schema_migrations (version) VALUES ('002_seed') ON CONFLICT DO NOTHING;
COMMIT;
