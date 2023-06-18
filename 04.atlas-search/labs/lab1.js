const { MongoClient } = require("mongodb");
const config = require("../config");

module.exports = {
  basicSearch: async function (term) {
    mongoClient = new MongoClient(config.atlasURI);
    await mongoClient.connect();
    let db = mongoClient.db("forum_db");
    let posts_collection = db.collection("posts");

    pipeline = [
      // TODO: query MongoDB using Atlas Search to allow searching a term using the English analyzer
      // the user's search input is provided in the variable "term"
      // limit results to 20 records
    ];

    // return results as an array of json documents
    result = { query: pipeline };
    result["data"] = await posts_collection.aggregate(pipeline).toArray();
    await mongoClient.close();
    return result;
  },
};
