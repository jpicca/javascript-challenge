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

// **** Filter data ****

var button = d3.select('#filter-btn');

// Grab all cities in data

var stateArr = [];
var cityArr = [];

tableData.forEach(sighting => {
    if (!cityArr.includes(sighting.city)) {
        cityArr.push(sighting.city);
    };
    if (!stateArr.includes(sighting.state)) {
        stateArr.push(sighting.state);
    };
});

// Append cities and states to selection dropdowns

var cityDropdown = d3.select('#cities');
var stateDropdown = d3.select('#states');

// Add a default/initial option in dropdown
stateDropdown.append('option').text('Choose a State/Province');

stateArr.sort().forEach(element => {
    let option = stateDropdown.append('option');
    option.text(element);
    option.attr('value',element);
    //cityDropdown.append(`<option value=${element}>${element}</option>`);
});

cityArr.sort().forEach(element => {
    let option = cityDropdown.append('option');
    option.text(element);
    option.attr('value',element);
    //cityDropdown.append(`<option value=${element}>${element}</option>`);
});

// Upon change of country and/or state inputs, filter subsequent dropdowns

var stateInput = '';

// Select the country radio buttons
var radioBtn = d3.selectAll("input[name='country']");

// Bind an event handler to radio buttons that will update the state/city dropdowns
radioBtn.on('change', function() {
    let country = d3.select("input[name='country']:checked").node().value
    
    if (country !== 'all') {
        // Filter state & city lists

        // States
        let returnedStates = tableData.filter(sighting => {
            return sighting.country === country;
        });

        let stateFiltered = []
        returnedStates.forEach(entry => {
            if (!stateFiltered.includes(entry.state)) {
                stateFiltered.push(entry.state);
            };
        })

        // Cities
        let returnedCities = tableData.filter(sighting => {
            return sighting.country === country;
        });

        let cityFiltered = []
        returnedCities.forEach(entry => {
            if (!cityFiltered.includes(entry.city)) {
                cityFiltered.push(entry.city);
            };
        });

        // Clear the state & city dropdowns & update

        // States
        stateDropdown.html("")

        // Add a default/initial option in dropdown
        stateDropdown.append('option').text('Choose a State/Province');

        stateFiltered.sort().forEach(element => {
            let option = stateDropdown.append('option');
            option.text(element);
            option.attr('value',element);
        });

        // Cities
        cityDropdown.html("")

        cityFiltered.sort().forEach(element => {
            let option = cityDropdown.append('option');
            option.text(element);
            option.attr('value',element);
        });
    
    } // If all countries are selected, just run code that populates dropdowns like usual
    //   Yes, I should re-factor and create a population function, among other things. 
    else {
        tableData.forEach(sighting => {
            if (!cityArr.includes(sighting.city)) {
                cityArr.push(sighting.city);
            };
            if (!stateArr.includes(sighting.state)) {
                stateArr.push(sighting.state);
            };
        });
        
        // Clear the city dropdown
        cityDropdown.html("")
        stateDropdown.html("")

        // Add a default/initial option in dropdown
        stateDropdown.append('option').text('Choose a State/Province');
        
        stateArr.sort().forEach(element => {
            let option = stateDropdown.append('option');
            option.text(element);
            option.attr('value',element);
        });

        cityArr.sort().forEach(element => {
            let option = cityDropdown.append('option');
            option.text(element);
            option.attr('value',element);
        });
    }
});

stateDropdown.on('change',function () {

    stateInput = stateDropdown.property('value');
    
    // Re-populate cityArr
    let returnedCities = tableData.filter(sighting => {
        return sighting.state === stateInput;
    });

    let cityFiltered = returnedCities.map(entry => {
        return entry.city;
    })

    // Clear the city dropdown
    cityDropdown.html("")

    cityFiltered.sort().forEach(element => {
        let option = cityDropdown.append('option');
        option.text(element);
        option.attr('value',element);
    });
    
});

button.on('click',function() {

    // date input
    let input = d3.select('#datetime');

    let inputValue = input.property("value");

    // cities input
    // Gather selections (which could be multiple) in dropdown
    let cityInput = d3.select('#cities')
                        .selectAll("option")
                        .filter(function () { 
                            return this.selected; 
                        }).nodes();
    //console.log(cityInput)

    // Get values from those cities and add to array
    let selectedCities = []
    cityInput.forEach(element => { selectedCities.push(element.value)});
    
    // Filter our table values
    let returnedEntries = tableData.filter(entry => {
        
        // If one or more cities are selected
        if (selectedCities.length > 0) {
            // If there is a date entered
            if (inputValue.length > 0) {
                return ((entry.datetime === inputValue) && (selectedCities.includes(entry.city)));
            } 
            // If there's no date entered
            else {
                return selectedCities.includes(entry.city);
            }
        } 
        // If no cities are selected, base off date/state
        else {
            // If there is a date entered
            if (inputValue.length > 0) {
                return ((entry.datetime === inputValue) && (entry.state === stateInput));
            } 
            // If there's no date entered
            else {
                return entry.state === stateInput;
            }
        }
    });

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
        // Alert the user if no cities are selected / if nothing is returned.
        alert('Either no entries for that combo exist or you did not choose a city!');
    };

})