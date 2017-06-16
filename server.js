var PaVEParser = require('ar-drone/lib/video/PaVEParser');
var arDrone = require('ar-drone');
var path = require('path');
var io = require('socket.io').listen(3001); //all socket traffic goes through port 3001
var express = require('express')
var app = express()
var port = 3000

// drone dictionary
var dronesData = {
	'drone1' : {'ip': '192.168.1.10'}, // ardrone2_042129 - 192.168.1.12
	'drone2' : {'ip': '192.168.1.11'}, // ardrone2_042145 - 192.168.1.12
	'drone3' : {'ip': '192.168.1.12'}, // ardrone2_123284 - 192.168.1.12
}

// drone clients
var drones = {}

// create client and configure for each drone
for(name in dronesData){

	drones[name] = arDrone.createClient(dronesData[name]);
	drones[name].disableEmergency();
	drones[name].animateLeds('blinkRed', 5, 2);

	var idx = Object.keys(dronesData).indexOf(name);
  	console.log("Created a drone client named "+name+" with ip " + dronesData[name].ip);
  	
  	drones[name].config('general:navdata_demo', 'FALSE'); // get back all data the drone can send
	drones[name].config('general:navdata_options', 777060865); // turn on GPS
  	drones[name].config('control:altitude_max', 5000); // set max height

  	require("dronestream").listen(3002+idx, dronesData[name]); // initiate video stream for each drone

  	/* save video stream */
 	drones[name]['output'] = require('fs').createWriteStream(name+'.h264');
	drones[name]['video'] = drones[name].getVideoStream();
	drones[name]['parser'] = new PaVEParser();

	drones[name]['parser']
	  .on('data', function(data) {
	    drones[name]['output'].write(data.payload);
	  })
	  .on('end', function() {
	    drones[name]['output'].end();
	  });

	drones[name]['video'].pipe(drones[name]['parser']);
}

app.use(express.static(path.join(__dirname, 'public'))); // static resources

app.get('/', function(req, res){ res.sendFile(path.join(public + "index.html")); });
app.get('/takeoff', function(req, res){disableEmergency(); blinkLeds(); takeoff(); res.sendStatus(200); });
app.get('/land', function(req, res){land(); res.sendStatus(200);});
app.get('/clockwise', function(req, res){clockwise(0.3); setTimeout(function(){ stop(); }, 1000); res.sendStatus(200);});
app.get('/counterClockwise', function(req, res){counterClockwise(0.3); setTimeout(function(){ stop(); }, 1000); res.sendStatus(200);});
app.get('/up', function(req, res){up(0.3); setTimeout(function(){ stop(); }, 1000); res.sendStatus(200);});
app.get('/down', function(req, res){down(0.3); setTimeout(function(){ stop(); }, 1000); res.sendStatus(200);});
app.get('/front', function(req, res){front(0.3); setTimeout(function(){ stop(); }, 1000); res.sendStatus(200);});
app.get('/back', function(req, res){back(0.3); setTimeout(function(){ stop(); }, 1000); res.sendStatus(200);});
app.get('/left', function(req, res){left(0.3); setTimeout(function(){ stop(); }, 1000);res.sendStatus(200);});
app.get('/right', function(req, res){right(0.3); setTimeout(function(){ stop(); }, 1000); res.sendStatus(200);});
app.get('/blinkLeds', function(req, res){blinkLeds();res.sendStatus(200);});
app.get('/stop', function(req, res){stop();res.sendStatus(200);});
app.get('/batteryLife', function(req, res){batteryLife();res.sendStatus(200);});
app.get('/disableEmergency', function(req, res){disableEmergency();res.sendStatus(200);});
app.get('/calibrate', function(req, res){calibrate();res.sendStatus(200);});

/* streaming stuff */
io.on('connection', function (socket) {

	var socket_navdata = {};
  	console.log("socket connection with client established");

    setInterval(function(){

    	for(name in drones){

        	drones[name].on('navdata', function(navdata) {
			   socket_navdata[name] = navdata;
			});

    	}

    	socket.emit('navdata', { name: 'navdata', value: socket_navdata});
        
    },3000);
});

app.listen(port);

/* aggreate functions for swarm */
takeoff = function () {
	for(var name in drones){
		drones[name].takeoff();
	}
}

land = function () {
	for(var name in drones){
		drones[name].land();
	}
}

clockwise = function (amount) {
	for(var name in drones){
      drones[name].clockwise(amount)
	}
}

counterClockwise = function (amount) {
	for(var name in drones){
		  drones[name].counterClockwise(amount)
	}
}

up = function (amount) {
	for(var name in drones){
	    drones[name].up(amount)
	}
}

down = function (amount) {
	for(var name in drones){
	    drones[name].down(amount)
	}
}

front = function (amount) {
	for(var name in drones){
	    drones[name].front(amount)
	}
}

back = function (amount) {
	for(var name in drones){
	    drones[name].back(amount)
	}
}

left = function (amount) {
	for(var name in drones){
	    drones[name].left(amount)
	}
}

right = function (amount) {
	for(var name in drones){
	    drones[name].right(amount)
	}
}

blinkLeds = function (amount) {
	for(var name in drones){
		drones[name].animateLeds('redSnake', 5, 5)
	}
}

stop = function (amount) {
	for(var name in drones){
		drones[name].stop()
	}
}

batteryLife = function () {
	for(var name in drones){
		var val = drones[name].battery()
    	console.log("battery life: "+val);
	}
}

disableEmergency = function () {
  for(var name in drones){
    drones[name].disableEmergency();
  }
}

calibrate = function () {
  for(var name in drones){
    drones[name].calibrate(0);
  }
}
