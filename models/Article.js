const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String,
        required: true
    },
    // summary: {
    //     type: String,
    //     required: true
    // },
    // picture: {
    //     type: String,
    //     required: true
    // },
    // timestamp: {
    //     type: Date,
    //     default: Date.now
    // },
    // saved: {
    //     type: Boolean,
    //     default: false
    // },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;