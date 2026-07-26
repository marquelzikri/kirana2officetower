import type { Property } from '../types';
import { featuredProperties } from '../data/mockData';
import { Database } from 'bun:sqlite';

export interface EnvWithDb {
  DB?: any; // Cloudflare D1Database binding
}

// Local Bun SQLite fallback instance (persisted in .wrangler or local file)
let localSqliteDb: Database | null = null;

function getLocalSqliteDb(): Database {
  if (!localSqliteDb) {
    localSqliteDb = new Database('properties_local.sqlite', { create: true });
    initTableInSqlite(localSqliteDb);
  }
  return localSqliteDb;
}

function initTableInSqlite(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      tower_name TEXT NOT NULL,
      unit_code TEXT NOT NULL,
      floor INTEGER NOT NULL,
      zone TEXT NOT NULL,
      condition TEXT NOT NULL,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      location TEXT NOT NULL,
      size_sqm REAL NOT NULL,
      area TEXT NOT NULL,
      price TEXT NOT NULL,
      numeric_price REAL NOT NULL,
      rental_rate_sqm REAL,
      service_charge_sqm REAL,
      ceiling_height TEXT,
      electricity_capacity TEXT,
      parking_ratio TEXT,
      view_type TEXT,
      image TEXT NOT NULL,
      gallery_images TEXT,
      floor_plan_image TEXT,
      features TEXT,
      description TEXT,
      featured INTEGER DEFAULT 0,
      bathrooms INTEGER,
      bedrooms INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Map Database Row to Property object
export function mapRowToProperty(row: any): Property {
  return {
    id: row.id,
    title: row.title,
    towerName: row.tower_name,
    unitCode: row.unit_code,
    floor: Number(row.floor),
    zone: row.zone,
    condition: row.condition,
    type: row.type,
    category: row.category,
    location: row.location,
    sizeSqm: Number(row.size_sqm),
    area: row.area,
    price: row.price,
    numericPrice: Number(row.numeric_price),
    rentalRateSqm: row.rental_rate_sqm ? Number(row.rental_rate_sqm) : undefined,
    serviceChargeSqm: row.service_charge_sqm ? Number(row.service_charge_sqm) : undefined,
    ceilingHeight: row.ceiling_height || undefined,
    electricityCapacity: row.electricity_capacity || undefined,
    parkingRatio: row.parking_ratio || undefined,
    viewType: row.view_type || undefined,
    image: row.image,
    galleryImages: row.gallery_images ? JSON.parse(row.gallery_images) : [],
    floorPlanImage: row.floor_plan_image || undefined,
    features: row.features ? JSON.parse(row.features) : [],
    description: row.description || undefined,
    featured: Boolean(row.featured),
    bathrooms: row.bathrooms ? Number(row.bathrooms) : undefined,
    bedrooms: row.bedrooms ? Number(row.bedrooms) : undefined,
  };
}

// Map Property object to Database row params
export function mapPropertyToRowParams(property: Partial<Property>) {
  return {
    id: property.id,
    title: property.title || '',
    tower_name: property.towerName || 'Kirana Two Office Tower',
    unit_code: property.unitCode || '',
    floor: property.floor || 1,
    zone: property.zone || 'Low Zone',
    condition: property.condition || 'Bare Shell',
    type: property.type || 'For Rent',
    category: property.category || 'Office Tower',
    location: property.location || 'Jl. Boulevard Timur No. 88, Kelapa Gading, Jakarta Utara',
    size_sqm: property.sizeSqm || 0,
    area: property.area || `${property.sizeSqm || 0} m²`,
    price: property.price || '',
    numeric_price: property.numericPrice || 0,
    rental_rate_sqm: property.rentalRateSqm ?? null,
    service_charge_sqm: property.serviceChargeSqm ?? null,
    ceiling_height: property.ceilingHeight ?? null,
    electricity_capacity: property.electricityCapacity ?? null,
    parking_ratio: property.parkingRatio ?? null,
    view_type: property.viewType ?? null,
    image: property.image || '',
    gallery_images: JSON.stringify(property.galleryImages || []),
    floor_plan_image: property.floorPlanImage ?? null,
    features: JSON.stringify(property.features || []),
    description: property.description ?? null,
    featured: property.featured ? 1 : 0,
    bathrooms: property.bathrooms ?? null,
    bedrooms: property.bedrooms ?? null,
  };
}

// 1. GET ALL PROPERTIES (WITH FILTERING & SORTING)
export async function getPropertiesFromDb(
  env: EnvWithDb,
  filters?: {
    search?: string;
    zone?: string;
    condition?: string;
    type?: string;
    sizeRange?: string;
    sortBy?: string;
  }
): Promise<Property[]> {
  await ensureSeededIfEmpty(env);

  if (env.DB) {
    // Cloudflare D1 Execution
    let query = 'SELECT * FROM properties WHERE 1=1';
    const params: any[] = [];

    if (filters?.search?.trim()) {
      const q = `%${filters.search.trim()}%`;
      query += ` AND (LOWER(title) LIKE LOWER(?) OR LOWER(unit_code) LIKE LOWER(?) OR LOWER(location) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))`;
      params.push(q, q, q, q);
    }

    if (filters?.zone && filters.zone !== 'all') {
      query += ` AND zone = ?`;
      params.push(filters.zone);
    }

    if (filters?.condition && filters.condition !== 'all') {
      query += ` AND condition = ?`;
      params.push(filters.condition);
    }

    if (filters?.type && filters.type !== 'all') {
      query += ` AND type = ?`;
      params.push(filters.type);
    }

    if (filters?.sizeRange && filters.sizeRange !== 'all') {
      if (filters.sizeRange === 'small') query += ` AND size_sqm < 150`;
      else if (filters.sizeRange === 'medium') query += ` AND size_sqm >= 150 AND size_sqm <= 300`;
      else if (filters.sizeRange === 'large') query += ` AND size_sqm > 300 AND size_sqm <= 600`;
      else if (filters.sizeRange === 'whole') query += ` AND size_sqm > 600`;
    }

    if (filters?.sortBy === 'price-asc') query += ` ORDER BY numeric_price ASC`;
    else if (filters?.sortBy === 'price-desc') query += ` ORDER BY numeric_price DESC`;
    else if (filters?.sortBy === 'size-desc') query += ` ORDER BY size_sqm DESC`;
    else if (filters?.sortBy === 'size-asc') query += ` ORDER BY size_sqm ASC`;
    else if (filters?.sortBy === 'floor-desc') query += ` ORDER BY floor DESC`;
    else query += ` ORDER BY created_at DESC`;

    const stmt = env.DB.prepare(query);
    const { results } = await stmt.bind(...params).all();
    return (results || []).map(mapRowToProperty);
  } else {
    // Local Bun SQLite Execution
    const db = getLocalSqliteDb();
    let query = 'SELECT * FROM properties WHERE 1=1';
    const params: any[] = [];

    if (filters?.search?.trim()) {
      const q = `%${filters.search.trim()}%`;
      query += ` AND (LOWER(title) LIKE LOWER(?) OR LOWER(unit_code) LIKE LOWER(?) OR LOWER(location) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))`;
      params.push(q, q, q, q);
    }

    if (filters?.zone && filters.zone !== 'all') {
      query += ` AND zone = ?`;
      params.push(filters.zone);
    }

    if (filters?.condition && filters.condition !== 'all') {
      query += ` AND condition = ?`;
      params.push(filters.condition);
    }

    if (filters?.type && filters.type !== 'all') {
      query += ` AND type = ?`;
      params.push(filters.type);
    }

    if (filters?.sizeRange && filters.sizeRange !== 'all') {
      if (filters.sizeRange === 'small') query += ` AND size_sqm < 150`;
      else if (filters.sizeRange === 'medium') query += ` AND size_sqm >= 150 AND size_sqm <= 300`;
      else if (filters.sizeRange === 'large') query += ` AND size_sqm > 300 AND size_sqm <= 600`;
      else if (filters.sizeRange === 'whole') query += ` AND size_sqm > 600`;
    }

    if (filters?.sortBy === 'price-asc') query += ` ORDER BY numeric_price ASC`;
    else if (filters?.sortBy === 'price-desc') query += ` ORDER BY numeric_price DESC`;
    else if (filters?.sortBy === 'size-desc') query += ` ORDER BY size_sqm DESC`;
    else if (filters?.sortBy === 'size-asc') query += ` ORDER BY size_sqm ASC`;
    else if (filters?.sortBy === 'floor-desc') query += ` ORDER BY floor DESC`;
    else query += ` ORDER BY created_at DESC`;

    const stmt = db.prepare(query);
    const rows = stmt.all(...params);
    return rows.map(mapRowToProperty);
  }
}

// 2. GET PROPERTY BY ID
export async function getPropertyByIdFromDb(env: EnvWithDb, id: string): Promise<Property | null> {
  if (env.DB) {
    const row = await env.DB.prepare('SELECT * FROM properties WHERE id = ?').bind(id).first();
    return row ? mapRowToProperty(row) : null;
  } else {
    const db = getLocalSqliteDb();
    const row = db.prepare('SELECT * FROM properties WHERE id = ?').get(id);
    return row ? mapRowToProperty(row) : null;
  }
}

// 3. CREATE PROPERTY
export async function createPropertyInDb(env: EnvWithDb, propertyData: Omit<Property, 'id'> & { id?: string }): Promise<Property> {
  const id = propertyData.id || `kt-${Date.now().toString(36)}`;
  const property: Property = {
    ...propertyData,
    id,
    towerName: propertyData.towerName || 'Kirana Two Office Tower',
    area: propertyData.area || `${propertyData.sizeSqm} m²`,
  };

  const p = mapPropertyToRowParams(property);

  const query = `
    INSERT INTO properties (
      id, title, tower_name, unit_code, floor, zone, condition, type, category,
      location, size_sqm, area, price, numeric_price, rental_rate_sqm, service_charge_sqm,
      ceiling_height, electricity_capacity, parking_ratio, view_type, image,
      gallery_images, floor_plan_image, features, description, featured, bathrooms, bedrooms
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?
    );
  `;

  const values: any[] = [
    p.id, p.title, p.tower_name, p.unit_code, p.floor, p.zone, p.condition, p.type, p.category,
    p.location, p.size_sqm, p.area, p.price, p.numeric_price, p.rental_rate_sqm, p.service_charge_sqm,
    p.ceiling_height, p.electricity_capacity, p.parking_ratio, p.view_type, p.image,
    p.gallery_images, p.floor_plan_image, p.features, p.description, p.featured, p.bathrooms, p.bedrooms
  ];

  if (env.DB) {
    await env.DB.prepare(query).bind(...values).run();
  } else {
    const db = getLocalSqliteDb();
    db.prepare(query).run(...values);
  }

  return property;
}

// 4. UPDATE PROPERTY
export async function updatePropertyInDb(env: EnvWithDb, id: string, propertyData: Partial<Property>): Promise<Property> {
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

  const query = `
    UPDATE properties SET
      title = ?, tower_name = ?, unit_code = ?, floor = ?, zone = ?, condition = ?, type = ?, category = ?,
      location = ?, size_sqm = ?, area = ?, price = ?, numeric_price = ?, rental_rate_sqm = ?, service_charge_sqm = ?,
      ceiling_height = ?, electricity_capacity = ?, parking_ratio = ?, view_type = ?, image = ?,
      gallery_images = ?, floor_plan_image = ?, features = ?, description = ?, featured = ?, bathrooms = ?, bedrooms = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?;
  `;

  const values: any[] = [
    p.title, p.tower_name, p.unit_code, p.floor, p.zone, p.condition, p.type, p.category,
    p.location, p.size_sqm, p.area, p.price, p.numeric_price, p.rental_rate_sqm, p.service_charge_sqm,
    p.ceiling_height, p.electricity_capacity, p.parking_ratio, p.view_type, p.image,
    p.gallery_images, p.floor_plan_image, p.features, p.description, p.featured, p.bathrooms, p.bedrooms,
    id
  ];

  if (env.DB) {
    await env.DB.prepare(query).bind(...values).run();
  } else {
    const db = getLocalSqliteDb();
    db.prepare(query).run(...values);
  }

  return updated;
}

// 5. DELETE PROPERTY
export async function deletePropertyFromDb(env: EnvWithDb, id: string): Promise<boolean> {
  const query = 'DELETE FROM properties WHERE id = ?';
  if (env.DB) {
    await env.DB.prepare(query).bind(id).run();
  } else {
    const db = getLocalSqliteDb();
    db.prepare(query).run(id);
  }
  return true;
}

// 6. SEED DATABASE WITH DEFAULT PROPERTIES IF EMPTY OR REQUESTED
export async function seedPropertiesInDb(env: EnvWithDb, force: boolean = false): Promise<number> {
  if (force) {
    if (env.DB) {
      await env.DB.prepare('DELETE FROM properties').run();
    } else {
      const db = getLocalSqliteDb();
      db.prepare('DELETE FROM properties').run();
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
  let count = 0;
  if (env.DB) {
    const res = await env.DB.prepare('SELECT COUNT(*) as count FROM properties').first();
    count = res?.count ? Number(res.count) : 0;
  } else {
    const db = getLocalSqliteDb();
    const res = db.prepare('SELECT COUNT(*) as count FROM properties').get() as any;
    count = res?.count ? Number(res.count) : 0;
  }

  if (count === 0) {
    await seedPropertiesInDb(env, false);
  }
}
