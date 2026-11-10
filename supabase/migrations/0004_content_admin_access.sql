-- Complete the schema and access policies required by the CMS screens.

CREATE TABLE IF NOT EXISTS public.urban_interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  "order" INTEGER
);

ALTER TABLE public.urban_interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exhibition_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_posts ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.cms_admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.cms_admins ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.cms_admins FROM anon, authenticated;
GRANT SELECT ON public.cms_admins TO authenticated;

DROP POLICY IF EXISTS "Site admins can read their own admin record" ON public.cms_admins;
CREATE POLICY "Site admins can read their own admin record"
  ON public.cms_admins FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- The public site reads these tables; signed-in users manage their content.
GRANT SELECT ON public.events, public.artworks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events, public.artworks TO authenticated;
GRANT SELECT ON public.exhibition_info, public.event_posts, public.urban_interventions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exhibition_info, public.event_posts, public.urban_interventions TO authenticated;

DROP POLICY IF EXISTS "Public can read exhibition info" ON public.exhibition_info;
CREATE POLICY "Public can read exhibition info"
  ON public.exhibition_info FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can update exhibition info" ON public.exhibition_info;
DROP POLICY IF EXISTS "Authenticated users can read exhibition_info" ON public.exhibition_info;
DROP POLICY IF EXISTS "Authenticated users can update own exhibition_info" ON public.exhibition_info;
CREATE POLICY "Site admins can insert exhibition info"
  ON public.exhibition_info FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.cms_admins WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Site admins can update exhibition info"
  ON public.exhibition_info FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.cms_admins WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.cms_admins WHERE user_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Public can read event posts" ON public.event_posts;
DROP POLICY IF EXISTS "Authenticated users can read event_posts" ON public.event_posts;
CREATE POLICY "Public can read event posts"
  ON public.event_posts FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can create event_posts" ON public.event_posts;
DROP POLICY IF EXISTS "Authenticated users can update event_posts" ON public.event_posts;
DROP POLICY IF EXISTS "Authenticated users can delete event_posts" ON public.event_posts;
CREATE POLICY "Site admins can create event posts"
  ON public.event_posts FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.cms_admins WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Site admins can update event posts"
  ON public.event_posts FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.cms_admins WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.cms_admins WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Site admins can delete event posts"
  ON public.event_posts FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.cms_admins WHERE user_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Public can read urban interventions" ON public.urban_interventions;
CREATE POLICY "Public can read urban interventions"
  ON public.urban_interventions FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can delete urban interventions" ON public.urban_interventions;
DROP POLICY IF EXISTS "Authenticated users can insert urban interventions" ON public.urban_interventions;
DROP POLICY IF EXISTS "Authenticated users can update urban interventions" ON public.urban_interventions;
CREATE POLICY "Site admins can delete urban interventions"
  ON public.urban_interventions FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.cms_admins WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Site admins can insert urban interventions"
  ON public.urban_interventions FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.cms_admins WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Site admins can update urban interventions"
  ON public.urban_interventions FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.cms_admins WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.cms_admins WHERE user_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Allow full access for authenticated users on events" ON public.events;
DROP POLICY IF EXISTS "Allow full access for authenticated users on artworks" ON public.artworks;
CREATE POLICY "Site admins can manage events"
  ON public.events FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.cms_admins WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.cms_admins WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Site admins can manage artworks"
  ON public.artworks FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.cms_admins WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.cms_admins WHERE user_id = (SELECT auth.uid())));

GRANT USAGE, SELECT ON SEQUENCE public.events_id_seq, public.artworks_id_seq TO authenticated;

INSERT INTO storage.buckets (id, name, public)
VALUES ('urban_intervention_images', 'urban_intervention_images', true)
ON CONFLICT (id) DO NOTHING;

UPDATE storage.buckets
SET public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
WHERE id IN ('artwork_images', 'urban_intervention_images');

DROP POLICY IF EXISTS "Public can read urban intervention images" ON storage.objects;
CREATE POLICY "Public can read urban intervention images"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'urban_intervention_images');

DROP POLICY IF EXISTS "Authenticated users can upload urban intervention images" ON storage.objects;
CREATE POLICY "Site admins can upload urban intervention images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'urban_intervention_images'
    AND EXISTS (SELECT 1 FROM public.cms_admins WHERE user_id = (SELECT auth.uid()))
  );

DROP POLICY IF EXISTS "Authenticated users can update urban intervention images" ON storage.objects;
CREATE POLICY "Site admins can update urban intervention images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'urban_intervention_images'
    AND EXISTS (SELECT 1 FROM public.cms_admins WHERE user_id = (SELECT auth.uid()))
  )
  WITH CHECK (
    bucket_id = 'urban_intervention_images'
    AND EXISTS (SELECT 1 FROM public.cms_admins WHERE user_id = (SELECT auth.uid()))
  );

DROP POLICY IF EXISTS "Authenticated users can delete urban intervention images" ON storage.objects;
CREATE POLICY "Site admins can delete urban intervention images"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'urban_intervention_images'
    AND EXISTS (SELECT 1 FROM public.cms_admins WHERE user_id = (SELECT auth.uid()))
  );

DROP POLICY IF EXISTS "Allow authenticated uploads on artwork images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates on artwork images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes on artwork images" ON storage.objects;
CREATE POLICY "Site admins can upload artwork images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'artwork_images'
    AND EXISTS (SELECT 1 FROM public.cms_admins WHERE user_id = (SELECT auth.uid()))
  );
CREATE POLICY "Site admins can update artwork images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'artwork_images'
    AND EXISTS (SELECT 1 FROM public.cms_admins WHERE user_id = (SELECT auth.uid()))
  )
  WITH CHECK (
    bucket_id = 'artwork_images'
    AND EXISTS (SELECT 1 FROM public.cms_admins WHERE user_id = (SELECT auth.uid()))
  );
CREATE POLICY "Site admins can delete artwork images"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'artwork_images'
    AND EXISTS (SELECT 1 FROM public.cms_admins WHERE user_id = (SELECT auth.uid()))
  );
