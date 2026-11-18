import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

export function ReorderButtons({ collection, items, index }: { collection: 'artworks' | 'urban_interventions'; items: { id: string; title: string }[]; index: number }) {
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: (ids: string[]) => api.reorder(collection, ids),
    onSettled: () => { client.invalidateQueries({ queryKey: [collection] }); },
  });
  const move = (direction: number) => {
    const ids = items.map(item => String(item.id));
    const target = index + direction;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    mutation.mutate(ids);
  };
  return <span className="inline-flex gap-1 mr-2">
    <Button type="button" variant="outline" size="sm" disabled={index === 0 || mutation.isPending} onClick={() => move(-1)} aria-label={`Move ${items[index].title} up`}>↑</Button>
    <Button type="button" variant="outline" size="sm" disabled={index === items.length - 1 || mutation.isPending} onClick={() => move(1)} aria-label={`Move ${items[index].title} down`}>↓</Button>
    {mutation.isError && <span role="alert">Could not reorder. Please retry.</span>}
  </span>;
}
