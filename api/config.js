const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const cors = require('cors');

module.exports = (() => {
  const app = express();

  app.set('port', process.env.PORT || 3080);
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors());

  app.use(errorHandler());

  return app;
})();
