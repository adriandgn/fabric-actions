import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EventForm from "./EventForm";
import { useToast } from "@/components/ui/use-toast";

// Define the type for an event
export type Event = {
  id: number;
  created_at: string;
  title: string;
  event_date: string;
  location: string | null;
  description: string | null;
};

const fetchEvents = async () => {
  const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const deleteEvent = async (id: number) => {
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw error;
};

const EventsPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: fetchEvents
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({ title: "Event deleted successfully." });
    },
    onError: (err) => {
      toast({ title: "Error deleting event", description: err.message, variant: "destructive" });
    }
  });

  const handleNewEventClick = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleEditEventClick = (event: Event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleDeleteEvent = (id: number) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Events</CardTitle>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewEventClick}>Add New Event</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
              </DialogHeader>
              <EventForm event={editingEvent} onSuccess={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Loading events...</p>}
          {error && <p className="text-red-500">Error loading events: {error.message}</p>}
          {events && events.length === 0 && !isLoading && <p>No events found. Add a new one!</p>}
          {events && events.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{event.event_date}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>{event.description}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditEventClick(event)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteEvent(event.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsPage;
