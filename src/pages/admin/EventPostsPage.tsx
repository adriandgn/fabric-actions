import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import EventPostForm from './EventPostForm'; // Will create this next

// Define schema for event posts
interface EventPost {
  id: string;
  created_at: string;
  title: string;
  subtitle?: string;
  content: string;
  order?: number;
}

const EventPostsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [currentPost, setCurrentPost] = React.useState<EventPost | null>(null);

  // Fetch event posts
  const { data: posts, isLoading, error } = useQuery<EventPost[]> ({
    queryKey: ['event_posts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('event_posts').select('*').order('order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Mutation for deleting an event post
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('event_posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event_posts'] });
      toast({
        title: 'Success!',
        description: 'Event post deleted successfully.',
      });
    },
    onError: (err) => {
      toast({
        title: 'Error',
        description: `Failed to delete event post: ${err.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event post?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (post: EventPost) => {
    setCurrentPost(post);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setCurrentPost(null);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return <div className="p-4 md:p-8">Loading event posts...</div>;
  }

  if (error) {
    return <div className="p-4 md:p-8">Error loading event posts: {error.message}</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Manage Event Posts</CardTitle>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd}>Add New Event Post</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl md:max-w-4xl lg:max-w-5xl">
              <DialogHeader>
                <DialogTitle>{currentPost ? 'Edit Event Post' : 'Add New Event Post'}</DialogTitle>
              </DialogHeader>
              <EventPostForm
                eventPost={currentPost}
                onSuccess={() => {
                  setIsFormOpen(false);
                  setCurrentPost(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {posts && posts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subtitle</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.subtitle}</TableCell>
                    <TableCell>{post.order}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(post)} className="mr-2">
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No event posts found. Add a new one!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventPostsPage;
