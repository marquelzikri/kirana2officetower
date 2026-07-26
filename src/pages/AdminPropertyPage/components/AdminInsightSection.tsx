import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';

import { Button } from '@/components/atoms/Button';
import { InsightFormModal } from '@/components/organisms/InsightFormModal';
import { useAuth } from '@/context/AuthContext';
import { deleteInsight,fetchInsights } from '@/services/insightService';
import type { Insight } from '@/types';

export const AdminInsightSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInsight, setEditingInsight] = useState<Insight | undefined>(undefined);
  const queryClient = useQueryClient();
  const { isOwner } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['insights', 'all'],
    queryFn: () => fetchInsights({ showAll: true }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteInsight(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    },
  });

  const handleEdit = (insight: Insight) => {
    setEditingInsight(insight);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!isOwner) {
      alert('Hanya owner yang dapat menghapus artikel.');
      return;
    }
    if (window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCreateNew = () => {
    setEditingInsight(undefined);
    setIsModalOpen(true);
  };

  const handleSaved = () => {
    setIsModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ['insights'] });
  };

  const insights = data?.insights || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-headline-md text-on-surface">Manajemen Artikel & Insight</h2>
          <p className="font-body-md text-on-surface-variant mt-1">
            Kelola konten artikel, panduan investasi, dan berita terkini.
          </p>
        </div>
        <Button onClick={handleCreateNew} className="bg-heritage-red text-white whitespace-nowrap">
          <span className="material-symbols-outlined mr-2 align-middle text-[18px]">edit_document</span>
          Tulis Artikel Baru
        </Button>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-heritage-red"></div>
        </div>
      ) : insights.length === 0 ? (
        <div className="py-16 text-center border border-outline-variant rounded-lg bg-surface-container-high/30">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3">article</span>
          <h3 className="font-headline-md text-on-surface mb-2">Belum ada artikel</h3>
          <p className="font-body-md text-on-surface-variant mb-6">Mulai publikasikan konten pertama Anda.</p>
          <Button onClick={handleCreateNew}>Buat Artikel</Button>
        </div>
      ) : (
        <div className="hidden md:block border border-outline-variant rounded-lg overflow-hidden bg-surface">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-high text-on-surface font-label-md uppercase tracking-wider">
              <tr>
                <th className="p-4 border-b border-outline-variant">Judul</th>
                <th className="p-4 border-b border-outline-variant">Kategori</th>
                <th className="p-4 border-b border-outline-variant">Status</th>
                <th className="p-4 border-b border-outline-variant">Tanggal</th>
                <th className="p-4 border-b border-outline-variant">Penulis</th>
                <th className="p-4 border-b border-outline-variant text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant font-body-md">
              {insights.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-high/30 transition-colors">
                  <td className="p-4 text-on-surface">
                    <div className="line-clamp-2" title={item.title}>{item.title}</div>
                  </td>
                  <td className="p-4 text-on-surface-variant">{item.category}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
                      item.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 text-on-surface-variant">
                    {item.publishedAt 
                      ? new Date(item.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) 
                      : '-'}
                  </td>
                  <td className="p-4 text-on-surface-variant">{item.authorName}</td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="p-2 text-on-surface-variant hover:text-heritage-red transition-colors"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    {isOwner && (
                      <button 
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteMutation.isPending}
                        className="p-2 text-on-surface-variant hover:text-heritage-red transition-colors disabled:opacity-50"
                        title="Hapus"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile view */}
      <div className="md:hidden flex flex-col gap-4">
        {insights.map((item) => (
          <div key={item.id} className="bg-surface border border-outline-variant rounded-lg p-4 flex flex-col gap-3 shadow-sm">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-headline-sm text-on-surface line-clamp-2">{item.title}</h3>
              <span className={`shrink-0 inline-flex px-2 py-1 text-[10px] rounded-full font-medium ${
                item.status === 'published' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {item.status === 'published' ? 'Published' : 'Draft'}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">category</span>
                {item.category}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('id-ID') : '-'}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">person</span>
                {item.authorName}
              </span>
            </div>
            
            <div className="flex justify-end gap-2 mt-2 pt-3 border-t border-outline-variant">
              <Button onClick={() => handleEdit(item)} className="px-3 py-1.5 text-sm">
                <span className="material-symbols-outlined text-[18px] mr-1 align-middle">edit</span>
                Edit
              </Button>
              {isOwner && (
                <Button onClick={() => handleDelete(item.id)} disabled={deleteMutation.isPending} className="px-3 py-1.5 text-sm bg-transparent border border-outline-variant text-on-surface">
                  <span className="material-symbols-outlined text-[18px] mr-1 align-middle">delete</span>
                  Hapus
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <InsightFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSaved={handleSaved}
        insight={editingInsight} 
      />
    </div>
  );
};
