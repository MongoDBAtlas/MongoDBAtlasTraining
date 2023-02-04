const { MongoClient } = require("mongodb");
const config = require("../config");
mongoClient = new MongoClient(config.atlasURI);
module.exports = {
  facetSearch: async function () {
    await mongoClient.connect();
    let db = mongoClient.db("forum_db");
    let posts_collection = db.collection("posts");

    pipeline = [
      {
        $searchMeta: {
          //TODO - use facets to create buckets for reply_count and return the number of records in each bucket, as well as the number of documents for each user.full_name
          index: "one_index",
          facet: {
            operator: {
              exists: {
                path: "reply_count",
              },
            },
            facets: {
              reply_count_facet: {
                type: "number",
                path: "reply_count",
                boundaries: [0, 5, 10, 15, 20],
                default: "More than 20",
              },
              username_facet: {
                type: "string",
                path: "user.full_name",
                numBuckets: 25,
              },
            },
          },
        },
      },
      {
        $limit: 20,
      },
    ];

    // return results as an array of json documents
    result = { query: pipeline };
    result["data"] = await posts_collection.aggregate(pipeline).toArray();
    await mongoClient.close();
    return result;
  },
};
