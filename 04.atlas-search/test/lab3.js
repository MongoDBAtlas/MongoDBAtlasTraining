const assert = require("assert")
const lab3 = require("../labs/lab3")

describe('lab3', function(){
    it('Should return \"[Fixed] Lab: Deploy a Replica Set\"', async function(){
        let results = await lab3.compoundSearch("test")
        //console.log(results)
        assert.equal(results["data"][0].post_title, "[Fixed] Lab: Deploy a Replica Set")
    })
    
})