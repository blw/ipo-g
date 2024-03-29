var currentAd = {};
var displayedCreative = "";


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
		this._distance = distance;
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

adMetaDataStore[0] = new adMetadata(1, 37.486665, -122.228640, new creative("philz_1.jpg", "philz_2.jpg"), "QR");  //philz
adMetaDataStore[1] = new adMetadata(2, 37.486343, -122.229942, new creative("starbucks.jpg"), "navigate");
adMetaDataStore[2] = new adMetadata(3, 37.490593, -122.227851, new creative("innout.jpeg"), "navigate");
adMetaDataStore[3] = new adMetadata(4, 37.486891, -122.226802, new creative("amobee.jpg"), "navigate");


var calcDistance = function (checkPoint, centerPoint) {
	var ky = 40000 / 360;
	var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
	var dx = Math.abs(centerPoint.long - checkPoint.long) * kx;
	var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
	return (Math.sqrt(dx * dx + dy * dy)*0.6214); // in miles.
}



var returnAd = function(locationMetadata) {
	var creative = "";
	var distanceInMiles = 0.05;
	var nextAd = {};
	for (var i = 0; i<adMetaDataStore.length; i++) {
		var distance = calcDistance(locationMetadata, adMetaDataStore[i]);
		if (distance < distanceInMiles) {
			nextAd = adMetaDataStore[i];
			distanceInMiles = distance;
			nextAd.distance = distance;
		}
	}
	
	if (Object.keys(nextAd).length !=0 && Object.keys(currentAd).length !=0  && currentAd.id === nextAd.id) {
		if (nextAd.distance > currentAd.distance && nextAd.creative.headingOut != null) {
			if (Object.keys(nextAd).length != 0) {
				creative = nextAd.creative.headingOut;
			}
		} else if (nextAd.distance ==  currentAd.distance && nextAd.creative.headingOut != null && displayedCreative === nextAd.creative.headingOut) {
			creative = displayedCreative;
		}
		else {
			if (Object.keys(nextAd).length != 0) {
				creative = nextAd.creative.headingIn;
			}
		}
	} else {
		if (Object.keys(nextAd).length != 0) {
			creative = nextAd.creative.headingIn;
		}
		
	}
	if (Object.keys(nextAd).length !=0) {
		currentAd = new adMetadata(nextAd.id, nextAd.lat, nextAd.long, nextAd.creative, nextAd.action, nextAd.distance);
	} else {
		currentAd = {};
	}
	
	displayedCreative = creative;
	return {
		name: creative,
		action: currentAd.action,
		lat: currentAd.lat,
		long: currentAd.long
	};
}
