const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://<username>:<password>@***.***.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);


async function run() {
    try {
        const database = client.db("sample_mflix");
        const userCollection = database.collection("movies");

        const pipeline = [
            {
              '$match': {
                'genres': 'Comedy'
              }
            }, {
              '$unwind': {
                'path': '$countries'
              }
            }, {
              '$group': {
                '_id': '$countries', 
                'count': {
                  '$sum': 1
                }
              }
            }
          ];


      const result = await userCollection.aggregate(pipeline);

      await result.forEach(console.dir);

    } finally {
      await client.close();
    }
  }


  run().catch(console.dir);