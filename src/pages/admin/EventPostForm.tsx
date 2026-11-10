import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Controller } from 'react-hook-form'; // Import Controller

interface EventPostFormProps {
  eventPost?: EventPost;
  onSuccess: () => void;
}

interface EventPost {
  id?: string;
  title: string;
  subtitle?: string;
  content: string;
  order?: number;
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value || '', false);
    }
  }, [editor, value]);

  return (
    <div className="border rounded-md min-h-[200px]">
      <EditorContent editor={editor} />
    </div>
  );
};

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  order: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().int().positive('Order must be a positive integer').optional()
  ),
});

const EventPostForm: React.FC<EventPostFormProps> = ({ eventPost, onSuccess }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<EventPost>({
    resolver: zodResolver(formSchema),
    defaultValues: eventPost || { title: '', subtitle: '', content: '', order: undefined },
  });

  React.useEffect(() => {
    reset(eventPost || { title: '', subtitle: '', content: '', order: undefined });
  }, [eventPost, reset]);

  const upsertMutation = useMutation({
    mutationFn: async (data: EventPost) => {
      const { error } = await supabase.from('event_posts').upsert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event_posts'] });
      toast({
        title: 'Success!',
        description: `Event post ${eventPost ? 'updated' : 'added'} successfully.`,
      });
      onSuccess();
    },
    onError: (err) => {
      toast({
        title: 'Error',
        description: `Failed to ${eventPost ? 'update' : 'add'} event post: ${err.message}`,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: EventPost) => {
    // If eventPost exists, it means we are editing, so include the id
    const dataToUpsert = eventPost ? { ...data, id: eventPost.id } : data;
    upsertMutation.mutate(dataToUpsert);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register('title')} />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>
      <div>
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input id="subtitle" {...register('subtitle')} />
        {errors.subtitle && <p className="text-red-500 text-sm">{errors.subtitle.message}</p>}
      </div>
      <div>
        <Label htmlFor="content">Content</Label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <RichTextEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
      </div>
      <div>
        <Label htmlFor="order">Order</Label>
        <Input id="order" type="number" {...register('order')} />
        {errors.order && <p className="text-red-500 text-sm">{errors.order.message}</p>}
      </div>
      <DialogFooter>
        <Button type="submit" disabled={upsertMutation.isPending}>
          {upsertMutation.isPending ? 'Saving...' : 'Save Event Post'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default EventPostForm;
