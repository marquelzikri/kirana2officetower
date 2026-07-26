import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Link } from 'react-router-dom';

import { MainLayout } from '@/components/templates/MainLayout';
import { fetchInsights } from '@/services/insightService';

const formatDate = (dateStr: string) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
};

export const InsightPage: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['insights'],
    queryFn: () => fetchInsights({ status: 'published' })
  });

  const insights = data?.insights || [];
  const featuredArticle = insights[0];
  const remainingArticles = insights.slice(1);

  return (
    <MainLayout>
      <div className="max-w-container mx-auto px-margin-desktop py-section-gap-desktop">
        <header className="mb-12 border-b border-outline-variant pb-8">
          <h1 className="font-headline-lg text-4xl md:text-5xl lg:text-6xl text-on-surface mb-4">
            Perspektif tentang pasar properti Indonesia.
          </h1>
          <p className="text-on-surface-variant font-body-md text-lg">
            Temukan wawasan terbaru, analisis pasar, dan berita seputar Kirana Two Office Tower.
          </p>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-heritage-red"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-heritage-red">
            Gagal memuat artikel. Silakan coba lagi nanti.
          </div>
        ) : insights.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant">
            Belum ada artikel yang dipublikasikan.
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredArticle != null && (
              <Link
                to={`/insight/${featuredArticle.slug}`}
                className="group relative block rounded-2xl overflow-hidden mb-12 shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative w-full shrink-0 aspect-[21/9] min-h-[220px] sm:min-h-[280px] bg-surface-container-high">
                  {featuredArticle.coverImage ? (
                    <img
                      src={featuredArticle.coverImage}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400"></div>
                  )}
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-3 py-1 bg-heritage-red/90 text-white text-xs font-label-caps uppercase tracking-wider rounded-full">
                        {featuredArticle.category}
                      </span>
                      {featuredArticle.publishedAt && (
                        <span className="text-sm opacity-80">
                          {formatDate(featuredArticle.publishedAt)}
                        </span>
                      )}
                    </div>
                    <h2 className="font-headline-md text-3xl md:text-4xl mb-4 group-hover:text-heritage-red transition-colors duration-300">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-white/80 line-clamp-2 md:text-lg max-w-3xl mb-6">
                      {featuredArticle.excerpt}
                    </p>
                    <span className="inline-flex items-center text-white font-medium group-hover:text-heritage-red transition-colors">
                      Baca Artikel <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid Articles */}
            {remainingArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {remainingArticles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/insight/${article.slug}`}
                    className="group flex flex-col bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative w-full shrink-0 aspect-[16/10] bg-surface-container-high overflow-hidden">
                      {article.coverImage ? (
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300 group-hover:scale-105 transition-transform duration-500"></div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2.5 py-1 bg-heritage-red/10 text-heritage-red text-[10px] font-label-caps uppercase tracking-wider rounded-full">
                          {article.category}
                        </span>
                        {article.publishedAt && (
                          <span className="text-xs text-on-surface-variant">
                            {formatDate(article.publishedAt)}
                          </span>
                        )}
                      </div>
                      <h3 className="font-headline-md text-xl text-on-surface mb-3 group-hover:text-heritage-red transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-on-surface-variant text-sm line-clamp-3 mb-6 flex-grow">
                        {article.excerpt}
                      </p>
                      <span className="text-heritage-red text-sm font-medium flex items-center mt-auto">
                        Baca <span className="material-symbols-outlined ml-1 text-[16px]">arrow_right_alt</span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};
