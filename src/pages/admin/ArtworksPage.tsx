import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ArtworkForm from "./ArtworkForm";
import { useToast } from "@/components/ui/use-toast";

// Define the type for an artwork
export type Artwork = {
  id: number;
  created_at: string;
  title: string;
  year: number | null;
  description: string | null;
  image_url: string | null;
};

const fetchArtworks = async () => {
  const { data, error } = await supabase.from('artworks').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const deleteArtwork = async (id: number) => {
  const { error } = await supabase.from('artworks').delete().eq('id', id);
  if (error) throw error;
};

const ArtworksPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: artworks, isLoading, error } = useQuery<Artwork[]>({
    queryKey: ['artworks'],
    queryFn: fetchArtworks
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteArtwork,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
      toast({ title: "Artwork deleted successfully." });
    },
    onError: (err) => {
      toast({ title: "Error deleting artwork", description: err.message, variant: "destructive" });
    }
  });

  const handleNewArtworkClick = () => {
    setEditingArtwork(null);
    setIsFormOpen(true);
  };

  const handleEditArtworkClick = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    setIsFormOpen(true);
  };

  const handleDeleteArtwork = (id: number) => {
    if (window.confirm("Are you sure you want to delete this artwork?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Artworks</CardTitle>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewArtworkClick}>Add New Artwork</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingArtwork ? 'Edit Artwork' : 'Add New Artwork'}</DialogTitle>
              </DialogHeader>
              <ArtworkForm artwork={editingArtwork} onSuccess={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Loading artworks...</p>}
          {error && <p className="text-red-500">Error loading artworks: {error.message}</p>}
          {artworks && artworks.length === 0 && !isLoading && <p>No artworks found. Add a new one!</p>}
          {artworks && artworks.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {artworks.map((artwork) => (
                  <TableRow key={artwork.id}>
                    <TableCell className="font-medium">{artwork.title}</TableCell>
                    <TableCell>{artwork.year}</TableCell>
                    <TableCell>
                      {artwork.image_url && (
                        <img src={artwork.image_url} alt={artwork.title} className="w-16 h-16 object-cover rounded" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditArtworkClick(artwork)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteArtwork(artwork.id)}>Delete</Button>
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

export default ArtworksPage;
