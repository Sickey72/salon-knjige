import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Authors table - писци/аутори књига
 */
export const authors = mysqlTable("authors", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 255 }),
  lastName: varchar("lastName", { length: 255 }),
  fullName: varchar("fullName", { length: 512 }).notNull(), // Пуно име за приказ
  photoUrl: text("photoUrl"), // URL фотографије аутора
  biography: text("biography"), // Биографија аутора
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Author = typeof authors.$inferSelect;
export type InsertAuthor = typeof authors.$inferInsert;

/**
 * Editions table - едиције/библиотеке
 */
export const editions = mysqlTable("editions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"), // Кратак опис едиције
  logoUrl: text("logoUrl"), // URL лого едиције
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Edition = typeof editions.$inferSelect;
export type InsertEdition = typeof editions.$inferInsert;

/**
 * Books table - књиге
 */
export const books = mysqlTable("books", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 512 }).notNull(),
  subtitle: varchar("subtitle", { length: 512 }), // Поднаслов
  authorId: int("authorId").references(() => authors.id),
  editionId: int("editionId").references(() => editions.id),
  quantity: int("quantity").default(0).notNull(), // Количина на стању
  price: int("price"), // Цена у динарима (може бити празно)
  isbn: varchar("isbn", { length: 64 }), // ISBN број
  description: text("description"), // Опис/извод из рецензије
  coverImageUrl: text("coverImageUrl"), // URL слике корице
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Book = typeof books.$inferSelect;
export type InsertBook = typeof books.$inferInsert;

/**
 * Tags table - тагови за категоризацију књига
 */
export const tags = mysqlTable("tags", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(), // URL-friendly назив
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Tag = typeof tags.$inferSelect;
export type InsertTag = typeof tags.$inferInsert;

/**
 * Book-Tag junction table - релација књига-тагови (many-to-many)
 */
export const bookTags = mysqlTable("bookTags", {
  id: int("id").autoincrement().primaryKey(),
  bookId: int("bookId").notNull().references(() => books.id, { onDelete: "cascade" }),
  tagId: int("tagId").notNull().references(() => tags.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BookTag = typeof bookTags.$inferSelect;
export type InsertBookTag = typeof bookTags.$inferInsert;

/**
 * Relations
 */
export const authorsRelations = relations(authors, ({ many }) => ({
  books: many(books),
}));

export const editionsRelations = relations(editions, ({ many }) => ({
  books: many(books),
}));

export const booksRelations = relations(books, ({ one, many }) => ({
  author: one(authors, {
    fields: [books.authorId],
    references: [authors.id],
  }),
  edition: one(editions, {
    fields: [books.editionId],
    references: [editions.id],
  }),
  bookTags: many(bookTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  bookTags: many(bookTags),
}));

export const bookTagsRelations = relations(bookTags, ({ one }) => ({
  book: one(books, {
    fields: [bookTags.bookId],
    references: [books.id],
  }),
  tag: one(tags, {
    fields: [bookTags.tagId],
    references: [tags.id],
  }),
}));
