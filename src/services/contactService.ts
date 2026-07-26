import type { ContactMessage, ContactStatus } from '@/types';

export interface SubmitContactInput {
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
}

export async function submitContactForm(data: SubmitContactInput): Promise<{ success: boolean; contact: ContactMessage }> {
  const response = await fetch('/api/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const resData = (await response.json().catch(() => ({}))) as any;
  if (!response.ok) {
    throw new Error(resData.error || 'Gagal mengirim pesan kontak');
  }

  return resData;
}

export async function fetchContacts(statusFilter: string = 'all'): Promise<ContactMessage[]> {
  const params = new URLSearchParams();
  if (statusFilter && statusFilter !== 'all') {
    params.append('status', statusFilter);
  }

  const url = `/api/contacts${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);

  const resData = (await response.json().catch(() => ({}))) as any;
  if (!response.ok) {
    throw new Error(resData.error || 'Gagal mengambil pesan kontak');
  }

  return resData.contacts || [];
}

export async function updateContactStatus(
  id: string,
  status: ContactStatus
): Promise<{ success: boolean; contact: ContactMessage }> {
  const response = await fetch(`/api/contacts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  const resData = (await response.json().catch(() => ({}))) as any;
  if (!response.ok) {
    throw new Error(resData.error || 'Gagal memperbarui status pesan');
  }

  return resData;
}

export async function deleteContact(id: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`/api/contacts/${id}`, {
    method: 'DELETE',
  });

  const resData = (await response.json().catch(() => ({}))) as any;
  if (!response.ok) {
    throw new Error(resData.error || 'Gagal menghapus pesan kontak');
  }

  return resData;
}
