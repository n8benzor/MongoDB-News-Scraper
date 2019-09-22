$(document).ready(function () {

  $(document).on("click", "#scrape-articles", scrapeArticles);
  $(document).on("click", "#save-article", saveArticle);
  // $(document).on("click", ".unsave-btn", unsaveArticle);

  $(document).on("click", "#delete-article", deleteArticle);
  // $(document).on("click", "#comment-modal", commentArticle);
  $(document).on("click", "#save-comment", saveComment);
  $(document).on("click", "#clear-articles", clearArticles);

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
      // This function handles opening the notes modal and displaying our notes
    // We grab the id of the article to get notes for from the card element the delete button sits inside
    var currentArticle = $(this)
      .parents(".card")
      .data();
    console.log(currentArticle)
    // Grab any notes with this headline/article id
    $.get("/api/notes/" + currentArticle._id).then(function(data) {
      console.log(data)
      // Constructing our initial HTML to add to the notes modal
      var modalText = $("<div class='container-fluid text-center'>").append(
        $("<h4>").text("Notes For Article: " + currentArticle._id),
        $("<hr>"),
        $("<ul class='list-group note-container'>"),
        $("<textarea placeholder='New Note' rows='4' cols='60'>"),
        $("<button class='btn btn-success save'>Save Note</button>")
      );
      console.log(modalText)
      // Adding the formatted HTML to the note modal
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      var noteData = {
        _id: currentArticle._id,
        notes: data || []
      };
      console.log('noteData:' + JSON.stringify(noteData))
      // Adding some information about the article and article notes to the save button for easy access
      // When trying to add a new note
      $(".btn.save").data("article", noteData);
      // renderNotesList will populate the actual note HTML inside of the modal we just created/opened
      renderNotesList(noteData);
    });


    // var articleId = $(this).attr("data-articleId");
    // $(".modal").attr("data-articleId", articleId);
    // // $("#note-modal-title").empty();
    // $(".notes-list").empty();
    // $("#form8").val("");
    // $.ajax("/notes/article/" + articleId, {
    //   type: "GET"
    // }).then(
    //   function(data) {
    //     createModalHTML(data);
    //   }
    // );

    // // show the modal
    // $("#add-note-modal").modal("toggle");
  };



  function saveComment() {

    var noteData;
    var newNote = $("#form8")
      .val()
      .trim();
    // If we actually have data typed into the note input field, format it
    // and post it to the "/api/notes" route and send the formatted noteData as well
    if (newNote) {
      noteData = { _headlineId: $(this).data("article")._id, noteText: newNote };
      $.post("/api/notes", noteData).then(function() {
        // When complete, close the modal
        // bootbox.hideAll();
      });
    }

    // var thisId = $(this).attr("data-id");
    // var newNote = {
    //   body: $("#form8").val().trim()
    // }
    // console.log("logging thisID from app.js", thisId);
    // console.log("logging the text area input", newNote);
    // if (!$("#form8").val()) {
    //     alert("please enter a note to save")
    // }else {
    //   $.ajax({
    //         method: "POST",
    //         url: "/api/notes/" + thisId,
    //         data: newNote
    //       }).done(function(err, data) {
    //           // Log the response
    //           console.log(data);
    //           // Empty the notes section
    //           $("#form8" + thisId).val("");
    //           // $(".modalNote").modal("hide");
    //           // window.location = "/saved"
    //       });
    // }
  }

  function clearArticles() {
    $.get("api/clear").then(function(data) {
      console.log(data)
      $("#handlebars-sandbox").empty();
      location.reload();
    });
  }
})