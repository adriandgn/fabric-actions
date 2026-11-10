-- 0003_create_event_posts_table.sql

CREATE TABLE public.event_posts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    title text NOT NULL,
    subtitle text,
    content text NOT NULL,
    "order" integer
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.event_posts ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read
CREATE POLICY "Authenticated users can read event_posts"
ON public.event_posts FOR SELECT
TO authenticated
USING (true);

-- Policy for authenticated users to create
CREATE POLICY "Authenticated users can create event_posts"
ON public.event_posts FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy for authenticated users to update
CREATE POLICY "Authenticated users can update event_posts"
ON public.event_posts FOR UPDATE
TO authenticated
USING (true);

-- Policy for authenticated users to delete
CREATE POLICY "Authenticated users can delete event_posts"
ON public.event_posts FOR DELETE
TO authenticated
USING (true);
