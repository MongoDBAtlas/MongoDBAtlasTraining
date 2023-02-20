const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://<username>:<password>@***.***.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

function getRandomTemperature(max) {
  return Math.floor(Math.random() * max);
}

async function run() {
    try {
      const database = client.db("modeling");
      const userCollection = database.collection("bucket");
      // create a document to insert
      const sensor_id = "12345";
      const bucket_range = 5;


      const device = {sensor_id:sensor_id, transaction_count: {$lt: bucket_range}};

      
      for (let i=0; i <100; i++)
      {
        let temp= getRandomTemperature (30);
        let now = new Date();
        const updateQuery = {
            $setOnInsert: {sensor_id : sensor_id, start_date:now.toISOString()},
            $push: {measurements: {temperature: temp, timestamp: now.toISOString()}},
            $inc: {transaction_count:1, sum_temperature: temp}
          };

        const result = await userCollection.updateOne(device, updateQuery, {upsert:true});
      }

    } finally {
      await client.close();
    }
  }

  run().catch(console.dir);