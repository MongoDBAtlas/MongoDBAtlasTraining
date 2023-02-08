const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://<username>:<password>@***.***.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);


async function run() {
    try {
      const database = client.db("handson");
      const userCollection = database.collection("user");

      const result = await userCollection.deleteOne({"ssn":"123-456-0001"});
      
      console.log(
        `${result.deletedCount} document(s) removed`,
      );


    } finally {
      await client.close();
    }
  }

  run().catch(console.dir);