class Carousel {

	constructor(element) {
		this.element = element;
		this.element.classList.add("carousel");
		this.slides = this.createDivWithClass("slides");
		this.container = this.createDivWithClass("carousel_container");
		this.container.appendChild(document.getElementById("carousel_item"));
		this.slides.appendChild(this.container);
		document.getElementById("bloc_page").insertBefore(this.element, document.getElementById("map_panel"));
		this.items = [this.getItem(this.getImage("images/1.jpg", "", "item_1"), "Mon titre 1", "Un peu de texte pour tester le carousel"),
		this.getItem(this.getImage("images/2.jpg", "", "item_2"), "Mon titre 2", "Un peu de texte pour tester le carousel"),
		this.getItem(this.getImage("images/3.jpg", "", "item_3"), "Mon titre 3", "Un peu de texte pour tester le carousel"),
		this.getItem(this.getImage("images/4.jpg", "", "item_4"), "Mon titre 4", "Un peu de texte pour tester le carousel"),
		this.getItem(this.getImage("images/5.jpg", "", "item_5"), "Mon titre 5", "Un peu de texte pour tester le carousel")];
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
		pauseButton.appendChild(document.createElement("button"));
		this.element.appendChild(pauseButton);
		document.querySelector("button").classList.add("fas");
		document.querySelector("button").classList.add("fa-pause");
		let play = true;
		let callNext = this.next.bind(this);
		let callPrev = this.prev.bind(this);
		let intervalId = setInterval(callNext, 5000);
		document.querySelector("button").addEventListener("click", function () {
			if(play) {
				clearInterval(intervalId);
				play = false;
				document.querySelector("button").classList.replace("fa-pause", "fa-play");
				return;
			}
			intervalId = setInterval(callNext, 5000);
			play = true;
			document.querySelector("button").classList.replace("fa-play", "fa-pause");
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

	prev() {
		document.querySelector("button").setAttribute("disabled", "");
		this.directionItem(1);	
	}

	next() {
		document.querySelector("button").setAttribute("disabled", "");
		this.directionItem(-1);
	}

	directionItem(direction) {
		let xItem = parseFloat(getComputedStyle(document.getElementById("carousel_item")).left);
		let xContainerMax = parseFloat(getComputedStyle(document.querySelector(".carousel")).width);
		let vitesse = 70;
		document.getElementById("carousel_item").style.left = (xItem + direction * vitesse) + "px";
		if(direction > 0) {
			if(xItem < xContainerMax) {
				this.animationId = requestAnimationFrame(this.prev.bind(this));
			}
			else {
				cancelAnimationFrame(this.animationId);
				this.determinePrevNewItem();
			}
		}

		else {
			if(-xItem < xContainerMax) {
				this.animationId = requestAnimationFrame(this.next.bind(this));	
			}
			else {
				cancelAnimationFrame(this.animationId);
				this.determineNextNewItem();
			}
		}
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
				animationId = requestAnimationFrame(this.prevNew.bind(this));
			} else {
				cancelAnimationFrame(animationId);
				document.querySelector("button").removeAttribute("disabled");
				document.querySelector(".new_carousel_item").classList.remove("new_carousel_item");
			}
		}

		else {
			if(xItem > 70) {
				animationId = requestAnimationFrame(this.nextNew.bind(this));
			} else {
				cancelAnimationFrame(animationId);
				document.querySelector("button").removeAttribute("disabled");
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