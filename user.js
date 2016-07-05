let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        match: /[a-zA-Z0-9._]+@\w+\.\w+/
    },
    firstName: { type: String },
    lastName: { type: String },
    picture: {
        type: String,
        match: /^https?:\/\//i
    }
    insDate: { type: Date, default: Date.now },
    updDate: { type: Date },
    oauth: {
        type: String,
        required: true
    }
    posts: [ { type: mongoose.Schema.Types.ObjectId }],
});

module.exports = userSchema;
module.exports.set('toObject', { virtuals: true });
module.exports.set('toJSON', { virtuals: true });
