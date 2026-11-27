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
  const pathname = path && new URL(path, self.location.origin).pathname;

  event.waitUntil(
    self.clients
      .matchAll({ includeUncontrolled: true, type: "window" })
      .then((windows) => {
        const target = windows.find(
          (window) => !pathname || new URL(window.url).pathname === pathname,
        );

        if (target) return target.focus();
        if (path) return self.clients.openWindow(path);
      }),
  );
});
