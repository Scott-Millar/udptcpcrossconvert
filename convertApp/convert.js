var dgram = require('dgram')
var net = require('net')

var UDPserver = dgram.createSocket('udp4')

var TCPclient = new net.Socket()

var UDPIN = 10000;
var UDPOUT = 11000;
var TCPIN = 12000;
var TCPOUT = 13000;

var HOSTLOCAL = '127.0.0.1'

// if you want to broadcast, set broadcast to true then set the final number of the IP to 255.

var broadcastBool = false
var UDPOUTHOST = '127.0.0.1'
var TCPOUTHOST = '127.0.0.1'

var UDPmessage
var TCPmessage

// UDP Listening Loop

UDPserver.on('listening', function () {
    var address = UDPserver.address()
    console.log('UDP Server listening on ' + address.address + ":" + address.port)
})

UDPserver.on('message', function (message, remote) {
    //console.log(remote.address + ':' + remote.port +' - ' + message)
    sendTCP(new Buffer(message))
})

UDPserver.bind(UDPIN, HOSTLOCAL)

//TCP Listening Loop

// Create Server instance 
var TCPserver = net.createServer(onClientConnected);  
 
TCPserver.listen(TCPIN, HOSTLOCAL, function() {  
  console.log('TCP server listening on %j', TCPserver.address());
});
 
function onClientConnected(sock) {  
  var remoteAddress = sock.remoteAddress + ':' + sock.remotePort;
  console.log('new client connected: %s', remoteAddress);
 
  sock.on('data', function(data) {
    console.log('%s Says: %s', remoteAddress, data);
    broadcastBool ? broadcastUDP(new Buffer(data)) : sendUDP(new Buffer(data))        
  });
  sock.on('close',  function () {
    console.log('connection from %s closed', remoteAddress);
  });
  sock.on('error', function (err) {
    console.log('Connection %s error: %s', remoteAddress, err.message);
  });
};

net.createServer(function (socket) {

  // Identify this client
  socket.name = socket.remoteAddress + ":" + socket.remotePort 

  // Handle incoming messages from clients.
  socket.on('data', function (data) {
    console.log('received TCP message: ' + message)
  })

}).listen(TCPIN)

function broadcastUDP(message){
    var client = dgram.createSocket('udp4')
    client.send(message, 0, message.length, UDPOUT, UDPOUTHOST, function(err, bytes) {
        client.setBroadcast(true)
        if (err) console.log('Message not sent: ' + message)
        //console.log('UDP message sent to ' + HOSTSEND +':'+ SENDPORT[PORTtoSEND]);
        client.close()
    })

}

function sendUDP(message){
    var client = dgram.createSocket('udp4')
    client.send(message, 0, message.length, UDPOUT, UDPOUTHOST, function(err, bytes) {
        client.setBroadcast(false)
        if (err) console.log('Message not sent: ' + message)
        //console.log('UDP message sent to ' + HOSTSEND +':'+ SENDPORT[PORTtoSEND]);
        client.close()
    })

}

function sendTCP(message){
    TCPclient.connect(TCPOUT, TCPOUTHOST, function() {
        console.log('Client connected to: ' + TCPOUTHOST + ':' + TCPOUT);
        // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
        TCPclient.write(message);
    });

    TCPclient.on('data', function(data) {    
        console.log('Client received: ' + data);
         if (data.toString().endsWith('exit')) {
           TCPclient.destroy();
        }
    });

        // Add a 'close' event handler for the client socket
    TCPclient.on('close', function() {
        console.log('Client closed');
    });
     
    TCPclient.on('error', function(err) {
        console.error(err);
        console.log('Ensure settings are correct for TCP out and host address')
    });
}