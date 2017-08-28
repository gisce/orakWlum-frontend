/*
'use strict';

// Register a listener for push events!
self.addEventListener('push', (event) => {
    console.log("new pushh!", event);

    var title = 'A new message!';
    var body = 'Testing browser notifications!';
    var icon = '/images/the-icon-192x192.png';
    var tag = 'notification-test';

    // toDo ensure permissions are enought
    event.waitUntil(
      self.registration.showNotification(title, {
        body: body,
        icon: icon,
        tag: tag
      })
    );
});

*/
