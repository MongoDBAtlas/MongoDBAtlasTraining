function getLatestPosts(){
    fetch("http://localhost:3000/recent").then((result) => {
        result.json().then((data) => {
            rebuildTable(data)
        })
    })
}

function runSearch(advanced){
    // runs basic search
    searchData = {
        "searchText": document.getElementById("searchText").value,
        "searchTopicFilters": getTopicList(),
        "staffOnly": document.getElementById("staffResponseOnly").checked,
        "date": document.getElementById("inptDate").value,
        "advanced":advanced
    }

    fetch("http://localhost:3000/forumsearch",{
        method:"POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(searchData)
    }).then((result) => {
        result.json().then((data) => {
            console.log(data)
            rebuildTable(data["data"])
        })
    })
}

function runAdvancedSearch(){
    // runs advanced search, query string should be typed into search bar
}

function rebuildTable(data){
    let table = document.getElementById("resultTable");
    while(table.hasChildNodes()){
        table.removeChild(table.firstChild)
    }
    
    // build rows
    data.forEach((doc) => {
        let newRow = document.createElement("tr");
        
        //title
        let newColTitle = document.createElement("td")
        newColTitleLink = document.createElement("a")
        newColTitleLink.setAttribute("href",doc.post_url)
        newColTitleLink.setAttribute("target","_blank")
        newColTitleLink.innerHTML = doc.post_title;
        newColTitle.appendChild(newColTitleLink)
        newRow.appendChild(newColTitle)

        //author
        let newColAuthor = document.createElement("td");
        newColAuthor.innerHTML = doc.user.full_name
        newRow.appendChild(newColAuthor)

        //reply count
        let newColReplies = document.createElement("td");
        newColReplies.innerHTML = doc.reply_count;
        newRow.appendChild(newColReplies);

        //post text
        let newColPostText = document.createElement("td");
        newColPostText.innerHTML = doc.post_text_html;
        newRow.appendChild(newColPostText);

        table.appendChild(newRow)
    })
}

function getTopicList(){
    // returns list of sidebar topics with checkmark
    let topics = []
    let topicCheckboxIDs = [
        "replicaSet",
        "shardedCluster",
        "atlas",
        "community"
    ]

    topicCheckboxIDs.forEach((id) => {
        let checkbox = document.getElementById(id);
        if(checkbox.checked){
            topics.push(checkbox.getAttribute("name"))
        }
    })

    return topics
}

// Autocomplete
function autocomplete(inp) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", async function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        arr = await getAutocompleteOptions(val)
        console.log(arr)
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (true) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            boldItem = arr[i].replace(val,"<strong>" + val + "</strong>")
            b.innerHTML = boldItem
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
  }

async function getAutocompleteOptions(term){
    searchData = {
        "searchText": term
    }

    fetchResult = await fetch("http://localhost:3000/autocomplete",{
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(searchData)
        })
    fetchResultJson = await fetchResult.json()
    console.log(fetchResultJson)
    autocompleteList = []
    fetchResultJson["data"].forEach((record) => {
        autocompleteList.push(record.post_title)
    })
    return autocompleteList
    

    // fetch("http://localhost:3000/autocomplete",{
    //     method:"POST",
    //     headers: {
    //         "Content-Type":"application/json"
    //     },
    //     body: JSON.stringify(searchData)
    // }).then((result) => {
    //     result.json().then((data) => {
    //         autocompleteList = []
    //         data.forEach((record) => {
    //             autocompleteList.push(record.post_title)
    //         })
    //         return autocompleteList
    //     })
    // })
}


// Get facets
function getFacets(){
    fetch("http://localhost:3000/facets").then((result) => {
        result.json().then((data) => {
            rebuildSidebar(data)
        })
    })
}

function rebuildSidebar(data){
    let facetHTML = document.getElementById("sidebarFacets");
    facetHTML.innerHTML = "";
    data["data"][0]["facet"]["reply_count_facet"]["buckets"].forEach((facet) => {
        facetHTML.appendChild(buildFacetItem(facet,"reply_count"));
    })
    data["data"][0]["facet"]["username_facet"]["buckets"].forEach((facet) => {
        facetHTML.appendChild(buildFacetItem(facet,"user"));
    })

}

function buildFacetItem(facet,facet_type){
    console.log(facet)
    let newFacetItem = document.createElement("span");
    newFacetItem.setAttribute("class","list-group-item list-group-item-light p-3")
    if(facet_type = "reply_count"){
        if(typeof facet["_id"] == "number"){
            newFacetItem.innerHTML = facet["_id"] + " - " + (facet["_id"] + 5) + " replies : " + facet["count"];
        } else {
            newFacetItem.innerHTML = facet["_id"] + " replies: " + facet["count"];

        }
    }

    if(facet_type == "user"){
        newFacetItem.innerHTML = facet["_id"] + ": " + facet["count"];
    }
    
    return newFacetItem
}



autocomplete(document.getElementById("searchText"))
getLatestPosts()
getFacets()