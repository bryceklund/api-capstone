function sortBy(arr, key, dir) {
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

function handleSort(results) {
    console.log('handleSort running...');
    $('#sort-option').change(function(event) {
        const option = $('#sort-option option:selected').val();
        let sorted = sortBy(results, option.split('-', 2)[0], option.split('-', 2)[1]);
        if (option != "") {
            $('.results').empty();
            for (let i = 0; i < sorted.length; i++) {
                $('.results').append(`<li class="result" name="${sorted[i]["name"]}" distance="${(sorted[i]["distance"] / 1609.344).toFixed(2)}" rating="${sorted[i]["rating"]}" busyvalue="">
                <a href="${sorted[i]["url"]}" target="_blank">
                    <div class="">
                    <img src="${sorted[i]["image_url"]}" alt="business photo">
                    <h2>${sorted[i]["name"]}</h2>
                    <p>Distance: ${(sorted[i]["distance"] / 1609.344).toFixed(2)} miles<br>
                        <span class="address">Address: ${sorted[i]["location"]["address1"]}</span><br>
                        <span class="rating">rating: ${sorted[i]["rating"]}</span>
                    </p>
                    </div>
                </a>
                </li>`
            )};
        }

    });
}

function showData(json, rating) {
    $('.results').empty();
    $('.loading').addClass('hidden');
    $('.results-container').removeClass('hidden');
    $('.try-again').click(event => appReset());
    let results = [];
    console.log(json.businesses);
    for (let i = 0; i < json.total; i++) {
        if (json['businesses'][i].rating <= rating && json['businesses'][i]["is_closed"] == false) {
            results.push(json['businesses'][i]);
            console.log(json['businesses'][i]);
            $('.results').append(`<li class="result" name="${json['businesses'][i]["name"]}" distance="${(json['businesses'][i]["distance"] / 1609.344).toFixed(2)}" rating="${json['businesses'][i]["rating"]}" busyvalue="">
            <a href="${json['businesses'][i]["url"]}" target="_blank">
                <div class="">
                <img src="${json['businesses'][i]["image_url"]}" alt="business photo">
                <h2>${json['businesses'][i]["name"]}</h2>
                <p>Distance: ${(json['businesses'][i]["distance"] / 1609.344).toFixed(2)} miles<br>
                    <span class="address">Address: ${json['businesses'][i]["location"]["address1"]}</span><br>
                    <span class="rating">rating: ${json['businesses'][i]["rating"]}</span>
                </p>
                </div>
            </a>
            </li>`);
        }

    }
    if (results.length == 0) {
        $('.results').append(`<p class="no-results">No results found!</p>`);
    }
    handleSort(results);
    console.log(results);
}

function callYelp(lat, long, rating, couches) {
    let url = "https://cors-anywhere.herokuapp.com" + `/api.yelp.com:443/v3/businesses/search?latitude=${lat}&longitude=${long}&radius=3200&categories=divebars&price=1`;
    if (couches) {
        console.log('couches!');
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
    console.log(url);
    const ratingval = rating;
    fetch(url, header)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => showData(responseJson, ratingval))
    .catch(err => {
        $('.error-text').text(`Something went wrong: ${err.message}`.toUpperCase())
    });
}

function getData(position) {
    $('.home').addClass('hidden');
    $('.loading').removeClass('hidden');
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    const rating = $(".stars input:checked").val();
    const couches = $('#couches:checked').val();
    console.log(couches);
    console.log(lat, long);
    console.log(rating);
    callYelp(lat, long, rating, couches);
}

function handleGo() {
    $('.stars input').click(event => {
        let label = $(`label[for=${$(this).attr('id')}]`);
        console.log(label);
        $(`label[for=${$(event.currentTarget).attr('id')}]`).css('color', '#ffc700');
        $(`label[for!=${$(event.currentTarget).attr('id')}]`).css('color', '');
        console.log($('.stars input:checked').val())
    });
    $('#go').click(event => {
        const rating = $(".stars input:checked").val();
        console.log('go button clicked');
        event.preventDefault();
        navigator.geolocation.getCurrentPosition(getData);

    });
}

function appReset() {
    $('.results').empty();
    $('.home').removeClass('hidden');
    $('.results-container').addClass('hidden');
}

$(handleGo);