const MongoClient = require('mongodb').MongoClient
const url = "mongodb://localhost:27017"
const dbName = process.env.DATABASE_NAME
const client = new MongoClient(url, {useUnifiedTopology:true, useNewUrlParser: true})

client.connect()
const db = client.db(dbName)

module.exports = db
