# Epic 1: Content Management System (CMS) for FABRIC[ACTIONS] Website

**Epic Goal**: To implement a comprehensive Content Management System (CMS) for the FABRIC[ACTIONS] website, enabling dynamic administration of the "Urban Interventions" gallery, "About the event" posts, and "Hero" section event information, thereby enhancing content flexibility and reducing reliance on code changes for content updates.

**Integration Requirements**:
*   Seamless integration of new admin interfaces with the existing `/admin` routes and authentication.
*   Dynamic fetching and display of content in public-facing components without disrupting existing UI/UX.
*   Consistent use of Supabase for data storage and `react-query` for data management across all new features.
*   Adherence to existing coding standards, component patterns, and design system.

## Story 1.1 Implement Admin for Urban Interventions Gallery
As a content administrator,
I want to create, read, update, and delete "Urban Intervention" entries,
so that I can manage the content of the urban interventions gallery dynamically.

### Acceptance Criteria
1.  Admin page `/admin/urban-interventions` exists and is accessible to authenticated users.
2.  Users can add new urban intervention entries with title, date, image URL, description (optional), and order (optional).
3.  Users can view a list of existing urban intervention entries.
4.  Users can edit existing urban intervention entries.
5.  Users can delete existing urban intervention entries.
6.  Image uploads are handled securely and efficiently (e.g., via Supabase Storage).

### Integration Verification
1.  IV1: The public-facing "Urban Interventions" gallery on the homepage displays data fetched from Supabase.
2.  IV2: Adding, editing, or deleting an urban intervention entry in the admin panel immediately reflects on the public-facing gallery.
3.  IV3: The performance of the public-facing gallery remains consistent with current performance.

## Story 1.2 Implement Admin for "About the Event" Posts
As a content administrator,
I want to create, read, update, and delete "About the Event" posts,
so that I can manage multiple dynamic content blocks for the event description.

### Acceptance Criteria
1.  Admin page `/admin/event-posts` exists and is accessible to authenticated users.
2.  Users can add new event posts with title, subtitle (optional), content, and order (optional).
3.  Users can view a list of existing event posts.
4.  Users can edit existing event posts.
5.  Users can delete existing event posts.

### Integration Verification
1.  IV1: The public-facing "About the Event" section on the homepage displays multiple posts fetched from Supabase, ordered correctly.
2.  IV2: Adding, editing, or deleting an event post in the admin panel immediately reflects on the public-facing section.
3.  IV3: The performance of the public-facing "About the Event" section remains consistent with current performance.

## Story 1.3 Implement Admin for Hero Section Event Information
As a content administrator,
I want to update the event information displayed in the Hero section,
so that I can easily manage details like last exhibition, next exhibition, date, and address.

### Acceptance Criteria
1.  Admin page `/admin/exhibition-info` exists and is accessible to authenticated users.
2.  The page displays a single form to edit the "Exhibition Info" (last exhibition, next exhibition, next exhibition date, next exhibition address).
3.  Changes saved in the admin form are reflected on the public-facing Hero section.

### Integration Verification
1.  IV1: The public-facing Hero section on the homepage displays event information fetched from Supabase.
2.  IV2: Updating the exhibition info in the admin panel immediately reflects on the public-facing Hero section.
3.  IV3: The performance of the public-facing Hero section remains consistent with current performance.