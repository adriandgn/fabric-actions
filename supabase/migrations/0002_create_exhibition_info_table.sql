-- 0002_create_exhibition_info_table.sql

CREATE TABLE public.exhibition_info (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    last_exhibition text,
    next_exhibition text,
    next_exhibition_date text,
    next_exhibition_address text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.exhibition_info ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read
CREATE POLICY "Authenticated users can read exhibition_info"
ON public.exhibition_info FOR SELECT
TO authenticated
USING (true);

-- Policy for authenticated users to update (assuming admin role will be handled by RLS or application logic)
CREATE POLICY "Authenticated users can update own exhibition_info"
ON public.exhibition_info FOR UPDATE
TO authenticated
USING (true); -- Assuming a single row, so no specific ownership check needed for now.
