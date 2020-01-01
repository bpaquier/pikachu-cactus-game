const $game = document.querySelector(".game");
const $startButton = document.querySelector(".start");
const $score = document.querySelector(".game__score");
const $mountainsSection = document.querySelector(".game__mountain");
const $originalMountains = document.querySelector(".mountain1");
const $overlay = document.querySelector(".overlay");
const $sun = document.querySelector(".game__sun");
const $showLife = document.querySelector(".game__life");

let isStarted = true;
let isJumping = false;
let pikaInvicible = false;

let GAMEWIDTH = 700;
let score = 0;
let lifes = 4;

let mountains = [];
let cactusPosition = [];

let scoreTemplate;
let gameTemplate;
let apparitionMountainsTemplate;
let apparitionCactusTimeout;

$showLife.innerHTML = "Life : " + lifes;
$score.innerHTML = "Score : " + score;

createPikachu();

$startButton.addEventListener("click", function() {
  start();
});

/* SECTION FUNCTIONS*/

function start() {
  if (isStarted) {
    isStarted = false;
    pikachuMove();
    createMountains();
    mountainsBackgroundMove();
    apparitionMountainsTemplate = setInterval(createMountains, 10000);
    gameTemplate = setInterval(function() {
      apparitionCactusTimeout = setTimeout(createCactus, getRandomNumber());
    }, 2300);
    scoreTemplate = setInterval(increaseScore, 100);
  }
}

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
  } while (number < 100);
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
    switch (e.keyCode) {
      case 38 || 32:
        if (!$pikachu.classList.contains("is-jumping")) {
          jump();
        }
        break;
      case 40:
        if ($pikachu.classList.contains("is-jumping")) {
          $pikachu.classList.remove("is-jumping");
          clearTimeout(jumpDuration);
        }
        break;
      case 39:
        if (!$pikachu.classList.contains("is-jumping")) {
          pikachuPosition += 5;
          $pikachu.style.left = pikachuPosition + "px";
        }
        break;
      case 37:
        if (!$pikachu.classList.contains("is-jumping")) {
          pikachuPosition -= 5;
          $pikachu.style.left = pikachuPosition + "px";
        }
        break;
    }
  });
  document.addEventListener("click", function() {
    jump();
  });
}

function jump() {
  if (!isJumping) {
    $pikachu.classList.add("is-jumping");
    jumpDuration = setTimeout(function() {
      $pikachu.classList.remove("is-jumping");
    }, 1000);
  }
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
  $mountainsSection.appendChild($mountain);

  mountains.push($mountain);
}

function removeMountain() {
  mountains.forEach(function(mountain) {
    mountain.remove();
  });
  mountains = [];
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
    pikaEatACactus();
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
  if (!pikaInvicible) {
    let pikaPositionX = $pikachu.offsetLeft + $pikachu.offsetWidth - 10;
    let pikaPositionY = $pikachu.offsetTop + $pikachu.offsetHeight - 5;

    cactusPosition.forEach(function(cactus) {
      if (
        cactus.offsetLeft < pikaPositionX &&
        $pikachu.offsetLeft + 20 < cactus.offsetLeft + cactus.offsetWidth &&
        cactus.offsetTop < pikaPositionY
      ) {
        if (lifes > 0) {
          lifes--;
          pikaInvicible = true;
          $pikachu.classList.add("is-flashing");
          $showLife.innerHTML = "Life : " + lifes;
          setTimeout(function() {
            $pikachu.classList.remove("is-flashing");
            pikaInvicible = false;
          }, 3000);
        } else {
          reset();
        }
      }
    });
  }
}

function reset() {
  lifes = 4;
  score = 0;
  isStarted = true;

  clearTimeout(apparitionCactusTimeout);
  clearInterval(gameTemplate);
  clearInterval(scoreTemplate);
  clearInterval(apparitionMountainsTemplate);

  $pikachu.classList.add("is-dead");
  $overlay.classList.add("is-visible");
  $sun.style.visibility = "hidden";

  removeCactus();
  removeMountain();

  setTimeout(function() {
    $overlay.classList.remove("is-visible");
    $originalMountains.style.visibility = "visible";
    $sun.style.visibility = "visible";

    $showLife.innerHTML = "Life : " + lifes;
    $score.innerHTML = "SCORE : " + score;

    $pikachu.remove();
    createPikachu();
  }, 3000);
}
