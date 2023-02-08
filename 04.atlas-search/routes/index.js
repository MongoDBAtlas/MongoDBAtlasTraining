var express = require('express');
var router = express.Router();

const pbf = require("./prebuilt_functions");



//import labs
const lab1 = require('../labs/lab1')
const lab2 = require('../labs/lab2')
const lab3 = require('../labs/lab3')
const lab4 = require('../labs/lab4')
const lab5 = require('../labs/lab5')
const lab6 = require('../labs/lab6')
const lab7 = require('../labs/lab7')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// GET 20 recent posts
router.get('/recent', async function (req, res, next) {
  posts = await pbf.getRecentPosts();
  res.send(JSON.stringify(posts));
})

/* Lab 1 - Search Bar */
router.post('/forumsearch', async function (req, res) {
  try {
    let result;
    if (req.body.staffOnly) {
      result = await lab3.compoundSearch(req.body.searchText)
    } else if (req.body.searchText.indexOf("\"") > -1) {
      queryString = req.body.searchText
      queryString = queryString.replace("\"", "")
      queryString = queryString.replace("\"", "")
      console.log(queryString)
      result = await lab4.keywordSearch(queryString)
    } else if (req.body.date) {
      result = await lab5.nearSearch(req.body.searchText, new Date(req.body.date))
    } else if (req.body.advanced) {
      result = await lab6.queryStringSearch(req.body.searchText)
    }
    else {
      result = await lab1.basicSearch(req.body.searchText)
    }
    console.log(req.body)
    res.send(JSON.stringify(result))
  } catch (e) {
    console.log("It didn't work :(")
    console.log(e)
  }

})

/* Lab 2 - Autocomplete */
router.post('/autocomplete', async function (req, res) {
  try {
    let result = await lab2.autocomplete(req.body.searchText)
    console.log(req.body)
    res.send(JSON.stringify(result))
  } catch (e) {
    console.log("It didn't work :(")
    res.send(JSON.stringify({"error":"Autocomplete not functioning."}))
  }

})

/* Lab 7 - Facets */
router.get('/facets', async function (req, res, next) {
  try {
    facets = await lab7.facetSearch()
    res.send(JSON.stringify(facets));
  } catch (e) {
    console.log("It didn't work :(")
    console.log(e)
  }

})

module.exports = router;
