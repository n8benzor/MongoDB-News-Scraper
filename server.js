// Require our dependencies
const express = require('express');
const logger = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require('body-parser')

// Initialize Express
const app = express();

const PORT = process.env.PORT || 3000;

// Connect to the Mongo DB
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, {userMongoClient: true});

// check connection status
let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Connected to Mongoose");
})

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));

// Body Parser
app.use(bodyParser.urlencoded({
    extended: false
}));

// Make public a static folder
app.use(express.static("public"));

// Set Handlebars.
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
const htmlroutes = require("./controllers/html_controller.js");
app.use(htmlroutes);
const articlesroutes = require("./controllers/articles_controller");
app.use(articlesroutes);



// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });