// Scraping tools
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");


    // Routes
    module.exports = function (app) {
        // home page
        app.get('/', function (req, res) {
            // res.render('home');
          db.Article.find({saved: false}, function(err, data){
            res.render('home', { home: true, article : data });
          })
        });
      
        // saved pages
        app.get('/saved', function (req, res) {
          db.Article.find({saved: true}, function(err, data){
            res.render('saved', { home: false, article : data });
          })
        });
      
        // Save Article to saved: true
        app.put("/api/headlines/:id", function(req, res){
          const saved = req.body.saved == 'true'
          if(saved){
            db.Article.updateOne({_id: req.body._id},{$set: {saved:true}}, function(err, result){
            if (err) {
              console.log(err)
            } else {
              return res.send(true)
            }
          });
          }
        });
      
        // delete article 
        app.delete("/api/delete/:id", function(req, res){
          console.log('reqbody:' + JSON.stringify(req.params.id))
          db.Article.deleteOne({_id: req.params.id}, function(err, result){
            if (err) {
              console.log(err)
            } else {
              return res.send(true)
            }
          });
        });
      

        app.get("/scrape", function(req, res) {
            //             // First, we grab the body of the html with request
            axios.get("https://www.si.com/subcategory/mmqb").then(function (response) {

                // Then, we load that into cheerio and save it to $ for a shorthand selector
                const $ = cheerio.load(response.data);

                $("article").each(function (i, element) {
                    // Save an empty result object
                    var result = {};
                    result.headline = $(element).find("span a").text().trim();
                    result.url = 'https://www.si.com' + $(element).find("span a").attr("href");
                    result.summary = $(element).find(".summary").text().trim();
                    result.picture = $(element).find(".component").attr("data-src");

                    // Add the text and href of every link, and save them as properties of the result object
                    // result.title = $(this)
                    // .children("a")
                    // .text();
                    // result.link = $(this)
                    // .children("a")
                    // .attr("href");

                    // Create a new Article using the `result` object built from scraping
        //             db.Article.create(result)
        //                 .then(function (dbArticle) {
        //                     // View the added result in the console
        //                     console.log(dbArticle);
        //                 })
        //                 .catch(function (err) {
        //                     // If an error occurred, send it to the client
        //                     console.log(err);
        //                 });
        //             console.log(result);
        //         });
        //     })
        // });

        if (result.headline !== '' && result.summary !== ''){
          db.Article.findOne({headline: result.headline}, function(err, data) {
            if(err){
              console.log(err)
            } else {
              if (data === null) {
              db.Article.create(result)
               .then(function(dbArticle) {
                 console.log(dbArticle)
              })
              .catch(function(err) {
              // If an error occurred, send it to the client
              console.log(err)
              });
            }
            console.log(data)
            }
          });
          }
    
          });
    
        // If we were able to successfully scrape and save an Article, send a message to the client
        res.send("Scrape completed!");
      });
      });
      
        // get back all notes for a given article
        app.get("/api/notes/:id", function(req, res){
          // res.send(true)
          db.Article.findOne({_id: req.params.id})
          .populate("note")
          .then(function(dbArticle){
            console.log(dbArticle.note)
            res.json(dbArticle.note)
          })
          .catch(function(err){
            res.json(err)
          })
        });
      
        // add note to an article
          app.post("/api/notes", function(req, res){
          console.log(req.body)
          db.Note.create({ noteText: req.body.noteText })
          .then(function(dbNote){
            console.log('dbNote:' + dbNote)
            return db.Article.findOneAndUpdate({ _id:req.body._headlineId}, 
            { $push: {note: dbNote._id} }, 
            {new: true})
          })
          .then(function(dbArticle){
            console.log('dbArticle:'+dbArticle)
            res.json(dbArticle)
          })
          .catch(function(err){
            res.json(err);
          })
        });
      
        // delete note form article
        app.delete("/api/notes/:id", function(req, res){
          console.log('reqbody:' + JSON.stringify(req.params.id))
          db.Note.deleteOne({_id: req.params.id}, function(err, result){
            if (err) {
              console.log(err)
            } else {
              return res.send(true)
            }
          });
        });
      
        // clear all articles from database
        app.get("/api/clear", function(req, res){
          console.log(req.body)
          db.Article.deleteMany({}, function(err, result){
            if (err) {
              console.log(err)
            } else {
              console.log(result)
              res.send(true)
            }
          })
        });
      }


