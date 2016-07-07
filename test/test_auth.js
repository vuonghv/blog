"use strict";
let assert = require('assert');
let express = require('express');
let superagent = require('superagent');
let wagner = require('wagner-core');
let status = require('http-status');

let URL_ROOT = 'http://localhost:3000';

describe('Post API', function() {
	let server;
	let User;

	before(function() {
		let app = express();

		let models = require('../models')(wagner);
    wagner.invoke(require('../auth'), { app: app });
		app.use(require('../api')(wagner));

		server = app.listen(3000);

		User = models.User;
	});

	after(function() {
		server.close();
	});

	beforeEach(function(done) {
		// Make sure Users are empty before each test
		User.remove({}, function(error) {
			assert.ifError(error);
			done();
		});
	});

  it('can authenticate an user', function(done) {
		let USERNAME = 'vuonghv';
		let PASSWORD = '23aaoiadfa';
		let EMAIL = 'vuonghv.cs@gmail.com';
		let payload = {
      username: USERNAME,
      password: PASSWORD
		};

    User.create({
        username: USERNAME,
        password: PASSWORD,
        email: EMAIL
      },
      function(err, user) {
        assert.ifError(err);
        let url = URL_ROOT + '/login/';
        superagent
          .post(url)
          .send(payload)
          .end(function(err, res) {
            assert.ifError(err);
            assert.equal(res.status, status.OK);

            let result;
            assert.doesNotThrow(function() {
              result = JSON.parse(res.text);
            });

            assert.ok(result);
            assert.equal(result.username, USERNAME);
            assert.equal(result.password, PASSWORD);
            assert.equal(result.email, EMAIL);
            done();
          });
    });
  });
});
