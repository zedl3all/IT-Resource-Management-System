const http = require('http');
const { Server } = require('socket.io');
const createApp = require('./app');
const UpdateStatusService = require('./middleware/UpdateService');

const PORT = 3000;

// Create app and server
const app = createApp();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

// Set io instance to app for use in routes
app.set('io', io);

// Socket.IO setup
io.on('connection', (socket) => {
    console.log('🔌 Socket connected:', socket.id);
    socket.on('disconnect', () => console.log('🔌 Socket disconnected:', socket.id));
});

// Start the auto-update service
UpdateStatusService.startAutoUpdate(io, 1); // every 1 minute

// Start server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});