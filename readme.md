# NFL News Scraper 

This app allows users to view NFL News articles from [SI.com](https://www.si.com/subcategory/mmqb), save articles, and comment on their favorites. Each article is displayed with the headline title, date it was published, as well as an image and link to the source URL on the [SI.com](https://www.si.com/subcategory/mmqb) website.  The app uses Node/Express for the server and routing, MongoDB/Mongoose for the database and models, Handlebars for the layout and views, & Cheerio/Request. 

[Live Demo Link](https://evening-brook-50234.herokuapp.com/)
![enter image description here](https://github.com/n8benzor/MongoDB-News-Scraper/blob/master/public/assets/images/logo.png?raw=true)


## Technology Used

-   HTML, CSS, jQuery, Bootstrap,  [Handlebars.js](https://handlebarsjs.com/)
-   JavaScript
-   Node.js
-   MongoDB and  [Mongoose](http://mongoosejs.com/)
-   [Express.js](https://expressjs.com/)
-   npm, including  [express](https://www.npmjs.com/package/express)  and  [body-parser](https://www.npmjs.com/package/body-parser)  packages.
-   [cheerio](https://cheerio.js.org/)  for scraping the website

## Using the App

 1. Click the Scrape New Articles button to get the latest news articles from Si.com
 ![enter image description here](https://github.com/n8benzor/MongoDB-News-Scraper/blob/master/public/assets/images/step-1.png?raw=true)
 
 2. The results will populate the page
 ![enter image description here](https://github.com/n8benzor/MongoDB-News-Scraper/blob/master/public/assets/images/step-2.png?raw=true)

3. Each article displayed contains the headline, summary of the article, image, link to the main article, and a save article button. When the Save Article button is clicked that article will be viewable in the Saved Articles link at the top of the page.
![enter image description here](https://github.com/n8benzor/MongoDB-News-Scraper/blob/master/public/assets/images/step-3.png?raw=true)

4. When the Save Article button is clicked that article will be viewable in the Saved Articles link at the top of the page.
![enter image description here](https://github.com/n8benzor/MongoDB-News-Scraper/blob/master/public/assets/images/step-4.png?raw=true)

5. Each saved article will include a comments button and delete article button. If the delete article button is clicked the article will no longer be viewable.
![enter image description here](https://github.com/n8benzor/MongoDB-News-Scraper/blob/master/public/assets/images/step-5.png?raw=true)

6. If the comments button is clicked the a modal will allow you to post a comment related to that articular article.
![enter image description here](https://github.com/n8benzor/MongoDB-News-Scraper/blob/master/public/assets/images/step-6.png?raw=true)

![enter image description here](https://github.com/n8benzor/MongoDB-News-Scraper/blob/master/public/assets/images/step-7.png?raw=true)

7. Once a comment is submitted they will displayed whenever you click on the comments button again.
![enter image description here](https://github.com/n8benzor/MongoDB-News-Scraper/blob/master/public/assets/images/step-8.png?raw=true)


