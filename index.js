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

// Auth Routes
app.use('/auth', AuthRoute);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/equipments', equipmentRoutes);
app.use('/', webRoutes);

// CSS
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
