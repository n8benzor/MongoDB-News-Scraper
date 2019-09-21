$(document).ready(function () {

  $(document).on("click", "#scrape-articles", scrapeArticles);
  $(document).on("click", "#save-article", saveArticle);

  $(document).on("click", "#delete-article", deleteArticle);
  $(document).on("click", "#comment-article", commentArticle);
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
      .parents(".card")
      .remove();

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
        // Run the initPage function again. This will reload the entire list of articles
        // initPage();
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
  }


  function commentArticle(event) {
    // This function handles opening the notes modal and displaying our notes
    // We grab the id of the article to get notes for from the card element the delete button sits inside
    var currentArticle = $(this)
      .parents(".card")
      .data();
    console.log(currentArticle)
    // Grab any notes with this headline/article id
    $.get("/api/notes/" + currentArticle._id).then(function(data) {
      console.log(data)
     
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
  }


  // function renderNotesList(data) {
  //   // This function handles rendering note list items to our notes modal
  //   // Setting up an array of notes to render after finished
  //   // Also setting up a currentNote variable to temporarily store each note
  //   var notesToRender = [];
  //   var currentNote;
  //   if (!data.notes.length) {
  //     // If we have no notes, just display a message explaining this
  //     currentNote = $("<li class='list-group-item'>No notes for this article yet.</li>");
  //     notesToRender.push(currentNote);
  //   } else {
  //     // If we do have notes, go through each one
  //     for (var i = 0; i < data.notes.length; i++) {
  //       // Constructs an li element to contain our noteText and a delete button
  //       currentNote = $("<li class='list-group-item note'>")
  //         .text(data.notes[i].noteText)
  //         .append($("<button class='btn btn-danger note-delete'>x</button>"));
  //       // Store the note id on the delete button for easy access when trying to delete
  //       currentNote.children("button").data("_id", data.notes[i]._id);
  //       // Adding our currentNote to the notesToRender array
  //       notesToRender.push(currentNote);
  //     }
  //   }
  //   // Now append the notesToRender to the note-container inside the note modal
  //   $(".note-container").append(notesToRender);
  // }

  function saveComment() {
    // const thisId = $(this).attr("data-id");
      // This function handles what happens when a user tries to save a new note for an article
      // Setting a variable to hold some formatted data about our note,
      // grabbing the note typed into the input box
      const noteData;
      const newNote = $("#form8").val().trim();
      // If we actually have data typed into the note input field, format it
      // and post it to the "/api/notes" route and send the formatted noteData as well
      if (newNote) {
        noteData = { _headlineId: $(this).data("article")._id, noteText: newNote };
        $.post("/api/notes", noteData).then(function() {
          // When complete, close the modal
          // $('.modal').on('click', hideall);
        });
      }
  }

  function clearArticles() {
    $.get("api/clear").then(function(data) {
      console.log(data)
      $("#handlebars-sandbox").empty();
      // initPage();
      location.reload();
    });
  }
})