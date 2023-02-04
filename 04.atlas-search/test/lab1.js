const assert = require("assert")
const lab1 = require("../labs/lab1")

describe('lab1', function () {
    it('Should return post 3983 (fuzzy) or post 5105 (synonyms)', async function () {
        let fuzzy = await lab1.basicSearch("reeplica sat")
        let synonyms = await lab1.basicSearch("crustacean")

        let passed = false
        if (fuzzy["data"].length > 0) {
            console.log("Lab 1: fuzzy search detected")
            if (fuzzy["data"][0].post_id == 3983) {
               
                passed = true
            }
        }

        if (synonyms["data"].length > 0) {
            console.log("Lab 1: synonym search detected")
            if (synonyms["data"][0].post_id == 5105) {
                passed = true
            }
        }



        assert.equal(passed, true)
    })
})