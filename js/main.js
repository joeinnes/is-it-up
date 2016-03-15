var servers = [];

servers = JSON.parse(localStorage.getItem('servers'));

if (!servers) {
    servers = [{
    "name": 'Bing',
    "ip": "bing.com",
    "successCount": 0,
    "notified": true
}, {
    "name": "Outlook (Exchange)",
    "ip": "outlook.office365.com",
    "successCount": 0,
    "notified": true
}, {
    "name": "Joe's Homepage",
    "ip": "joeinn.es",
    "successCount": 0,
    "notified": true
}, {
    "name": "Mokus",
    "ip": "mokus.xyz",
    "successCount": 0,
    "notified": true
    }];
}

serverList = [];

Server = function(serverName, hostname) {
    this.name = serverName;
    this.hostname = hostname;
    this.state = 'loading';
    this.isup = 'Checking...';
    this.color = 'is-warning';
    this.pingCount = 0;
    this.successCount = 0;
    this.notified = true;

    this.updateNode = function() {
        if(!document.getElementById(this.name)) {
          var thisNode = document.createElement('li');
          thisNode.id = this.name;
          thisNode
        } else { 
          thisNode = document.getElementById(this.name);
        }
        thisNode.innerHTML = '';
        newData = document.createElement('a');
        newData.className = "button is-" + this.state + ' ' + this.color + ' is-thin';
        newData.innerHTML = this.state;
        thisNode.appendChild(newData);
        newData2 = document.createElement('span');
        newData2.innerHTML = " " + this.name + " ";
        thisNode.appendChild(newData2);
        newData3 = document.createElement('span');
        newData3.innerHTML = "&times;";
        newData3.className = "is-right";
        newData3.addEventListener('click', function(e) { 
            this.parentNode.parentNode.removeChild(this.parentNode);
            var index = serverList.indexOf(this);
            serverList.splice(index, 1);
            for (var i = 0; i < servers.length; i++) {
                console.log(this.parentNode.id);
                if (servers[i].name === this.parentNode.id) {
                    servers.splice(i, 1);
                    localStorage.setItem('servers', JSON.stringify(servers));
                    break;
                }
            }
            return;
        });
        thisNode.appendChild(newData3);
        return thisNode;
    };

    this.appendNode = function(parent) {
        document.getElementById(parent).appendChild(this.updateNode(this.name));
    };

    this.isup = function() {
        if (this.successCount > 6) {
            this.successCount = 6;
        } else {
            this.successCount++;
        }
    };

    this.isdown = function() {
        if (this.successCount < 1) {
            this.successCount = 0;
        } else {
            this.successCount--;
        }
    };

    this.ping = function() {
        var self = this;
        if (!this.inUse) {
            this.status = 'unchecked';
            this.inUse = true;
            var _that = this;
            this.img = new Image();
            this.img.onload = function() {
                _that.inUse = false;
                this.isup();
            }.bind(this);
            this.img.onerror = function(e) {
                if (_that.inUse) {
                    _that.inUse = false;
                    this.isup();
                }

            }.bind(this);
            this.start = new Date().getTime();
            this.img.src = "http://" + this.hostname;
            this.timer = setTimeout(function() {
                if (_that.inUse) {
                    _that.inUse = false;
                    this.isdown();
                }
            }.bind(this), 1900);
        }
        this.pingCount++;
        this.up();
    };

    this.up = function() {
        if (this.pingCount < 4) {
            return;
        }
        if (this.successCount > 2) {
            this.color = 'is-success';
            this.state = '&#10003;';
            this.notified = false;
            this.updateNode();
            return true;
        } else {
            this.color = 'is-danger';
            this.state = '&#10007;'
            if (!this.notified) {
                this.notify(this.name + ' is down', 'Alert');
                this.notified = true;
            }
            this.updateNode();
            return false;
        }
    };
    
    this.notify = function (body, title) {
        var notifications = document.getElementById('notifications-off');
        if (notifications.checked) {
            return; // and do nothing;
        }
        var options = {
            body: body,
            icon: 'img/alert.png'
        };
        
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
            var n = new Notification(title, options);
            setTimeout(n.close.bind(n), 2000);
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function(permission) {
                if (permission === "granted") {
                    var n = new Notification(title, options);
                    setTimeout(n.close.bind(n), 2000);
                }
            });
        }
    };
};

servers.forEach(function(server, index) {
    var thisServer = new Server(server.name, server.ip);
    thisServer.appendNode('displayData');
    thisServer.ping();
    serverList.push(thisServer);
});

setInterval(function() {
  serverList.forEach(function(server) {
    server.ping();
    console.log(server.successCount);
  });
}, 2000);

function addServer() {
    var serverName = document.getElementById('newservername').value;
    var serverHost = document.getElementById('newserverhost').value;
    newServer = new Server(serverName, serverHost);
    serverList.push(newServer);
    newServer.appendNode('displayData');
    clearForm();
    servers.push({
       name: serverName,
       ip: serverHost,
       successCount: 0,
       notified: true 
    });
    localStorage.setItem('servers', JSON.stringify(servers));
    return;
}

function clearForm() {
    document.getElementById('newservername').value = '';
    document.getElementById('newserverhost').value = '';
    return;
}