const { MongoClient } = require("mongodb");
const config = require("../config");

module.exports = {
  compoundSearch: async function (term) {
    mongoClient = new MongoClient(config.atlasURI);
    await mongoClient.connect();
    let db = mongoClient.db("forum_db");
    let posts_collection = db.collection("posts");

    pipeline = [
      // TODO: write a compound query to search for whatever search term the user has entered and filter responses to just MongoDB staff
      // the user's search input is provided in the variable "term"
      // limit results to 20 records.
      {
        $search: {
          index: "one_index",
          compound: {
            must: {
              text: {
                query: term,
                path: "post_text",
              },
            },
            filter: {
              equals: {
                value: true,
                path: "mongodb_staff",
              },
            },
          },
        },
      },
    ];

    // return results as an array of json documents
    result = { query: pipeline };
    result["data"] = await posts_collection.aggregate(pipeline).toArray();
    await mongoClient.close();
    return result;
  },
};
