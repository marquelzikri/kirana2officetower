import type { User, UserRole } from '@/types';

export async function loginApi(username: string, password: string): Promise<{ success: boolean; user: User; message: string }> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data: any = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Gagal melakukan login. Periksa username dan password Anda.');
  }

  return data;
}

export async function logoutApi(): Promise<void> {
  await fetch('/api/auth/logout', {
    method: 'POST',
  });
}

export async function fetchCurrentAuthUserApi(): Promise<User | null> {
  const response = await fetch('/api/auth/me');
  if (!response.ok) {
    return null;
  }
  const data: any = await response.json();
  return data.user || null;
}

export async function fetchUsersApi(): Promise<User[]> {
  const response = await fetch('/api/users');
  const data: any = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Gagal mengambil daftar pengguna.');
  }
  return data.users || [];
}

export async function createUserApi(userData: {
  username: string;
  password: string;
  role: UserRole;
  name: string;
}): Promise<User> {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  const data: any = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Gagal membuat pengguna baru.');
  }

  return data;
}

export async function fetchSetupStatusApi(): Promise<{ hasUsers: boolean; count: number }> {
  const response = await fetch('/api/auth/setup-status');
  const data: any = await response.json().catch(() => ({}));
  if (!response.ok) {
    return { hasUsers: true, count: 1 };
  }
  return { hasUsers: !!data.hasUsers, count: data.count || 0 };
}

export async function onboardOwnerApi(ownerData: {
  username: string;
  password: string;
  name: string;
}): Promise<{ success: boolean; user: User; message: string }> {
  const response = await fetch('/api/auth/onboard-owner', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ownerData),
  });

  const data: any = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Gagal mendaftar sebagai Owner.');
  }

  return data;
}

export async function deleteUserApi(userId: string): Promise<void> {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'DELETE',
  });

  const data: any = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Gagal menghapus pengguna.');
  }
}
