const express = require('express');
const bodyParser = require('body-parser');
const logger = require("./utilities/logger/logger");
const cors = require("cors");
const indexRouter = require('./modules/index')
var path = require("path");
require('dotenv').config({ path: __dirname + '/.env' });
const { connectDb } = require('./db_connection');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

connectDb();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const whitelist = [
  '*'
];
app.use((req, res, next) => {
  const origin = req.get('referer');
  const isWhitelisted = whitelist.find((w) => origin && origin.includes(w));
  if (isWhitelisted) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
  }
  // Pass to next layer of middleware
  if (req.method === 'OPTIONS') res.sendStatus(200);
  else next();
});

const setContext = (req, res, next) => {
  if (!req.context) req.context = {};
  next();
};
app.use(setContext);

app.use('/', indexRouter);
app.use("/api", indexRouter);
app.use(function (req, res, next) {
  res.sendStatus(404);
});

app.listen(process.env.PORT, async () => {
  try {
    logger.info(`🚀 backend app running on port ${process.env.PORT}`);
  } catch (err) {
    logger.error("server error: ", err);
  }

});


