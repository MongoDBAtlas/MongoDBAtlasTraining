const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://<username>:<password>@***.***.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);


async function run() {
    try {
      const database = client.db("handson");
      const userCollection = database.collection("user");

      const qeury = <<query>>;

      const result = await userCollection.deleteOne(qeury);
      
      console.log(
        `${result.deletedCount} document(s) removed`,
      );


    } finally {
      await client.close();
    }
  }

  run().catch(console.dir);