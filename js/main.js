var servers = [{
  "name": 'Bing',
  "ip": "bing.com",
  "successCount": 0,
  "notified": true
}, {
  "name": "Outlook (Exchange)",
	"ip": "outlook.office365.com", 
  "successCount": 0,
  "notified": true
}];

var pingCount = 0;

servers.forEach(function(server) {
	var thisServer = document.createElement('li');
	thisServer.id = server.name;
	thisServer.innerHTML = '<a class="button is-loading is-warning">Checking...</a>&nbsp;' + server.name;
	document.getElementById('displayData').appendChild(thisServer);
});

setInterval(function() { 
  servers.forEach(function(server, index) {
  var p = new ping(server.ip, server.name, function(data, name) {
    if (data === 'up') {
      servers[index].successCount++;
    } else {
      servers[index].successCount--;
    }
    if (servers[index].successCount > 5) {
      servers[index].successCount = 5;
    } else if (servers[index].successCount < 0) {
      servers[index].successCount = 0;
    }

    if (servers[index].successCount > 2) {
      var thisServer = document.getElementById(server.name);
      thisServer.innerHTML = '<a class="button is-success">✓</a> &nbsp;' + server.name;
      servers[index].notified = false;
    } else {
      if (pingCount > 2) {
        var thisServer = document.getElementById(server.name);
        thisServer.innerHTML = '<a class="button is-danger">✗</a> &nbsp;' + server.name;
        if (server.name != 'breakMe' && server.notified === false) {
          notify(server.name + ' is down', 'test.png', 'Alert');
	  servers[index].notified = true;
        }
      }
    }
  });
  p = null;
  pingCount++;
});
}, 5000);


function ping(ip, name, callback) {

    if (!this.inUse) {
        this.status = 'unchecked';
        this.inUse = true;
        this.callback = callback;
        this.ip = ip;
        var _that = this;
        this.img = new Image();
        this.img.onload = function () {
            _that.inUse = false;
            _that.callback('up', name);

        };
        this.img.onerror = function (e) {
            if (_that.inUse) {
                _that.inUse = false;
                _that.callback('up', name);
            }

        };
        this.start = new Date().getTime();
        this.img.src = "http://" + ip;
        this.timer = setTimeout(function () {
            if (_that.inUse) {
                _that.inUse = false;
                _that.callback('down', name);
            }
        }, 1900);
    }
}

function notify(body, icon, title) {

  var options = {
    body: body,
    icon: 'img/alert.png'
  };
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var n = new Notification(title, options);
    setTimeout(n.close.bind(n), 2000);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var n = new Notification(title, options);
	setTimeout(n.close.bind(n), 2000);
      }
    });
  }

  // At last, if the user has denied notifications, and you 
  // want to be respectful there is no need to bother them any more.
}