'use strict';

// Register a listener for push events!
self.addEventListener('push', (event) => {
    console.log("new pushh!", event);
});
