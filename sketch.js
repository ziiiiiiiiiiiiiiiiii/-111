let speedMod = 1;
let draggedLava = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

class Lava {
	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.d = r * 2;
		this.maxSize = this.d * 2;
		this.xSpeed = random(-0.5, 0.5);
		this.ySpeed = random(-0.5, -2);
		this.res = r < 25 ? 5 : 8;
		this.resF = this.res + 2;
		this.offsets = Array.from({ length: this.res }, () => random(-5, 5));
		this.noiseOffsets = Array.from({ length: this.res }, () => random(1000));
		this.layer = round(random(1, 4));
	}

	move() {
		if (!this.dragging) {
			this.x += this.xSpeed;
			this.y += this.ySpeed * speedMod;
			if (this.y < -this.maxSize) {
				this.x = random(width);
				this.y = height + this.d;
			}
		}

		for (let i = 0; i < this.offsets.length; i++) {
			this.offsets[i] = map(noise(this.noiseOffsets[i]), 0, 1, 0, this.d);
			this.noiseOffsets[i] += this.hovered ? 0.025 : 0.005;
		}
	}

	show() {
		push();
		if (darkMode) fill(183, 235, 255, 25 * this.layer);
		else fill(0, 25 * this.layer);

		if (this.hovered) strokeWeight(2);
		else strokeWeight(1);

		translate(this.x, this.y);

		beginShape();
		for (let i = 0; i <= this.resF; i++) {
			let rad = (i * TAU) / this.res;
			let r = this.r + this.offsets[i % this.offsets.length];
			curveVertex(r * cos(rad), r * sin(rad));
		}
		endShape();

		if (mouseX || mouseY) {
			this.hovered = inFill(mouseX, mouseY);

			if (this.hovered && mouseIsPressed) {
				if (!draggedLava) {
					this.dragging = true;
					draggedLava = this;
					dragOffsetX = this.x - mouseX;
					dragOffsetY = this.y - mouseY;
					cursor('grabbing');
				}
			} else if (this.hovered) {
				cursor('grab');
			}
		} else this.hovered = false;

		pop();
	}
}

let darkMode = false;
let lavas = [];
let looping = true;
let blue, black;

function setup() {
	createCanvas();
	let amount = floor(width / 40);
	for (let i = 0; i < amount; i++) {
		let l = new Lava(random(width), random(height), random(10, 100));
		lavas.push(l);
	}
	blue = color(183, 235, 255, 64);
	black = color(0, 64);
}


function draw() {
	darkMode = document.body.classList.contains('dark');
	background(darkMode ? black : blue);

	for (let l of lavas) {
		l.move();
		l.show();
	}
}

function mouseDragged() {
	if (draggedLava) {
		draggedLava.x = mouseX + dragOffsetX;
		draggedLava.y = mouseY + dragOffsetY;
		return false;
	}
}

function mouseReleased() {
	if (draggedLava) {
		draggedLava.dragging = false;
		draggedLava = null;
	}
	mouseX = mouseY = 0;
}

function windowResized() {
	resizeCanvas();
}


