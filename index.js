const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');

// Middleware
app.use(express.json());
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
app.use('/user', userRoutes);
app.use('/room', roomRoutes);
app.use('/equipment', equipmentRoutes);
app.use('/', webRoutes);

// CSS
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
