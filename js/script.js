
const input = document.querySelector('#search_field');
const submitButton = document.querySelector('#submit')
let requestURL = "https://ipgeolocation.abstractapi.com/v1/?api_key=c5094700a1614fa08030c502c0fdf9f2";

let map, infoWindow, myLatLng, marker;

function initMap(myLatLng) {
	
  map = new google.maps.Map(document.getElementById("map"), {
    center: myLatLng,
    zoom: 15,
	streetViewControl: false,
	fullscreenControl: false,
	mapTypeControl: false
  });
  marker = new google.maps.Marker({
	position: myLatLng,
	map: map,
	icon: {
		url: 'img/location_icon.svg',
		scaledSize: new google.maps.Size(32,40),
		}
});
  infoWindow = new google.maps.InfoWindow();
}

// Try HTML5 geolocation.
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(
	  (position) => {
		const pos = {
		  lat: position.coords.latitude,
		  lng: position.coords.longitude,
		};
	
		map.setCenter(pos);
		marker = new google.maps.Marker({
		  position: pos,
		  map: map,
		  icon: {
			  url: 'img/location_icon.svg',
			  scaledSize: new google.maps.Size(32,40),
			  }
	  });
		
	  },
	  () => {
		handleLocationError(true, infoWindow, map.getCenter());
	  }
	);
  } else {
	// Browser doesn't support Geolocation
	handleLocationError(false, infoWindow, map.getCenter());
  }

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
  }

function showData(data) {
	document.querySelector('#isp_get').textContent = data.connection.isp_name;

	if (data.timezone.gmt_offset>0) {
		document.querySelector('#timezone_get').textContent = 'UTC+0' + data.timezone.gmt_offset + ':00'
	} else 
	if (data.timezone.gmt_offset < 0) {
		document.querySelector('#timezone_get').textContent = 'UTC' + data.timezone.gmt_offset + ':00'
	}
	document.querySelector('#location_get').textContent = data.city;
	document.querySelector('#ip_get').textContent = data.ip_address;
}

submitButton.addEventListener('click', function() {
	if(input.value) {
		requestURL = "https://ipgeolocation.abstractapi.com/v1/?api_key=c5094700a1614fa08030c502c0fdf9f2&ip_address=" + input.value;
		sendRequest('GET', requestURL)
		.then(data => {
			myLatLng = {
				lat: data.latitude,
				lng: data.longitude
					}
			initMap(myLatLng)
			showData(data)
		})
		.catch(err => customAlert());
		input.value = '';
	}
})

input.addEventListener('keyup', function(e) {
	e.preventDefault();
	if (e.keyCode === 13) {
		submitButton.click();
	}
})

function sendRequest(method, url) {
	return fetch(url).then(response => {
		return response.json()
	})
}
sendRequest('GET', requestURL)
	.then(data => {
		showData(data)
	})
	.catch(err => console.log(err))

const alert = document.querySelector('#alert')

function customAlert() {
	alert.classList.remove('hide')
	alert.classList.add('show')
	alert.classList.add('showAlert')
	setTimeout(() => {
		alert.classList.add('hide')
		alert.classList.remove('show')
	}, 5000);
}
const closeButton = document.querySelector('.close-btn')
	closeButton.addEventListener('click', () => {
		alert.classList.add('hide')
		alert.classList.remove('show')
	})