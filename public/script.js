// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

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
    clickable: false,
    icon: new google.maps.MarkerImage('icon.png',
          new google.maps.Size(50,28),
          new google.maps.Point(0,0),
          new google.maps.Point(25,14)),
    shadow: null,
    zIndex: 999,
    map // your google.maps.Map object
  });
  google.maps.event.addDomListener(window, 'load', function() {
    setInterval(watchLocation, 200);
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

function watchLocation() {
  navigator.geolocation.getCurrentPosition(function(position) {
    cur = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    var adsCur = {
      lat: position.coords.latitude,
      long: position.coords.longitude
    }
    var adsToShow = returnAd(adsCur);
    console.log(adsToShow);
    if (adsToShow != '') {
      $('#adImg').attr('src', adsToShow);
    }
    map.setCenter(cur);
    currentPositionMarker.setPosition(new google.maps.LatLng(cur.lat, cur.lng))

  });

  // var GeoMarker = new GeolocationMarker(map, null, null, {visible: false});
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