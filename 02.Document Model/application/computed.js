const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://<username>:<password>@***.***.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

function getRandomTemperature(max) {
  return Math.floor(Math.random() * max);
}

async function run() {
    try {
      const database = client.db("modeling");
      const computedCollection = database.collection("computed");
      // create a document to insert
      const sensor_id = "12345";
      const bucket_range = 60;


      const device = {sensor_id:sensor_id, txCount: {$lt: bucket_range}};

      
      for (let i=0; i <100; i++)
      {
        let temp= getRandomTemperature (30);
        let mois = getRandomTemperature (50);
        let now = new Date();
        const updateQuery = {
            $setOnInsert: {sensor_id : sensor_id, start_date:now.toISOString()},
            $push: {measurements: {temperature: temp, moisture: mois ,timestamp: now.toISOString()}},
            $inc: {txCount:1, sum_temp: temp, sum_moisture: mois}
          };

        const result = await computedCollection.updateOne(device, updateQuery, {upsert:true});
      }

    } finally {
      await client.close();
    }
  }

  run().catch(console.dir);