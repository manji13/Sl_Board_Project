const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); 
const connectDB = require('./db.js');
const coachRoutes = require('./Routes/coachRoutes.js'); 

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/coaches', coachRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('API is running successfully...');
});

// Export for Vercel serverless
module.exports = app;

// Local development (not used on Vercel)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}