const { MongoClient } = require('mongodb');
const uri = process.env.ATLAS_URI;
const client = new MongoClient(uri);
var path = require('path');
require('dotenv').config({ path: __dirname + '/.env' });
const logger = require("./utilities/logger/logger")
const connectDb = async () => {
    try {
      await client.connect();
      const dbRole = await client.db().command({ hello: 1 });
      logger.info(`Role of database - Host: ${dbRole.me}  Is primary: ${dbRole.isWritablePrimary}`);
      //await client.close();
    } catch (e) {
      logger.error('db connection error: ', e.message);
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