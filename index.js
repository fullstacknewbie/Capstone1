/*ask mentor about opendata=true "Data returned by the API has mixed licensing and applicable copyright attribution (included in results as "Data Provider"). If you require Open licensed data you currently must filter by opendata=true to return only original OCM data."*/

/*what is poi?*/

/*https://api.openchargemap.io/v3/poi/?output=json&countrycode=US&maxresults=10*/

/*AIzaSyBpBXVhah9rxejaSMoDOU3TXehc0ApwcNA google API*/
/*AIzaSyAAm9OKeoPq6MVO9Wfpi_i57YMofNb_D50 google API*/

'use strict'

$(function() {
    watchForSubmit();
})

var map=null

function watchForSubmit() {
    $("form").submit(event => {
        event.preventDefault();
        const zip=$("#zip").val();
        console.log(zip)
        getLatLong(zip)
    })
}

function getLatLong(zip){
    console.log(zip.value)
    fetch ("https://maps.googleapis.com/maps/api/geocode/json?address="+zip+"&key=AIzaSyAqHEFAOikP1X73U_trS-aQvjiqcXKWSHs")
        .then(response=>response.json())
        .then(responseJson=>getResults(responseJson))
}

function getResults(responseJson) {
    initMap(responseJson)
    console.log(responseJson)
    console.log(responseJson.results[0].geometry.location)
    let lat=responseJson.results[0].geometry.location.lat
    let long=responseJson.results[0].geometry.location.lng
    console.log(lat)
    console.log(long)
    fetch ("https://api.openchargemap.io/v3/poi/?output=json&latitude="+lat+"&longitude="+long+"&maxresults=10")
        .then(response=>response.json())
        .then(responseLatLong=>displayResults(responseLatLong))
}

function displayResults(responseLatLong){
    console.log(responseLatLong)
    console.log(responseLatLong[0].AddressInfo.AddressLine1)
    console.log(responseLatLong[0].AddressInfo.Town)
    console.log(responseLatLong[0].AddressInfo.StateOrProvince)
    console.log(responseLatLong[0].AddressInfo.Postcode)
    console.log(responseLatLong.length)
    console.log(responseLatLong[0].AddressInfo.Latitude)
    console.log(responseLatLong[0].AddressInfo.Longitude)
    let total=responseLatLong.length
    let i=0
    for (i=0; i<total; i++) {
        var address=responseLatLong[i].AddressInfo.AddressLine1
        console.log(address)
        var city=responseLatLong[i].AddressInfo.Town
        console.log(city)
        var state=responseLatLong[i].AddressInfo.StateOrProvince
        console.log(state)
        var zipCode=responseLatLong[i].AddressInfo.Postcode
        console.log(zipCode)
        console.log(responseLatLong[i].AddressInfo.Latitude)
        var latLong = {lat: responseLatLong[i].AddressInfo.Latitude, lng: responseLatLong[i].AddressInfo.Longitude}
        console.log(latLong)
        $("#results").append("<span>"+address+"<br>"+city+", "+zipCode+" "+state+"<span><br><br>");
        var marker = new google.maps.Marker({position: latLong, map: map});
    }
}

function initMap(responseLatLong) {
    console.log(responseLatLong.results[0].geometry.location)
    // let i=0
    // let total=10
    // for (i=0; i<total; i++) {
        // let latMap=responseLatLong[i].AddressInfo.Latitude
        // let longMap=responseLatLong[i].AddressInfo.Longitude
        // var latLong = {lat: latMap, lng: longMap};
        var uluru = {lat: -25.344, lng: 131.036};
        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 10,
            center: responseLatLong.results[0].geometry.location
            });
        // var marker = new google.maps.Marker({
        //     position: latLong,
        //     map: map
        // })
    //}
}