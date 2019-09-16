// Scraping tools
const axios = require("axios");
const cheerio = require("cheerio");

// Initialize Express
const app = express();

// Require all models
const db = require("./models");



// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("http://www.nfl.com/news").then(function(error, response, html) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      const $ = cheerio.load(html);
    
      $("div.news-contents li").each(function(i, element) {

        // Save an empty result object
        const result = {};

        result.title = $(this).children("a").text();
        result.link = $(this).children("a").attr("href");
        result.summary = $(this).children("p").text();
        result.picture = $(this).children("img").text();       

        console.log(result);

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
            console.log(err);
          });
      });
      res.send("Scrape Complete");
    });
  });

  // Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({})
    .then (function (found){
      res.json(found);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
  });

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
    db.Article.findOne({ _id: req.params.id})
    .populate('note')
    .then (function (found){
      res.json(found);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note
    db.Note.create(req.body)
    .then (function (dbNote){
      return db.User.findOneAndUpdate({_id: req.params.id}, { note: dbNote._id}, { new: true });
    })
    .catch (function (err){
      res.json(err);
    })
  })
