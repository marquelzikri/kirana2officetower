import type { Insight, InsightStatus } from '@/types';

import { type EnvWithDb, getDb, getLocalSqliteDb } from '../db';


export function mapRowToInsight(row: any): Insight {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    body: row.body,
    coverImage: row.cover_image || undefined,
    category: row.category,
    authorId: row.author_id,
    authorName: row.author_name,
    status: (row.status as InsightStatus) || 'draft',
    publishedAt: row.published_at || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

export async function createInsightInDb(
  env: EnvWithDb,
  insightData: {
    title: string;
    slug?: string;
    excerpt: string;
    body: string;
    coverImage?: string;
    category: string;
    authorId: string;
    authorName: string;
    status?: InsightStatus;
  }
): Promise<Insight> {
  const id = `ins-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  const status = insightData.status || 'draft';
  const slug = insightData.slug || generateSlug(insightData.title);

  const insight: Insight = {
    id,
    title: insightData.title.trim(),
    slug,
    excerpt: insightData.excerpt.trim(),
    body: insightData.body,
    coverImage: insightData.coverImage || undefined,
    category: insightData.category.trim(),
    authorId: insightData.authorId,
    authorName: insightData.authorName,
    status,
    publishedAt: status === 'published' ? now : undefined,
    createdAt: now,
    updatedAt: now,
  };

  const query = `
    INSERT INTO insights (
      id, title, slug, excerpt, body, cover_image,
      category, author_id, author_name, status,
      published_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    insight.id,
    insight.title,
    insight.slug,
    insight.excerpt,
    insight.body,
    insight.coverImage || null,
    insight.category,
    insight.authorId,
    insight.authorName,
    insight.status,
    insight.publishedAt || null,
    insight.createdAt,
    insight.updatedAt,
  ];

  const db = getDb(env);
  if (db) {
    await db.prepare(query).bind(...values).run();
  } else {
    const localDb = await getLocalSqliteDb();
    localDb.prepare(query).run(...values);
  }

  return insight;
}

export async function getInsightsFromDb(
  env: EnvWithDb,
  options?: { status?: string; category?: string; showAll?: boolean }
): Promise<Insight[]> {
  let query = 'SELECT * FROM insights';
  const conditions: string[] = [];
  const params: any[] = [];

  if (!options?.showAll) {
    conditions.push('status = ?');
    params.push('published');
  } else if (options?.status && options.status !== 'all') {
    conditions.push('status = ?');
    params.push(options.status);
  }

  if (options?.category && options.category !== 'all') {
    conditions.push('category = ?');
    params.push(options.category);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ' ORDER BY created_at DESC';

  const db = getDb(env);
  if (db) {
    const stmt = db.prepare(query);
    const { results } = params.length > 0
      ? await stmt.bind(...params).all()
      : await stmt.all();
    return (results || []).map(mapRowToInsight);
  } else {
    const localDb = await getLocalSqliteDb();
    const stmt = localDb.prepare(query);
    const rows = params.length > 0 ? stmt.all(...params) : stmt.all();
    return (rows || []).map(mapRowToInsight);
  }
}

export async function getInsightByIdFromDb(
  env: EnvWithDb,
  id: string
): Promise<Insight | null> {
  const query = 'SELECT * FROM insights WHERE id = ?';
  const db = getDb(env);
  if (db) {
    const row = await db.prepare(query).bind(id).first();
    return row ? mapRowToInsight(row) : null;
  } else {
    const localDb = await getLocalSqliteDb();
    const row = localDb.prepare(query).get(id);
    return row ? mapRowToInsight(row) : null;
  }
}

export async function getInsightBySlugFromDb(
  env: EnvWithDb,
  slug: string
): Promise<Insight | null> {
  const query = 'SELECT * FROM insights WHERE slug = ?';
  const db = getDb(env);
  if (db) {
    const row = await db.prepare(query).bind(slug).first();
    return row ? mapRowToInsight(row) : null;
  } else {
    const localDb = await getLocalSqliteDb();
    const row = localDb.prepare(query).get(slug);
    return row ? mapRowToInsight(row) : null;
  }
}

export async function updateInsightInDb(
  env: EnvWithDb,
  id: string,
  data: Partial<Insight>
): Promise<Insight> {
  const existing = await getInsightByIdFromDb(env, id);
  if (!existing) {
    throw new Error(`Insight dengan ID ${id} tidak ditemukan`);
  }

  const now = new Date().toISOString();
  const updated: Insight = {
    ...existing,
    ...data,
    id,
    updatedAt: now,
  };

  // Set publishedAt when transitioning to published
  if (data.status === 'published' && existing.status !== 'published') {
    updated.publishedAt = now;
  }

  const query = `
    UPDATE insights SET
      title = ?, slug = ?, excerpt = ?, body = ?,
      cover_image = ?, category = ?, author_id = ?,
      author_name = ?, status = ?, published_at = ?,
      updated_at = ?
    WHERE id = ?
  `;

  const values = [
    updated.title,
    updated.slug,
    updated.excerpt,
    updated.body,
    updated.coverImage || null,
    updated.category,
    updated.authorId,
    updated.authorName,
    updated.status,
    updated.publishedAt || null,
    updated.updatedAt,
    id,
  ];

  const db = getDb(env);
  if (db) {
    await db.prepare(query).bind(...values).run();
  } else {
    const localDb = await getLocalSqliteDb();
    localDb.prepare(query).run(...values);
  }

  return updated;
}

export async function deleteInsightFromDb(
  env: EnvWithDb,
  id: string
): Promise<boolean> {
  const query = 'DELETE FROM insights WHERE id = ?';
  const db = getDb(env);
  if (db) {
    await db.prepare(query).bind(id).run();
  } else {
    const localDb = await getLocalSqliteDb();
    localDb.prepare(query).run(id);
  }
  return true;
}
