# wake_on_lan
You can use this repository to build a server and a client which you can use to turn on your computer over the internet using a server on the internet and a socket listener for your commands at your home which can send WOL magic packets to your main computer.

# Setup
You need to create `.env` file in this main directory. You need to write these inside that file:

## For Server
```
SERVER_SECRET = 'Type your server secret here so you can use it when making a web request.'
PORT = 3003
```

## For Client
```
SERVER_ADDRESS = 'Address of the server which runs the Socket.io and request server. It should be something like this: http://example.com'
MAC_ADDRESS = 'MAC Address of the computer you want to wake up. It should be something like this: aa:bb:cc:dd:ee:ff'
```
