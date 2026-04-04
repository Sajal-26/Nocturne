import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import pkg from 'body-parser';
const { json } = pkg;
import { typeDefs, resolvers } from './graphql/index.js';

async function startServer() {
    const app = express();
    const httpServer = createServer(app);

    const io = new Server(httpServer, {
        cors: {
            origin: "*", 
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`New Connection: ${socket.id}`);
        
        socket.on('sync:play', (data) => {
            socket.broadcast.emit('sync:playback', data);
        });

        socket.on('disconnect', () => {
            console.log(`Disconnected: ${socket.id}`);
        });
    });

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true, 
    });

    await server.start();

    app.use(cors());
    app.use(json());

    app.use('/graphql', expressMiddleware(server));

    app.get('/health', (req, res) => {
        res.json({ status: "online", service: "Nocturne Backend" });
    });

    const PORT = process.env.PORT || 4000;
    httpServer.listen(PORT, () => {
        console.log(`Nocturne Hub Running at:`);
        console.log(`HTTP/Realtime: http://localhost:${PORT}`);
        console.log(`GraphQL Server: http://localhost:${PORT}/graphql`);
    });
}

startServer().catch(err => {
    console.error("Server Failed to Start:", err);
});
