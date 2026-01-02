import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// In development, unregister any existing service workers to prevent caching issues
// In production, register the PWA service worker
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
  // Only register service worker in production
  import('virtual:pwa-register').then(({ registerSW }) => {
    const updateSW = registerSW({
      onNeedRefresh() {
        if (confirm('A new version of Championship Concierge is available. Refresh now?')) {
          updateSW(true);
        }
      },
      onOfflineReady() {
        console.log('App ready to work offline');
      },
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
