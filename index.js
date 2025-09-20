const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;
const path = require('path');

// Middleware
app.use(express.json());
app.use(cookieParser());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const userRoutes = require('./routes/UserRoute');
const roomRoutes = require('./routes/RoomRoute');
const webRoutes = require('./routes/WebRoutes');
const equipmentRoutes = require('./routes/EquipmentRoute');
const AuthRoute = require('./routes/AuthRoute');
const maintenanceRoute = require('./routes/MaintenanceRoute')
const imageRoutes = require('./routes/ImageRoute');
const equipmentTypeRoutes = require('./routes/equipment-typesRoute');

// Auth Routes
app.use('/auth', AuthRoute);

// Routes
// !Do not change the paths below, they should be plural
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/equipments', equipmentRoutes);
app.use('/api/maintenances', maintenanceRoute);
app.use('/api/images', imageRoutes);
app.use('/api/equipment-types', equipmentTypeRoutes);
app.use('/', webRoutes);

// CSS
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
