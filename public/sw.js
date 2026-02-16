/* Intentionally empty service worker placeholder.
 * Prevents 404 noise from stale service worker registrations.
 */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

