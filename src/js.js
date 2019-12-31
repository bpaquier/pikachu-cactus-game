const $game = document.querySelector(".game");
const $startButton = document.querySelector(".start");
const $score = document.querySelector(".game__score");
const $mountains = document.querySelector(".game__mountain");
const $originalMountains = document.querySelector(".mountain1");
const $overlay = document.querySelector(".overlay");
let cactus = [];

let $pikachu;

function createPikachu() {
  $pikachu = document.createElement("div");
  $pikachu.classList.add("game__pikachu");
  $game.appendChild($pikachu);
}

createPikachu();

let cactusPosition = [];
let GAMEWIDTH = 700;
let score = 0;
let scoreTemplate;
let gameTemplate;
let apparitionMountainsTemplate;
let apparitionCactusTimeout;
let pikaEatACactusTemplate;
let loose;

$startButton.addEventListener("click", function() {
  pikachuMove();
  createMountains();
  mountainsBackgroundMove();

  apparitionMountainsTemplate = setInterval(createMountains, 15000);
  gameTemplate = setInterval(function() {
    apparitionCactusTimeout = setTimeout(createCactus, getRandomNumber());
  }, 2300);

  scoreTemplate = setInterval(increaseScore, 100);

  setInterval(function pikaEatACactus() {
    let pikaPositionX = $pikachu.offsetLeft + $pikachu.offsetWidth;
    let pikaPositionY = $pikachu.offsetTop + $pikachu.offsetHeight;

    cactusPosition.forEach(function(cactus) {
      if (
        cactus.offsetLeft === pikaPositionX &&
        cactus.offsetTop < pikaPositionY
      ) {
        reset();
      }
    });
  }, 1);
});
/* SECTION FUNCTIONS*/

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
          }, 1400);
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
  const $mountain = document.createElement("div");
  $mountain.classList.add("mountain");
  $mountain.classList.add("move");

  $mountain.style.width = getRandomNumberMountainSize() + "px";
  $mountain.style.height = getRandomNumberMountainSize() + "px";
  $mountains.appendChild($mountain);

  setInterval(function() {
    if ($mountain.offsetLeft < -100 || loose) {
      $mountain.style.visibility = "hidden";
      $originalMountains.style.visibility = "hidden";
      $originalMountains.classList.remove("move");
      $originalMountains.style.left = "0px";
    }
  }, 50);
}

function createCactus() {
  const $cactus = document.createElement("div");
  $cactus.classList.add("game__cactus");
  $game.appendChild($cactus);
  let positionX = $cactus.offsetLeft;
  setInterval(function() {
    positionX -= 1;
    $cactus.style.left = positionX + "px";
  }, 10);
  cactusPosition.push($cactus);
}

function reset() {
  loose = true;

  clearTimeout(apparitionCactusTimeout);
  clearInterval(gameTemplate);
  clearInterval(scoreTemplate);
  clearInterval(apparitionMountainsTemplate);

  $pikachu.classList.add("is-dead");
  $overlay.classList.add("is-visible");

  removeCactus();

  setTimeout(function() {
    $overlay.classList.remove("is-visible");
    $score.innerHTML = "SCORE : " + 0;
    score = 0;
    $originalMountains.style.visibility = "visible";

    $pikachu.remove();
    createPikachu();
    loose = false;
  }, 3000);
}

function removeCactus() {
  let allCactus = document.querySelectorAll(".game__cactus");
  allCactus.forEach(function(cactus) {
    cactus.remove();
  });
}
