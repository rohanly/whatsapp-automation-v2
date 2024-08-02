import { subscribeToPushNotification } from "@/api/notifications.service";
import { urlBase64ToUint8Array } from "@/utils";
import React, { useState } from "react";

const CheckSubscription: React.FC = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("");

  const subscribeUser = async (registration: ServiceWorkerRegistration) => {
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY
        ),
      });
      setSubscriptionStatus("User has been subscribed.");
      console.log("Subscription object:", subscription);
      // Send the subscription to the server if needed
      subscribeToPushNotification(subscription);
    } catch (error) {
      console.error("Error during subscription", error);
      setSubscriptionStatus("Error during subscription.");
    }
  };

  const checkSubscription = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
          setSubscriptionStatus("User is subscribed.");
          console.log("Subscription object:", subscription);
        } else {
          await subscribeUser(registration);
        }
      } catch (error) {
        console.error("Error during getSubscription()", error);
        setSubscriptionStatus("Error checking subscription.");
      }
    } else {
      setSubscriptionStatus("Push messaging is not supported in your browser.");
    }
  };

  return (
    <div>
      <button onClick={checkSubscription}>Check Subscription</button>
      <p>{subscriptionStatus}</p>
    </div>
  );
};

export default CheckSubscription;
