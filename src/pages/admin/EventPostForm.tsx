import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
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
  subtitle?: string | null;
  content: string;
  position?: number;
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
      editor.commands.setContent(value || '', { emitUpdate: false });
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
  position: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().int().min(0).optional()
  ),
});

const EventPostForm: React.FC<EventPostFormProps> = ({ eventPost, onSuccess }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<z.input<typeof formSchema>, unknown, z.output<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: eventPost ? { ...eventPost, subtitle: eventPost.subtitle ?? '' } : { title: '', subtitle: '', content: '', position: 0 },
  });

  React.useEffect(() => {
    reset(eventPost ? { ...eventPost, subtitle: eventPost.subtitle ?? '' } : { title: '', subtitle: '', content: '', position: 0 });
  }, [eventPost, reset]);

  const upsertMutation = useMutation({
    mutationFn: async (content: z.output<typeof formSchema>) => {
      await api.save('event_posts', { ...content, position: content.position ?? 0 }, eventPost?.id);
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

  const onSubmit = (data: z.output<typeof formSchema>) => {
    upsertMutation.mutate(data);
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
        <Label htmlFor="position">Order</Label>
        <Input id="position" type="number" {...register('position')} />
        {errors.position && <p className="text-red-500 text-sm">{errors.position.message}</p>}
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
