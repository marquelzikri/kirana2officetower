import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { createUserApi, deleteUserApi, fetchUsersApi } from '@/services/authService';
import type { User, UserRole } from '@/types';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({ isOpen, onClose }) => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('admin');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch users query
  const { data: users = [], isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsersApi(),
    enabled: isOpen,
  });

  // Create user mutation
  const createMutation = useMutation({
    mutationFn: createUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setUsername('');
      setPassword('');
      setName('');
      setRole('admin');
      setErrorMsg(null);
      setSuccessMsg('Pengguna baru berhasil ditambahkan.');
      setTimeout(() => setSuccessMsg(null), 3000);
    },
    onError: (err: any) => {
      setErrorMsg(err.message || 'Gagal membuat pengguna');
      setSuccessMsg(null);
    },
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setSuccessMsg('Pengguna berhasil dihapus.');
      setTimeout(() => setSuccessMsg(null), 3000);
    },
    onError: (err: any) => {
      setErrorMsg(err.message || 'Gagal menghapus pengguna');
    },
  });

  if (!isOpen) return null;

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password || !name.trim()) {
      setErrorMsg('Semua field wajib diisi');
      return;
    }
    setErrorMsg(null);
    createMutation.mutate({
      username: username.trim(),
      password,
      name: name.trim(),
      role,
    });
  };

  const handleDeleteUser = (targetUser: User) => {
    if (targetUser.id === currentUser?.id) {
      alert('Anda tidak dapat menghapus akun Anda sendiri');
      return;
    }
    if (confirm(`Apakah Anda yakin ingin menghapus akun '${targetUser.username}'?`)) {
      deleteMutation.mutate(targetUser.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-on-surface/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-outline-variant/30 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-fade-in text-on-surface">
        {/* Header */}
        <div className="px-6 py-5 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-heritage-red/10 border border-heritage-red/20 rounded-xl flex items-center justify-center text-heritage-red">
              <span className="material-symbols-outlined">manage_accounts</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-surface font-headline-md">Manajemen Pengguna & Peran</h2>
              <p className="text-xs text-on-surface-variant">Fitur Eksklusif Peran Owner (Pemilik Properties)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:text-on-surface bg-surface-container-high hover:bg-outline-variant/30 rounded-xl transition-all"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-4 bg-error-container/60 border border-error/30 rounded-xl text-error text-sm flex items-center justify-between">
              <span>{errorMsg}</span>
              <button onClick={() => setErrorMsg(null)} className="text-xs underline font-semibold">Tutup</button>
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm flex items-center justify-between">
              <span>{successMsg}</span>
              <button onClick={() => setSuccessMsg(null)} className="text-xs underline font-semibold">Tutup</button>
            </div>
          )}

          {/* Form to Add New User */}
          <form onSubmit={handleCreateUser} className="bg-surface-container-low border border-outline-variant/40 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-heritage-red">Tambah Akun Baru</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3.5 py-2.5 bg-white border border-outline-variant/60 rounded-xl text-sm text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: budi_admin"
                  className="w-full px-3.5 py-2.5 bg-white border border-outline-variant/60 rounded-xl text-sm text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3.5 py-2.5 bg-white border border-outline-variant/60 rounded-xl text-sm text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Peran (Role)</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 bg-white border border-outline-variant/60 rounded-xl text-sm text-on-surface focus:outline-none focus:border-heritage-red"
                >
                  <option value="admin">Admin (Operational Access)</option>
                  <option value="owner">Owner (Full Privileges)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-5 py-2.5 bg-heritage-red hover:bg-red-800 text-white font-bold rounded-xl text-xs transition-all shadow-sm disabled:opacity-50"
              >
                {createMutation.isPending ? 'Menambahkan...' : 'Simpan Akun Baru'}
              </button>
            </div>
          </form>

          {/* Users List Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Daftar Pengguna Terdaftar ({users.length})
            </h3>

            {isLoading ? (
              <div className="py-8 text-center text-on-surface-variant text-sm">Memuat data pengguna...</div>
            ) : isError ? (
              <div className="py-4 text-center text-error text-sm">{(error as any)?.message}</div>
            ) : (
              <div className="border border-outline-variant/30 rounded-2xl overflow-hidden bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-container-low text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Nama</th>
                      <th className="px-4 py-3">Username</th>
                      <th className="px-4 py-3">Peran</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {users.map((u) => {
                      const isSelf = u.id === currentUser?.id;
                      return (
                        <tr key={u.id} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="px-4 py-3.5 font-medium text-on-surface flex items-center space-x-2">
                            <span>{u.name}</span>
                            {isSelf && (
                              <span className="px-2 py-0.5 bg-heritage-red/10 text-heritage-red text-[10px] rounded-full font-bold border border-heritage-red/20">
                                Anda
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 font-mono text-on-surface-variant text-xs">{u.username}</td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                u.role === 'owner'
                                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                  : 'bg-blue-100 text-blue-800 border border-blue-200'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            {!isSelf && (
                              <button
                                onClick={() => handleDeleteUser(u)}
                                disabled={deleteMutation.isPending}
                                className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-medium transition-all"
                              >
                                Hapus
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
