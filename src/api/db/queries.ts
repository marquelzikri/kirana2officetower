export interface PropertyFilterOptions {
  search?: string;
  zone?: string;
  condition?: string;
  type?: string;
  sizeRange?: string;
  sortBy?: string;
}

export function buildFilteredPropertyQuery(filters?: PropertyFilterOptions): { query: string; params: any[] } {
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

  return { query, params };
}

export const INSERT_PROPERTY_QUERY = `
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

export const UPDATE_PROPERTY_QUERY = `
  UPDATE properties SET
    title = ?, tower_name = ?, unit_code = ?, floor = ?, zone = ?, condition = ?, type = ?, category = ?,
    location = ?, size_sqm = ?, area = ?, price = ?, numeric_price = ?, rental_rate_sqm = ?, service_charge_sqm = ?,
    ceiling_height = ?, electricity_capacity = ?, parking_ratio = ?, view_type = ?, image = ?,
    gallery_images = ?, floor_plan_image = ?, features = ?, description = ?, featured = ?, bathrooms = ?, bedrooms = ?,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = ?;
`;
