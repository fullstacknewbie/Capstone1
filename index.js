'use strict'

$(function() {
    watchForSubmit();
})

var map=null

function watchForSubmit() {
    $("form").submit(event => {
        event.preventDefault();
        const zip=$("#zip").val();
        getLatLong(zip)
    })
}

//converts zip code into coordinates
function getLatLong(zip){
    fetch ("https://maps.googleapis.com/maps/api/geocode/json?address="+zip+"&key=AIzaSyAqHEFAOikP1X73U_trS-aQvjiqcXKWSHs")
        .then(response=>response.json())
        .then(responseJson=>getResults(responseJson))
}

//feeds coordinates into Open Charge API to retrieve nearest charging locations
function getResults(responseJson) {
    initMap(responseJson)
    let lat=responseJson.results[0].geometry.location.lat
    let long=responseJson.results[0].geometry.location.lng
    fetch ("https://api.openchargemap.io/v3/poi/?output=json&latitude="+lat+"&longitude="+long+"&maxresults=10")
        .then(response=>response.json())
        .then(responseLatLong=>displayResults(responseLatLong))
}

//displays map and list of results
function displayResults(responseLatLong){
    let total=responseLatLong.length
    let i=0
    //iterates over all results
    for (i=0; i<total; i++) {
        //displays current address on Google Map
        var marker = new google.maps.Marker({position: latLong, map: map, icon: 'marker.png'});
        //defines address components
        var address=responseLatLong[i].AddressInfo.AddressLine1
        var city=responseLatLong[i].AddressInfo.Town
        var state=responseLatLong[i].AddressInfo.StateOrProvince
        var zipCode=responseLatLong[i].AddressInfo.Postcode
        var latLong = {lat: responseLatLong[i].AddressInfo.Latitude, lng: responseLatLong[i].AddressInfo.Longitude}
        //returns list of addresses to webpage
        $("#results").append("<span>"+address+"<br>"+city+", "+zipCode+" "+state+"<span><br><br>");
    }
}

function initMap(responseLatLong) {
    console.log(responseLatLong.results[0].geometry.location)
        var uluru = {lat: -25.344, lng: 131.036};
        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 10,
            center: responseLatLong.results[0].geometry.location
            });
}