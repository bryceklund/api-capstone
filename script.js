function showData(json) {
    $('.results').empty();
    $('.home').addClass('hidden');
    $('.try-again').removeClass('hidden');
    for (let i = 0; i < json.total; i++) {
        console.log(json['businesses'][i]);
        $('.results').append(`<a href="${json['businesses'][i]["url"]}" target="_blank">
            <div class="result">
            <img src="${json['businesses'][i]["image_url"]}" alt="business photo">
            <h2>${json['businesses'][i]["name"]}</h2>
            <p>Distance: ${json['businesses'][i]["distance"] / 1609.344} miles<br>
                <span class="address">Address: ${json['businesses'][i]["location"]["address1"]}</span><br>
                <span class="hours">closed now? ${json['businesses'][i]["is_closed"]}</span><br>
                <span class="rating">rating: ${json['businesses'][i]["rating"]}</span>
            </p>
            </div>
        </a>`);
    }
    $('.try-again').click(event => appReset());
}

function callYelp(lat, long, rating) {
    const url = "http://cors-anywhere.herokuapp.com" + `/api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${long}&radius=3200&categories=divebars&price=1`;
    const header = {
        method: 'get',
        headers: {
            'Authorization': 'Bearer ajlYJ0-yupZgYj18Vjfi_fGGbPRNFzxzb0d0j3WvORtVRIp6--oYrjRf-ZDdwT1XiVvKB_gHNZ0AcUr9G-U0_ZY4AOX--7ivRRDDYyxUAJEqDiHs2e1z3HFVS4XfXHYx',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': '*'
        }
    };
    console.log(url);
   /*$.ajax({
        'url': 'https://api.yelp.com/v3/businesses/search',
        'dataType': 'jsonp',
        'data': {
            'latitude': lat,
            'longitude': long,
            'radius': 3200,
            'categories': 'divebars',
            'price': 1
        },
        'cache': true
        //'success': console.log(data)
   });*/
   
   
    fetch(url, header)
    .then(response => response.json())
    .then(responseJson => showData(responseJson));
}

function getData(position) {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    const rating = $("input[name='star']:checked").val();
    console.log(lat, long);
    callYelp(lat, long, rating);
}

function handleGo() {
    $('#go').click(event => {
        console.log('go button clicked');
        event.preventDefault();
        navigator.geolocation.getCurrentPosition(getData);
    })
}

function appReset() {
    $('.results').empty();
    $('.home').removeClass('hidden');
    $('.try-again').addClass('hidden');
}

$(handleGo);