import type { User, UserDbRow, UserRole } from '@/types';

import { generateSalt, hashPassword } from '../auth';
import type { EnvWithDb } from '../db';
import { getDb, getLocalSqliteDb } from '../db';

export async function getUsersCountFromDb(env: EnvWithDb): Promise<number> {
  const db = getDb(env);
  if (db) {
    try {
      const res = await db.prepare('SELECT COUNT(*) as count FROM users').first();
      return res?.count ? Number(res.count) : 0;
    } catch {
      return 0;
    }
  } else {
    try {
      const localDb = await getLocalSqliteDb();
      const res = localDb.prepare('SELECT COUNT(*) as count FROM users').get() as any;
      return res?.count ? Number(res.count) : 0;
    } catch {
      return 0;
    }
  }
}

export async function getUserByUsernameFromDb(env: EnvWithDb, username: string): Promise<UserDbRow | null> {
  const db = getDb(env);
  if (db) {
    const row = await db.prepare('SELECT * FROM users WHERE username = ?').bind(username).first();
    return (row as UserDbRow) || null;
  } else {
    const localDb = await getLocalSqliteDb();
    const row = localDb.prepare('SELECT * FROM users WHERE username = ?').get(username);
    return (row as UserDbRow) || null;
  }
}

export async function getUserByIdFromDb(env: EnvWithDb, id: string): Promise<UserDbRow | null> {
  const db = getDb(env);
  if (db) {
    const row = await db.prepare('SELECT * FROM users WHERE id = ?').bind(id).first();
    return (row as UserDbRow) || null;
  } else {
    const localDb = await getLocalSqliteDb();
    const row = localDb.prepare('SELECT * FROM users WHERE id = ?').get(id);
    return (row as UserDbRow) || null;
  }
}

export async function getAllUsersFromDb(env: EnvWithDb): Promise<User[]> {
  const query = 'SELECT id, username, role, name, created_at, updated_at FROM users ORDER BY created_at ASC';
  const db = getDb(env);
  let rows: any[] = [];
  if (db) {
    const { results } = await db.prepare(query).all();
    rows = results || [];
  } else {
    const localDb = await getLocalSqliteDb();
    rows = localDb.prepare(query).all();
  }

  return rows.map((r: any) => ({
    id: r.id,
    username: r.username,
    role: r.role as UserRole,
    name: r.name,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}

export async function createUserInDb(
  env: EnvWithDb,
  userData: { username: string; password: string; role: UserRole; name: string }
): Promise<User> {
  const existing = await getUserByUsernameFromDb(env, userData.username.toLowerCase());
  if (existing) {
    throw new Error(`Username '${userData.username}' sudah digunakan`);
  }

  const id = `usr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const salt = generateSalt();
  const passwordHash = await hashPassword(userData.password, salt);
  const username = userData.username.toLowerCase();

  const query = `
    INSERT INTO users (id, username, password_hash, salt, role, name)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [id, username, passwordHash, salt, userData.role, userData.name];

  const db = getDb(env);
  if (db) {
    await db.prepare(query).bind(...values).run();
  } else {
    const localDb = await getLocalSqliteDb();
    localDb.prepare(query).run(...values);
  }

  return {
    id,
    username,
    role: userData.role,
    name: userData.name,
  };
}

export async function deleteUserFromDb(env: EnvWithDb, id: string): Promise<boolean> {
  const user = await getUserByIdFromDb(env, id);
  if (!user) {
    throw new Error(`User tidak ditemukan`);
  }

  const query = 'DELETE FROM users WHERE id = ?';
  const db = getDb(env);
  if (db) {
    await db.prepare(query).bind(id).run();
  } else {
    const localDb = await getLocalSqliteDb();
    localDb.prepare(query).run(id);
  }
  return true;
}

export async function clearAllUsersInDb(env: EnvWithDb): Promise<void> {
  const query = 'DELETE FROM users';
  const db = getDb(env);
  if (db) {
    await db.prepare(query).run();
  } else {
    const localDb = await getLocalSqliteDb();
    localDb.prepare(query).run();
  }
}
