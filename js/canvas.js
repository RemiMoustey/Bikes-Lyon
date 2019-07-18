/* Source : https://codepen.io/Zonecss/pen/dqvXNo */

class Canvas {

	constructor() {
		this.canvas = document.querySelector("canvas");
		if(this.canvas.getContext) {
			const ctx = this.canvas.getContext("2d");
			ctx.strokeRect(0, 0, 150, 150);
			ctx.beginPath();
		    this.canvas.addEventListener("mousedown", this.drawLine);
			this.canvas.addEventListener("touchstart", this.drawLine);
			this.canvas.addEventListener("touchmove", this.moveLine);
			$('#clear').on("click", this.clearDraw);
			$("#submit").on("click", this.clearDraw);
			$('#submit').on("click", function() {
				$('#signature').hide();
			});
		}
	}

	getPosition = (event, canvas) => {
		let position = canvas.getBoundingClientRect();
		let eventEle = event.changedTouches? event.changedTouches[0]:event;
		return {
			posX : (event.clientX - position.left) / (position.right - position.left) * canvas.width,
			posY : (event.clientY - position.top) / (position.bottom - position.top) * canvas.height
		};
	}

	drawLine = (e) => {
		let canvas = e.currentTarget;
		let position = this.getPosition(e, canvas);
		canvas.posX = position.posX;
		canvas.posY = position.posY;
		canvas.bDraw = true;
		this.canvas.addEventListener("mousemove", this.moveLine);
		canvas.addEventListener("mouseup", this.stopDraw);
		canvas.addEventListener("touchend", this.stopDraw);
	}

	stopDraw = (e) => {
		e.currentTarget.bDraw = false;
	}

	moveLine = (e) => {
		let canvas = e.currentTarget;
		let ctx = null;
		let pos = null;
		if(canvas.bDraw === false) {
			return false;
		}
		pos = this.getPosition(event, canvas);
		ctx = canvas.getContext("2d");
		ctx.lineWidth = 4;
		ctx.strokeStyle = "#000";
		ctx.beginPath();
		ctx.moveTo(canvas.posX, canvas.posY);
		ctx.lineTo(pos.posX, pos.posY);
		ctx.stroke();

		canvas.posX = pos.posX;
		canvas.posY= pos.posY;
	}

	clearDraw = (e) => {
		if(this.canvas.getContext) {
			let ctx = this.canvas.getContext('2d')
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			ctx.strokeRect(0, 0, 150, 150);
			$('#submit').attr("disabled", "");
		}
	}
}

new Canvas();