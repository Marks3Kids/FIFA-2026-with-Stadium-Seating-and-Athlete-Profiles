import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// In development, unregister any existing service workers to prevent caching issues
// In production, register the PWA service worker (only for web, not Capacitor/iOS builds)
if (import.meta.env.DEV) {
  // Clear any stale service workers in development
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
        console.log('Service worker unregistered for development');
      });
    });
  }
} else {
  // Production: force reload when a new service worker takes control so users
  // always get fresh JS bundles rather than stale cached versions.
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[SW] New service worker active — reloading for fresh assets.');
      window.location.reload();
    });

    // If there is already a waiting SW (installed but not yet active),
    // tell it to skip waiting immediately so the controllerchange fires.
    navigator.serviceWorker.ready.then(registration => {
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      // Also watch for future updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New SW installed and old one still in control → skip waiting
            newWorker.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      });
    });
  }
}

createRoot(document.getElementById("root")!).render(<App />);
