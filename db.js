// db.js

const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = 'weatherMonitoring'; // Name of your database
let db;

// Function to connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        db = client.db(dbName);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

// Function to insert a daily weather summary
async function insertDailySummary(summary) {
    try {
        const collection = db.collection('dailySummaries');
        await collection.insertOne(summary);
        console.log("Daily summary inserted:", summary);
    } catch (error) {
        console.error("Failed to insert summary:", error);
    }
}

// Function to retrieve daily summaries
async function getDailySummaries() {
    try {
        const collection = db.collection('dailySummaries');
        const summaries = await collection.find().toArray();
        return summaries;
    } catch (error) {
        console.error("Failed to retrieve summaries:", error);
        return [];
    }
}

// Function to close the database connection
async function closeDB() {
    try {
        await client.close();
        console.log("Disconnected from MongoDB");
    } catch (error) {
        console.error("Error closing MongoDB connection:", error);
    }
}

// Export the functions
module.exports = {
    connectDB,
    insertDailySummary,
    getDailySummaries,
    closeDB,
};
