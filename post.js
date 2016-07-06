"use strict";
let mongoose = require('mongoose');

let postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  body: { type: String },
  comments: [ { body: String, date: Date, author: String }],
  insDate: { type: Date, default: Date.now },
  isPublic: Boolean,
  meta: {
    votes: Number,
    favs: Number
  }
});

module.exports = postSchema;
module.exports.set('toObject', { virtuals: true });
module.exports.set('toJSON', { virtuals: true });
