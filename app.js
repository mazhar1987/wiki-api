/**
 * Require the npm libraries
 */
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


/**
 * Make app for express
 */
const app = express();


/**
 * Make Port
 */
let port = process.env.PORT || 3000;


/**
 * Set ejs
 */
app.set("view engine", "ejs");


/**
 * Use body parser
 */
app.use(bodyParser.urlencoded({
    extended: true
}));


/**
 * Store static files
 */
app.use(express.static("public"));


/**
 * Connect mongodb
 */
mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});


/**
 *  Create article schema
 */ 
const articleSchema = {
    title: String,
    content: String
};


/**
 * Create article model
 */
const Article = mongoose.model("Article", articleSchema);


/**
 * Request targeting All Articles
 */
app.route("/articles")
.get(function (req, res) {
    Article.find(
        {}, 
        function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        }
    );        
})
.post(function (req, res) {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(
        function (err) {
            if (!err) {
                res.send("Successfully added new article.");
            } else {
                res.send(err);
            }
        }
    );        
})
.delete(function (req, res) {
    Article.deleteMany(
        function (err) {
            if (!err) {
                res.send("Successfully deleted all articles.");
            } else {
                res.send(err);
            }
        }
    );        
});


/** 
 * Request targeting specifing article
 */ 
app.route("/articles/:articleTitle")
.get(function (req, res) {
    Article.findOne(
        {title: req.params.articleTitle}, 
        function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title was found.");
            }
        }
    );
})
.put(function (req, res) {
    Article.update(
        {title: req.params.articleTitle}, 
        {title: req.body.title, content: req.body.content}, 
        {overwrite: true}, 
        function (err) {
            if (!err) {
                res.send("Successfully updated the article.");
        }
        }
    );
})
.patch(function (req, res) {
    Article.update(
        {title: req.params.articleTitle}, 
        {
            $set: req.body
        }, 
        function (err) {
            if (!err) {
                res.send("Successfully updated the article patch.");
            } else {
                res.send(err);
            }
        }
    );
})
.delete(function (req, res) {
    Article.deleteOne(
        {title: req.params.articleTitle},
        function (err) {
            if (!err) {
                res.send("Successfully deleted the article");
            } else {
                res.send(err);
            }
        }
    );
});
 

/**
 * Server starting
 */
app.listen(port, function () {
    console.log(`The server is running on http://localhost:${port}`);
});