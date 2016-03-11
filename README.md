# Is It Up
Is It Up is a Javascript based service dashboard with built-in browser notifications.

It functions by attempting to load an image from the server. If any response is received, the server is seen as 'up' (whether the image is available or not). If the request times out, the server is seen as 'down'.

Notifications are displayed in case a server that was previously up goes down.

A server is classed as 'up' if it responds to at least two out of the last five pings.

The Bulma framework (http://bulma.io) was used for this project.

Credit to the creator of http://jsfiddle.net/GSSCD (http://stackoverflow.com/users/429938/trante) - upon whose code this was largely built.
