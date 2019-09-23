// Scraping tools
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");




// Routes
module.exports = function (app) {
  // home page
  app.get('/', function (req, res) {
    // res.render('home');
    db.Article.find({ saved: false }, function (err, data) {
      res.render('home', { home: true, article: data });
    })
  });

  // saved pages
  app.get('/saved', function (req, res) {
    db.Article.find({ saved: true }, function (err, data) {
      res.render('saved', { home: false, article: data });
    })
  });

  // Save Article to saved: true
  app.put("/api/headlines/:id", function (req, res) {
    const saved = req.body.saved == 'true'
    if (saved) {
      db.Article.updateOne({ _id: req.body._id }, { $set: { saved: true } }, function (err, result) {
        if (err) {
          console.log(err)
        } else {
          return res.send(true)
        }
      });
    }
  });

  // delete article 
  app.delete("/api/delete/:id", function (req, res) {
    console.log('reqbody:' + JSON.stringify(req.params.id))
    db.Article.deleteOne({ _id: req.params.id }, function (err, result) {
      if (err) {
        console.log(err)
      } else {
        return res.send(true)
      }
    });
  });

  // scrape articles
  app.get("/scrape", function (req, res) {
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

        if (result.headline !== '' && result.summary !== '') {
          db.Article.findOne({ headline: result.headline }, function (err, data) {
            if (err) {
              console.log(err)
            } else {
              if (data === null) {
                db.Article.create(result)
                  .then(function (dbArticle) {
                    console.log(dbArticle)
                  })
                  .catch(function (err) {
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

  // Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  db.Article.findByIdAndUpdate({ _id: req.params.id})
  .populate('note')
  .then (function (found){
    res.json(found);
  })
  .catch(function(err) {
    // If an error occurs, send it back to the client
    res.json(err);
  });
});


  // route to find a note by ID
app.get("/notes/article/:id", function(req, res) {
  db.Article.findOne({"_id":req.params.id})
    .populate("notes")
    .exec (function (error, data) {
        if (error) {
            console.log(error);
        } else {
          res.json(data);
        }
    });        
});

  // add note to an article
  app.post("/api/notes/:id", function(req, res){
    console.log("logging the req.body from api routes", req.body.body);
    db.Note.create({ body: req.body.body })

    .then(function(dbNote) {
      return db.Article.findByIdAndUpdate({ _id: req.params.id }, {$push: { "note": dbNote._id }}, { new: true }
      // , {
      //   $push: {
      //     notes: dbNote._id
      //   }
      // }
      )

      // var articleIdFromString = mongoose.Types.ObjectId(req.params.id)
      // return db.Article.findByIdAndUpdate(articleIdFromString, {
      // })
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
      console.log('logging dbarticle', dbArticle);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
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
  app.get("/api/clear", function (req, res) {
    console.log(req.body)
    db.Article.deleteMany({}, function (err, result) {
      if (err) {
        console.log(err)
      } else {
        console.log(result)
        res.send(true)
      }
    })
  });


  // this route saves the submited comment to the databse, as well as updated the specific saved article it is saved to 
app.post('/api/submit/:id', function(req, res) {
  console.log('logging the req.body from api routes', req.body.comment)

	db.Note.create({
		'body': req.body.comment
	})
	.then(function(data) {
		console.log('loggging req.params from api routes', req.params.id);
		return db.Article.findByIdAndUpdate(
			{ _id: req.params.id }, 
			{ $push: { notes: data._id } }, { new: true });
	})
	res.redirect('back');
});

// this route will delete the comment from the database specified by the id
app.post('/api/delete-comment/:id', function(req, res) {
	db.Note.remove(
		{
			'_id': req.params.id
		},
		function(error, removed) {
			if (error) {
		        console.log(error);
		       	res.send(error);
		    } else {
		    	console.log('removed from articles');
		    	res.redirect('back');
		    }
		}
	)	
});



};


