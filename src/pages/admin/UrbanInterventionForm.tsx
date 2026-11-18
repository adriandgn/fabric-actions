import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { UrbanIntervention } from "./UrbanInterventionsPage"; // Changed import
import { useForm } from "react-hook-form";
import { z } from "zod"; // Import zod
import { zodResolver } from "@hookform/resolvers/zod"; // Import zodResolver

interface UrbanInterventionFormProps {
  urbanIntervention?: UrbanIntervention | null;
  onSuccess: () => void;
}

// Define Zod schema for validation
const urbanInterventionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string(),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(1).max(9999),
  image_url: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  position: z.preprocess(
    (value) => value === "" || value === undefined ? undefined : Number(value),
    z.number().int().min(0).optional()
  ),
  image: z.custom<FileList>((value) => typeof FileList !== 'undefined' && value instanceof FileList)
});

type FormData = z.infer<typeof urbanInterventionSchema>;

const upsertUrbanIntervention = async (urbanInterventionData: FormData, existingId?: string) => {
  let imageUrl: string | null = urbanInterventionData.image_url || null;

  if (urbanInterventionData.image && urbanInterventionData.image.length > 0) {
    imageUrl = (await api.upload(urbanInterventionData.image[0])).url;
  }

  const { image, ...rest } = urbanInterventionData;
  return api.save('urban_interventions', { ...rest, date: rest.date || `${rest.month}/${rest.year}`, position: rest.position ?? 0, image_url: imageUrl }, existingId);
};

const UrbanInterventionForm = ({ urbanIntervention, onSuccess }: UrbanInterventionFormProps) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<z.input<typeof urbanInterventionSchema>, unknown, FormData>({
    resolver: zodResolver(urbanInterventionSchema), // Add zodResolver
    defaultValues: {
      title: urbanIntervention?.title || '',
      date: urbanIntervention?.date || '',
      month: urbanIntervention?.month ?? '',
      year: urbanIntervention?.year ?? '',
      image_url: urbanIntervention?.image_url || '',
      description: urbanIntervention?.description || '',
      position: urbanIntervention?.position ?? 0,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => upsertUrbanIntervention(data, urbanIntervention?.id), // Pass existingId
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urban_interventions'] });
      onSuccess();
    }
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="month">Month</Label>
        <Input id="month" type="number" min="1" max="12" {...register('month')} />
        {errors.month && <p className="text-red-500 text-sm">Month is required (1–12)</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="year">Year</Label>
        <Input id="year" type="number" min="1" max="9999" {...register('year')} />
        {errors.year && <p className="text-red-500 text-sm">Year is required</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title")} />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="image">Image</Label>
        <Input id="image" type="file" accept="image/*" {...register("image")} />
        {urbanIntervention?.image_url && (
          <img src={urbanIntervention.image_url} alt="Current Urban Intervention Image" className="w-24 h-24 object-cover rounded mt-2" />
        )}
        {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
      </div>
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving...' : 'Save Urban Intervention'}
      </Button>
      {mutation.isError && <p className="text-red-500 text-sm">{mutation.error.message}</p>}
    </form>
  );
};

export default UrbanInterventionForm;
