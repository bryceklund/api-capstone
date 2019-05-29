function sortBy(arr, key, dir) { //sorting function; arguments are: the filtered results array, the parameter to sort by, and the direction to sort by
    if (key == 'name') {
        if (dir == 'asc') {
            return arr.sort(function(a, b) {
                let nameA  = a['name'].toLowerCase(), nameB = b['name'].toLowerCase();
                if (nameA < nameB) { //sort string ascending
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;   
                }
                return 0; //default return value (no sorting)
            }); 
        } else if (dir == 'desc') {
            return arr.sort(function(a, b) {
                let nameA  = a['name'].toLowerCase(), nameB = b['name'].toLowerCase();
                if (nameA < nameB) { //sort string descending
                    return 1;
                }
                if (nameA > nameB) {
                    return -1;   
                }
                return 0; //default return value (no sorting)
        });
        }
    } else {
        if (dir == 'asc') {
            return arr.sort((a, b) => {
                return b[key] - a[key];
            });
        } else if (dir == 'desc') {
            return arr.sort((a, b) => {
                return a[key] - b[key];
            });
        }
    }
}

function handleSort(results) { //calls the sortBy function and then rearranges the results on the DOM
    const option = $('#sort-option option:selected').val();
    let sorted = sortBy(results, option.split('-', 2)[0], option.split('-', 2)[1]); //parse out sort options and call sortBy()
    if (option != "") { //prevent sorting if there is no sort option selected
        $('.results').empty(); //clear the DOM
        for (let i = 0; i < sorted.length; i++) { //display sorted results
            $('.results').append(`<li class="result" name="${sorted[i]["name"]}" distance="${(sorted[i]["distance"] / 1609.344).toFixed(2)}" rating="${sorted[i]["rating"]}" busyvalue="">
            <a href="${sorted[i]["url"]}" target="_blank">
                <div class="">
                <img src="${sorted[i]["image_url"]}" alt="business photo">
                <h2>${sorted[i]["name"]}</h2>
                <p>Distance: ${(sorted[i]["distance"] / 1609.344).toFixed(2)} miles<br>
                    <span class="address">Address: ${sorted[i]["location"]["address1"]}</span><br>
                    <span class="result-rating">rating: ${sorted[i]["rating"]}</span>
                </p>
                </div>
            </a>
            </li>`
        )};
    }

}



function showData(json, rating) { //clears the loading page, displays the initial results
    $('.results').empty();
    $('.loading').addClass('hidden');
    $('.results-container').removeClass('hidden');
    $('.try-again').click(event => appReset());
    $('.top-link').click(function(e) { //handles the animation for "back to top"
        e.preventDefault();
        $('body, html').animate({
            scrollTop: $('head').offset().top
        }, 500);
    });
    let results = []; //filtered results array for sorting
    for (let i = 0; i < json.total; i++) {
        if (json['businesses'][i].rating <= rating && json['businesses'][i]["is_closed"] == false) { //filters out results that are closed and have a rating higher than what is specified
            results.push(json['businesses'][i]); //stores filtered results in the new array
            $('.results').append(`<li class="result" name="${json['businesses'][i]["name"]}" distance="${(json['businesses'][i]["distance"] / 1609.344).toFixed(2)}" rating="${json['businesses'][i]["rating"]}" busyvalue="">
            <a href="${json['businesses'][i]["url"]}" target="_blank">
                <div class="">
                <img src="${json['businesses'][i]["image_url"]}" alt="business photo">
                <h2>${json['businesses'][i]["name"]}</h2>
                <p>Distance: ${(json['businesses'][i]["distance"] / 1609.344).toFixed(2)} miles<br>
                    <span class="address">Address: ${json['businesses'][i]["location"]["address1"]}</span><br>
                    <span class="result-rating">rating: ${json['businesses'][i]["rating"]}</span>
                </p>
                </div>
            </a>
            </li>`);
        }

    }
    if (results.length == 0) { //handles the case where there are no results
        $('.results').append(`<p class="no-results">No results found!</p>`);
    }
    handleSort(results); //sort by the default option (near)
    $('#sort-option').change(function(event) { //handle new sort requests
        handleSort(results);
    });
}

function callYelp(lat, long, rating, couches, bars) { //calls the yelp api
    //handles URL changes based on landing page option selections
    let url = "https://cors-anywhere.herokuapp.com" + `/api.yelp.com:443/v3/businesses/search?latitude=${lat}&longitude=${long}&radius=3200&categories=divebars&price=1`;
    if (couches && bars) {
        url = "https://cors-anywhere.herokuapp.com" + `/api.yelp.com:443/v3/businesses/search?term=couch&latitude=${lat}&longitude=${long}&radius=3200&categories=divebars,bars,lounges&price=1`;
    } else if (bars) {
        url = "https://cors-anywhere.herokuapp.com" + `/api.yelp.com:443/v3/businesses/search?latitude=${lat}&longitude=${long}&radius=3200&categories=divebars,bars,lounges&price=1`;
    } else if (couches) {
        url = "https://cors-anywhere.herokuapp.com" + `/api.yelp.com:443/v3/businesses/search?term=couch&latitude=${lat}&longitude=${long}&radius=3200&categories=divebars&price=1`;

    }
    const header = {
        method: 'get',
        headers: {
            'Authorization': 'Bearer ajlYJ0-yupZgYj18Vjfi_fGGbPRNFzxzb0d0j3WvORtVRIp6--oYrjRf-ZDdwT1XiVvKB_gHNZ0AcUr9G-U0_ZY4AOX--7ivRRDDYyxUAJEqDiHs2e1z3HFVS4XfXHYx',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const ratingval = rating;
    fetch(url, header) //here's where the real magic happens; inital fetch request to the yelp api
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText); //handle errors
    })
    .then(responseJson => showData(responseJson, ratingval))
    .catch(err => {
        $('.error-text').text(`Something went wrong: ${err.message}`.toUpperCase())
    });
}

function getData(position) { //parses out data from the geolocation api and sends it to the yelp api
    $('.home').addClass('hidden');
    $('.loading').removeClass('hidden'); //removes landing page, shows loading page 
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    const rating = $(".stars input:checked").val();
    const couches = $('#couches:checked').val();
    const bars = $('#bars:checked').val();
    callYelp(lat, long, rating, couches, bars);
}

function handleGo() {
    $('.stars input').click(event => { //highlights stars when clicked
        let label = $(`label[for=${$(this).attr('id')}]`);
        $(`label[for=${$(event.currentTarget).attr('id')}]`).css('color', '#ffc700');
        $(`label[for!=${$(event.currentTarget).attr('id')}]`).css('color', '');
    });
    $('#go').click(event => { //takes rating from star selection and calls the geolocation api
        const rating = $(".stars input:checked").val();
        event.preventDefault();
        navigator.geolocation.getCurrentPosition(getData);
    });
}

function appReset() { //resets the app to the landing page
    $('.results').empty();
    $('.home').removeClass('hidden');
    $('.results-container').addClass('hidden');
}

$(handleGo); //document ready function to kick everything off