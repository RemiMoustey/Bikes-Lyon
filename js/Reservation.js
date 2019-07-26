let intervalId = null;
/* Variable globale qui permet de rendre le compteur de temps restant à la réservation fonctionnel,
avec une répétition à un intervalle de temps régulier. */

class Reservation {

	// Cet objet permet d'afficher les informations relatives à la réservation stockées dans le localStorage.
	constructor(name, firstname) {
		this.station = $('#address').text();
		if(this.station !== "") {
			sessionStorage.setItem("station", this.station);
		}
		$('#name').attr("value", localStorage.getItem("name"));
		$('#firstname').attr("value", localStorage.getItem("firstname"));
		$('#address').text('');
		$('#number_places').text('');
		$("#available_bikes").text('');
		this.buildReservation();
	}

	// Diminue le compteur toutes les secondes et stocke les information dans la sessionStorage.
	reduceTime() {
		let counterSecondsElt = $("#seconds").get(0);
		let counterMinutesElt = $("#minutes").get(0);
		let counterMinutesNum = Number(counterMinutesElt.textContent);
		let counterSecondsNum = Number(counterSecondsElt.textContent);
		if(counterSecondsNum > 0) {
			counterSecondsElt.textContent = (counterSecondsNum - 1);
		}
		else {
			counterMinutesElt.textContent = counterMinutesNum - 1;
			counterSecondsElt.textContent = 59;
		}
		sessionStorage.setItem("minutes", Number(counterMinutesElt.textContent));
		sessionStorage.setItem("seconds", Number(counterSecondsElt.textContent));

		if(sessionStorage.getItem("minutes") === "0" && sessionStorage.getItem("seconds") === "0") {
			clearInterval(intervalId);
			$("#bloc_timer").html("");
			sessionStorage.setItem("minutes", "");
			sessionStorage.setItem("seconds", "");
		}
	}

	// Utilise les informations stockées pour les afficher à l'écran de l'utilisateur.
	buildReservation() {
		$('#places_bikes').removeClass("places_bikes_orange");
		$('#bloc_timer').html("<div class=\"green_background\">Vélo réservé à la station <br />" + sessionStorage.getItem("station") + "<br />par " + localStorage.getItem("firstname") + " " + localStorage.getItem("name") + "</div>");
		$('#submit').attr("disabled", "");
		let counterMinutes = sessionStorage.getItem("minutes");
		let counterSeconds = sessionStorage.getItem("seconds");
		sessionStorage.setItem("minutes", counterMinutes);
		sessionStorage.setItem("seconds", counterSeconds);
		if(sessionStorage.getItem("minutes") !== "20" && sessionStorage.getItem("seconds") !== "30") {
			counterMinutes = sessionStorage.getItem("minutes");
			counterSeconds = sessionStorage.getItem("seconds");
		}
		else {
			sessionStorage.setItem("minutes", counterMinutes);
			sessionStorage.setItem("seconds", counterSeconds);
		}
		let minutesElt = document.createElement("span");
		minutesElt.id = "minutes";
		minutesElt.textContent = counterMinutes;
		let secondsElt = document.createElement("span");
		secondsElt.id = "seconds";
		secondsElt.textContent = counterSeconds;
		let clockElt = this.createDivWithClass("clock");
		$("#bloc_timer").append(clockElt);
		$(".clock").append("Temps restant : ");
		$(".clock").append(minutesElt, "min ");
		$(".clock").append(secondsElt, "s.");
		intervalId = setInterval(this.reduceTime, 1000);
	}

	createDivWithClass(className) {
		let div = document.createElement("div");		
		div.classList.add(className);
		return div;
	}
}

let form = $('form').get(0);
$('#name').attr("value", localStorage.getItem("name"));
$('#firstname').attr("value", localStorage.getItem("firstname"));
if (sessionStorage.getItem("minutes") !== "" && sessionStorage.getItem("seconds") !== "" &&
	sessionStorage.getItem("minutes") !== null && sessionStorage.getItem("seconds") !== null) {
	new Reservation(name, firstname);
}

$('form').on("submit", function(e) {
	clearInterval(intervalId); // Pour qu'il n'y ait qu'un seul intervalle en cours.
	e.preventDefault();
	let name = form.elements.name.value;
	let firstname = form.elements.firstname.value;
	localStorage.setItem("name", name);
	localStorage.setItem("firstname", firstname);
	sessionStorage.setItem("minutes", 20);
	sessionStorage.setItem("seconds", 0);
	$('#signature').hide();
	new Reservation(name, firstname);
});