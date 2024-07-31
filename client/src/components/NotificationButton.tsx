import React, { useEffect } from "react";

const NotificationButton: React.FC = () => {
  const handleSubscribe = async () => {
    try {
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        throw new Error("Permission not granted for Notification");
      }
      alert("Subscribed to notifications!");
    } catch (error) {
      console.error("Error subscribing to notifications:", error);
      alert("Failed to subscribe to notifications");
    }
  };

  return <button onClick={handleSubscribe}>Enable Notifications</button>;
};

export default NotificationButton;
