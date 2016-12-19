var express = require('express');
var sanitize = require('mongo-sanitize');
var router = express.Router();
var mongoose = require('mongoose');

const BlogEntry = require('../models/blog_entry.js');
const BlogName = 'Blog Technogi'

//------------------------------------------------------------------------------
// Converting an asychronous function into an ES6 promise.
//------------------------------------------------------------------------------
function promisify(func) {
  return function (/* nothing */) {
    return new Promise((resolve, reject) => {
      let args = Array.prototype.slice.call(arguments);
      args.push((err, ...result) => {
        if (err) reject(err);
        else resolve(result);
      });
      func.apply(null, args);
    });
  };
}

/* GET home page. */
router.get('/', function(req, res, next) {
	var BlogEntries = mongoose.model('blogEntry');

	// Get all blog entries for display to the user
	BlogEntries.find(function (err, blogEntries) {
		if (err) {
			console.log("ERROR: couldn't retrieve values from Blog Entries.");
  		res.render('index', { title: BlogName, blogEntries: [] });
  		return;
		}
		//console.log(blogEntries);
  	res.render('index', { title: BlogName, blogEntries: blogEntries });
  	return;
	});
});

router.get('/new_entry', function (req, res, next) {
	res.render('new-entry', { title: BlogName });
});

router.post('/new_entry', function (req, res, next) {
	// Get entry's data from the user and sanitize results
	let author = sanitize(req.body.author);
	var labels = sanitize(req.body.labels).split(',');
	for (var i = 0; i<labels.length; i++) {
		labels[i] = labels[i].trim();
	}
	let title = sanitize(req.body.title);
	let content = sanitize(req.body.content);

	// Save results on MongoDB and redirect to homepage
	let blogEntry = new BlogEntry({
		author: author,
		creationDate: new Date,
		title: title,
		content: content,
		labels: labels
	});

	res.redirect('/');
	return promisify(blogEntry.save());
});

router.get('/post', function (req, res, next) {
	// Get MongoDB _id from URL and use it to find entry (post)
	var id = req.query.id;
	BlogEntry.findById(id, function (err, entry) {
		if (err) {
			res.render('/');
			return;
		}
		res.render('post', { title: BlogName, post: entry });
	});
});

module.exports = router;
