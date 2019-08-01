/*
	- Crée le fond de carte grâce à l'API Mapbox.
	- Crée les différents marqueurs de stations (rouges et verts) dont les données sont récupérées par l'API JCDecaux.
*/

class MapStations {

	// Permet de former un objet regroupant le fond de carte et les marqueurs de stations.
	constructor() {
		this.greenIcon = L.icon({
			iconUrl: "images/green_bike.png",
			iconSize: [26, 40],
			iconAnchor: [13, 40]
		});

		this.redIcon = L.icon({
			iconUrl: "images/red_bike.png",
			iconSize: [26, 40],
			iconAnchor: [13, 40]
		});

		this.background = this.getBackgroundMap();
		this.recupStations();
	}

	// Renvoie le fond de la carte.
	getBackgroundMap() {
		let background = L.map('mapid').setView([45.762, 4.854], 13);

		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		    maxZoom: 18,
		    id: 'mapbox.streets',
		    accessToken: 'pk.eyJ1IjoicmVtaW02MyIsImEiOiJjankwMHE3bGkwMnM3M2RsazRkMjRmYmYwIn0.kZsG98EgabFQ5DNubAZTsg'
		}).addTo(background);

		return background;
	}

	// Renvoie des objets JavaScript après les avoir convertis du format JSON.
	async getStations() {
		try {
			const response = await fetch("https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=28739a9e4d6cd592b4a215b24a880460621ca811");
			if(response.ok) {
				return response.json();
			} else {
				console.error("Retour du serveur : ", response.status);
			}
		} catch (e) {
			console.log(e);
		}		
	}

	/* 
		- Récupère les stations sous forme d'objets.
		- Détermine la couleur du marqueur de la station.
		- Affiche les informations pour le visiteur.
		- Affiche l'espace pour signer si l'utilisateur clique sur une station verte
		et le fait disparaître si l'utilisateur clique sur une station rouge.
	*/
	async recupStations () {
		let stations =  await this.getStations();
		for(let station of stations) {
			if(station.status === "OPEN" && station.available_bikes > 0) {
				let marker = L.marker([station.position.lat, station.position.lng], {icon: this.greenIcon});
				marker.addTo(this.background);
				marker.title(station.address);
				marker.on("click", function() {
					$('#red_station').text('');
					$('#address').text(station.address);
					$('#number_places').text(station.bike_stands + " places");
					if(station.available_bikes === 1) {
						$("#available_bikes").text(station.available_bikes + " vélo disponible");
					}
					else if(station.available_bikes > 1) {
						$("#available_bikes").text(station.available_bikes + " vélos disponibles");
					}
					$('#signature').show();
					$('#places_bikes').addClass("places_bikes_orange");
					$('canvas').on("click", function() {
						$('#submit').removeAttr("disabled");
					});
				});
			}
			else if(station.status === "CLOSED" || station.available_bikes === 0) {
				let marker = L.marker([station.position.lat, station.position.lng], {icon: this.redIcon});
				marker.addTo(this.background);
				marker.on("click", function() {
					$('#address').text(station.address);
					$('#number_places').text('');
					$("#available_bikes").text('');
					$('#signature').hide();
					$('#places_bikes').addClass("places_bikes_orange");
					if(station.available_bikes === 0) {
						$("#red_station").text('Cette station n\'a aucun vélo disponible.');
					}
					if(station.status === "CLOSED") {
						$('#red_station').text('Cette station est fermée.');
					}
					$('#submit').attr("disabled", "");
				});
			}
		}
	}
}

new MapStations();
