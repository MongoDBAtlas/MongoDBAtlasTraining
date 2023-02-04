const assert = require("assert")
const lab5 = require("../labs/lab5")

describe('lab5', function(){
    it('Should return post 189187', async function(){
        let results = await lab5.nearSearch("shard", new Date("2020-07-04"))
        assert.equal(results["data"][0].post_id, 189187)
    })
    
})