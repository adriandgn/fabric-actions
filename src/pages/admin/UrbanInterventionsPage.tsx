import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import UrbanInterventionForm from "./UrbanInterventionForm"; // Changed import
import { useToast } from "@/components/ui/use-toast";

// Define the type for an urban intervention
export type UrbanIntervention = {
  id: string; // Changed to string for UUID
  created_at: string;
  title: string;
  date: string;
  image_url: string | null;
  description: string | null;
  position: number;
};

const fetchUrbanInterventions = () => api.list<UrbanIntervention>('urban_interventions');

const deleteUrbanIntervention = (id: string) => api.remove('urban_interventions', id);

const UrbanInterventionsPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: urbanInterventions, isLoading, error } = useQuery<UrbanIntervention[]>({
    queryKey: ['urban_interventions'],
    queryFn: fetchUrbanInterventions
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUrbanIntervention, setEditingUrbanIntervention] = useState<UrbanIntervention | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteUrbanIntervention,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urban_interventions'] });
      toast({ title: "Urban Intervention deleted successfully." });
    },
    onError: (err) => {
      toast({ title: "Error deleting urban intervention", description: err.message, variant: "destructive" });
    }
  });

  const handleNewUrbanInterventionClick = () => {
    setEditingUrbanIntervention(null);
    setIsFormOpen(true);
  };

  const handleEditUrbanInterventionClick = (urbanIntervention: UrbanIntervention) => {
    setEditingUrbanIntervention(urbanIntervention);
    setIsFormOpen(true);
  };

  const handleDeleteUrbanIntervention = (id: string) => { // Changed id type
    if (window.confirm("Are you sure you want to delete this urban intervention?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Urban Interventions</CardTitle>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewUrbanInterventionClick}>Add New Urban Intervention</Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined} className="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingUrbanIntervention ? 'Edit Urban Intervention' : 'Add New Urban Intervention'}</DialogTitle>
              </DialogHeader>
              <UrbanInterventionForm urbanIntervention={editingUrbanIntervention} onSuccess={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Loading urban interventions...</p>}
          {error && <p className="text-red-500">Error loading urban interventions: {error.message}</p>}
          {urbanInterventions && urbanInterventions.length === 0 && !isLoading && <p>No urban interventions found. Add a new one!</p>}
          {urbanInterventions && urbanInterventions.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {urbanInterventions.map((urbanIntervention) => (
                  <TableRow key={urbanIntervention.id}>
                    <TableCell className="font-medium">{urbanIntervention.title}</TableCell>
                    <TableCell>{urbanIntervention.date}</TableCell>
                    <TableCell>
                      {urbanIntervention.image_url && (
                        <img src={urbanIntervention.image_url} alt={urbanIntervention.title} className="w-16 h-16 object-cover rounded" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditUrbanInterventionClick(urbanIntervention)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteUrbanIntervention(urbanIntervention.id)}>Delete</Button>
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

export default UrbanInterventionsPage;
