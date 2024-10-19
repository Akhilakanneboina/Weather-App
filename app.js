require('dotenv').config();

// Import required packages
const express = require('express');
const axios = require('axios');
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');

const { connectDB, insertDailySummary, closeDB } = require('./db'); // Import from db.js

const app = express();
const PORT = process.env.PORT || 3000;

// OpenWeatherMap API configuration
const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const CITIES = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
const INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Function to fetch weather data
async function fetchWeatherData() {
    for (const city of CITIES) {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
            console.log(`Fetching data for ${city} from: ${url}`);
            const response = await axios.get(url);

            // Log the status and response data
            console.log('Response Status:', response.status);
            console.log('Response Data:', response.data);

            const weatherData = response.data;
            await processWeatherData(weatherData);
        } catch (error) {
            console.error(`Error fetching data for ${city}:`, error.response ? error.response.data : error.message);
        }
    }
}

// Function to process weather data
async function processWeatherData(data) {
    const summary = {
        city: data.name,
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        main: data.weather[0].main,
        dt: new Date(data.dt * 1000).toISOString(),
    };

    console.log("Weather Summary:", summary);
    await insertDailySummary(summary);
    checkAlerts(summary); // Call checkAlerts to trigger any alerts
}

// Function to check alerts
async function checkAlerts(summary) {
    const threshold = 35; // Example threshold
    if (summary.temp > threshold) {
        sendAlert(summary);
    }
}

// Function to send email alerts
async function sendAlert(summary) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_RECIPIENT,
        subject: 'Weather Alert!',
        text: `Alert for ${summary.city}: Current temperature is ${summary.temp}°C, which exceeds the threshold.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Alert sent for:", summary.city);
    } catch (error) {
        console.error("Error sending alert:", error);
    }
}

// Start fetching weather data at regular intervals
function startWeatherMonitoring() {
    setInterval(fetchWeatherData, INTERVAL);
}

// Main function to start the application
async function main() {
    await connectDB(); // Connect to the database
    startWeatherMonitoring(); // Start fetching weather data
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${3000}`);
    });
}

// Close the database connection when the process exits
process.on('SIGINT', async () => {
    await closeDB();
    process.exit(0);
});

// Run the main function
main().catch(console.error);
const path = require('path');

// Serve static files from the public directory
app.use(express.static('public'));

// API endpoint to get daily summaries
app.get('/weather', async (req, res) => {
    try {
        const dailySummaries = await fetchDailySummaries();
        res.json(dailySummaries);
    } catch (error) {
        console.error('Error fetching daily summaries:', error);
        // Differentiate error types
        if (error instanceof SomeSpecificError) {
            res.status(400).json({ error: 'Bad Request', details: error.message });
        } else {
            res.status(500).json({ error: 'Internal Server Error', message: error.message });
        }
    }
});




async function fetchDailySummaries() {
    // Implement the logic to fetch daily summaries from the database
    // Example:
    const summaries = await db.collection('dailySummaries').find().toArray();
    return summaries;
}
