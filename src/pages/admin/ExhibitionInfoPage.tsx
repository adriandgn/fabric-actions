import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Define schema for exhibition info
const exhibitionInfoSchema = z.object({
  id: z.string().uuid().optional(),
  last_exhibition: z.string().optional(),
  next_exhibition: z.string().optional(),
  next_exhibition_date: z.string().optional(),
  next_exhibition_address: z.string().optional(),
});

type ExhibitionInfo = z.infer<typeof exhibitionInfoSchema>;

const ExhibitionInfoPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch exhibition info
  const { data, isLoading, error } = useQuery<ExhibitionInfo[]> ({
    queryKey: ['exhibition_info'],
    queryFn: async () => {
      const { data, error } = await supabase.from('exhibition_info').select('*');
      if (error) throw error;
      return data;
    },
  });

  const { register, handleSubmit, reset } = useForm<ExhibitionInfo>({
    resolver: zodResolver(exhibitionInfoSchema),
    values: data && data.length > 0 ? data[0] : {}, // Pre-fill form if data exists
  });

  // Mutation for updating exhibition info
  const updateMutation = useMutation({
    mutationFn: async (info: ExhibitionInfo) => {
      const { data, error } = await supabase.from('exhibition_info').upsert(info).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exhibition_info'] });
      toast({
        title: 'Success!',
        description: 'Exhibition info updated successfully.',
      });
    },
    onError: (err) => {
      toast({
        title: 'Error',
        description: `Failed to update exhibition info: ${err.message}`,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (formData: ExhibitionInfo) => {
    updateMutation.mutate(formData);
  };

  React.useEffect(() => {
    if (data && data.length > 0) {
      reset(data[0]);
    }
  }, [data, reset]);

  if (isLoading) {
    return <div>Loading exhibition info...</div>;
  }

  if (error) {
    return <div>Error loading exhibition info: {error.message}</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Manage Exhibition Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="last_exhibition">Last Exhibition</Label>
              <Input id="last_exhibition" {...register('last_exhibition')} />
            </div>
            <div>
              <Label htmlFor="next_exhibition">Next Exhibition</Label>
              <Input id="next_exhibition" {...register('next_exhibition')} />
            </div>
            <div>
              <Label htmlFor="next_exhibition_date">Next Exhibition Date</Label>
              <Input id="next_exhibition_date" {...register('next_exhibition_date')} />
            </div>
            <div>
              <Label htmlFor="next_exhibition_address">Next Exhibition Address</Label>
              <Input id="next_exhibition_address" {...register('next_exhibition_address')} />
            </div>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExhibitionInfoPage;
