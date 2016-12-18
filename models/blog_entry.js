'use strict';

var mongoose = require('mongoose');
//var ObjectId = mongoose.Schema.Types.ObjectId;

//-------------------------------------------------------------------------------
var blogEntrySchema = mongoose.Schema({
  author: String,			// Blog's author
  creationDate: Date,	// Creation date of the entry
  title: String,			// Entry's title
  content: String,		// The entry's content
  labels: [String]		// Labels for classification
});

//-------------------------------------------------------------------------------
module.exports = mongoose.model('blogEntry', blogEntrySchema);
