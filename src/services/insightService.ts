import type { Insight } from '@/types';

export interface InsightsApiResponse {
  insights: Insight[];
}

export interface InsightFilterParams {
  status?: string;
  category?: string;
  showAll?: boolean;
}

export async function fetchInsights(
  filters?: InsightFilterParams
): Promise<InsightsApiResponse> {
  const params = new URLSearchParams();
  if (filters?.status && filters.status !== 'all') {
    params.append('status', filters.status);
  }
  if (filters?.category && filters.category !== 'all') {
    params.append('category', filters.category);
  }
  if (filters?.showAll) {
    params.append('all', 'true');
  }

  const queryString = params.toString();
  const url = `/api/insights${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch insights: ${response.statusText}`
    );
  }

  return response.json();
}

export async function fetchInsightBySlug(
  slug: string
): Promise<Insight> {
  const response = await fetch(`/api/insights/${slug}`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch insight detail: ${response.statusText}`
    );
  }

  return response.json();
}

export async function createInsight(
  data: Partial<Insight>
): Promise<Insight> {
  const response = await fetch('/api/insights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errData = (await response.json().catch(() => ({}))) as any;
    throw new Error(
      errData.error ||
        `Failed to create insight: ${response.statusText}`
    );
  }

  return response.json();
}

export async function updateInsight(
  id: string,
  data: Partial<Insight>
): Promise<Insight> {
  const response = await fetch(`/api/insights/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errData = (await response.json().catch(() => ({}))) as any;
    throw new Error(
      errData.error ||
        `Failed to update insight: ${response.statusText}`
    );
  }

  return response.json();
}

export async function deleteInsight(
  id: string
): Promise<{ success: boolean }> {
  const response = await fetch(`/api/insights/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errData = (await response.json().catch(() => ({}))) as any;
    throw new Error(
      errData.error ||
        `Failed to delete insight: ${response.statusText}`
    );
  }

  return response.json();
}
