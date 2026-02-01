import { eq, gt, sql, and, or, like, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users, books, authors, editions, tags, bookTags } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL);
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflict(
      (t) => ({
        target: t.openId,
        do: db.update(users).set(updateSet),
      })
    );
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// BOOKS QUERIES
// ============================================================================

/**
 * Преузми све књиге са количином > 5 (за јавни приказ)
 */
export async function getPublicBooks(filters?: {
  editionId?: number;
  tagId?: number;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  let query = db
    .select({
      book: books,
      author: authors,
      edition: editions,
    })
    .from(books)
    .leftJoin(authors, eq(books.authorId, authors.id))
    .leftJoin(editions, eq(books.editionId, editions.id))
    .where(gt(books.quantity, 5));

  // Примени филтере
  const conditions = [gt(books.quantity, 5)];
  
  if (filters?.editionId) {
    conditions.push(eq(books.editionId, filters.editionId));
  }
  
  if (filters?.search) {
    const searchTerm = `%${filters.search}%`;
    conditions.push(
      or(
        like(books.title, searchTerm),
        like(authors.fullName, searchTerm)
      )!
    );
  }
  
  if (filters?.tagId) {
    // За филтрирање по тагу, морамо да користимо subquery
    const booksWithTag = db
      .select({ bookId: bookTags.bookId })
      .from(bookTags)
      .where(eq(bookTags.tagId, filters.tagId));
    
    // TODO: Implement proper subquery filtering
  }

  const result = await db
    .select({
      book: books,
      author: authors,
      edition: editions,
    })
    .from(books)
    .leftJoin(authors, eq(books.authorId, authors.id))
    .leftJoin(editions, eq(books.editionId, editions.id))
    .where(and(...conditions))
    .orderBy(desc(books.createdAt))
    .limit(filters?.limit || 50)
    .offset(filters?.offset || 0);

  return result;
}

/**
 * Преузми све књиге (за админ панел)
 */
export async function getAllBooks() {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({
      book: books,
      author: authors,
      edition: editions,
    })
    .from(books)
    .leftJoin(authors, eq(books.authorId, authors.id))
    .leftJoin(editions, eq(books.editionId, editions.id))
    .orderBy(desc(books.createdAt));

  return result;
}

/**
 * Преузми књигу по ID-у
 */
export async function getBookById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select({
      book: books,
      author: authors,
      edition: editions,
    })
    .from(books)
    .leftJoin(authors, eq(books.authorId, authors.id))
    .leftJoin(editions, eq(books.editionId, editions.id))
    .where(eq(books.id, id))
    .limit(1);

  if (result.length === 0) return null;

  // Преузми тагове за ову књигу
  const bookTagsResult = await db
    .select({
      tag: tags,
    })
    .from(bookTags)
    .leftJoin(tags, eq(bookTags.tagId, tags.id))
    .where(eq(bookTags.bookId, id));

  return {
    ...result[0],
    tags: bookTagsResult.map(r => r.tag).filter(Boolean),
  };
}

// ============================================================================
// AUTHORS QUERIES
// ============================================================================

export async function getAllAuthors() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(authors).orderBy(authors.fullName);
}

export async function getAuthorById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(authors).where(eq(authors.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// ============================================================================
// EDITIONS QUERIES
// ============================================================================

export async function getAllEditions() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(editions).orderBy(editions.name);
}

export async function getEditionById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(editions).where(eq(editions.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// ============================================================================
// TAGS QUERIES
// ============================================================================

export async function getAllTags() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(tags).orderBy(tags.name);
}
