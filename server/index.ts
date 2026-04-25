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

// ── Server-side Restore Access page ──────────────────────────────────────────
// Registered here (before initializeApp / Vite / static catch-all) so it is
// ALWAYS reachable regardless of initialization state or service-worker caching.
// Pure HTML + inline JS — zero dependency on the React bundle.
app.get("/restore-access", (_req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Restore Access — Championship Concierge</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#0a0f0a;color:#fff;font-family:system-ui,-apple-system,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:16px}
    .card{background:#111;border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:36px 28px;max-width:420px;width:100%;text-align:center}
    .logo{font-size:13px;font-weight:700;letter-spacing:.06em;color:#22c55e;margin-bottom:28px;display:flex;align-items:center;justify-content:center;gap:8px}
    h1{font-size:22px;font-weight:800;margin-bottom:8px}
    p{font-size:14px;color:#888;margin-bottom:24px;line-height:1.5}
    input{width:100%;background:#0a0f0a;border:1px solid rgba(255,255,255,.2);border-radius:10px;padding:14px 16px;color:#fff;font-size:15px;outline:none;margin-bottom:12px;transition:border-color .2s}
    input:focus{border-color:#22c55e}
    button{width:100%;background:#22c55e;color:#000;font-weight:800;font-size:15px;padding:14px;border:none;border-radius:10px;cursor:pointer;transition:opacity .2s}
    button:disabled{opacity:.5;cursor:default}
    .err{color:#f87171;font-size:13px;margin-bottom:12px;line-height:1.5;text-align:left}
    .ok{color:#22c55e;font-size:14px;font-weight:600;margin-top:8px}
    .help{font-size:12px;color:#555;margin-top:20px}
    .help a{color:#22c55e;text-decoration:none}
    .back{display:inline-block;margin-top:18px;font-size:13px;color:#555;text-decoration:none}
    .back:hover{color:#aaa}
    .spinner{display:inline-block;width:16px;height:16px;border:2px solid rgba(0,0,0,.3);border-top-color:#000;border-radius:50%;animation:spin .7s linear infinite;vertical-align:middle;margin-right:6px}
    @keyframes spin{to{transform:rotate(360deg)}}
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">&#9917; CHAMPIONSHIP CONCIERGE 2026</div>
    <h1>Restore Your Access</h1>
    <p>Enter the email you used when you purchased. We'll look it up and unlock your content immediately.</p>
    <input type="email" id="email" placeholder="your@email.com" autocomplete="email" autofocus />
    <div id="err" class="err" style="display:none"></div>
    <button id="btn" onclick="restore()">Restore Access</button>
    <div id="ok" class="ok" style="display:none">&#10003; Purchase found! Redirecting you now&hellip;</div>
    <p class="help">Problems? Email <a href="mailto:support@championshipconcierge.com">support@championshipconcierge.com</a></p>
    <a class="back" href="/">&larr; Back to home</a>
  </div>
  <script>
    async function restore() {
      var email = document.getElementById('email').value.trim().toLowerCase();
      var errEl = document.getElementById('err');
      var okEl = document.getElementById('ok');
      var btn = document.getElementById('btn');
      errEl.style.display = 'none';
      okEl.style.display = 'none';
      if (!email || !email.includes('@')) {
        errEl.textContent = 'Please enter a valid email address.';
        errEl.style.display = 'block';
        return;
      }
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span>Checking\u2026';
      try {
        var res = await fetch('/api/subscription/verify?email=' + encodeURIComponent(email) + '&t=' + Date.now());
        var data = await res.json();
        if (data.valid && data.tier && data.tier !== 'free') {
          localStorage.setItem('championship_email', email);
          localStorage.setItem('championship_tier', data.tier);
          okEl.style.display = 'block';
          btn.style.display = 'none';
          if ('serviceWorker' in navigator) {
            var regs = await navigator.serviceWorker.getRegistrations();
            await Promise.all(regs.map(function(r){ return r.unregister(); }));
          }
          setTimeout(function(){ window.location.replace('/home'); }, 800);
        } else {
          errEl.textContent = 'No paid purchase found for this email. Please double-check the address you used at checkout, or contact support@championshipconcierge.com';
          errEl.style.display = 'block';
          btn.disabled = false;
          btn.textContent = 'Try Again';
        }
      } catch(e) {
        errEl.textContent = 'Connection error. Please check your internet and try again.';
        errEl.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Try Again';
      }
    }
    document.getElementById('email').addEventListener('keydown', function(e){ if(e.key==='Enter') restore(); });
  </script>
</body>
</html>`);
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
  express.raw({ type: '*/*' }),
  async (req, res) => {
    try {
      // Initialize Stripe lazily on first webhook
      await ensureStripeInitialized();
      if (!stripeEnabled) {
        console.log('Webhook received but Stripe not yet initialized — returning 200 to avoid retry storm');
        return res.status(200).json({ received: true });
      }
      
      const signature = req.headers['stripe-signature'];
      if (!signature) {
        return res.status(400).json({ error: 'Missing stripe-signature' });
      }

      const sig = Array.isArray(signature) ? signature[0] : signature;

      // Ensure body is a Buffer — if not, convert it
      let payload: Buffer;
      if (Buffer.isBuffer(req.body)) {
        payload = req.body;
      } else if (typeof req.body === 'string') {
        payload = Buffer.from(req.body);
      } else {
        payload = Buffer.from(JSON.stringify(req.body));
      }

      const { uuid } = req.params;
      const { WebhookHandlers } = await import("./webhookHandlers");
      await WebhookHandlers.processWebhook(payload, sig, uuid);
      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error.message);
      // Return 400 only for genuine signature failures, not processing issues
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
