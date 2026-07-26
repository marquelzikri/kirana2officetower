import { featuredProperties } from '@/data/mockData';
import type { Property } from '@/types';

import { mapPropertyToRowParams,mapRowToProperty } from './db/mappers';
import type { PropertyFilterOptions } from './db/queries';
import { buildFilteredPropertyQuery, INSERT_PROPERTY_QUERY, UPDATE_PROPERTY_QUERY } from './db/queries';
import { initTableInSqlite } from './db/schema';

export * from './db/contacts';
export * from './db/users';
export type { PropertyFilterOptions };


export interface EnvWithDb {
  DB?: any;
  kirana_properties_db?: any;
}

export function getDb(env?: EnvWithDb): any {
  if (!env) return null;
  return env.DB || env.kirana_properties_db || null;
}

let localSqliteDb: any = null;

export async function getLocalSqliteDb(): Promise<any> {
  if (!localSqliteDb) {
    if (typeof Bun !== 'undefined') {
      const sqliteModule = 'bun:sqlite';
      const { Database: BunDatabase } = await import(sqliteModule);
      localSqliteDb = new BunDatabase('properties_local.sqlite', { create: true });
      initTableInSqlite(localSqliteDb);
    } else {
      throw new Error('Local SQLite fallback is only available under Bun runtime');
    }
  }
  return localSqliteDb;
}

export { mapPropertyToRowParams,mapRowToProperty };

// 1. GET ALL PROPERTIES (WITH FILTERING & SORTING)
export async function getPropertiesFromDb(
  env: EnvWithDb,
  filters?: PropertyFilterOptions
): Promise<Property[]> {
  await ensureSeededIfEmpty(env);
  const db = getDb(env);
  const { query, params } = buildFilteredPropertyQuery(filters);

  if (db) {
    const stmt = db.prepare(query);
    const { results } = await stmt.bind(...params).all();
    return (results || []).map(mapRowToProperty);
  } else {
    const localDb = await getLocalSqliteDb();
    const stmt = localDb.prepare(query);
    const rows = stmt.all(...params);
    return rows.map(mapRowToProperty);
  }
}

// 2. GET PROPERTY BY ID
export async function getPropertyByIdFromDb(env: EnvWithDb, id: string): Promise<Property | null> {
  const db = getDb(env);
  if (db) {
    const row = await db.prepare('SELECT * FROM properties WHERE id = ?').bind(id).first();
    return row ? mapRowToProperty(row) : null;
  } else {
    const localDb = await getLocalSqliteDb();
    const row = localDb.prepare('SELECT * FROM properties WHERE id = ?').get(id);
    return row ? mapRowToProperty(row) : null;
  }
}

// 3. CREATE PROPERTY
export async function createPropertyInDb(
  env: EnvWithDb,
  propertyData: Omit<Property, 'id'> & { id?: string }
): Promise<Property> {
  const id = propertyData.id || `kt-${Date.now().toString(36)}`;
  const property: Property = {
    ...propertyData,
    id,
    towerName: propertyData.towerName || 'Kirana Two Office Tower',
    area: propertyData.area || `${propertyData.sizeSqm} m²`,
  };

  const p = mapPropertyToRowParams(property);
  const values: any[] = [
    p.id, p.title, p.tower_name, p.unit_code, p.floor, p.zone, p.condition, p.type, p.category,
    p.location, p.size_sqm, p.area, p.price, p.numeric_price, p.rental_rate_sqm, p.service_charge_sqm,
    p.ceiling_height, p.electricity_capacity, p.parking_ratio, p.view_type, p.image,
    p.gallery_images, p.floor_plan_image, p.features, p.description, p.featured, p.bathrooms, p.bedrooms
  ];

  const db = getDb(env);
  if (db) {
    await db.prepare(INSERT_PROPERTY_QUERY).bind(...values).run();
  } else {
    const localDb = await getLocalSqliteDb();
    localDb.prepare(INSERT_PROPERTY_QUERY).run(...values);
  }

  return property;
}

// 4. UPDATE PROPERTY
export async function updatePropertyInDb(
  env: EnvWithDb,
  id: string,
  propertyData: Partial<Property>
): Promise<Property> {
  const existing = await getPropertyByIdFromDb(env, id);
  if (!existing) {
    throw new Error(`Property with id ${id} not found`);
  }

  const updated: Property = {
    ...existing,
    ...propertyData,
    id,
    area: propertyData.sizeSqm ? `${propertyData.sizeSqm} m²` : (propertyData.area || existing.area),
  };

  const p = mapPropertyToRowParams(updated);
  const values: any[] = [
    p.title, p.tower_name, p.unit_code, p.floor, p.zone, p.condition, p.type, p.category,
    p.location, p.size_sqm, p.area, p.price, p.numeric_price, p.rental_rate_sqm, p.service_charge_sqm,
    p.ceiling_height, p.electricity_capacity, p.parking_ratio, p.view_type, p.image,
    p.gallery_images, p.floor_plan_image, p.features, p.description, p.featured, p.bathrooms, p.bedrooms,
    id
  ];

  const db = getDb(env);
  if (db) {
    await db.prepare(UPDATE_PROPERTY_QUERY).bind(...values).run();
  } else {
    const localDb = await getLocalSqliteDb();
    localDb.prepare(UPDATE_PROPERTY_QUERY).run(...values);
  }

  return updated;
}

// 5. DELETE PROPERTY
export async function deletePropertyFromDb(env: EnvWithDb, id: string): Promise<boolean> {
  const query = 'DELETE FROM properties WHERE id = ?';
  const db = getDb(env);
  if (db) {
    await db.prepare(query).bind(id).run();
  } else {
    const localDb = await getLocalSqliteDb();
    localDb.prepare(query).run(id);
  }
  return true;
}

// 6. SEED DATABASE WITH DEFAULT PROPERTIES IF EMPTY OR REQUESTED
export async function seedPropertiesInDb(env: EnvWithDb, force: boolean = false): Promise<number> {
  const db = getDb(env);
  if (force) {
    if (db) {
      await db.prepare('DELETE FROM properties').run();
    } else {
      const localDb = await getLocalSqliteDb();
      localDb.prepare('DELETE FROM properties').run();
    }
  }

  let count = 0;
  for (const property of featuredProperties) {
    const existing = await getPropertyByIdFromDb(env, property.id);
    if (!existing || force) {
      await createPropertyInDb(env, property);
      count++;
    }
  }

  return count;
}

// Internal helper to ensure DB has data on startup
async function ensureSeededIfEmpty(env: EnvWithDb): Promise<void> {
  const db = getDb(env);
  let count = 0;
  if (db) {
    try {
      const res = await db.prepare('SELECT COUNT(*) as count FROM properties').first();
      count = res?.count ? Number(res.count) : 0;
    } catch {
      return;
    }
  } else {
    try {
      const localDb = await getLocalSqliteDb();
      const res = localDb.prepare('SELECT COUNT(*) as count FROM properties').get() as any;
      count = res?.count ? Number(res.count) : 0;
    } catch {
      return;
    }
  }

  if (count === 0) {
    await seedPropertiesInDb(env, false);
  }
}



