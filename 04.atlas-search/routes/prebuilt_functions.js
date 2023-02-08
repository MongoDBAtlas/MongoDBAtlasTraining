const config = require("../config");
const { MongoClient } = require("mongodb");

module.exports = {
    getRecentPosts: async function () {
        try {
            const client = new MongoClient(config.atlasURI);
            await client.connect();
            const collection = client.db("forum_db").collection("posts");
            let result = await collection.find().sort().limit(20).toArray() // sort & limit to 20 - may want to build index
            await client.close();
            return result
        } catch (e) {
            console.log("It didn't work :(")
            console.log(e)
        }

    }
}