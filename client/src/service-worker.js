import { cacheNames, clientsClaim } from "workbox-core";
import { setCatchHandler, setDefaultHandler } from "workbox-routing";
import { NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";
import { registerRoute } from "workbox-routing/registerRoute";

/**
 * @typedef {import("workbox-core").CacheNames} CacheNames
 * @typedef {import("workbox-core").ClientsClaim} ClientsClaim
 * @typedef {import("workbox-routing").SetCatchHandler} SetCatchHandler
 * @typedef {import("workbox-routing").SetDefaultHandler} SetDefaultHandler
 * @typedef {import("workbox-strategies").NetworkFirst} NetworkFirst
 * @typedef {import("workbox-strategies").StaleWhileRevalidate} StaleWhileRevalidate
 * @typedef {import("workbox-routing/registerRoute").RegisterRoute} RegisterRoute
 * @typedef {import("workbox-routing/registerRoute").RouteHandlerCallback} RouteHandlerCallback
 * @typedef {import("workbox-routing/registerRoute").RouteMatchCallback} RouteMatchCallback
 */

/** @type {ServiceWorkerGlobalScope} */
let self;

/** @type {CacheNames} */
const cacheName = cacheNames.runtime;

/** @type {RequestInfo[]} */
const manifestURLs = self.__WB_MANIFEST.map((entry) => new Request(entry.url));

self.addEventListener("install", (event) => {
  /**
   * @param {ExtendableEvent} event
   */
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(manifestURLs);
    })
  );
});

// self.addEventListener("activate", (event) => {
//   /**
//    * @param {ExtendableEvent} event
//    */
//   event.waitUntil(
//     caches.open(cacheName).then((cache) => {
//       return cache.keys().then((keys) => {
//         return Promise.all(
//           keys.map((key) => {
//             if (!manifestURLs.includes(key)) {
//               return cache.delete(key);
//             }
//           })
//         );
//       });
//     })
//   );

//   clientsClaim();
// });

// Handle push subscription
self.addEventListener("pushsubscriptionchange", (event) => {
  console.log("Push Subscription has been changed!");
  // You can send the updated subscription to the server here if needed
});

// Handle push notifications
self.addEventListener("push", (event) => {
  const payload = { title: "Default title", body: "Default body" };

  const options = {
    body: payload.body,
    icon: "icon.png", // Path to an icon image
    badge: "badge.png", // Path to a badge image
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

// Subscribe to push notifications
self.addEventListener("activate", (event) => {});

// Register route for handling push messages
registerRoute(
  /**
   * @param {{ request: Request }} param0
   */
  ({ request }) => request.destination === "push",
  new StaleWhileRevalidate()
);

// Fallback to app-shell for document request
setDefaultHandler(new NetworkFirst());

setCatchHandler(({ event }) => {
  if (event.request.destination === "document") {
    return caches.match(new Request("index.html"));
  }

  return Response.error();
});
