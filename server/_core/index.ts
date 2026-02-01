import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";


function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  
  // Import endpoint
  app.post("/api/import-books", async (req, res) => {
    try {
      const { books, adminKey } = req.body;
      const ADMIN_KEY = process.env.ADMIN_IMPORT_KEY || "salon-knjige-admin-2026";
      
      if (!adminKey || adminKey !== ADMIN_KEY) {
        return res.status(401).json({ error: "Invalid admin key" });
      }
      
      if (!Array.isArray(books)) {
        return res.status(400).json({ error: "Books must be an array" });
      }
      
      const { importBooksFromExcel } = await import("../db");
      const result = await importBooksFromExcel(books);
      
      res.json(result);
    } catch (error) {
      console.error("Import error:", error);
      res.status(500).json({ error: String(error) });
    }
  });
  
  // Import endpoint sa ispravnom strukturom (bez autentifikacije za sada)
  app.post("/api/import-books-fixed", async (req, res) => {
    try {
      const books = req.body;
      
      if (!Array.isArray(books)) {
        return res.status(400).json({ error: "Books must be an array" });
      }
      
      const { importBooksFixed } = await import("../db");
      const result = await importBooksFixed(books);
      
      res.json(result);
    } catch (error) {
      console.error("Import error:", error);
      res.status(500).json({ error: String(error) });
    }
  });
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
