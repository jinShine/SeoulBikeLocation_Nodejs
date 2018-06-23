const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false }));

const seoulbikeRouter = require('./router/seoulbike_router');
app.use(seoulbikeRouter);

module.exports = app;


