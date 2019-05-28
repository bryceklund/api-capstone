function sortBy(arg, sel, elem) { //taken from the internet
    console.log('sortBy is running');
        let element = $(sel).children(elem);
        if (arg.includes("name")) {
            console.log('name sort is running');
            if (arg.includes("desc")) {
                element.sort();
            } else {
                element.sort();
                element.reverse();
            }
            $(element).detach().appendTo($(sel));
            console.log(element);
        } else {
            console.log('int sort is running');
            element.sort(function(a, b) {
                let an = parseInt(a.getAttribute(arg)),
                bn = parseInt(b.getAttribute(arg));
                if (arg.includes("asc")) {
                        if (an > bn)
                        return 1;
                        if (an < bn)
                        return -1;
                } else if (arg.includes("desc")) {
                        if (an < bn)
                        return 1;
                        if (an > bn)
                        return -1;
                }
                return 0;
            });
            console.log($(element));

            console.log('sorting complete - attempting to manipulate DOM');
            $(element).detach().appendTo($(sel));
        }
}


function handleSort() {
    console.log('handleSort running...');
    $('#sort-option').change(function(event) {
        const option = $('#sort-option option:selected').val();
        console.log(option);
        sortBy(option, '.results', 'li');
    });
}

function showData(json, rating) {
    $('.results').empty();
    $('.home').addClass('hidden');
    $('.results-container').removeClass('hidden');
    $('.try-again').click(event => appReset());
    handleSort();

    for (let i = 0; i < json.total; i++) {
        if (json['businesses'][i].rating <= rating && json['businesses'][i]["is_closed"] == false) {
            console.log(json['businesses'][i]);
            $('.results').append(`<li name="${json['businesses'][i]["name"]}" distance="${(json['businesses'][i]["distance"] / 1609.344).toFixed(2)}" rating="${json['businesses'][i]["rating"]}" busyvalue="">
            <a href="${json['businesses'][i]["url"]}" target="_blank">
                <div class="result">
                <img src="${json['businesses'][i]["image_url"]}" alt="business photo">
                <h2>${json['businesses'][i]["name"]}</h2>
                <p>Distance: ${(json['businesses'][i]["distance"] / 1609.344).toFixed(2)} miles<br>
                    <span class="address">Address: ${json['businesses'][i]["location"]["address1"]}</span><br>
                    <span class="hours">closed now? ${json['businesses'][i]["is_closed"]}</span><br>
                    <span class="rating">rating: ${json['businesses'][i]["rating"]}</span>
                </p>
                </div>
            </a>
            </li>`);
        }
    }

}

function callYelp(lat, long, rating) {
    const url = "https://cors-anywhere.herokuapp.com" + `/api.yelp.com:443/v3/businesses/search?latitude=${lat}&longitude=${long}&radius=3200&categories=divebars&price=1`;
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
    .then(response => response.json())
    .then(responseJson => showData(responseJson, ratingval));
}

function getData(position) {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    const rating = $(".stars input:checked").val();
    console.log(lat, long);
    console.log(rating);
    callYelp(lat, long, rating);
}

function handleGo() {
    $('.stars input').click(event => {

        console.log($('.stars input:checked').val())
    });
    $('#go').click(event => {
        const rating = $(".stars input:checked").val();
        console.log('go button clicked');
        event.preventDefault();
        navigator.geolocation.getCurrentPosition(getData);
        
    })
}

function appReset() {
    $('.results').empty();
    $('.home').removeClass('hidden');
    $('.results-container').addClass('hidden');
}

$(handleGo);