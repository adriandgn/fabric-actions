import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Artwork } from "./ArtworksPage";
import { useForm } from "react-hook-form";

interface ArtworkFormProps {
  artwork?: Artwork | null;
  onSuccess: () => void;
}

type FormData = Omit<Artwork, 'created_at' | 'id'> & { id?: string; image?: FileList };

const upsertArtwork = async (artworkData: FormData) => {
  let imageUrl: string | null = artworkData.image_url || null;

  if (artworkData.image && artworkData.image.length > 0) {
    imageUrl = (await api.upload(artworkData.image[0])).url;
  }

  const { image, id, ...rest } = artworkData;
  return api.save('artworks', { ...rest, year: Number.isFinite(rest.year) ? rest.year : null, image_url: imageUrl }, id);
};

const ArtworkForm = ({ artwork, onSuccess }: ArtworkFormProps) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: artwork
      ? { id: artwork.id, title: artwork.title, year: artwork.year, description: artwork.description, image_url: artwork.image_url, position: artwork.position }
      : { title: '', year: undefined, description: '', image_url: '', position: 0 },
  });

  const mutation = useMutation({
    mutationFn: upsertArtwork,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
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
        <Label htmlFor="year">Year</Label>
        <Input id="year" type="number" {...register("year", { valueAsNumber: true })} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="image">Image</Label>
        <Input id="image" type="file" accept="image/*" {...register("image")} />
        {artwork?.image_url && (
          <img src={artwork.image_url} alt="Current Artwork Image" className="w-24 h-24 object-cover rounded mt-2" />
        )}
      </div>
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving...' : 'Save Artwork'}
      </Button>
      {mutation.isError && <p className="text-red-500 text-sm">{mutation.error.message}</p>}
    </form>
  );
};

export default ArtworkForm;
