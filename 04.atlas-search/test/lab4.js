const assert = require("assert")
const lab4 = require("../labs/lab4")

describe('lab4', function(){
    it('Should return post id 204499', async function(){
        let results = await lab4.keywordSearch("How to add a modifier to a nested document with mongodb")
        assert.equal(results["data"][0].post_id, 204499)
    })
})