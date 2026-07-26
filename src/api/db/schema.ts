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

    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      company TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'unread' CHECK(status IN ('unread', 'read', 'replied')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS insights (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT NOT NULL,
      body TEXT NOT NULL,
      cover_image TEXT,
      category TEXT NOT NULL,
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
      published_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

