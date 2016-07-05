"use strict";
let bodyparser = require('body-parser');
let express =  require('express');
let status = require('http-status');

module.exports = function(wagner) {
    let api = express.Router();

    api.use(bodyparser.json());

    api.post('/posts', wagner.invoke(function(Post) {
        return function(req, res) {
            Post.create(req.body, function(err, doc) {
                if (err) {
                    return res.
                        status(status.BAD_REQUEST).
                        json({ error: err.toString() });
                }
                return res.json(doc);
            });
        };
    }));

    return api;
};
