import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============================================================================
  // BOOKS ROUTER
  // ============================================================================
  books: router({
    // Јавни приказ књига (количина > 5)
    getPublic: publicProcedure
      .input(z.object({
        editionId: z.number().optional(),
        tagId: z.number().optional(),
        search: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getPublicBooks(input);
      }),

    // Све књиге (за админ)
    getAll: protectedProcedure.query(async () => {
      return await db.getAllBooks();
    }),

    // Књига по ID-у
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getBookById(input.id);
      }),
  }),

  // ============================================================================
  // AUTHORS ROUTER
  // ============================================================================
  authors: router({
    getAll: publicProcedure.query(async () => {
      return await db.getAllAuthors();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getAuthorById(input.id);
      }),
  }),

  // ============================================================================
  // EDITIONS ROUTER
  // ============================================================================
  editions: router({
    getAll: publicProcedure.query(async () => {
      return await db.getAllEditions();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getEditionById(input.id);
      }),
  }),

  // ============================================================================
  // TAGS ROUTER
  // ============================================================================
  tags: router({
    getAll: publicProcedure.query(async () => {
      return await db.getAllTags();
    }),
  }),
});

export type AppRouter = typeof appRouter;
