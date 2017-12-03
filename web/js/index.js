/* Custom JavaScript */

//Database Location
var databaseUrl = 'https://spot-lite.herokuapp.com';

//Locations Array
var locations = [];	

//Map Variable
var map = null;

//Current Location
var currentLocation = null;

//Current Location Radius
var currentLocationRadius = null;

//Nearby Locations Distance
var locationsDistance = 100000;

//Navigation Watch ID	
var watchID = null;

//Application Function	
var app = {

    //Application Constructor
    initialize: function() {
        app.bindEvents();
    },
    
    //Bind Event Listeners
    bindEvents: function() {
		document.addEventListener('deviceready', app.onDeviceReady, false);
    },
    
    //Device Ready Event Handler
    onDeviceReady: function() {
        app.recievedEvent('deviceready');
    },
    
    //Function Run on Device Ready
    recievedEvent: function(id) {
        if(id == 'deviceready'){
        	app.deviceReady();
        }
    },
    
    //Device Ready Function
    deviceReady: function() {
		
		//Listen for Notification Click
		/*		
		cordova.plugins.notification.local.on("click", function (notification, state) {			
			var locationID = "#locationDetail" + notification.id;
					
			if($("#details").html()){
				
				//Show specific location details				
				$(locationID).click();
				
			}
		});
		*/
		
		//Top Display Buttons Click Function
		$(".display a").on("click", function(){
		   $(".display").find(".active").removeClass("active");
		   $(this).parent().addClass("active");
		});
		
		//Bottom Category Buttons Click Function
		$(".category a").on("click", function(){
		   $(".category").find(".active").removeClass("active");
		   $(this).parent().addClass("active");
		});
		
		//Initialize Map
		app.initMap();
		
		//Displays Map
		app.displayMap();
		
    },
    
    //Initializes Map
    initMap: function(){		
		
		//Initial Lat/Lng
		var lat = 0; 
		var lng = 0;
	
		//Creating Map
		map = new GMaps({
			div: '#map',
			lat: lat,
			lng: lng,
			zoom: 16
		});	

		//Creating Current Location Center
		currentLocation = map.drawCircle({
			lat : lat,
			lng : lng,
			radius : 10,
			strokeColor: 'dodgerblue',
			strokeOpacity: 1,
			strokeWeight: 2,
			fillColor: 'dodgerblue',
			fillOpacity: 1
		});	
	
		//Creating Current Location Radius
		currentLocationRadius = map.drawCircle({
			lat : lat,
			lng : lng,
			radius : 50,
			strokeColor: 'dodgerblue',
			strokeOpacity: 0.0,
			strokeWeight: 2,
			fillColor: 'dodgerblue',
			fillOpacity: 0.25
		});	
	
		//Creating Center Map Control
		map.addControl({
		  position: 'top_right',
		  content: '',
		  style: {
			margin: '10px',
			height: '30px',
			width: '30px',
			background: 'white',
			backgroundImage: 'url("./img/current.png")'
		  },
		  events: {
			click: function(){
			  map.setCenter(currentLocation.getCenter().lat(),currentLocation.getCenter().lng());
			  map.setZoom(16);
			}
		  }
		});
 
		//Turn On Background Geolocation
		//backgroundGeolocation.start();
		
		//Turn Off Background Geolocation
    	//backgroundGeolocation.stop(); 
		
		//Get Current Location on Init
		navigator.geolocation.getCurrentPosition(app.onInit,app.onError);
		
		//Navigation Watch Options
		var watchOptions = { enableHighAccuracy: true };

		//Start Tracking Location	
		watchID = navigator.geolocation.watchPosition(app.onSuccess,app.onError,watchOptions);
		
	},
	
	//onInitSuccess callback receives position object and updates position on map
	onInit: function(position) {
		
		//Sets Current LatLng Variable
		var latlng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
		
		//Set Map Center
		map.setCenter(position.coords.latitude,position.coords.longitude);
		
		//Set currentLocation Position
		currentLocation.setCenter(latlng);
		
		//Set currentLocationRadius Position
		currentLocationRadius.setCenter(latlng);
		
		//onSuccess Call
		function onSuccessCallback(){
			app.onSuccess(position);
		}

		//Get Nearby Locations from Database based off Current Location
		app.getLocations(null,onSuccessCallback);
		
	},
	
	//onSuccess callback receives position object and updates position on map
	onSuccess: function(position) {
		
		//Sets Current LatLng Variable
		var latlng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
		
		//Set currentLocation Position
		currentLocation.setCenter(latlng);
		
		//Set currentLocationRadius Position
		currentLocationRadius.setCenter(latlng);
		
		//Notifications Array
		var notifications = [];
		
		//Loop through Geofences
		for(var i=0;i<locations.length;i++){		
			
			//Checks Locations within currentLocationRadius
			if(map.checkGeofence(locations[i].lat,locations[i].lng,currentLocationRadius)){

				//Alert if location is inside currentLocationRadius
				if(locations[i].inside){
					//Location is already inside currentLocationRadius
				}else{
				
					//Sets location inside currentLocationRadius
					locations[i].setInside();			
					
					//Creates Notification Object
					var notification = {
						id: locations[i].id,
						title: locations[i].name,
						text: locations[i].short_desc
					};
					
					//Pushes Notification onto Notifications Array
					notifications.push(notification);
				}		
				
			}else{
			
				//Sets location outside currentLocationRadius
				locations[i].setOutside();
			}
		}
		
		//Sends Notifications
		for(var i=0;i<notifications.length;i++){
			//cordova.plugins.notification.local.schedule(notifications[i]);	
		}	
					
	},

	//onError Callback receives a PositionError object
	onError: function(error) {
		//console.log('Location Error. Error Code: ' + error.code + '. Error Message: ' + error.message);
	},
	
	//Gets Nearby Locations from Database
    getLocations: function(category, onSuccessCallback){		
		
		var currentLat = currentLocation.getCenter().lat();
		var currentLng = currentLocation.getCenter().lng();
		var distance = locationsDistance;
		
		var request = new XMLHttpRequest();
		request.open('GET', databaseUrl + '/getlocations', true);

		request.onload = function() {
		  if (request.status >= 200 && request.status < 400) {
			var locations = JSON.parse(request.responseText)
			app.loadLocations(locations);
			if(onSuccessCallback){
				onSuccessCallback();
			}
		  } else {
			//Error
			//console.log('Request Error')
		  }
		};
		
		request.onerror = function() {
		  //Connection Error
		  //console.log('Connection Error')
		};
		
		request.send();

		/*		
		jQuery.ajax({
			url: databaseUrl + '/getlocations',
			type: 'GET',
			//data: {lat:currentLat,lng:currentLng,distance:distance,category:category},
			dataType: 'json',	
			async:true,
            crossDomain:true,		
			success: function(json) {
				var locations = JSON.parse(json)
				app.loadLocations(locations);
				if(onSuccessCallback){
					onSuccessCallback();
				}
			},
			error: function(){
				//console.log("Error Getting Locations");
			}
		});
		*/
		
	},
	
	//Creates HTML for Locations List and Locations Details
	loadLocations: function(data){
		
		locations = [];
		
		var list = '<div class="container"><div class="row">';

		var details = '';

		for(var i=0;i<data.length;i++){

			//Load Location
			//var location = app.loadLocation(data[i]);
			var location = new app.Location(data[i].id,data[i].name,data[i].short_desc,data[i].long_desc,data[i].img,data[i].lat,data[i].lng,data[i].radius);	
			
			//Push Location onto Array of Locations
			locations.push(location);

			//Creates Location in List
			list+= 
			`<div class="col-md-4 col-sm-6 locations-item text-center">
				<a id="location${location.id}" href="#locationDetail${i}" class="locations-link" data-toggle="modal">
					<div class="locations-caption">
						<h4>${location.name}</h4>
						<p class="text-muted">${location.short_desc}</p>
					</div>
				</a>
			</div>`;
			
			//Creates Location Details Popup Modal
			details +=
			`<div class="locations-modal modal fade text-center" id="locationDetail${i}" tabindex="-1" role="dialog" aria-hidden="true" style="visibility:visible">
				<div class="vertical-alignment-helper">
					<div class="modal-dialog vertical-align-center">
						<div class="modal-content">
							<div class="close-modal" data-dismiss="modal">
								<div class="lr">
									<div class="rl">
									</div>
								</div>
							</div>
							<div class="container">
								<div class="row">
									<div class="col-lg-8 col-lg-offset-2">
										<div class="modal-body">
											<h2>${location.name}</h2>
											<p class="item-intro text-muted">${location.short_desc}</p>
											</br>
											<p>${location.long_desc}</p>
											<button type="button" class="btn btn-danger" data-dismiss="modal"><i class="fa fa-times"></i> Close Details</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>`;
		}		
				
		list += '</div></div>';
					
		document.getElementById("locations").innerHTML = list;
		document.getElementById("details").innerHTML = details;
		
	},

	//Load Individual Locations
	loadLocation: function(data){
		var location = data;

		location.inside = false;
		
		location.marker = map.addMarker({
				lat: this.lat,
				lng: this.lng,
				clickable: true,
				opacity: 1.0
		});
		
		location.marker.addListener('click', function() {
			var locationID = "#locationDetail" + location.id;
					
			if($("#details").html()){
				
				//Show specific location details				
				$(locationID).click();
				
			}
		});
		
		location.setInside = function(){
			this.inside = true;
			//this.marker.setClickable(true);
			//this.marker.setOpacity(1.0);
		};
		
		location.setOutside = function(){
			this.inside = false;
			//this.marker.setClickable(false);
			//this.marker.setOpacity(0.5);
		};	

		locations.push(location);

		return location;
	},
	
	//Location Object
	Location: function(id,name,short_desc,long_desc,img,lat,lng,radius){
		this.id = id;
		this.name = name;
		this.short_desc = short_desc;
		this.long_desc = long_desc;
		this.img = img;
		this.lat = lat;
		this.lng = lng;
		this.radius = parseFloat(radius);
		this.inside = false;
		
		this.marker = map.addMarker({
				lat: this.lat,
				lng: this.lng,
				clickable: true,
				opacity: 1.0
		});
		
		this.marker.addListener('click', function() {
			var locationID = "#locationDetail" + id;
					
			if($("#details").html()){
				
				//Show specific location details				
				$(locationID).click();
				
			}
	  	});
		
		this.setInside = function(){
			this.inside = true;
			//this.marker.setClickable(true);
			//this.marker.setOpacity(1.0);
		};
		
		this.setOutside = function(){
			this.inside = false;
			//this.marker.setClickable(false);
			//this.marker.setOpacity(0.5);
		};	
		
	},
	
	//Filter Locations
	filter: function(category){
		document.getElementById("locations").innerHTML = '';
		document.getElementById("details").innerHTML = '';
		map.removeMarkers();
		app.getLocations(category);
		map.refresh();
		
		//Get Current Location	
		navigator.geolocation.getCurrentPosition(app.onSuccess,app.onError);
	},
	
	//Display Map
	displayMap: function(){
		document.getElementById("locations").style.display = "none";
		document.getElementById("map").style.visibility = "visible";
		map.refresh();
	},
	
	//Display List
	displayList: function(){
		document.getElementById("locations").style.display = "inline";	
		document.getElementById("map").style.visibility = "hidden";
	}
	
};

app.initialize();