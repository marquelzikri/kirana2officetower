import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Link,useParams } from 'react-router-dom';

import { MainLayout } from '@/components/templates/MainLayout';
import { fetchInsightBySlug } from '@/services/insightService';

const formatDate = (dateStr: string) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr));
};

export const InsightDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading, error } = useQuery({
    queryKey: ['insight', slug],
    queryFn: () => slug ? fetchInsightBySlug(slug) : Promise.reject('No slug'),
    enabled: !!slug
  });

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-margin-desktop py-section-gap-desktop">
        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-heritage-red"></div>
          </div>
        ) : error || !article ? (
          <div className="text-center py-32">
            <h2 className="font-headline-lg text-2xl mb-4 text-on-surface">Artikel Tidak Ditemukan</h2>
            <p className="text-on-surface-variant mb-8">Maaf, artikel yang Anda cari tidak ada atau telah dipindahkan.</p>
            <Link to="/insight" className="inline-flex items-center text-heritage-red font-medium hover:underline">
              <span className="material-symbols-outlined mr-2">arrow_back</span>
              Kembali ke Insight
            </Link>
          </div>
        ) : (
          <article>
            {/* Breadcrumb */}
            <nav className="flex text-sm text-on-surface-variant mb-8" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link to="/insight" className="hover:text-heritage-red transition-colors">
                    Journal
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-sm mx-1">chevron_right</span>
                    <span className="truncate max-w-[200px] md:max-w-xs">{article.title}</span>
                  </div>
                </li>
              </ol>
            </nav>

            {/* Header */}
            <header className="mb-10">
              <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 bg-heritage-red/10 text-heritage-red text-xs font-label-caps uppercase tracking-wider rounded-full">
                  {article.category}
                </span>
                {article.publishedAt && (
                  <time className="text-sm text-on-surface-variant" dateTime={article.publishedAt}>
                    {formatDate(article.publishedAt)}
                  </time>
                )}
              </div>
              <h1 className="font-headline-lg text-4xl md:text-5xl text-on-surface mb-6 leading-tight">
                {article.title}
              </h1>
              <p className="text-xl md:text-2xl text-on-surface-variant font-headline-md italic leading-relaxed">
                {article.excerpt}
              </p>
            </header>

            {/* Cover Image */}
            {article.coverImage && (
              <figure className="mb-12">
                <img 
                  src={article.coverImage} 
                  alt={article.title}
                  className="w-full aspect-[16/10] object-cover rounded-2xl shadow-sm"
                />
              </figure>
            )}

            {/* Content Body */}
            <div 
              className="prose prose-lg prose-headings:font-headline-md prose-headings:text-on-surface prose-p:text-on-surface-variant prose-p:leading-relaxed prose-a:text-heritage-red prose-a:no-underline hover:prose-a:underline prose-li:text-on-surface-variant max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: article.body }}
            />

            {/* Footer */}
            <footer className="border-t border-outline-variant pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface font-medium">
                  {article.authorName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant">Ditulis oleh</p>
                  <p className="font-medium text-on-surface">{article.authorName}</p>
                </div>
              </div>

              <Link 
                to="/insight"
                className="inline-flex items-center px-6 py-3 border border-outline-variant rounded-full text-on-surface hover:border-heritage-red hover:text-heritage-red transition-colors"
              >
                <span className="material-symbols-outlined mr-2">arrow_back</span>
                Kembali ke Insight
              </Link>
            </footer>
          </article>
        )}
      </div>
    </MainLayout>
  );
};
