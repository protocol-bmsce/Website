const ship = document.querySelector("#ship");
const bullet = document.querySelector("#bullet");
const asteroidContainer = document.querySelector("#asteroid");
let ship_left = 0;
let bullet_top = 500;
const move_inter = 20;

window.addEventListener("load", function () {
	setInterval(spawnAsteroid, 2000); 
	setInterval(moveAsteroids, 50); 
});

window.addEventListener("click", function () {
	fire();
});

window.addEventListener("mousemove", function (e) {
	ship_left = e.x;
	ship.style.left = ship_left + "px";
});

window.addEventListener("keydown", function (e) {
	switch (e.key) {
		case "ArrowLeft":
			ship_left -= move_inter;
			ship.style.left = ship_left + "px";
			break;
		case "ArrowRight":
			ship_left += move_inter;
			ship.style.left = ship_left + "px";
			break;
		case " ":
			fire();
			break;
	}
});

function fire() {
	const ship_loc = ship.getBoundingClientRect();
	bullet.style.left = ship_loc.x + ship_loc.width / 2 + "px";
	bullet.style.display = "block";
	bullet_top = ship_loc.top;
	bullet.style.top = bullet_top + "px";

	let tid = setInterval(function () {
		bullet_top -= 10;
		bullet.style.top = bullet_top + "px";

		const asteroids = asteroidContainer.querySelectorAll("img");
		asteroids.forEach((at) => {
			if (isCollapsed(bullet, at)) {
				showExplosion(at);
				at.remove(); // remove asteroid on explosion
				clearInterval(tid); // stop bullet
				bullet.style.display = "none";
			}
		});

		// stop bullet when off screen
		if (bullet_top < 0) {
			clearInterval(tid);
			bullet.style.display = "none";
		}
	}, 10);
}

function isCollapsed(obj1, obj2) {
	let object_1 = obj1.getBoundingClientRect();
	let object_2 = obj2.getBoundingClientRect();

	return (
		object_1.left < object_2.left + object_2.width &&
		object_1.left + object_1.width > object_2.left &&
		object_1.top < object_2.top + object_2.height &&
		object_1.top + object_1.height > object_2.top
	);
}

function spawnAsteroid() {
	let at = document.createElement("img");
	at.src = "../images/rock1.gif"; 
	at.style.width = "50px";
	at.style.position = "absolute";
	at.style.left = Math.random() * (window.innerWidth - 50) + "px";
	at.style.top = "0px";
	asteroidContainer.appendChild(at);
}

function moveAsteroids() {
	const asteroids = asteroidContainer.querySelectorAll("img");

	asteroids.forEach((at) => {
		let top = parseInt(at.style.top) || 0;
		top += 3; 
		at.style.top = top + "px";

		
		if (top > window.innerHeight) {
			at.remove();
		}
	});
}

function showExplosion(at) {
	const rect = at.getBoundingClientRect();

	const explosion = document.createElement("img");
	explosion.src = "../images/explod.gif";
	explosion.style.width = "50px";
	explosion.style.position = "absolute";
	explosion.style.left = rect.left + "px";
	explosion.style.top = rect.top + "px";
	document.body.appendChild(explosion);

	
	setTimeout(() => {
		explosion.remove();
	}, 500);
}

 