const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
const cors = require("cors");
// object id database 
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;

// envconfig
require('dotenv').config()
 
// middleware
app.use(cors());
app.use(express.json());
 
// user name:
// Password :
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l5n9e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
 
async function run() {
    try {
        await client.connect();
        console.log("database connect");
        // const database = client.db("kormuPulour");
        // const servicesCollection = database.collection("services");
       
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)
 
app.get('/', (req, res) => {
  res.send('Hello From Kormu paulour!')
})
 
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
