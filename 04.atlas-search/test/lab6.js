const assert = require("assert")
const lab6 = require("../labs/lab6")

describe('lab6', function(){
    it('Should return post 35743', async function(){
        let results = await lab6.queryStringSearch("post_title:community AND post_text:(student OR university)")
        //console.log(results["data"][0])
        assert.equal(results["data"][0].post_id, 35743)
    })
    
})