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
  const payload = event.data.json();

  event.waitUntil(
    self.registration.showNotification("Your App Name", {
      body: payload.message,
    })
  );
});

// Subscribe to push notifications
self.addEventListener("activate", (event) => {
  console.log("ACTIVATE");

  /**
   * @param {ExtendableEvent} event
   */
  event.waitUntil(
    self.registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
      })
      .then((subscription) => {
        console.log("Push subscription successful:", subscription);
        // Send the subscription to the server if needed
        sendSubscriptionToServer(subscription);
      })
      .catch((error) => {
        console.error("Error subscribing to push notifications:", error);
      })
  );
});

/**
 * @param {any} subscription
 */
const sendSubscriptionToServer = async (subscription) => {
  // Send the subscription details to your server using a fetch or other method
  try {
    const resp = await fetch("/api/push_notifications/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subscription }),
    });
    console.log(resp);
  } catch (err) {
    console.log(err);
  }
};

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

/**
 * @param {string} base64String
 * @returns {Uint8Array}
 */
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  const buffer = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    buffer[i] = rawData.charCodeAt(i);
  }

  return buffer;
}

/** @type {Uint8Array} */
const applicationServerKey = urlBase64ToUint8Array(
  "BKV5YbAjaj4F6NTeJ3dm3oTMYoaLCOPn2OzaQP0zmr98uvKCij4R0hZwBHIeW-3_nz3DdLfWcke_Oyjqb5-lRYg"
);
