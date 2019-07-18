let intervalId = null;

class Reservation {

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

	reduceTime() {
		let counterSecondsElt = document.getElementById("seconds");
		let counterMinutesElt = document.getElementById("minutes");
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

	buildReservation() {
		$('#bloc_timer').text("Vélo réservé à la station " + sessionStorage.getItem("station") + " par " + localStorage.getItem("firstname") + " " + localStorage.getItem("name"));
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
		let minutes = document.createElement("span");
		minutes.id = "minutes";
		minutes.textContent = counterMinutes;
		let seconds = document.createElement("span");
		seconds.id = "seconds";
		seconds.textContent = counterSeconds;
		$('#bloc_timer').append(document.createElement("br"));
		$('#bloc_timer').append("Temps restant : ");
		$('#bloc_timer').append(minutes, "min ");
		$('#bloc_timer').append(seconds, "s");
		intervalId = setInterval(this.reduceTime, 1000);
	}
}

let form = document.querySelector("form");
$('#name').attr("value", localStorage.getItem("name"));
$('#firstname').attr("value", localStorage.getItem("firstname"));
if (sessionStorage.getItem("minutes") !== "" && sessionStorage.getItem("seconds") !== "" &&
	sessionStorage.getItem("minutes") !== null && sessionStorage.getItem("seconds") !== null) {
	new Reservation;
}

form.addEventListener("submit", function(e) {
	clearInterval(intervalId); /* Pour qu'il n'y ait qu'un seul intervalle en cours */
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