const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://<username>:<password>@***.***.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);


async function run() {
    try {
      const database = client.db("handson");
      const userCollection = database.collection("user");
      // create a document to insert
      const newUser = {name:"Kyudong"};

      const result = await userCollection.insertOne(newUser);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
      await client.close();
    }
  }

  run().catch(console.dir);