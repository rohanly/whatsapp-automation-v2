import API from ".";

export const subscribeToPushNotification = async (
  subscription: PushSubscription
) => {
  const resp = await API.post("/api/push_notifications/subscribe", {
    subscription,
  });
  return resp.data;
};
