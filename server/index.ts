import express, { type Request, Response, NextFunction } from "express";
import { serveStatic } from "./static";
import { createServer } from "http";
// Note: registerRoutes is dynamically imported after server starts to avoid blocking

const app = express();
const httpServer = createServer(app);

// Health check endpoint - responds immediately without any processing
// Must be registered FIRST before any other middleware
app.get("/_health", (_req, res) => {
  res.status(200).send("ok");
});

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

let stripeEnabled = false;

// Stripe initialization runs in background - doesn't block server startup
function initStripeBackground() {
  // Delay Stripe init by 5 seconds to let health checks pass first
  setTimeout(async () => {
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

      console.log('Syncing Stripe data...');
      stripeSync.syncBackfill()
        .then(() => console.log('Stripe data synced'))
        .catch((err: any) => console.error('Error syncing Stripe data:', err));
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
    }
  }, 5000);
}

app.post(
  '/api/stripe/webhook/:uuid',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
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

// In production, serve static files immediately (before routes are fully registered)
// This allows the "/" health check to pass while routes initialize in background
if (process.env.NODE_ENV === "production") {
  serveStatic(app);
}

// ALWAYS serve the app on the port specified in the environment variable PORT
// Start listening FIRST so health checks pass immediately
const port = parseInt(process.env.PORT || "5000", 10);
httpServer.listen(
  {
    port,
    host: "0.0.0.0",
    reusePort: true,
  },
  () => {
    log(`serving on port ${port}`);
    
    // Now register routes and start background initialization
    (async () => {
      try {
        // In development, set up Vite before routes
        if (process.env.NODE_ENV !== "production") {
          const { setupVite } = await import("./vite");
          await setupVite(httpServer, app);
        }
        
        // Register API routes (dynamically imported to avoid blocking startup)
        const { registerRoutes } = await import("./routes");
        await registerRoutes(httpServer, app);
        log("Routes registered successfully");
        
        // Start Stripe initialization in background
        initStripeBackground();
      } catch (error) {
        console.error("Error during initialization:", error);
      }
    })();
  },
);
