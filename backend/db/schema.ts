import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const quotes = sqliteTable('quotes', {
 id: text('id').primaryKey(), reference: text('reference').unique(), createdAt: integer('created_at').notNull(),
 name: text('name').notNull(), phone: text('phone').notNull(), email: text('email').notNull(),
 service: text('service').notNull(), city: text('city').notNull(), details: text('details').notNull(),
 status: text('status').notNull().default('New'), notes: text('notes').notNull().default(''),
 ipHash: text('ip_hash').notNull(), workflow:text('workflow').notNull().default('{}'), version:integer('version').notNull().default(0),
 extra: text('extra').notNull().default('{}'), photos: text('photos').notNull().default('[]'),
}, t=>[index('quotes_created_idx').on(t.createdAt),index('quotes_ip_idx').on(t.ipHash,t.createdAt)]);
export const loginCodes = sqliteTable('login_codes', { codeHash:text('code_hash').primaryKey(), challenge:text('challenge').notNull(), expires:integer('expires').notNull() });
export const adminSessions = sqliteTable('admin_sessions', { tokenHash:text('token_hash').primaryKey(), expires:integer('expires').notNull() });
export const mediaFiles=sqliteTable('media_files',{id:text('id').primaryKey(),name:text('name').notNull(),mime:text('mime').notNull(),size:integer('size').notNull(),created:integer('created').notNull()});
export const heroSettings=sqliteTable('hero_settings',{id:text('id').primaryKey(),payload:text('payload').notNull(),version:integer('version').notNull()});

export const siteSettings=sqliteTable('site_settings',{id:text('id').primaryKey(),payload:text('payload').notNull(),version:integer('version').notNull()});

export const quoteCounters=sqliteTable('quote_counters',{day:text('day').primaryKey(),sequence:integer('sequence').notNull()});
export const quoteUploads=sqliteTable('quote_uploads',{id:text('id').primaryKey(),quoteId:text('quote_id').notNull(),tokenHash:text('token_hash').notNull(),uploadId:text('upload_id').notNull(),name:text('name').notNull(),mime:text('mime').notNull(),size:integer('size').notNull(),created:integer('created').notNull(),ipHash:text('ip_hash').notNull(),state:text('state').notNull().default('uploading')},t=>[index('quote_uploads_ip_idx').on(t.ipHash,t.created)]);
export const quoteEvents=sqliteTable('quote_events',{id:text('id').primaryKey(),quoteId:text('quote_id').notNull(),created:integer('created').notNull(),status:text('status').notNull()},t=>[index('quote_events_quote_idx').on(t.quoteId,t.created)]);
export const quoteMessages=sqliteTable('quote_messages',{id:text('id').primaryKey(),quoteId:text('quote_id').notNull(),created:integer('created').notNull(),author:text('author').notNull(),body:text('body').notNull()},t=>[index('quote_messages_quote_idx').on(t.quoteId,t.created)]);
export const quoteNotifications=sqliteTable('quote_notifications',{quoteId:text('quote_id').primaryKey(),created:integer('created').notNull(),state:text('state').notNull(),error:text('error').notNull().default('')});
export const jobPhotos=sqliteTable('job_photos',{id:text('id').primaryKey(),quoteId:text('quote_id').notNull(),stage:text('stage').notNull(),name:text('name').notNull(),mime:text('mime').notNull(),created:integer('created').notNull()},t=>[index('job_photos_quote_idx').on(t.quoteId)]);
