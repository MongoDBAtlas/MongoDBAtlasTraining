const { MongoClient } = require("mongodb");
const config = require("../config");

module.exports = {
    keywordSearch : async function(term){
        mongoClient = new MongoClient(config.atlasURI)
        await mongoClient.connect()
        let db = mongoClient.db("forum_db")
        let posts_collection = db.collection("posts")

        pipeline = [
            // TODO: write a query that uses an index with the keyword analyzer to find a specific term or phrase
            // the user's search input is provided in the variable "term". Limit results to 20 records.
            
        ]

        // return results as an array of json documents
        result = {"query":pipeline}
        result["data"] = await posts_collection.aggregate(pipeline).toArray()
        await mongoClient.close()
        return result
    }
}