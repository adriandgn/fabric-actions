import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import DOMPurify from 'dompurify';

interface EventPost {
  id: string;
  created_at: string;
  title: string;
  subtitle?: string;
  content: string;
  position?: number;
}

const EventPostsSection: React.FC = () => {
  const { data: posts, isLoading, error } = useQuery<EventPost[]> ({
    queryKey: ['public_event_posts'],
    queryFn: () => api.list<EventPost>('event_posts'),
  });

  if (isLoading) {
    return (
      <section className="px-6 md:px-12 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold font-grotesk mb-12">ABOUT THE EVENT</h2>
        <p>Loading event posts...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-6 md:px-12 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold font-grotesk mb-12">ABOUT THE EVENT</h2>
        <p className="text-red-500">Error loading event posts: {error.message}</p>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <section className="px-6 md:px-12 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold font-grotesk mb-12">ABOUT THE EVENT</h2>
        <p>No event posts found.</p>
      </section>
    );
  }

  return (
    <section id="about-the-event" className="px-6 md:px-12 py-16 md:py-24">
      <h2 className="text-3xl md:text-4xl font-bold font-grotesk mb-12">ABOUT THE EVENT</h2>
      <div className="space-y-8">
        {posts.map((post) => (
          <div key={post.id} className="border-b border-gray-700 pb-8">
            <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
            {post.subtitle && <p className="text-lg text-gray-400 mb-2">{post.subtitle}</p>}
            <div
              className="text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content, { USE_PROFILES: { html: true } }) }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default EventPostsSection;
