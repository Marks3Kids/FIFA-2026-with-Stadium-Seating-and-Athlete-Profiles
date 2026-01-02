import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

// Track initialization state
let appInitialized = false;

// Health check endpoints - respond immediately without any processing
// The "/" route shows a loading page during startup, before static files are ready
app.get("/", (req, res, next) => {
  if (!appInitialized) {
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Championship Concierge</title>
          <meta http-equiv="refresh" content="1">
          <style>
            body { 
              background: #0f172a; 
              color: #10b981; 
              font-family: system-ui, sans-serif;
              display: flex; 
              align-items: center; 
              justify-content: center; 
              height: 100vh; 
              margin: 0;
            }
            .loader { text-align: center; }
            .spinner { 
              width: 40px; 
              height: 40px; 
              border: 3px solid #1e293b; 
              border-top: 3px solid #10b981; 
              border-radius: 50%; 
              animation: spin 1s linear infinite; 
              margin: 0 auto 16px;
            }
            @keyframes spin { to { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <div class="loader">
            <div class="spinner"></div>
            <div>Loading Championship Concierge...</div>
          </div>
        </body>
      </html>
    `);
  } else {
    next(); // Pass to static file serving after initialization
  }
});
app.get("/_health", (_req, res) => {
  res.status(200).send("ok");
});

// Start listening IMMEDIATELY - don't wait for any other setup
const port = parseInt(process.env.PORT || "5000", 10);
httpServer.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
  console.log(`Server listening on port ${port}`);
  
  // All other initialization happens AFTER listen
  initializeApp();
});

async function initializeApp() {
  console.log(`Initializing app in ${process.env.NODE_ENV} mode...`);
  try {
    // Register API routes FIRST so they take priority over Vite/static files
    console.log("Registering API routes...");
    const { registerRoutes } = await import("./routes");
    await registerRoutes(httpServer, app);
    console.log("Routes registered successfully");
    
    // In development, set up Vite AFTER API routes (it handles HMR for frontend)
    if (process.env.NODE_ENV !== "production") {
      console.log("Setting up Vite...");
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    }
    
    // In production, serve static files AFTER routes are registered
    if (process.env.NODE_ENV === "production") {
      console.log("Setting up static file serving...");
      const { serveStatic } = await import("./static");
      serveStatic(app);
      console.log("Static files configured");
    }
    
    appInitialized = true;
    console.log("App initialization complete");
  } catch (error) {
    console.error("Error during initialization:", error);
  }
}

// Note: serveStatic is dynamically imported after server starts

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

let stripeEnabled = false;

// Stripe initialization - runs lazily on first Stripe-related request
let stripeInitPromise: Promise<void> | null = null;

async function ensureStripeInitialized() {
  if (stripeEnabled) return;
  if (stripeInitPromise) return stripeInitPromise;
  
  stripeInitPromise = (async () => {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.log('DATABASE_URL not set, skipping Stripe initialization');
      return;
    }

    const hasStripeConnector = process.env.REPLIT_CONNECTORS_HOSTNAME && 
      (process.env.REPL_IDENTITY || process.env.WEB_REPL_RENEWAL);

    if (!hasStripeConnector) {
      console.log('Stripe connector not configured, skipping Stripe initialization');
      return;
    }

    try {
      console.log('Initializing Stripe schema...');
      const { runMigrations } = await import('stripe-replit-sync');
      await runMigrations({ databaseUrl });
      console.log('Stripe schema ready');

      const { getStripeSync } = await import("./stripeClient");
      const stripeSync = await getStripeSync();

      console.log('Setting up managed webhook...');
      const webhookBaseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;
      const { webhook } = await stripeSync.findOrCreateManagedWebhook(
        `${webhookBaseUrl}/api/stripe/webhook`,
        { enabled_events: ['*'], description: 'Managed webhook for Stripe sync' }
      );
      console.log(`Webhook configured: ${webhook.url}`);

      stripeEnabled = true;

      // Sync in background - don't await
      console.log('Starting Stripe data sync in background...');
      stripeSync.syncBackfill()
        .then(() => console.log('Stripe data synced'))
        .catch((err: any) => console.error('Error syncing Stripe data:', err));
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
    }
  })();
  
  return stripeInitPromise;
}

app.post(
  '/api/stripe/webhook/:uuid',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    // Initialize Stripe lazily on first webhook
    await ensureStripeInitialized();
    if (!stripeEnabled) {
      return res.status(503).json({ error: 'Stripe not configured' });
    }
    
    const signature = req.headers['stripe-signature'];
    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe-signature' });
    }

    try {
      const sig = Array.isArray(signature) ? signature[0] : signature;
      if (!Buffer.isBuffer(req.body)) {
        console.error('Webhook body is not a Buffer');
        return res.status(500).json({ error: 'Webhook processing error' });
      }

      const { uuid } = req.params;
      const { WebhookHandlers } = await import("./webhookHandlers");
      await WebhookHandlers.processWebhook(req.body as Buffer, sig, uuid);
      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error.message);
      res.status(400).json({ error: 'Webhook processing error' });
    }
  }
);

app.get('/api/stripe/publishable-key', async (_req, res) => {
  // Initialize Stripe lazily on first key request
  await ensureStripeInitialized();
  if (!stripeEnabled) {
    return res.status(503).json({ error: 'Stripe not configured', publishableKey: null });
  }
  
  try {
    const { getStripePublishableKey } = await import("./stripeClient");
    const publishableKey = await getStripePublishableKey();
    res.json({ publishableKey });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get publishable key' });
  }
});

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// Serve static files from public directory (for downloadable bracket PDF)
import path from "path";
app.use('/downloads', express.static(path.join(process.cwd(), 'public')));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  throw err;
});

// Old startup code removed - now handled by initializeApp() above
