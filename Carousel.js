/*
	Cette classe met en place le diaporama présent en haut de la page.
*/

class Carousel {

	// Crée l'objet et ses conteneurs et met à disposition le tableau des slides. 
	constructor(element) {
		this.element = element;
		this.element.classList.add("carousel");
		this.slides = this.createDivWithClass("slides");
		this.container = this.createDivWithClass("carousel_container");
		this.container.appendChild(document.getElementById("carousel_item"));
		this.slides.appendChild(this.container);
		document.getElementById("bloc_page").insertBefore(this.element, document.getElementById("map_panel"));
		this.items = [this.getItem(this.getImage("images/1.png", "Lion à vélo sur photo de Lyon", "item_1"),
		"Bienvenue sur lyonavelo.com !<br />Réservez dès maintenant votre vélo où vous le voulez !"),
		this.getItem(this.getImage("images/2.png", "Pan de la carte du site et petit cartouche d'explication", "item_2"),
		"Cliquez sur la station où vous désirez réserver votre vélo sur la carte ci-dessous.<br />Des informations sur la station sont affichées à droite de la carte."),
		this.getItem(this.getImage("images/3.png", "Formulaire à côté de la carte avec les champs 'Nom' et 'Prénom'", "item_3"),
		"Entrez votre nom et votre prénom dans le formulaire prévu à cet effet.<br />Ces champs sont obligatoires pour mener à bien votre réservation."),
		this.getItem(this.getImage("images/4.png", "Le champ de signature sous le formulaire", "item_4"),
		"Enfin, signez dans le cadre dédié à cet effet et cliquez sur 'Réserver'.<br />Votre vélo vous attend ! Toute nouvelle réservation annulera la précédente."),
		this.getItem(this.getImage("images/5.png", "Compteur de 20 minutes qui symbolise le temps de la réservation", "item_5"),
		"Vous n'avez plus qu'à vous rendre sur place !<br />Le temps restant de votre réservation s'affiche sur votre écran !")];
		this.animationId = null;
		this.animationStop = true;
		this.createNavigation();
	}

	/*
		- Met en place les boutons permettant de naviguer dans le diaporama.
		- Écoute les événements issus de l'interaction de l'utilisateur avec le programme
		(clics sur les boutons, changements de slide avec le clavier).
		- Appelle les fonctions nécessaires au fonctionnement des animations.
	*/
	createNavigation () {
		let prevArrow = this.createDivWithClass("carousel_prev");
		let nextArrow = this.createDivWithClass("carousel_next");
		prevArrow.classList.add("fas");
		prevArrow.classList.add("fa-chevron-left");
		nextArrow.classList.add("fas");
		nextArrow.classList.add("fa-chevron-right");
		this.slides.insertBefore(prevArrow, this.container);
		this.slides.appendChild(nextArrow);
		this.element.appendChild(this.slides);

		let pauseButton = this.createDivWithClass("pause_button");
		pauseButton.classList.add("fas");
		pauseButton.classList.add("fa-pause");
		this.element.appendChild(pauseButton);
		let play = true;
		let callNext = this.next.bind(this);
		let callPrev = this.prev.bind(this);
		let intervalId = setInterval(callNext, 5000);
		document.querySelector(".pause_button").addEventListener("click", function () {
			if(play) {
				clearInterval(intervalId);
				play = false;
				document.querySelector(".pause_button").classList.replace("fa-pause", "fa-play");
				return;
			}
			intervalId = setInterval(callNext, 5000);
			play = true;
			document.querySelector(".pause_button").classList.replace("fa-play", "fa-pause");
		});

		nextArrow.addEventListener("click", function () {
			clearInterval(intervalId);
			callNext();
			intervalId = setInterval(callNext, 5000);
		});
		prevArrow.addEventListener("click", function() {
			clearInterval(intervalId);
			callPrev();
			intervalId = setInterval(callNext, 5000);
		});

		document.addEventListener("keydown", function (e) {
			if(e.keyCode === 37) {
				clearInterval(intervalId);
				callPrev();
				intervalId = setInterval(callNext, 5000);
			}
			else if(e.keyCode === 39) {
				clearInterval(intervalId);
				callNext();
				intervalId = setInterval(callNext, 5000);
			}
		});
	}

	/*
	Les deux méthodes suivantes préviennent qu'une animation est en cours et appellent
	la méthode permettant l'apparition et le glissement du nouvel élément. 
	Ainsi, aucune animation ne peut être déclenchée si une autre animation est en cours.
	*/
	prev() {
		if(this.animationStop === true) {
			this.animationStop = false;
			this.determinePrevNewItem();
		}
	}

	next() {
		if(this.animationStop === true) {
			this.animationStop = false;
			this.determineNextNewItem();
		}
	}

	/*
		Les deux méthodes suivantes appellent les méthodes :
		- qui sélectionnent le slide suivant
		- qui déterminent la direction du slide suivant selon qu'il s'agit du précédent ou du suivant.
	*/
	determinePrevNewItem() {
		if(document.querySelector("img").classList.contains("item_1")) {
			this.newItem(4);
			this.prevNew();
			return;
		}
		for(let i = 1; i < this.items.length; i++) {
			if(document.querySelector("img").classList[0] === this.items[i].Image.classHTML) {
				this.newItem(i - 1);
				this.prevNew();
				return;
			}
		}
	}

	determineNextNewItem() {
		if(document.querySelector("img").classList.contains("item_5")) {
			this.newItem(0);
			this.nextNew();
			return;
		}
		for(let i = 0; i < this.items.length - 1; i++) {
			if(document.querySelector("img").classList[0] === this.items[i].Image.classHTML) {
				this.newItem(i + 1);
				this.nextNew();
				return;
			}
		}
	}

	// Sélectionne (grâce au tableau this.items) et crée le nouveau slide après un changement automatique ou par l'utilisateur.
	newItem(range) {
		let item = document.createElement("div");
		item.id = "carousel_item";
		item.classList.add("new_carousel_item");
		let image = this.createDivWithClass("carousel_image");
		let text = this.createDivWithClass("carousel_text");
		item.appendChild(image);
		item.appendChild(text);
		image.appendChild(document.createElement("img"));
		image.querySelector("img").setAttribute("src", this.items[range].Image.src);
		image.querySelector("img").setAttribute("alt", this.items[range].Image.alt);
		image.querySelector("img").classList.add(this.items[range].Image.classHTML);
		text.appendChild(document.createElement("p")).innerHTML = this.items[range].description;
		document.querySelector(".carousel_container").replaceChild(item, document.getElementById("carousel_item"));
	}

	// Détermine la direction du nouveau slide.
	prevNew() {
		this.directionNewItem(1);
	}

	nextNew() {
		this.directionNewItem(-1);
	}

	// Définit l'animation du nouveau slide jusqu'à son arrêt.
	directionNewItem(direction) {
		let xItem = parseFloat(getComputedStyle(document.querySelector(".new_carousel_item")).left);
		if(direction < 0 && xItem === -1260) {
			xItem = -xItem;
		}
		let xContainerLeft = parseFloat(getComputedStyle(document.querySelector(".carousel_container")).left);
		let vitesse = 70;
		document.querySelector(".new_carousel_item").style.left = xItem + direction * vitesse + "px";
		if(direction > 0) {
			if(xItem < -70) {
				this.animationId = requestAnimationFrame(this.prevNew.bind(this));
			} else {
				cancelAnimationFrame(this.animationId);
				this.animationStop = true;
				document.querySelector(".new_carousel_item").classList.remove("new_carousel_item");
			}
		}
		else {
			if(xItem > 70) {
				this.animationId = requestAnimationFrame(this.nextNew.bind(this));
			} else {
				cancelAnimationFrame(this.animationId);
				this.animationStop = true;
				document.querySelector(".new_carousel_item").classList.remove("new_carousel_item");
			}
		}
	}

	getImage(src, alt, classHTML) {
		return new Image(src, alt, classHTML);
	}

	getItem(Image, description) {
		return new Item(Image, description);
	}

	createDivWithClass(className) {
		let div = document.createElement("div");
		div.classList.add(className);
		return div;
	}
}

// L'événement DOMContentLoaded permet de ne créer le diaporama qu'une fois que le document HTML a été entièrement chargé.
document.addEventListener('DOMContentLoaded', function() {
	new Carousel(document.createElement("div"));
});