const assert = require("assert")
const lab2 = require("../labs/lab2")

describe('lab2', function(){
    it('Should return \"Removing and re-adding a replica set member\"', async function(){
        let results = await lab2.autocomplete("Replic")
        assert.equal(results["data"][0].post_title, "Chapter 2 replication:Lab - initiate a replica set locally")
        await lab2.closeLab2Client()
    })
    
})