

function callYelp(lat, long, rating) {
    console.log(lat, long);
    const url = `https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${long}&radius=3200&categories=divebars&price=1`;
    const header = {
        method: 'get',
        headers: {
            'Authorization': 'Bearer ajlYJ0-yupZgYj18Vjfi_fGGbPRNFzxzb0d0j3WvORtVRIp6--oYrjRf-ZDdwT1XiVvKB_gHNZ0AcUr9G-U0_ZY4AOX--7ivRRDDYyxUAJEqDiHs2e1z3HFVS4XfXHYx'
        }
    };
    fetch(url, header)
    .then(response => response.json())
    .then(responseJson => console.log(responseJson));
}

function getData(position) {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    const rating = $("input[name='star']:checked").val();
    callYelp(lat, long, rating);
}

function handleGo() {
    $('.go').click(event => {
        console.log('go button clicked');
        event.preventDefault();
        navigator.geolocation.getCurrentPosition(getData);
    })
}

$(handleGo);