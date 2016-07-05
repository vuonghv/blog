"use strict";
let assert = require('assert');
let express = require('express');
let superagent = require('superagent');
let wagner = require('wagner-core');

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
		server.close();
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
				assert.equal(result._id, POST_ID);
				assert.equal(result.title, TITLE);
				assert.equal(result.author, AUTHOR);
				assert.equal(result.body, BODY);
				done();
			});
		});
	});

});
