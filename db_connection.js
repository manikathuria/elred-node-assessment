const { MongoClient } = require('mongodb');
const uri = process.env.ATLAS_URI;
const client = new MongoClient(uri);
var path = require('path');
require('dotenv').config({ path: __dirname + '/.env' });
const logger = require("./utilities/logger/logger");
const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    await client.connect();
    logger.info(`Database connected!!`);
    mongoose.connect(
      process.env.ATLAS_URI,
      (err) => {
        if (err) logger.error(err)
        else logger.info("mongdb is connected");
      }
    );

    //await client.close();
  } catch (e) {
    logger.error('db connection error: ', e);
  }
};

const getDb = () => {
  //if (db == "" ) return;
  return client.db();
}

module.exports = {
  connectDb,
  getDb
}