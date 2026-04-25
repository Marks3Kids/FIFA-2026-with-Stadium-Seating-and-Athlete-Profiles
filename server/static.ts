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

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist (but not for API routes)
  app.use("*", (req, res, next) => {
    // Skip API routes - they should already be handled by registered routes
    if (req.originalUrl.startsWith("/api")) {
      return next();
    }
    // /restore-access has its own Express handler registered before serveStatic.
    // This guard is belt-and-suspenders: it should never be reached, but if it
    // somehow is, pass through so the registered route can respond.
    if (req.originalUrl.startsWith("/restore-access")) {
      return next();
    }
    // Never cache the HTML shell — always serve fresh so PWA updates propagate
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
