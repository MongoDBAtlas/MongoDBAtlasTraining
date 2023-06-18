const { MongoClient } = require("mongodb");
const config = require("../config");
mongoClient = new MongoClient(config.atlasURI);
module.exports = {
  autocomplete: async function (term) {
    await mongoClient.connect();
    let db = mongoClient.db("forum_db");
    let posts_collection = db.collection("posts");

    pipeline = [
      {
        $search: {
          //TODO - query the data using the autocomplete index. Do not use fuzzy matching, stick with all the autocomplete defaults.
          // the user's search input is provided in the variable "term"
        },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          post_title: 1,
        },
      },
    ];

    // return results as an array of json documents
    result = { query: pipeline };
    result["data"] = await posts_collection.aggregate(pipeline).toArray();
    return result;
  },
  closeLab2Client: async function () {
    return await mongoClient.close();
  },
};
