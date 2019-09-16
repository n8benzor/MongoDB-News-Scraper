// Require our dependencies
const express = require('express');
const logger = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
// Scraping tools
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");

const PORT = process.env.PORT || 3000;

// Connect to the Mongo DB
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, {userMongoClient: true});

// Initialize Express
const app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));

// Body Parser
app.use(bodyParser.urlencoded({
    extended: false
}));

// Parse request body as JSON
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Set Handlebars.
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
const htmlroutes = require("./controllers/html_controller.js");
app.use(htmlroutes);


// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });