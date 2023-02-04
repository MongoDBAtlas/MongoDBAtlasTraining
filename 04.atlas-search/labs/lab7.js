const { MongoClient } = require("mongodb");
const config = require("../config");
mongoClient = new MongoClient(config.atlasURI)
module.exports = {
    facetSearch: async function () {

        await mongoClient.connect()
        let db = mongoClient.db("forum_db")
        let posts_collection = db.collection("posts")

        pipeline = [
            {
                "$searchMeta": {
                    //TODO - use facets to create buckets for reply_count and return the number of records in each bucket, as well as the number of documents for each user.full_name

                    
                }

            },
            {
                "$limit": 20
            }

        ]

        // return results as an array of json documents
        result = { "query": pipeline };
        result["data"] = await posts_collection.aggregate(pipeline).toArray()
        await mongoClient.close()
        return result
    }
}