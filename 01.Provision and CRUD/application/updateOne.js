const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://<username>:<password>@***.***.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);


async function run() {
    try {
      const database = client.db("handson");
      const userCollection = database.collection("user");

      const result = await userCollection.updateOne({"ssn":"123-456-7890"},{$set:{email:"kyudong.kim@mongodb.com"}});
      
      console.log(
        `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
      );


    } finally {
      await client.close();
    }
  }

  run().catch(console.dir);