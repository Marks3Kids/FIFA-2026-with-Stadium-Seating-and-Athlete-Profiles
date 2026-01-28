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
}

createRoot(document.getElementById("root")!).render(<App />);
