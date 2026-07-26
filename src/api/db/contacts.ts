import type { ContactMessage, ContactStatus } from '@/types';

import { type EnvWithDb, getDb, getLocalSqliteDb } from '../db';


export function mapRowToContact(row: any): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    company: row.company || undefined,
    subject: row.subject,
    message: row.message,
    status: (row.status as ContactStatus) || 'unread',
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

export async function createContactInDb(
  env: EnvWithDb,
  contactData: {
    name: string;
    email: string;
    phone: string;
    company?: string;
    subject: string;
    message: string;
  }
): Promise<ContactMessage> {
  const id = `msg-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const contact: ContactMessage = {
    id,
    name: contactData.name.trim(),
    email: contactData.email.trim(),
    phone: contactData.phone.trim(),
    company: contactData.company?.trim() || '',
    subject: contactData.subject.trim(),
    message: contactData.message.trim(),
    status: 'unread',
    createdAt: now,
    updatedAt: now,
  };

  const query = `
    INSERT INTO contacts (id, name, email, phone, company, subject, message, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    contact.id,
    contact.name,
    contact.email,
    contact.phone,
    contact.company || null,
    contact.subject,
    contact.message,
    contact.status,
    contact.createdAt,
    contact.updatedAt,
  ];

  const db = getDb(env);
  if (db) {
    await db.prepare(query).bind(...values).run();
  } else {
    const localDb = await getLocalSqliteDb();
    localDb.prepare(query).run(...values);
  }

  return contact;
}

export async function getContactsFromDb(
  env: EnvWithDb,
  statusFilter: string = 'all'
): Promise<ContactMessage[]> {
  let query = 'SELECT * FROM contacts';
  const params: any[] = [];

  if (statusFilter && statusFilter !== 'all') {
    query += ' WHERE status = ?';
    params.push(statusFilter);
  }

  query += ' ORDER BY created_at DESC';

  const db = getDb(env);
  if (db) {
    const stmt = db.prepare(query);
    const { results } = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all();
    return (results || []).map(mapRowToContact);
  } else {
    const localDb = await getLocalSqliteDb();
    const stmt = localDb.prepare(query);
    const rows = params.length > 0 ? stmt.all(...params) : stmt.all();
    return (rows || []).map(mapRowToContact);
  }
}

export async function updateContactStatusInDb(
  env: EnvWithDb,
  id: string,
  status: ContactStatus
): Promise<ContactMessage> {
  const now = new Date().toISOString();
  const query = 'UPDATE contacts SET status = ?, updated_at = ? WHERE id = ?';

  const db = getDb(env);
  if (db) {
    await db.prepare(query).bind(status, now, id).run();
  } else {
    const localDb = await getLocalSqliteDb();
    localDb.prepare(query).run(status, now, id);
  }

  // Retrieve updated contact
  const selectQuery = 'SELECT * FROM contacts WHERE id = ?';
  let row: any = null;
  if (db) {
    row = await db.prepare(selectQuery).bind(id).first();
  } else {
    const localDb = await getLocalSqliteDb();
    row = localDb.prepare(selectQuery).get(id);
  }

  if (!row) {
    throw new Error(`Pesan kontak dengan ID ${id} tidak ditemukan`);
  }

  return mapRowToContact(row);
}

export async function deleteContactFromDb(env: EnvWithDb, id: string): Promise<boolean> {
  const query = 'DELETE FROM contacts WHERE id = ?';
  const db = getDb(env);
  if (db) {
    await db.prepare(query).bind(id).run();
  } else {
    const localDb = await getLocalSqliteDb();
    localDb.prepare(query).run(id);
  }
  return true;
}
