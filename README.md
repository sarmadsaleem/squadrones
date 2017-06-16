## Hardware Requirements
You'll need following to follow this guide
- Based-station (Laptop)
- One or more Parrot’s AR Drone 2.0
- Wifi-router

## Software Requirements
You'll need following to follow this guide
- This has been tested on Mac OS Sierra & Ubuntu 14.04, should work fine on Windows too
- nodejs v8.1.0 [https://nodejs.org/en/](https://nodejs.org/en/)
- npm v5.0.3 (npm is distributed with Node.js- which means that when you download Node.js, you automatically get npm installed on your computer.)


## Getting started
Before getting started, it’s important to know the default behaviour of Parrot’s AR Drone 2.0. It works by creating an open ad-hoc network which you can connect to using your smartphone. FreeFlight app uses this ad-hoc network to communicate with the drone. AR Drone runs stripped down variant of Linux called BusyBox which can allow us to telnet into the drone, tweak with configuration scripts and even allow for internet connectivity on the drone.

**We'll configure each drone to connect to specific WPA2 protected wifi network instead of creating open ad-hoc network.** To be able to do this, we'll first need to telnet into the drone, install `wpa_supplicant` and then run the script to connect to specified network. Necessary code for all of this is in network_setup folder (Thanks to [https://github.com/daraosn/ardrone-wpa2](https://github.com/daraosn/ardrone-wpa2)).

### Configure wifi network
Configure your wireless router to create an WPA2 protected wifi network, in my case it's named `squadrones`. Router should be configured to have an IP address of `192.168.1.1` on subnet `255.255.255.0`. Configure the router's DHCP server to give clients IP addresses starting from `192.168.1.100`, we will reserve small pool for drones (192.168.1.10-99).

### Clone repository
```
git clone https://github.com/sarmadsaleem/squadrones.git
```

### Configure each drone
- Turn on AR Drone 2.0 and connect your laptop to its wifi network (e.g. `ardrone2_042129`)
- Install `wpa_supplicant` and connection script on your drone (to be done once for each drone).
```
cd network_setup
script/install
```
- Connect drone to wifi network `squadrones`. Make sure to use unique <ip-address-to-be-alloted> for each drone. (to be done everytime you want your drone to connect to specified wifi network)
```
# script/connect "<essid>" -p "<password>" -a <ip-address-to-be-alloted> -d <droneip>
script/connect script/connect "squadrones" -p "password" -a 192.168.1.10 -d 192.168.1.1
```
- Connect your laptop to `squadrones` wifi network and verify if the drone is connected
```
ping 192.168.1.10
```

### Start the server, pull in dependencies and enjoy simple swarm interface
Navigate to root of repo and run following commands
```
npm install
node server.js
```

Open `http://localhost:3000` in your browser

## Future plans
- Preset formations of drones instead of same commands being broadcasted to all of them
- Toggle to control drones individually or collectively
- Integrate PID Controller and tag detections to follow & land
- Preset animations and tricks