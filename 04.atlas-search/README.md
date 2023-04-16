<img src="https://companieslogo.com/img/orig/MDB_BIG-ad812c6c.png?t=1648915248" width="50%" title="Github_Logo"/>

# MongoDB Atlas Search Lab

This is a lab to help you gain experience using MongoDB Atlas Search. The original repo is [here](https://github.com/10gen/search_training_lab), but the repo is private.

In this lab, you will start with an unfinished application built to search through forum posts which are real-world data pulled from MongoDB's community forums.  
Your goal in each lab excercise is to complete the Atlas Search query pipeline. Outside of writing pipeline, you will not need to edit any code.

## Schedule

- [Setup](#prep-setup)
- [Lab 1: Fuzzy & Synonyms](#lab-1-fuzzy--synonyms)
- [Lab 2: Autocomplete](#lab-2-autocomplete)
- [Lab 3: Compound query](#lab-3-compound-query)
- [Lab 4: Search for full title - exact match](#lab-4-exact-match)
- [Lab 5: Distance Search - `near` operator](#lab-5-near-operator)
- [Lab 6: Advanced Search - `queryString` operator](#lab-6-querystring-operator)
- [Lab 7: Facets - bucketing search results](#lab-7-facets)
- [Lab 8: One indexing - Mix&Match](#lab-8-one-indexing)

## Prep: Setup

**Requisites**:

- Atlas cluster M0 or higher
- [mongorestore](https://www.mongodb.com/docs/database-tools/mongorestore/)([install](https://www.mongodb.com/try/download/database-tools))
- nodeJS
- npm

To get started, spin up an [Atlas M0 free tier](https://cloud.mongodb.com) using a cloud provider of your choice.  
While the cluster is being created, ensure that **nodeJS** and **npm** package manager are in place on your laptop.

From within `04.atlas-search/`,

1. run `npm install`
1. Copy `sample_config.js` and name it `config.js`. Set `atlasURI`
1. run `npm test`. All the unit tests should fail at the moment.
1. move to `04.atlas-search/data/` directory

From within `04.atlas-search/data/`,

5. run `tar -zxvf dump.tar.gz`
6. run `mongorestore <atlas URI>`
7. confirm `forum_db` is created and has 3 collections
   > posts  
   > replies  
   > synonyms

`````bash
data % mongorestore mongodb+srv://admin:*****@<<user atlas>>.mongodb.net/
2023-03-21T11:54:04.822+0900	WARNING: On some systems, a password provided directly in a connection string or using --uri may be visible to system status programs such as `ps` that may be invoked by other users. Consider omitting the password to provide it via stdin, or using the --config option to specify a configuration file with the password.
2023-03-21T11:54:05.601+0900	using default 'dump' directory
2023-03-21T11:54:05.601+0900	preparing collections to restore from
2023-03-21T11:54:05.612+0900	reading metadata for forum_db.posts from dump/forum_db/posts.metadata.json
2023-03-21T11:54:05.612+0900	reading metadata for forum_db.replies from dump/forum_db/replies.metadata.json
2023-03-21T11:54:05.612+0900	reading metadata for forum_db.synonyms from dump/forum_db/synonyms.metadata.json
2023-03-21T11:54:05.732+0900	restoring forum_db.posts from dump/forum_db/posts.bson
2023-03-21T11:54:05.744+0900	restoring forum_db.replies from dump/forum_db/replies.bson
2023-03-21T11:54:05.764+0900	restoring forum_db.synonyms from dump/forum_db/synonyms.bson
2023-03-21T11:54:05.780+0900	finished restoring forum_db.synonyms (1 document, 0 failures)
2023-03-21T11:54:06.734+0900	finished restoring forum_db.posts (5000 documents, 0 failures)
2023-03-21T11:54:08.585+0900	[#################.......]  forum_db.replies  34.2MB/46.2MB  (74.0%)
2023-03-21T11:54:09.656+0900	[########################]  forum_db.replies  46.2MB/46.2MB  (100.0%)
2023-03-21T11:54:09.656+0900	finished restoring forum_db.replies (34654 documents, 0 failures)
2023-03-21T11:54:09.656+0900	restoring users from dump/admin/system.users.bson
2023-03-21T11:54:09.703+0900	restoring roles from dump/admin/system.roles.bson
2023-03-21T11:54:09.774+0900	Failed: restore error: error running merge command: (Unauthorized) not authorized on admin to execute command { _mergeAuthzCollections: 1, tempUsersCollection: "admin.tempusers", tempRolesCollection: "admin.temproles", drop: false, db: "", writeConcern: { w: "majority" }, lsid: { id: UUID("bd28e6f6-76ee-4439-b76c-bff2785e2f05") }, $clusterTime: { clusterTime: Timestamp(1679367249, 5662), signature: { hash: BinData(0, 310FA0ECBA937791B82DCB7125EE2482C7964A7A), keyId: 7165675062429745153 } }, $db: "admin", $readPreference: { mode: "primary" } }
2023-03-21T11:54:09.774+0900	39655 document(s) restored successfully. 0 document(s) failed to restore.
`````

Back to `04.atlas-search/`,

8. run `npm start`
9. open `http://localhost:3000` from your browser

Right now if you type query into the application search box and hit the "Run Search" button, nothing happens.  
Let's fix that.

> You can check out the git branch `search-sol` to peek at the solutions for lab 1~7.

## Lab 1: Fuzzy & Synonyms

Create the first search index on `forum_db.posts`.

- index name: `language_index`
- analyzer: `lucene.english` for both index and search
- dynamic mapping: `true`

<img src="/04.atlas-search/images/image01.png" width="70%" height="70%">  

### Lab 1-a: Fuzzy search

1st fuzzy search query: open `labs/lab1.js` and complete the pipeline `$search` stage

- use `text` operator
- `term` is passed in for search term to use
- enable fuzzy search

> Now, unit test lab1 should pass  
> In the app, you will get results containing "replica set" when typing in typos like "reeplica sat"

<img src="/04.atlas-search/images/image02.png" width="80%" height="80%">   


### Lab 1-b: Synonym search

Update the index to enable synonyms

- synonym mapping name: `my-mapping`
- use `synonyms` for source collection
- analyzer: `lucene.english`

Following is configuration of Synonyms Mappings on the search index.
<img src="/04.atlas-search/images/image03.png" width="60%" height="60%">   

Update the query to support synonyms instead of fuzzy.

> Unit test lab1 should pass

`forum_db.synonyms` has an `equivalent` mapping for `["node", "server", "instance", "crustacean"]`.  
The first 3 make sense but why `crustacean`?  
It's because each and every document is likely to contain one of 3 so it's not easy to tell that our synonym really works. So the most unlikely synonym is added.  
You must be able to find documents with node, server, or instance if looking for `crustacean`.

<img src="/04.atlas-search/images/image04.png" width="80%" height="80%">   


## Lab 2: Autocomplete

Modify the index and support the simplest form of autocomplete on `post_title` field.  
Do not change any default values like `Max/Min Grams`, `Tokenization`, and `Fold Diacritics`.

<img src="/04.atlas-search/images/image05.png" width="70%" height="70%">  

Complete `labs/lab2.js` pipeline to support autocomplete on `post_title`.

Now unit test lab2 must pass.  
And the app will show search results as you type according to title.
<img src="/04.atlas-search/images/image06.png" width="70%" height="70%">  

## Lab 3: Compound query

Now time to implement advanced logic.  
For example, what if I want to do a text search but filter the result down to just posts by MongoDB employees?  
Add `$match` stage after `$search` can do but it's inefficient.  
You're better off letting Atlas Search handle filter.

To do that, we can use `compound` operator.

In the app UI, there's a checkbox, `Show Only MongoDB Employee Responses`.  
Let's make this work!

Leverage `mongodb_staff` field but you don't need to add it to the index because your index is dynamically mapped.

Use `compound` operator and complete `labs/lab3.js` pipeline to search by `post_text` and filter by `mongodb_staff`.

- `must`: `post_text`
- `filter`: `mongodb_staff`


<img src="/04.atlas-search/images/image07.png" width="80%" height="80%">  


Now unit test lab3 should pass.

## Lab 4: Exact match

**Use case**:  
If the user wraps a query in quotes, we want to find exactly matching phrase as a whole in the title.

Why not do with MongoDB native index using `$regex` on MQL `find` or aggregation `$match` stage?  
If not the term starts in the beginning of the field, it takes long to slide the term through the field. Atlas Search can do the job faster and better.

To support this, `keyword` analyzer should be used so create another index,

- index name: `keyword_index`
- analyzer: `lucene.keyword`
- field: `post_title`

<img src="/04.atlas-search/images/image08.png" width="70%" height="70%">  

Complete `labs/lab4.js` by using the new index.

Check if it works by entering `"How to add a modifier to a nested document with mongodb"` in the app.  
Don't forget to type in quotes too!

<img src="/04.atlas-search/images/image09.png" width="80%" height="80%">  


Now unit test lab4 should pass.

## Lab 5: `near` operator

While range query is supported by DB itself, Atlas Search allows you to find records near a given value like ISODate, number, or GeoJSON point fields.  
Moreover unlike range, `near` sorts out the result as per the distance from `origin`. It's especially powerful when with GeoJSON point.
- Use the "language_index" created lab1. (That is dynamic mapping)

In the `labs/lab5.js`, write a query to find posts created near a given date using `near` operator.

> **Hint**:  
> You need `compound` operator to run 2 operators
>
> - `text` for search term on `post_text`
> - `near` on `post_date`, use 1(ms) for `pivot` value

Run the app and check by entering a date into the date field and typing a term in the search field. Then hit `search` button.

Let's search the following record.   

<img src="/04.atlas-search/images/image10.png" width="70%" height="70%">  

Created on "2020-01-29" and it has "disagree" in the post_text.   

<img src="/04.atlas-search/images/image11.png" width="80%" height="80%">  


Now unit test lab5 should pass.

## Lab 6: `queryString` operator

So far, we've run a simple search. However, one of the common use cases is **Advanced Search** where users can combine searches on multiple fields using logical operators, `AND`, `OR`, `NOT`, or `()`.

> eg. `TERM1 OR (TERM2 AND TERM3))`

This can be accomplished in Atlas Search by using [`queryString`](https://www.mongodb.com/docs/atlas/atlas-search/queryString/) operator.

The `queryString` operator is not supported by language analyzer. So you need to create the 3rd index.

- index name: `qs_index`
- analyzer: `lucene.standard`
- dynamic: `true`

<img src="/04.atlas-search/images/image12.png" width="70%" height="70%">  


Complete `labs/lab6.js` and use the new `qs_index` and `queryString` operator with `defaultPath` to `post_text`.

<img src="/04.atlas-search/images/image13.png" width="80%" height="80%">  


Now unit test lab6 should pass.

## Lab 7: Facets

Facets allow users to group and aggregate data based on different properties(fields).  
Popular use case is a part of filter as in common e-Commerce product search.

All facet datatypes(`stringFacet`, `numberFacet`, `dateFacet`) are not covered by dynamic mapping. So index must explicitly declare facet fields even with `dynamic: true`.

Update `qs_index` and add `StringFacet` to `user.full_name` field, `NumberFacet` to `reply_count` field.

Add Field Mapping in Edit mode.   

<img src="/04.atlas-search/images/image14.png" width="70%" height="70%">  

The final index looks like this.   

<img src="/04.atlas-search/images/image15.png" width="70%" height="70%">  

Complete `labs/lab7.js` pipeline to use `$searchMeta` stage.

- First, filter out valid documents by `reply_count`
- define numberFacet
  - facet name: `reply_count_facet`
  - path: `reply_count`
  - boundaries: 0, 5, 10, 15, 20
  - default: `"More than 20"`
- define stringFacet
  - facet name: `username_facet`
  - path: `user.full_name`
  - number of buckets: 25

When you reload the search app, you can see Facets on left menu.

<img src="/04.atlas-search/images/image16.png" width="80%" height="80%">  


**note**: Other facet names than set above cannot pass the unit test lab7.

Now unit test lab7 should pass.

## Lab 8: One indexing

So far, you've created 3 indexes. If your cluster is M0 free tier, it has used up the max number of indexes.  
You can combine 3 indexes into one unified version.

> You can check out the branch, `search-sol8` for updated queries to use one index
