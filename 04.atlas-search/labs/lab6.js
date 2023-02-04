const { MongoClient } = require("mongodb");
const config = require("../config");
mongoClient = new MongoClient(config.atlasURI)
module.exports = {
    queryStringSearch : async function(term){
        
        await mongoClient.connect()
        let db = mongoClient.db("forum_db")
        let posts_collection = db.collection("posts")

        pipeline = [
            {
                "$search":{
                    //TODO - query the data using the query string operator. This will allow users to write advanced logic into their searches.
                    // the user's search input is provided in the variable "term"
                    
                        
                    
                }
            },
            {
                "$limit":20
            }
            
        ]

        // return results as an array of json documents
        result = {"query": pipeline};
        result["data"] = await posts_collection.aggregate(pipeline).toArray()
        await mongoClient.close()
        return result
    }
}