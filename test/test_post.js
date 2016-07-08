"use strict";
let assert = require('assert');
let express = require('express');
let superagent = require('superagent');
let wagner = require('wagner-core');
let status = require('http-status');

let URL_ROOT = 'http://localhost:3000';

describe('Post API', function() {
	let server;
	let Post;

	before(function() {
		let app = express();

		let models = require('../models')(wagner);
		app.use(require('../api')(wagner));

		server = app.listen(3000);

		Post = models.Post;
	});

	after(function() {
    if (server) { server.close(); }
	});

	beforeEach(function(done) {
		// Make sure Posts are empty before each test
		Post.remove({}, function(error) {
			assert.ifError(error);
			done();
		});
	});

	it('can load a post by id', function(done) {
		let POST_ID = '000000000000000000000001';
		let TITLE = 'How to write JS code';
		let AUTHOR = 'vuonghv';
		let BODY = 'Blah Blah ...';
		let post = {
			title: TITLE,
			author: AUTHOR,
			body: BODY,
			_id: POST_ID
		};
		Post.create(post, function(error, doc) {
			assert.ifError(error);
			let url = URL_ROOT + '/posts/' + POST_ID;
			superagent.get(url, function(error, res) {
				assert.ifError(error);
				let result;
				assert.doesNotThrow(function() {
					result = JSON.parse(res.text);
				});

				assert.ok(result);
        assert.equal(res.status, status.OK);
				assert.equal(result._id, POST_ID);
				assert.equal(result.title, TITLE);
				assert.equal(result.author, AUTHOR);
				assert.equal(result.body, BODY);
				done();
			});
		});
	});

  it('return 404 when load a non-exist post id', function(done) {
		let POST_ID = '000000000000000000000001';
    let url = URL_ROOT + '/posts/' + POST_ID;
    superagent.get(url, function(error, res) {
      assert.throws(() => { assert.ifError(error); }, Error);
      assert.equal(res.status, status.NOT_FOUND);
      done();
    });
  });

  it('can POST a new post', function(done) {
		let TITLE = 'How to write JS code';
		let AUTHOR = 'vuonghv';
		let BODY = 'Blah Blah ...';
		let payload = {
			title: TITLE,
			author: AUTHOR,
			body: BODY
		};
    let url = URL_ROOT + '/posts/';
    superagent.post(url)
      .send(payload)
      .end(function(error, res) {
        assert.ifError(error);
        assert.equal(res.status, status.CREATED);
        let result;
        assert.doesNotThrow(() => { result = JSON.parse(res.text); });
        assert.ok(result);
        assert.equal(result.title, TITLE);
        assert.equal(result.author, AUTHOR);
        assert.equal(result.body, BODY);
        done();
      });
  });

  it('can get list of posts', function(done) {
    let post1 = {
      title: 'How to write JS code',
      author: 'vuonghv',
      body: 'blah blah'
    };
    let post2 = {
      title: 'How to write C code',
      author: 'vuonghv',
      body: 'BLAH BLAH'
    };

    Post.create([post1, post2], function(error, posts) {
      assert.ifError(error);

      // sort by title, ascending
      let url = URL_ROOT + '/posts/?title=1';
      superagent.get(url, function(error, res) {
        assert.ifError(error);
        assert.equal(res.status, status.OK);
        let result;
        assert.doesNotThrow(() => { result = JSON.parse(res.text); });
        assert.equal(result.posts.length, 2);
        assert.equal(result.posts[0].title, 'How to write C code');
        assert.equal(result.posts[1].title, 'How to write JS code');
      });

      // sort by title, ascending
      url = URL_ROOT + '/posts/?title=-1';
      superagent.get(url, function(error, res) {
        assert.ifError(error);
        assert.equal(res.status, status.OK);
        let result;
        assert.doesNotThrow(() => { result = JSON.parse(res.text); });
        assert.equal(result.posts.length, 2);
        assert.equal(result.posts[0].title, 'How to write JS code');
        assert.equal(result.posts[1].title, 'How to write C code');
      });

      // sort by title, ascending
      url = URL_ROOT + '/posts/?limit=1';
      superagent.get(url, function(error, res) {
        assert.ifError(error);
        assert.equal(res.status, status.OK);
        let result;
        assert.doesNotThrow(() => { result = JSON.parse(res.text); });
        assert.equal(result.posts.length, 1);
        done();
      });
    });
  });

});
