import express from "express";
import http from "http";
import { BroadcastService } from 'services/broadcastService';

const app = express();
const server = http.createServer(app);

const broadcastService = new BroadcastService(server);
broadcastService.registerHandlers();

// Start the server
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});