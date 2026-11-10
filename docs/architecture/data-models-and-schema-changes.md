# Data Models and Schema Changes

## New Data Models
*   **Model: `urban_interventions`**
    *   **Purpose:** To store information about urban interventions for the gallery.
    *   **Integration:** New table in Supabase.
    *   **Key Attributes:**
        *   `id`: UUID (Primary Key) - Unique identifier.
        *   `created_at`: timestamp with time zone - Timestamp of creation.
        *   `title`: text - Title of the intervention.
        *   `date`: text - Date of the intervention (e.g., "MAY 29").
        *   `image_url`: text - URL of the intervention image.
        *   `description`: text (optional) - Detailed description.
        *   `order`: integer (optional) - Custom display order.
    *   **Relationships:** None with existing tables.

*   **Model: `event_posts`**
    *   **Purpose:** To store multiple "About the Event" posts.
    *   **Integration:** New table in Supabase.
    *   **Key Attributes:**
        *   `id`: UUID (Primary Key) - Unique identifier.
        *   `created_at`: timestamp with time zone - Timestamp of creation.
        *   `title`: text - Title of the post.
        *   `subtitle`: text (optional) - Subtitle of the post.
        *   `content`: text - Full content of the post.
        *   `order`: integer (optional) - Custom display order.
    *   **Relationships:** None with existing tables.

*   **Model: `exhibition_info`**
    *   **Purpose:** To store the single entry for Hero section event information.
    *   **Integration:** New table in Supabase (single row).
    *   **Key Attributes:**
        *   `id`: UUID (Primary Key, default 1) - Unique identifier (fixed to 1 for single row).
        *   `created_at`: timestamp with time zone - Timestamp of creation.
        *   `last_exhibition`: text - Details of the last exhibition.
        *   `next_exhibition`: text - Details of the next exhibition.
        *   `next_exhibition_date`: text - Date of the next exhibition.
        *   `next_exhibition_address`: text - Address of the next exhibition.
    *   **Relationships:** None with existing tables.

## Schema Integration Strategy
*   **Database Changes Required:**
    *   **New Tables:** `urban_interventions`, `event_posts`, `exhibition_info`.
    *   **Modified Tables:** None.
    *   **New Indexes:** Default indexes created by Supabase for primary keys. Additional indexes may be considered if performance issues arise with specific queries (e.g., on `order` fields).
    *   **Migration Strategy:** Supabase CLI migrations will be used to create these new tables. Each table will have its own migration file.
*   **Backward Compatibility:**
    *   The new tables are additive and do not modify existing tables or their schemas, ensuring full backward compatibility with existing functionalities.
    *   The public-facing components will be updated to fetch data from the new tables, but the old hardcoded content will remain in the codebase until fully replaced and verified.
