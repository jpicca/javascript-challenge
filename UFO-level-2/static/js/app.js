// from data.js
var tableData = data;

// YOUR CODE HERE!

// Select the element where we want to append data
var tbody = d3.select("tbody");

// Loop through the array of objects, grab each object
// Then append a row for each object
// Then take the values of each object and add to the selected element (tbody)

tableData.forEach(sighting => {
    var row = tbody.append("tr");
    Object.entries(sighting).forEach(([key, value]) => {
      var cell = row.append("td");
      cell.text(value);
    });
});

// Filter data

var button = d3.select('#filter-btn');

button.on('click',function() {

    let input = d3.select('#datetime');

    let inputValue = input.property("value");

    let returnedEntries = tableData.filter(entry => {
        return entry.datetime === inputValue;
    });

    //console.log(returnedEntries);

    // Populate with returned entries

    if (returnedEntries.length > 0) {

        // Clear table body
        tbody.html("")

        returnedEntries.forEach(sighting => {
            var row = tbody.append("tr")
            Object.entries(sighting).forEach(([key,value]) => {
                let cell = row.append("td");
                cell.text(value);
            })
        })
    } else {
        alert('No entries for that date!');
    };

})