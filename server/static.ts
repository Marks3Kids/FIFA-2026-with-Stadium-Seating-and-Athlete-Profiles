import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Fast root endpoint for health checks - returns 200 immediately
  // Serves minimal HTML that loads the SPA via JavaScript
  // Pre-read index.html once at startup for faster serving
  const indexPath = path.resolve(distPath, "index.html");
  const indexHtml = fs.readFileSync(indexPath, 'utf-8');
  
  app.get("/", (_req, res) => {
    // Serve the pre-cached index.html - no disk I/O on each request
    res.status(200).type('html').send(indexHtml);
  });

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist (but not for API routes)
  app.use("*", (req, res, next) => {
    // Don't intercept API routes - let them 404 properly
    if (req.originalUrl.startsWith("/api")) {
      return res.status(404).json({ error: "API endpoint not found" });
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
