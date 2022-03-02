const { MongoClient, ObjectId } = require("mongodb");
const express = require('express')
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// Replace the uri string with your MongoDB deployment's connection string.
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a9icx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    const database = client.db('likebunnies');
    const post = database.collection('post');

    // Get Api Create 
    app.get('/post', async( req, res) =>{
        const result =   await post.find({}).toArray()
        res.json(result)
    });

    // Post Api Create 
    app.post('/post', async( req, res) =>{
        const data = req.body
        const placeItem = await post.insertOne(data);
        res.json(placeItem)
    });

    //Delete Api Create 
    app.delete('/post/:id', async( req, res) =>{
        const id = req.params.id;
        const query ={ _id: ObjectId(id)};
        const result = await post.deleteOne(query);
        if (result.deletedCount === 1) {
        console.log("Successfully deleted one document.");
        } else {
        console.log("No documents matched the query. Deleted 0 documents.");
        }
        res.json(result)
    });
    // Update Api Create 
    // const filter = { rated: "G" };
    // // increment every document matching the filter with 2 more comments
    // const updateDoc = {
    //   $set: {
    //     random_review: `After viewing I am ${
    //       100 * Math.random()
    //     }% more satisfied with life.`,
    //   },
    // };
    // const result = await movies.updateMany(filter, updateDoc);
    // console.log(`Updated ${result.modifiedCount} documents`);
    
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send("Server Running")
})
app.listen( port , () =>{
    console.log("Server Running", port)
})


