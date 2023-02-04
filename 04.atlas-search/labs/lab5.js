const { MongoClient } = require("mongodb");
const config = require("../config");
const { post } = require("../routes");

module.exports = {
  nearSearch: async function (term, post_date) {
    mongoClient = new MongoClient(config.atlasURI);
    await mongoClient.connect();
    let db = mongoClient.db("forum_db");
    let posts_collection = db.collection("posts");
    pipeline = [
      // TODO: write a query to find all posts originally written near the user-specified date
      // the user's search input is provided in the variable "term" and the date variable is called "post_date"
      // limit results to 20 records.
      {
        $search: {
          index: "one_index",
          compound: {
            must: [
              {
                text: {
                  path: { value: "post_text", multi: "english" },
                  query: term,
                },
              },
              {
                near: {
                  path: "created_at",
                  origin: post_date,
                  pivot: 1,
                },
              },
            ],
          },
        },
      },
      { $limit: 20 },
    ];

    // return results as an array of json documents
    result = { query: pipeline };
    result["data"] = await posts_collection.aggregate(pipeline).toArray();
    await mongoClient.close();
    return result;
  },
};
