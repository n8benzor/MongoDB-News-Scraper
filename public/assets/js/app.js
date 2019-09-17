$(document).ready(function(){

    $(document).on("click", "#scrape-articles", scrapeArticles);
    $(document).on("click", "#save-article", saveArticle);

    $(document).on("click", "#delete-article", deleteArticle);
    $(document).on("click", ".media", articleNote);

    function scrapeArticles() {
       
        $.get("/scrape").then(function(data) {
          console.log(data);
          window.location.href = "/";
        });
      };

      function saveArticle() {
        // This function is triggered when the user wants to save an article
        // When we rendered the article initially, we attached a javascript object containing the headline id
        // to the element using the .data method. Here we retrieve that.
        const articleToSave = $(this)
          .parents(".media")
          .data();
    
        // Remove card from page
        $(this)
          .parents(".media")
          .remove();
    
        articleToSave.saved = true;
        // Using a patch method to be semantic since this is an update to an existing record in our collection
        console.log(articleToSave)
        $.ajax({
          method: "PUT",
          url: "/api/headlines/" + articleToSave._id,
          data: articleToSave
        }).then(function(data) {
          console.log(data)
          // If the data was saved successfully
          if (data) {
            // Run the initPage function again. This will reload the entire list of articles
            // initPage();
            location.reload();
          }
        });
      }

      function deleteArticle() {
        // This function handles deleting articles/headlines
        // We grab the id of the article to delete from the card element the delete button sits inside
        const articleToDelete = $(this)
          .parents(".media")
          .data();
    
        // Remove card from page
        $(this)
          .parents(".media")
          .remove();
        // Using a delete method here just to be semantic since we are deleting an article/headline
        console.log(articleToDelete._id)
        $.ajax({
          method: "DELETE",
          url: "/api/delete/" + articleToDelete._id
        }).then(function(data) {
          // If this works out, run initPage again which will re-render our list of saved articles
          if (data) {
            // initPage();
            window.load = "/saved"
          }
        });
      }
})