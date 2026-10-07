// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const leads=sqliteTable('leads',{id:text('id').primaryKey(),payload:text('payload').notNull(),createdAt:integer('created_at').notNull(),simulated:integer('simulated').notNull()});
export const feedback=sqliteTable('feedback',{id:text('id').primaryKey(),userId:text('user_id').notNull(),area:text('area').notNull(),message:text('message').notNull(),createdAt:integer('created_at').notNull()});

export const catalogState=sqliteTable('cc_state',{id:text('id').primaryKey(),payload:text('payload').notNull(),revision:integer('revision').notNull().default(1)});
export const adminSessions=sqliteTable('cc_sessions',{id:text('id').primaryKey(),expires:integer('expires').notNull()});
export const adminAttempts=sqliteTable('cc_attempts',{id:text('id').primaryKey(),attempts:integer('attempts').notNull(),since:integer('since').notNull()});
export const catalogBackups=sqliteTable('cc_backups',{id:text('id').primaryKey(),payload:text('payload').notNull(),created:integer('created').notNull()});
export const catalogContacts=sqliteTable('cc_contacts',{id:text('id').primaryKey(),payload:text('payload').notNull(),html:text('html').notNull(),status:text('status').notNull(),created:integer('created').notNull()});
