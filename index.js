const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;
const path = require('path');
const UpdateStatusService = require('./middleware/UpdateService');
const http = require('http');
const { Server } = require('socket.io');

// Middleware
app.use(express.json());
app.use(cookieParser());
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/Images', express.static(path.join(__dirname, 'Images')));
app.set('view engine', 'ejs');

// Routes
const userRoutes = require('./routes/UserRoute');
const roomRoutes = require('./routes/RoomRoute');
const webRoutes = require('./routes/WebRoutes');
const equipmentRoutes = require('./routes/EquipmentRoute');
const AuthRoute = require('./routes/AuthRoute');
const maintenanceRoute = require('./routes/MaintenanceRoute')
const imageRoutes = require('./routes/ImageRoute');
const equipmentTypeRoutes = require('./routes/equipment-typesRoute');
const errorRoute = require('./routes/ErrorRoute');

// !Do not change the paths below, they should be plural
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/equipments', equipmentRoutes);
app.use('/api/maintenances', maintenanceRoute);
app.use('/api/images', imageRoutes);
app.use('/api/equipment-types', equipmentTypeRoutes);
app.use('/error', errorRoute);
app.use('/auth', AuthRoute);
app.use('/', webRoutes);

// handle 404
app.use((req, res, next) => {
    res.status(404).redirect('/error/404');
});

// +++ Socket.IO server +++
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});
app.set('io', io);

io.on('connection', (socket) => {
    console.log('🔌 Socket connected:', socket.id);
    socket.on('disconnect', () => console.log('🔌 Socket disconnected:', socket.id));
});
// --- Socket.IO server ---

// Start the auto-update service
// Pass io so the service can emit events
UpdateStatusService.startAutoUpdate(io, 1); // every 1 minute

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
