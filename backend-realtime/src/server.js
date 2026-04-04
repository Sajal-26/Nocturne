const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware for auth tracking
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  // TODO: Implement Supabase Token Validation for multi-platform auth
  next();
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });

  // Future events: lounge:join, player:sync, chat:message
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Nocturne Realtime Engine running on http://localhost:${PORT}`);
});
