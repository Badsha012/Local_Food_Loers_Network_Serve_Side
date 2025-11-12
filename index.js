const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors=require('cors')
const app = express()
const port = 3000


app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Server is Running Found !')
})



const uri = "mongodb+srv://FoodLover-db:UNbqlMyjK1p4Fq5u@cluster0.cyspe14.mongodb.net/?appName=Cluster0";


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
    const db = client.db('FoodLover-db');
    const modelcollection = db.collection('FoodLovers')

       app.get('/FoodLovers', async (req, res) =>{

    const result = await modelcollection.find().toArray();
     res.send(result);
   })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
    
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
