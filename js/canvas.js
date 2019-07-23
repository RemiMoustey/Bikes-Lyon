/* Source : https://codepen.io/Zonecss/pen/dqvXNo */

class Canvas {

	constructor() {
		this.canvas = document.querySelector("canvas");
		if(this.canvas.getContext) {
			const ctx = this.canvas.getContext("2d");
			ctx.strokeRect(0, 0, 150, 150);
			ctx.beginPath();
		    this.canvas.addEventListener("mousedown", this.drawLine.bind(this));
			this.canvas.addEventListener("touchstart", this.drawLine.bind(this));
			$('#clear').on("click", this.clearDraw.bind(this));
			$("form").on("submit", this.clearDraw.bind(this));
			$('form').on("submit", function() {
				$('#signature').hide();
			});
			this.canvas.toDataURL("image/png");
		}
	}

	getPosition(event, canvas) {
		let position = canvas.getBoundingClientRect();
		return {
			posX : (event.clientX - position.left) / (position.right - position.left) * canvas.width,
			posY : (event.clientY - position.top) / (position.bottom - position.top) * canvas.height
		};
	}

	drawLine(e) {
		let canvas = e.target;
		let position = this.getPosition(e, canvas);
		canvas.posX = position.posX;
		canvas.posY = position.posY;
		canvas.bDraw = true;
		this.canvas.addEventListener("mousemove", this.moveLine.bind(this));
		canvas.addEventListener("mouseup", this.stopDraw.bind(this));
		this.canvas.addEventListener("touchmove", this.moveLine.bind(this));
		canvas.addEventListener("touchend", this.stopDraw.bind(this));
	}

	stopDraw(e) {
		e.target.bDraw = false;
	}

	moveLine (e) {
		let canvas = e.target;
		let ctx = null;
		let pos = null;
		if(canvas.bDraw === false) {
			return false;
		}
		pos = this.getPosition(event, canvas);
		ctx = canvas.getContext("2d");
		ctx.lineWidth = 4;
		ctx.strokeStyle = "#000000";
		ctx.beginPath();
		ctx.moveTo(canvas.posX, canvas.posY);
		ctx.lineTo(pos.posX, pos.posY);
		ctx.stroke();

		canvas.posX = pos.posX;
		canvas.posY= pos.posY;
	}

	clearDraw(e) {
		if(this.canvas.getContext) {
			let ctx = this.canvas.getContext('2d')
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			ctx.strokeRect(0, 0, 150, 150);
			$('#submit').attr("disabled", "");
		}
	}
}

new Canvas();