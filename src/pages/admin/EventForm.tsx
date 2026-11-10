import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Event } from "./EventsPage"; // Reuse the type
import { useForm } from "react-hook-form";

interface EventFormProps {
  event?: Event | null;
  onSuccess: () => void;
}

type FormData = Omit<Event, 'created_at' | 'id'> & { id?: string };

const upsertEvent = async (eventData: FormData) => {
  const { id, ...data } = eventData;
  return api.save('events', { ...data, event_date: data.event_date || null, link_url: data.link_url || null }, id);
};

const EventForm = ({ event, onSuccess }: EventFormProps) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: event
      ? { id: event.id, title: event.title, event_date: event.event_date || '', location: event.location,
          description: event.description, link_url: event.link_url || '', exhibition_group: event.exhibition_group, position: event.position }
      : { title: '', event_date: '', location: '', description: '', link_url: '', exhibition_group: 'latest', position: 0 },
  });

  const mutation = useMutation({
    mutationFn: upsertEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      onSuccess();
    }
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title", { required: "Title is required" })} />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="event_date">Date</Label>
        <Input id="event_date" type="date" {...register("event_date")} />
        {errors.event_date && <p className="text-red-500 text-sm">{errors.event_date.message}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="exhibition_group">Exhibition group</Label>
        <select id="exhibition_group" className="rounded border p-2 text-black" {...register('exhibition_group')}>
          <option value="next">Next</option><option value="latest">Latest</option>
        </select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="link_url">Link (optional)</Label>
        <Input id="link_url" {...register('link_url')} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" {...register("location")} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
      </div>
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving...' : 'Save Event'}
      </Button>
      {mutation.isError && <p className="text-red-500 text-sm">{mutation.error.message}</p>}
    </form>
  );
};

export default EventForm;
