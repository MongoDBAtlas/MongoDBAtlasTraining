const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://<username>:<password>@***.***.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);


async function run() {
    try {
      const database = client.db("modeling");
      const versionCollection = database.collection("versioning");
      

      for (let i=0; i <100; i++)
      {
        const newUser = {
            schema_version: "2.0",
            ssn:"123-456-000"+i, 
            email:"user"+i+"@email.com", 
            name:"Gildong Hong "+i, 
            age: Math.floor(Math.random()*100),
            DateOfBirth: "1st Jan.", 
            Hobbies:["Martial arts"],
            Addresses:[{"Address Name":"Work","Street":"431, Teheran-ro GangNam-gu ","City":"Seoul", "Zip":"06159"}], 
            Phones:[{"type":"mobile","number":"010-5555-1234"}]
          };

        const result = await versionCollection.insertOne(newUser);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
      }

    } finally {
      await client.close();
    }
  }

  run().catch(console.dir);