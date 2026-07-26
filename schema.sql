-- Cloudflare D1 SQL Schema for Properties
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
  gallery_images TEXT, -- JSON Array stringified
  floor_plan_image TEXT,
  features TEXT,       -- JSON Array stringified
  description TEXT,
  featured INTEGER DEFAULT 0, -- 0 for false, 1 for true
  bathrooms INTEGER,
  bedrooms INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Index for common query performance
CREATE INDEX IF NOT EXISTS idx_properties_zone ON properties(zone);
CREATE INDEX IF NOT EXISTS idx_properties_condition ON properties(condition);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);

-- Cloudflare D1 SQL Schema for Users
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

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Cloudflare D1 SQL Schema for Contacts / Inquiries
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

CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);


