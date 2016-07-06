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
          return res
            .status(status.BAD_REQUEST)
            .json({ error: err.toString() });
        }
        return res.status(status.CREATED).json(doc);
      });
    };
  }));

  api.get('/posts/:id', wagner.invoke(function(Post) {
    return function(req, res) {
      Post.findOne({ _id: req.params.id }, function(err, doc) {
        if (err) {
          return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json({ error: err.toString() });
        }

        if (!doc) {
          return res
            .status(status.NOT_FOUND)
            .json({ error: 'Not found' });
        }

        res.json(doc);
      });
    };
  }));

  api.get('/posts', wagner.invoke(function(Post) {
    return function(req, res) {
      let sort = { insDate: -1 };
      if (req.query.title === '1') {
        sort = { title: 1 };
      } else if (req.query.title === '-1') {
        sort = { title: -1 };
      }
      let limit = parseInt(req.query.limit);

      let query = Post.find({});
      if (limit > 0) query.limit(limit);
      query
        .sort(sort)
        .exec(handleMany.bind(null, 'posts', res));
    };
  }));

  return api;
};

function handleMany(property, res, error, result) {
  if (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: error.toString() });
  }

  let obj = {};
  obj[property] = result;
  res.json(obj);
}
