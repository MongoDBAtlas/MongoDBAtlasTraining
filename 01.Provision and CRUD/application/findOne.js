const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://<username>:<password>@***.***.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);


async function run() {
    try {
      const database = client.db("handson");
      const userCollection = database.collection("user");

      const result = await userCollection.findOne();
      console.log(`Find One Record: ${result._id}`);

      const query = {};

      const result2 = await userCollection.findOne(query);
      console.log(`Find One Record by SSN: ${result2._id}`);

    } finally {
      await client.close();
    }
  }

  run().catch(console.dir);