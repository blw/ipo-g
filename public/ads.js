var currentAd = {};


class creative {
	constructor(headingIn, headingOut) {
		this._headingIn = headingIn;
		this._headingOut = headingOut
	}
	
	get headingIn() {
		return this._headingIn;
	}
	
	set headingIn(headingIn) {
		this._headingIn = headingIn;
	}
	
	get headingOut() {
		return this._headingOut;
	}
	
	set headingOut(headingOut) {
		this._headingIn = headingOut;
	}
}


class adMetadata {
	constructor(id, lat, long, creative, action, distance ) {
		this._id = id;
		this._lat = lat;
		this._long = long;
		this._creative = creative;
		this._action = action;
	}
	
	get id() {
		return this._id;
	}
	
	set id(id) {
		this._id = id;
	}
	
	get lat() {
		return this._lat;
	}
	
	set lat(lat) {
		this._lat = lat;
	}
	get long() {
		return this._long;
	}
	
	set long(long) {
		this._long = long;
	}
	get creative() {
		return this._creative;
	}
	
	set creative(creative) {
		this._creative = creative;
	}
	get action() {
		return this._action;
	}
	
	set action(action) {
		this._action = action;
	}
	
	get distance() {
		return this._distance;
	}
	
	set distance(distance) {
		this._distance = distance;
	}
}

var currentLoc = { lat: 37.48809, long: -122.2251767 };
var adMetaDataStore = [];

adMetaDataStore[0] = new adMetadata(1, 37.486672, -122.228637, new creative("philz_1.jpg", "philz_2.jpg"), "navigate");  //philz

adMetaDataStore[1] = new adMetadata(2, 37.486330, -122.2299407, new creative("dummy"), "navigate");  //starbucks

var calcDistance = function (checkPoint, centerPoint) {
	var ky = 40000 / 360;
	var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
	var dx = Math.abs(centerPoint.long - checkPoint.long) * kx;
	var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
	return (Math.sqrt(dx * dx + dy * dy)*0.6214); // in miles.
}



var returnAd = function(locationMetadata) {
	var creative = "";
	var distanceInMiles = 0.4;
	var adMetadata = {};
	for (var i = 0; i<adMetaDataStore.length; i++) {
		var distance = calcDistance(locationMetadata, adMetaDataStore[i]);
		if (distance < distanceInMiles) {
			adMetadata = adMetaDataStore[i];
			distanceInMiles = distance;
			adMetadata.distance = distance;
		}
	}
	
	if (Object.keys(adMetadata).length !=0 && Object.keys(currentAd).length !=0  && currentAd.id === adMetadata.id) {
		if (adMetadata.distance > currentAd.distance && adMetadata.creative.headingOut != null) {
			creative = adMetadata.creative.headingOut;
		} else {
			creative = adMetadata.creative.headingIn;
		}
	} else {
		creative = adMetadata.creative.headingIn;
	}
	currentAd = Object.assign({}, adMetadata);
	return creative;
	
}
