// Scraping tools
const axios = require("axios");
const cheerio = require("cheerio");
// const db = require("../models");
const express = require('express');
// const app = express();
// Requiring our Note and Article models
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");


module.exports = function (app){
app.get("/", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      //res.json(doc);
      res.render("index", {articles: doc});
    }
  });
});




  // // A GET route for scraping the echoJS website
  app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("http://www.nytimes.com").then(function (error, response, html) {

      // Then, we load that into cheerio and save it to $ for a shorthand selector
      const $ = cheerio.load(response.data);

      $(".theme-summary").each(function (i, element) {

        // Save an empty result object
        const result = {};

        result.title = $(this).children("a").text();
        result.link = $(this).children("a").attr("href");
        result.summary = $(this).children("p").text();
        // result.picture = $(this).children("img").text();       

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function (dbArticle) {
            console.log(dbArticle);
          })
          .catch(function (err) {
            console.log(err);
          });
      });
      res.json(result);
    });
  });
};