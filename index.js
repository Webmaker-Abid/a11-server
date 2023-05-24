const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000; 



const uri = "mongodb+srv://student:5NUntyUuPtwPphas@cluster0.lddc2vn.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const db = client.db("allToys");
    const toys = db.collection("toysCollection");
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    app.get("/", async(req,res) => {
      const toysShop = await toys.find().toArray();
      res.send(toysShop);
    })

    app.get("/myToys/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await toys.find({
        sellerEmail: req.params.email}).toArray();
      res.send(result);
    });

    app.get("/:id", async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await toys.findOne(query);
      res.send(result);
    })

    

    app.post("/addToy", async(req,res) => {
      const info = req.body;
      const result = await toys.insertOne(info)
      console.log(info)
    })


    app.put("/:id", async(req,res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updateToy = req.body;
      const toy = {
        $set: {
          price: updateToy.price,
          quantity: updateToy.quantity,
          description: updateToy.description
        }
      }

      const result = await toys.updateOne(filter,toy,options)
      res.send(result)
    } )

    app.delete("/myToy/:id", async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await toys.deleteOne(query);
      res.send(result);
    })



  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});