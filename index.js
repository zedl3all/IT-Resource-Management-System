const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
const userRoutes = require('./routes/UserRoute');

// Routes
app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
