const $game = document.querySelector(".game");
const $startButton = document.querySelector(".start");
const $score = document.querySelector(".game__score");
const $mountains = document.querySelector(".game__mountain");
const $originalMountains = document.querySelector(".mountain1");
const $overlay = document.querySelector(".overlay");
let cactus = [];

let $pikachu;
let $mountain;

let cactusPosition = [];
let GAMEWIDTH = 700;
let score = 0;

let scoreTemplate;
let gameTemplate;
let apparitionMountainsTemplate;
let apparitionCactusTimeout;
let pikaEatACactusTemplate;

createPikachu();

$startButton.addEventListener("click", function() {
  pikachuMove();
  createMountains();
  mountainsBackgroundMove();

  apparitionMountainsTemplate = setInterval(createMountains, 15000);
  gameTemplate = setInterval(function() {
    apparitionCactusTimeout = setTimeout(createCactus, getRandomNumber());
  }, 2300);

  scoreTemplate = setInterval(increaseScore, 100);

  setInterval(pikaEatACactus, 1);
});

/* SECTION FUNCTIONS*/

function createPikachu() {
  $pikachu = document.createElement("div");
  $pikachu.classList.add("game__pikachu");
  $game.appendChild($pikachu);
}

function getRandomNumber() {
  let number;
  do {
    number = Math.floor(Math.random() * 23) * 100;
  } while (number < 900);
  return number;
}

function getRandomNumberMountainSize() {
  let number;
  do {
    number = Math.floor(Math.random() * 300);
  } while (number < 200);
  return number;
}

function increaseScore() {
  score++;
  $score.innerHTML = "SCORE : " + score;
}

function pikachuMove() {
  $pikachu.classList.add("is-running");
  window.addEventListener("keydown", function(e) {
    let jumpDuration;
    let pikachuPosition = $pikachu.offsetLeft;
    switch (e.key) {
      case "ArrowUp":
        if (!$pikachu.classList.contains("is-jumping")) {
          $pikachu.classList.add("is-jumping");
          jumpDuration = setTimeout(function() {
            $pikachu.classList.remove("is-jumping");
          }, 900);
        }
        break;
      case "ArrowDown":
        if ($pikachu.classList.contains("is-jumping")) {
          $pikachu.classList.remove("is-jumping");
          clearTimeout(jumpDuration);
        }
        break;
      case "ArrowRight":
        if (!$pikachu.classList.contains("is-jumping")) {
          pikachuPosition += 5;
          $pikachu.style.left = pikachuPosition + "px";
        }
        break;
      case "ArrowLeft":
        if (!$pikachu.classList.contains("is-jumping")) {
          pikachuPosition -= 5;
          $pikachu.style.left = pikachuPosition + "px";
        }
        break;
    }
  });
}

function mountainsBackgroundMove() {
  $originalMountains.classList.add("move");
}

function createMountains() {
  $mountain = document.createElement("div");
  $mountain.classList.add("mountain");
  $mountain.classList.add("move");

  $mountain.style.width = getRandomNumberMountainSize() + "px";
  $mountain.style.height = getRandomNumberMountainSize() + "px";
  $mountains.appendChild($mountain);
}

function removeMountain() {
  $mountain.style.visibility = "hidden";
  $originalMountains.style.visibility = "hidden";
  $originalMountains.classList.remove("move");
  $originalMountains.style.left = "0px";
}

function createCactus() {
  const $cactus = document.createElement("div");
  $cactus.classList.add("game__cactus");
  $game.appendChild($cactus);
  let positionX = $cactus.offsetLeft;
  setInterval(function() {
    positionX -= 1;
    $cactus.style.left = positionX + "px";
  }, 8);
  cactusPosition.push($cactus);
}

function removeCactus() {
  let allCactus = document.querySelectorAll(".game__cactus");
  allCactus.forEach(function(cactus) {
    cactus.remove();
  });
}

function pikaEatACactus() {
  let pikaPositionX = $pikachu.offsetLeft + $pikachu.offsetWidth - 10;
  let pikaPositionY = $pikachu.offsetTop + $pikachu.offsetHeight - 5;

  cactusPosition.forEach(function(cactus) {
    if (
      cactus.offsetLeft < pikaPositionX &&
      $pikachu.offsetLeft + 20 < cactus.offsetLeft + cactus.offsetWidth &&
      cactus.offsetTop < pikaPositionY
    ) {
      reset();
    }
  });
}

function reset() {
  clearTimeout(apparitionCactusTimeout);
  clearInterval(gameTemplate);
  clearInterval(scoreTemplate);
  clearInterval(apparitionMountainsTemplate);

  $pikachu.classList.add("is-dead");
  $overlay.classList.add("is-visible");

  removeCactus();
  removeMountain();

  setTimeout(function() {
    $overlay.classList.remove("is-visible");
    $score.innerHTML = "SCORE : " + 0;
    score = 0;
    $originalMountains.style.visibility = "visible";

    $pikachu.remove();
    createPikachu();
  }, 3500);
}
