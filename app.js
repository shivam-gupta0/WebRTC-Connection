const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// When a both client connects, send a welcome message and initialize their local sum to 0
io.on('connection', (socket) => {
    if (io.engine.clientsCount === 2) {
        io.emit('message', 'Both clients are conncted, Now number generation will start');
        socket.localSum = 0;

    }
  
  // When the client sends an addNumber message, add the number to the local sum and broadcast the number to all clients
  
  socket.on('addNumber', (randomNumber) => {
    if (io.engine.clientsCount === 2) {
        
        socket.localSum += randomNumber;
        socket.emit('number', { randomNumber });
        socket.broadcast.emit('message', `Client ${socket.id} generated ${randomNumber}.`);
        
        // Broadcast the number to the other client and add it to the local sum of both clients
        socket.broadcast.emit('otherNumber', { randomNumber });
        socket.broadcast.localSum += randomNumber;
        socket.localSum += randomNumber;
      }
    
  });
});

// Start the server
http.listen(3000, () => {
    console.log('Listening on port 3000');
});
