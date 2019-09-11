// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
var svg = 'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188zM32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805z';

var map, directionsService, directionsRenderer, cur, dest, circle;

function initMap() {


  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.487930899999995, lng: -122.22534259999999},
    zoom: 18,
    mapTypeId: 'roadmap'
  });
  directionsRenderer.setMap(map);

  initSearch();
  currentPositionMarker = new google.maps.Marker({
    map: map,
    flat: true,
    icon: {
       path: svg,
       strokeColor : 'red',
       strokeWeight : 1.5,
       scale: 0.7
     }
  });

  google.maps.event.addDomListener(window, 'load', function() {
    setInterval(watchLocation, 1000);
  });
}

function initSearch() {

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      dest = new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      });

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  calculateAndDisplayRoute(directionsService, directionsRenderer);
  });
}
var adsToShow = "";
var previousAds = "";
        $('#ad').slideToggle( "slow", function() {
          // Animation complete.
        });
function watchLocation() {
  $.get('getCarMetaData', function(data) {
    var response = data.response;
    
    cur = {
      lat: response.latitude,
      lng: response.longitude
    };
    var adsCur = {
      lat: response.latitude,
      long: response.longitude
    }
    previousAds = adsToShow;
    let ads = returnAd(adsCur);
    adsToShow = ads.name;
    console.log(previousAds);
    console.log(adsToShow);
    if (adsToShow != '') {
      $('#adImg').attr('src', adsToShow);
      $('#adImg').unbind();
      $('#adImg').click(() => handleClick(ads));
    }
    map.setCenter(cur);

    if(adsToShow != previousAds) {
      $('#adImg').next().remove();
    }

    if ((previousAds == '' && adsToShow != '') || (previousAds != '' && adsToShow == '')) {
        
        $('#ad').toggle("slide", {direction:'right'});


    }
    console.log(adsToShow);
    

    currentPositionMarker.setPosition(new google.maps.LatLng(cur.lat, cur.lng));
    currentPositionMarker.setIcon({
      path: svg,
      strokeColor : 'red',
      strokeWeight : 1.5,
      scale: 0.7,
      rotation: response.heading
    })

  });
  // var GeoMarker = new GeolocationMarker(map, null, null, {visible: false});
}

function handleClick(ads) {

  switch(ads.action) {

    case 'navigate':
      var icon = {
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      dest = new google.maps.Marker({
        map: map,
        icon: icon,
        position: new google.maps.LatLng(37.487876, -122.225290) // go to amobee
      });
      calculateAndDisplayRoute(directionsService, directionsRenderer);
      $('#ad').toggle("slide", {direction:'right'});
      break;
    case 'QR':
      //adsToShow = 'qr.png';
      $('#adImg').after($('<img src="qr.png"/>'));
      break;
    case 'reservation':
      break;
  }
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  directionsService.route(
      {
        origin: new google.maps.LatLng(cur.lat, cur.lng),
        destination: dest.position,
        travelMode: 'DRIVING'
      },
      function(response, status) {
        if (status === 'OK') {
          directionsRenderer.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
}