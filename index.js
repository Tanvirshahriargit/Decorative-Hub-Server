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
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    console.log("database connect");
    const database = client.db("Decorative_Hub");
    const productsCollection = database.collection("products");
    const ordersCollection = database.collection("orders");
    const usersCollection = database.collection("users");
    const reviewCollection = database.collection("review");
    

    // Get Api Gell Single Services
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await productsCollection.findOne(query)
      res.json(result)
    })
    // Get Api Gell All Services
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({})
      const result = await cursor.toArray();
      res.send(result)
    })

    //  Post Api Add Products
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product)
      res.json(result)
    })

    // Deleted Products
    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await productsCollection.deleteOne(query)
      res.json(result)
    })

    // post order
    app.post('/orders', async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order)
      res.json(result)
    })

    // Get Email with all orders
    app.get('/orders', async (req, res) => {
      const email = req.query.email;
      const query = {email: email}
      const cursor = ordersCollection.find(query)
      const order = await cursor.toArray()
      res.json(order)
    })

    // Get Api Gell All orders
    app.get("/orders", async (req, res) => {
      const cursor = ordersCollection.find({})
      const result = await cursor.toArray();
      res.send(result)
    })
    
    // Deleted Order
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await ordersCollection.deleteOne(query)
      res.json(result)
    })

    // status update
  app.put("/orders/:id", async (req, res) => {
    const filter = { _id: ObjectId(req.params.id) };
    console.log(req.params.id);
    const result = await ordersCollection.updateOne(filter, {
      $set: {
        status: req.body.status,
      },
    });
    res.send(result);
    console.log(result);
  });

    // Admin Check 
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email }
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user.role === 'admin' ) {
        isAdmin = true;
      }
      res.json({admin: isAdmin});
    })

    // users added post api 
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user)
      console.log(result);
      res.json(result)
    })

    // user upset api put 
    app.put('/users', async (req, res)=>{
      const user = req.body;
      const filter = { email: user.email }
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(filter, updateDoc, options)
      res.json(result)
    })

    // Make Admin Role 
    app.put('/users/admin', async (req, res) => {
      const user = req.body;
      console.log("put",user);
      const filter = { email: user.email }
      const updateDoc = { $set: { role: 'admin' } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    })
      //  Post Api Add Reviews
      app.post("/review", async (req, res) => {
        const product = req.body;
        const result = await reviewCollection.insertOne(product)
        res.json(result)
      })
     // Get Api Gell All Reviews
     app.get("/review", async (req, res) => {
      const cursor = reviewCollection.find({})
      const result = await cursor.toArray();
      res.send(result)
    })

  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello From Decorative-Hub!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
