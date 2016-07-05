"use strict";
let mongoose = require('mongoose');
let userSchema = require('./user');
let postSchema = require('./post');

let model = function(wagner) {
    mongoose.connect('mongodb://localhost:27017/blog');

    let User = mongoose.model('User', userSchema);
    let Post = mongoose.model('Post', postSchema);

    let models = {
        User: User,
        Post: Post
    };

    for (let key in models) {
        wagner.factory(key, function() { return models[key] });
    }

    return models;
};

module.exports = model;
