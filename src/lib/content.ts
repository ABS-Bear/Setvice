import { getCollection, getEntry } from 'astro:content';

export async function settings<T = any>(id: string): Promise<T> {
  const entry = await getEntry('settings', id);
  if (!entry) throw new Error(`Missing settings entry: ${id}`);
  return entry.data as T;
}

export async function businessDirections() {
  return (await getCollection('business-directions')).sort((a, b) => a.data.order - b.data.order);
}

export async function services() {
  return (await getCollection('services')).sort((a, b) => a.data.order - b.data.order);
}

export async function serviceTeam() {
  const entry = await getEntry('team', 'service-team');
  if (!entry) throw new Error('Missing team entry: service-team');
  return entry.data;
}
