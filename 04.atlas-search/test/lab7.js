const assert = require("assert")
const lab7 = require("../labs/lab7")

describe('lab7', function(){
    it('Should return 5 buckets for reply count and the first username should be Jon Streets', async function(){
        let results = await lab7.facetSearch();
        assert.equal(results["data"][0]["facet"]["reply_count_facet"]["buckets"].length, 5)
        assert.equal(results["data"][0]["facet"]["username_facet"]["buckets"][0]["_id"], "Jon Streets")
    })
    
})