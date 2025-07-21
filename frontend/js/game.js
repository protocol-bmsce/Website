const ship = document.querySelector("#ship");
const bullet = document.querySelector("#bullet");
const asteroidContainer = document.querySelector("#asteroid");
const scoreDisplay = document.querySelector("#score");
const questionBox = document.querySelector("#question-box");

let ship_left = 0;
let bullet_top = 500;
let score = 0;
let questionCount = 0;
const maxQuestions = 6;
let asteroidSpawnIntervalId;

let currentQuestion = {};
let currentOptions = [];
let hasAnsweredCurrentQuestion = false;
let availableQuestions = [];

const ASTEROID_WIDTH = 100;
const ASTEROID_HEIGHT = 100;
const ASTEROID_FALL_SPEED = 8;
const activeAsteroidPositions = [];
let usedXPositions = new Set();

window.addEventListener("load", () => {
  initializeGame();
  setInterval(moveAsteroids, 50);
  spawnInitialStars(100);
});
window.addEventListener("click", fire);
window.addEventListener("keydown", handleKeyDownForFire);

window.addEventListener("mousemove", (e) => {
  moveShip(e.clientX);
});
window.addEventListener("touchmove", (e) => {
  moveShip(e.touches[0].clientX);
});

function moveShip(x) {
  ship_left = x - ship.offsetWidth / 2;
  ship_left = Math.max(0, Math.min(ship_left, window.innerWidth - ship.offsetWidth));
  ship.style.left = ship_left + "px";
}

function handleKeyDownForFire(e) {
  if (e.key === "ArrowLeft") moveShip(ship_left - 20);
  if (e.key === "ArrowRight") moveShip(ship_left + 20);
  if (e.key === " ") fire();
}

function initializeGame() {
  score = 0;
  questionCount = 0;
  scoreDisplay.textContent = "Score: " + score;
  availableQuestions = [...allQuestions];
  shuffleArray(availableQuestions);
  loadNewQuestion();
}

function loadNewQuestion() {
  hasAnsweredCurrentQuestion = false;
  questionCount++;
  clearInterval(asteroidSpawnIntervalId);

  if (questionCount > maxQuestions || availableQuestions.length === 0) {
    endGame();
    return;
  }

  asteroidContainer.innerHTML = "";
  activeAsteroidPositions.length = 0;
  usedXPositions.clear();

  currentQuestion = availableQuestions.shift();
  questionBox.textContent = "Question: " + currentQuestion.question;
  currentOptions = [...currentQuestion.options];

  let optionsSpawned = 0;
  spawnAsteroidOption();
  optionsSpawned++;

  asteroidSpawnIntervalId = setInterval(() => {
    if (optionsSpawned < currentQuestion.options.length) {
      spawnAsteroidOption();
      optionsSpawned++;
    } else {
      clearInterval(asteroidSpawnIntervalId);
    }
  }, 1000);
}

function endGame() {
  questionBox.textContent = `Game Over! Final Score: ${score} out of ${maxQuestions}`;
  asteroidContainer.innerHTML = "";
  window.removeEventListener("click", fire);
  window.removeEventListener("keydown", handleKeyDownForFire);
  clearInterval(asteroidSpawnIntervalId);
  activeAsteroidPositions.length = 0;
  usedXPositions.clear();
}

function fire() {
  const shipRect = ship.getBoundingClientRect();
  const nozzleX = shipRect.left + shipRect.width / 2 - bullet.offsetWidth / 2;
  const nozzleY = shipRect.top;

  bullet.style.left = `${nozzleX}px`;
  bullet.style.top = `${nozzleY}px`;
  bullet.style.display = "block";
  bullet_top = nozzleY;

  const bulletSpeed = 150;

  const tid = setInterval(() => {
    bullet_top -= bulletSpeed;
    bullet.style.top = bullet_top + "px";

    const asteroids = asteroidContainer.querySelectorAll(".asteroid");
    for (const at of asteroids) {
      if (isColliding(bullet, at)) {
        showExplosion(at);
        asteroidContainer.innerHTML = "";

        activeAsteroidPositions.length = 0;
        usedXPositions.clear();

        const text = at.querySelector(".asteroid-text")?.textContent.trim();
        if (text && text.toLowerCase() === currentQuestion.answer.toLowerCase()) {
          score++;
        }

        scoreDisplay.textContent = "Score: " + score;
        hasAnsweredCurrentQuestion = true;
        clearInterval(tid);
        bullet.style.display = "none";
        loadNewQuestion();
        return;
      }
    }

    if (bullet_top < 0) {
      clearInterval(tid);
      bullet.style.display = "none";
    }
  }, 10);
}

function isColliding(obj1, obj2) {
  const r1 = obj1.getBoundingClientRect();
  const r2 = obj2.getBoundingClientRect();
  return (
    r1.left < r2.left + r2.width &&
    r1.left + r1.width > r2.left &&
    r1.top < r2.top + r2.height &&
    r1.top + r1.height > r2.top
  );
}

function spawnAsteroidOption() {
  if (currentOptions.length === 0 || hasAnsweredCurrentQuestion) return;

  const opt = currentOptions.shift();
  const asteroid = document.createElement("div");
  asteroid.classList.add("asteroid");

  const img = document.createElement("img");
  img.src = "../images/rock1.gif"; // ✅ correct relative path
  img.alt = "Asteroid";
  img.classList.add("asteroid-image");

  const text = document.createElement("span");
  text.classList.add("asteroid-text");
  text.textContent = opt;

  asteroid.appendChild(img);
  asteroid.appendChild(text);

  let newLeft;
  let attempts = 0;
  const startTop = -ASTEROID_HEIGHT;
  do {
    newLeft = Math.random() * (window.innerWidth - ASTEROID_WIDTH);
    var testRect = {
      left: newLeft,
      top: startTop,
      width: ASTEROID_WIDTH,
      height: ASTEROID_HEIGHT
    };
    attempts++;
  } while (checkOverlap(testRect) && attempts < 100);

  asteroid.style.left = `${newLeft}px`;
  asteroid.style.top = `${startTop}px`;
  asteroidContainer.appendChild(asteroid);

  activeAsteroidPositions.push({
    left: newLeft,
    top: startTop,
    width: ASTEROID_WIDTH,
    height: ASTEROID_HEIGHT,
    element: asteroid
  });
  usedXPositions.add(newLeft);
}

function moveAsteroids() {
  for (let i = activeAsteroidPositions.length - 1; i >= 0; i--) {
    const pos = activeAsteroidPositions[i];
    const el = pos.element;
    if (!document.body.contains(el)) {
      activeAsteroidPositions.splice(i, 1);
      continue;
    }

    let top = parseInt(el.style.top) || 0;
    top += ASTEROID_FALL_SPEED;
    el.style.top = top + "px";
    pos.top = top;

    if (top > window.innerHeight) {
      el.remove();
      activeAsteroidPositions.splice(i, 1);
    }
  }

  if (asteroidContainer.querySelectorAll(".asteroid").length === 0 &&
      currentOptions.length === 0 &&
      !hasAnsweredCurrentQuestion) {
    hasAnsweredCurrentQuestion = true;
    loadNewQuestion();
  }
}

function checkOverlap(newRect) {
  for (const rect of activeAsteroidPositions) {
    const verticalThreshold = ASTEROID_HEIGHT * 0.5;
    if (
      newRect.left < rect.left + rect.width &&
      newRect.left + newRect.width > rect.left &&
      Math.abs(newRect.top - rect.top) < verticalThreshold
    ) {
      return true;
    }
  }

  for (let x of usedXPositions) {
    if (Math.abs(newRect.left - x) < ASTEROID_WIDTH * 0.5) return true;
  }

  return false;
}

function showExplosion(el) {
  const rect = el.getBoundingClientRect();
  const explosion = document.createElement("img");
  explosion.src = "../images/explod.gif"; // ✅ correct path
  explosion.style.position = "absolute";
  explosion.style.left = rect.left + "px";
  explosion.style.top = rect.top + "px";
  explosion.style.width = "50px";
  explosion.style.zIndex = "999";
  document.body.appendChild(explosion);

  setTimeout(() => explosion.remove(), 500);
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ⭐ STAR BACKGROUND ANIMATION
const starsContainer = document.getElementById("stars-container");
setInterval(spawnStar, 100);
setInterval(moveStars, 50);

function spawnStar() {
  const star = document.createElement("div");
  star.classList.add("star");
  star.style.left = Math.random() * window.innerWidth + "px";
  star.style.top = "0px";
  star.style.opacity = Math.random();
  const size = Math.random() * 2 + 1;
  star.style.width = size + "px";
  star.style.height = size + "px";
  star.dataset.speed = Math.random() * 3 + 1;
  starsContainer.appendChild(star);
}

function moveStars() {
  const stars = starsContainer.querySelectorAll(".star");
  stars.forEach((star) => {
    let top = parseFloat(star.style.top);
    top += parseFloat(star.dataset.speed);
    star.style.top = top + "px";
    if (top > window.innerHeight) star.remove();
  });
}
