export async function sendPushNotification({
  expoPushToken,
  title,
  body,
  data,
}: {
  expoPushToken: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}) {
  if (!expoPushToken.startsWith("ExponentPushToken")) {
    console.error("Invalid Expo push token:", expoPushToken);
    return;
  }

  const message = {
    to: expoPushToken,
    sound: "default",
    title,
    body,
    data: data ?? {},
  };

  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  const result = await response.json();

  console.log("Push notification result:", result);

  return result;
}
