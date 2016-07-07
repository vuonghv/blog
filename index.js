"use strict";
let express = require('express');
let wagner = require('wagner-core');

// Register model to wagner
require('./models')(wagner);

let app = express();

wagner.invoke(require('./auth'), { app: app });

app.use('/api/v1/', require('./api')(wagner));

app.listen(3000, function() {
  console.log('Blog app listening on port 3000.');
});
