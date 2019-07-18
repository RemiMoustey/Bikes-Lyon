class Carousel {

	constructor(element) {
		this.element = element;
		this.element.classList.add("carousel");
		this.slides = this.createDivWithClass("slides");
		this.container = this.createDivWithClass("carousel_container");
		this.container.appendChild(document.getElementById("carousel_item"));
		this.slides.appendChild(this.container);
		document.getElementById("bloc_page").insertBefore(this.element, document.getElementById("map_panel"));
		this.items = [this.getItem(this.getImage("images/1.jpg", "Panneau d'enfants sur un vélo légendé 'Welcome'", "item_1"),
		"Bienvenue !", "Bienvenue sur standvelos-lyon.com ! Réservez dès maintenant votre vélo où vous le voulez !"),
		this.getItem(this.getImage("images/2.png", "Pan de la carte du site et petit cartouche d'explication", "item_2"),
		"Sélectionnez votre station", "Cliquez simplement sur la station où vous désirez réserver votre vélo sur la carte ci-dessous."),
		this.getItem(this.getImage("images/3.png", "Formulaire à côté de la carte avec les champs 'Nom' et 'Prénom'", "item_3"),
		"Entrez votre nom et votre prénom", "Entrez simplement votre nom et votre prénom dans le formulaire prévu à cet effet à côté de la carte."),
		this.getItem(this.getImage("images/4.png", "Le champ de signature sous le formulaire", "item_4"),
		"Signez", "Enfin, signez dans le cadre dédié à cet effet et cliquez sur 'Réservez'."),
		this.getItem(this.getImage("images/5.png", "Compteur de 20 minutes qui symbolise le temps de la réservation", "item_5"),
		"Votre vélo vous attend !", "Vous n'avez plus qu'à vous rendre sur place ! Le temps restant de votre réservation s'affiche sur votre écran !")];
		this.animationId = null;
		this.animationStop = true;
		this.createNavigation();
	}

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

		nextArrow.addEventListener("click", callNext);
		prevArrow.addEventListener("click", callPrev);

		document.addEventListener("keydown", function (e) {
			if(e.keyCode === 37) {
				callPrev();
			}
			else if(e.keyCode === 39) {
				callNext();
			}
		});
	}

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

	newItem(range) {
		let item = document.createElement("div");
		item.id = "carousel_item";
		item.classList.add("new_carousel_item")
		let image = this.createDivWithClass("carousel_image");
		let text = this.createDivWithClass("carousel_text");
		item.appendChild(image);
		item.appendChild(text);
		image.appendChild(document.createElement("img"));
		image.querySelector("img").setAttribute("src", this.items[range].Image.src);
		image.querySelector("img").setAttribute("alt", this.items[range].Image.alt);
		image.querySelector("img").classList.add(this.items[range].Image.classHTML);
		text.appendChild(document.createElement("h3")).textContent = this.items[range].title;
		text.appendChild(document.createElement("p")).textContent = this.items[range].description;
		document.querySelector(".carousel_container").replaceChild(item, document.getElementById("carousel_item"));
	}

	prevNew() {
		this.directionNewItem(1);
	}

	nextNew() {
		this.directionNewItem(-1);
	}

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

	getItem(Image, title, description) {
		return new Item(Image, title, description);
	}

	createDivWithClass(className) {
		let div = document.createElement("div");		
		div.classList.add(className);
		return div;
	}
}

document.addEventListener('DOMContentLoaded', function() {
	new Carousel(document.createElement("div"));
});