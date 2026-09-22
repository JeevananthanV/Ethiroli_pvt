// Ethiroli SaaS - Background Web Push Service Worker (Firebase / Standard Push API)

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle incoming background push notifications
self.addEventListener('push', (event) => {
  let notificationData = {
    title: 'Ethiroli Notification',
    body: 'You have a new update in Ethiroli.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    url: '/app'
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      notificationData = {
        title: parsed.title || parsed.notification?.title || notificationData.title,
        body: parsed.body || parsed.notification?.body || notificationData.body,
        icon: parsed.icon || parsed.notification?.icon || notificationData.icon,
        badge: parsed.badge || notificationData.badge,
        url: parsed.url || parsed.data?.url || notificationData.url,
        data: parsed.data || {}
      };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      data: { url: notificationData.url }
    })
  );
});

// Handle clicking on notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/app';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
