const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x4k0q.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const toolCollection = client.db('best_tools').collection('tools');
        const reviewCollection = client.db('best_tools').collection('reviews');
        const userCollection = client.db('best_tools').collection('users');
        // const bookingCollection = client.db('best_tools').collection('booking');

        app.get('/tool', async (req, res) => {
            const query = {};
            const cursor = toolCollection.find(query);
            const tools = await cursor.toArray();
            res.send(tools);
        });

        // review POST
        app.post('/review', async (req, res) => {
            const newReview = req.body;
            const result = await reviewCollection.insertOne(newReview);
            res.send(result);
        });

        app.get('/review', async (req, res) => {
            const reviews = await reviewCollection.find().toArray();
            res.send(reviews);
        });

        // PUT
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            // const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({ result });
        });
        // 
        // app.get('/tool/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const item = await toolCollection.findOne(query);
        //     res.send(item);
        // });
        // // PUT
        // app.put('/tool/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const deliveredQuantity = req.body;
        //     console.log(deliveredQuantity);
        //     const filter = { _id: ObjectId(id) };
        //     const options = { upsert: true };
        //     const updateDoc = {
        //         $set: {
        //             quantity: deliveredQuantity.newQuantity
        //         }
        //     };
        //     const result = await toolCollection.updateOne(filter, updateDoc, options);
        //     res.send(result);
        // });

        // app.put('/tool/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const setQuantity = req.body;
        //     const filter = { _id: ObjectId(id) };
        //     const options = { upsert: true };
        //     const updateDoc = {
        //         $set: {
        //             quantity: setQuantity.newQuantity
        //         }
        //     };
        //     const result = await toolCollection.updateOne(filter, updateDoc, options);
        //     res.send(result);
        // });
        // 
    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello from Best Tool');
});

app.listen(port, () => {
    console.log(`Best Tool listening on port ${port}`);
});