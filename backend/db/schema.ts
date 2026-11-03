import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const quotes = sqliteTable('quotes', {
 id: text('id').primaryKey(), createdAt: integer('created_at').notNull(),
 name: text('name').notNull(), phone: text('phone').notNull(), email: text('email').notNull(),
 service: text('service').notNull(), city: text('city').notNull(), details: text('details').notNull(),
 status: text('status').notNull().default('New'), notes: text('notes').notNull().default(''),
 ipHash: text('ip_hash').notNull(),
}, t=>[index('quotes_created_idx').on(t.createdAt),index('quotes_ip_idx').on(t.ipHash,t.createdAt)]);
export const loginCodes = sqliteTable('login_codes', { codeHash:text('code_hash').primaryKey(), challenge:text('challenge').notNull(), expires:integer('expires').notNull() });
export const adminSessions = sqliteTable('admin_sessions', { tokenHash:text('token_hash').primaryKey(), expires:integer('expires').notNull() });
