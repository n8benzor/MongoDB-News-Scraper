$(document).ready(function () {

  $(document).on("click", "#scrape-articles", scrapeArticles);
  $(document).on("click", "#save-article", saveArticle);
  // $(document).on("click", ".unsave-btn", unsaveArticle);
  $(document).on("click", "#delete-article", deleteArticle);
  $(document).on("click", "#clear-articles", clearArticles);

  $(document).on("click", "#comment-modal", commentArticle);
  $(document).on("click", "#save-comment", saveComment);
  $(document).on("click", ".delete-note", deleteNote);

  function scrapeArticles() {

    $.get("/scrape").then(function (data) {
      console.log(data);
      window.location.href = "/";
    });
  };

  function saveArticle() {
    // This function is triggered when the user wants to save an article
    // When we rendered the article initially, we attached a javascript object containing the headline id
    // to the element using the .data method. Here we retrieve that.
    const articleToSave = $(this)
      .parents(".card")
      .data();

    // Remove card from page
    $(this)
      .parents(".card");
      // .remove();

    articleToSave.saved = true;
    // Using a patch method to be semantic since this is an update to an existing record in our collection
    console.log(articleToSave)
    $.ajax({
      method: "PUT",
      url: "/api/headlines/" + articleToSave._id,
      data: articleToSave
    }).then(function (data) {
      console.log(data)
      // If the data was saved successfully
      if (data) {
        location.reload();
      }
    });
  }


  function deleteArticle() {
    const articleToDelete = $(this)
      .parents(".card")
      .data();

    // Remove card from page
    $(this)
      .parents(".card")
      .remove();
    // Using a delete method here just to be semantic since we are deleting an article/headline
    console.log(articleToDelete._id)
    $.ajax({
      method: "DELETE",
      url: "/api/delete/" + articleToDelete._id
    }).then(function (data) {
      // If this works out, run initPage again which will re-render our list of saved articles
      if (data) {
        // initPage();
        window.load = "/saved"
      }
    });
  };


  function commentArticle() {
  // Empty the notes from the note section
  $("#notes-list").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      const articleData = (data.note)
      for (let i = 0; i < articleData.length; i++){
        $("#notes-list").append("<span><li class='note'>" + articleData[i].body + "</li><button type='button' class='delete-note' aria-label='Close'><span aria-hidden='true'>&times; </span></button></span>");
      }
      // The title of the article
      $("#headline-color").append(data.headline);

      // If there's a note in the article
      // if (data.note) {
      //   // Place the body of the note in the body textarea
      // }
    });
    };


  function saveComment() {
    var thisId = $(this).attr("data-id");
    var newNote = {
      body: $("#form8").val().trim()
    }
    console.log("logging thisID from app.js", thisId);
    console.log("logging the text area input", newNote);
    if (!$("#form8").val()) {
        alert("please enter a note to save")
    }else {
      $.ajax({
            method: "POST",
            url: "/api/notes/" + thisId,
            data: newNote
          }).done(function(err, data) {
              // Log the response
              console.log(data);
              // Empty the notes section
              $("#form8" + thisId).val("");
              // $(".modalNote").modal("hide");
              window.location = "/saved"
          });
    }
  }

  function deleteNote() {
    // This function handles the deletion of notes
    // First we grab the id of the note we want to delete
    // We stored this data on the delete button when we created it
    var noteToDelete = $(this).data("_id");
    console.log("logging the id for delete", noteToDelete)
    // Perform an DELETE request to "/api/notes/" with the id of the note we're deleting as a parameter
    $.ajax({
      url: "/api/notes/" + noteToDelete,
      method: "DELETE"
    }).then(function() {
      // When done, hide the modal
      bootbox.hideAll();
    });
  }

  function clearArticles() {
    $.get("api/clear").then(function(data) {
      console.log(data)
      $("#handlebars-sandbox").empty();
      location.reload();
    });
  }

  
  

});