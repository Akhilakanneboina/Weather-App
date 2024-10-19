import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();



const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle JSON requests (Add this if you're working with JSON)
app.use(express.json());

// Connect to MongoDB
// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected successfully.');
    } catch (error) {
        console.error('Database connection failed:', error);  // Log the full error object
        process.exit(1);
    }
};


// Example route (add routes as needed)
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Main function to start the server
async function main() {
    try {
        await connectDB(); // Ensure database connection
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error during server startup:', error);
        process.exit(1); // Exit if something goes wrong
    }
}

// Run the main function
main().catch(console.error);
