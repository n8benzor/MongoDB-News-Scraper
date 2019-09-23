const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
const NoteSchema = new Schema({
  // `noteText` is of type String
  body: {
    type: String
  }
  ,
  date: {
    type: Date,
    default: Date.now
  }
  // article: {
  //     type: Schema.Types.ObjectId,
  //     ref: "Article"
  // }
});

// This creates our model from the above schema, using mongoose's model method
const Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
