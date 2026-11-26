// https://nextjs.org/docs/app/guides/progressive-web-apps#5-creating-a-service-worker
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const { body, path, title } = event.data.json();

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      data: { path },
      icon: "/icon-192x192.png",
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const path = event.notification.data?.path;
  const url = path && new URL(path, self.location.origin).href;

  event.waitUntil(
    self.clients
      .matchAll({ includeUncontrolled: true, type: "window" })
      .then((windows) => {
        const target = windows.find((window) => !url || window.url === url);

        if (target) return target.focus();
        if (url) return self.clients.openWindow(url);
      }),
  );
});
