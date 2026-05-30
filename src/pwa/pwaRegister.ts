/**
 * PWA Service Worker Registration
 * Handles registration and updates of the service worker
 */

export async function registerServiceWorker(): Promise<void> {
  if (!("serviceWorker" in navigator)) {
    console.log("Service Workers are not supported in this browser");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });

    console.log("Service Worker registered successfully:", registration);

    // Check for updates periodically
    setInterval(() => {
      registration.update();
    }, 60 * 1000); // Check every minute

    // Handle updates
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;

      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            // New service worker available, show update prompt
            console.log("New version available! Please refresh to update.");
            // You can show a toast/notification here
          }
        });
      }
    });
  } catch (error) {
    console.error("Service Worker registration failed:", error);
  }
}

/**
 * Unregister all service workers (useful for cleanup)
 */
export async function unregisterServiceWorkers(): Promise<void> {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();

    for (const registration of registrations) {
      await registration.unregister();
    }

    console.log("All Service Workers unregistered");
  } catch (error) {
    console.error("Error unregistering Service Workers:", error);
  }
}
