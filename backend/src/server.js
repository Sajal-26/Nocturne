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
import { getTrendingMovies, getTrendingTVShows } from './services/imdb.js';
import { getNetflixTop10 } from './services/netflix.js';
import { getHotstarPopular, getHotstarPopularShows } from './services/hotstar.js';
import { getAllPlatformTop10 } from './services/justwatch.js';

const warmCache = async () => {
    try {
        await Promise.all([getTrendingMovies(true), getTrendingTVShows(true)]);
    } catch (e) {
        console.warn('[CACHE] Pre-warm failed silently:', e.message);
    }
};

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
        socket.on('sync:play', (data) => {
            socket.broadcast.emit('sync:playback', data);
        });

        socket.on('disconnect', () => {
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

    app.get('/api/netflix-top-10', async (req, res) => {
        try {
            const { type, date } = req.query;
            const data = await getNetflixTop10(type || 'movie', date);
            res.json(data);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.get('/api/hotstar-popular', async (req, res) => {
        try {
            const data = await getHotstarPopular();
            res.json(data);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.get('/api/hotstar-popular-shows', async (req, res) => {
        try {
            const data = await getHotstarPopularShows();
            res.json(data);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.get('/api/platform-top-10', async (req, res) => {
        try {
            const { country, type } = req.query;
            const data = await getAllPlatformTop10({ country: country || 'IN', type: type || 'MOVIE' });
            res.json(data);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.get('/health', (req, res) => {
        res.json({ status: "online", service: "Nocturne Backend" });
    });

    const PORT = process.env.PORT || 4000;
    httpServer.listen(PORT, () => {
        console.log(`[SERVER] Nocturne Backend is operational on port ${PORT}`);
        warmCache();
    });
}

startServer().catch(err => {
    console.error("Server Failed to Start:", err);
});
