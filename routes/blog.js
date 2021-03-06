var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Blog = require('../models/blog.model');
var moment = require('moment');


router.get('/', function (req, res, next) {
    Blog.aggregate([
        {$match: {publish: true}},
        {$sort: {date: -1}}
    ]).exec(function (err, results) {
        if (err) {
            console.error(err);
            return res.render('error', {error: err, message: err.message});
        }
        results.forEach(function (item, index, array) {

            item.date = moment(results[index].date).fromNow();
            ;
            if (index === array.length - 1) {
                res.render('blog-dash',
                    {
                        title: "Blog",
                        marker: "Barnabas Nomo",
                        next: "Home",
                        blogs: results
                    });
            }
        });

    });
});

router.get('/J2nmnk209olq1RWfiq', function (req, res) {
    // console.log('getting all blogs');
    Blog.find({}).exec(function (err, results) {
        if (err) {
            res.send('an error has occurred' + err);
        }
        else {
            console.log("loaded blogs");
            res.json(results);
        }
    });
});


router.get('/title/:blog_title', function (req, res) {

    Blog.findOne({permalink: req.params.blog_title}).populate({
        path: 'author',
        select: 'firstname lastname'
    }).exec(function (err, blog) {
        if (err) {
            return console.log('an error has occurred' + err);
        }
        var isodate = blog.date;


        blog.date = moment(blog.date).format("ddd, MMMM Do YYYY");
        res.render('blog2', {blog: blog, isodate:isodate});
    });
});


module.exports = router;
