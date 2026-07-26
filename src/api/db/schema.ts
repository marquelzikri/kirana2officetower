export function initTableInSqlite(db: any) {
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

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('owner', 'admin')),
      name TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
