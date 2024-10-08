"use strict";

// DOM ELEMENTS
// --BUTTONS
const buttons = document.querySelectorAll(".game__panel-item");
// --GAME PANEL
const panel = document.querySelector(".game__panel");
// --GAME STATUS
const gameStatus = document.querySelector(".game__status");

// STARTER ELEMENTS
// AUDIO FILES
const sounds = {
  green: new Audio("./sounds/green.mp3"),
  red: new Audio("./sounds/red.mp3"),
  yellow: new Audio("./sounds/yellow.mp3"),
  blue: new Audio("./sounds/blue.mp3"),
  wrong: new Audio("./sounds/wrong.mp3"),
};

const colors = ["green", "red", "yellow", "blue"];

let correctSequence, level;

// play sound function
const playSound = (color) => {
  return new Promise((resolve) => {
    if (sounds[color]) {
      sounds[color].currentTime = 0;
      sounds[color].play();

      sounds[color].addEventListener("ended", resolve, { once: true });
    } else {
      resolve();
    }
  });
};

// play button animation
const playAnimation = async (button, color) => {
  button.classList.add("game__panel-item--active");
  await playSound(color);

  button.classList.remove("game__panel-item--active");
  await new Promise((resolve) => setTimeout(resolve, 250));
};

// play sequence to remember by user
const playSequence = async (sequence) => {
  toggleButtonState(true);
  for (const color of sequence) {
    const button = document.querySelector(`.game__panel-item--${color}`);
    await playAnimation(button, color);
  }
  toggleButtonState(false);
};

const generateColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

function getClick() {
  return new Promise((resolve) => {
    const handleClick = (event) => {
      const color = event.target.dataset.color;
      playSound(color);

      buttons.forEach((button) =>
        button.removeEventListener("click", handleClick)
      );
      resolve(color);
    };
    buttons.forEach((button) => button.addEventListener("click", handleClick));
  });
}

async function check() {
  for (let i = 0; i < correctSequence.length; i++) {
    const clickedColor = await getClick();
    if (clickedColor !== correctSequence[i]) {
      return false;
    }
  }
  return true;
}

const changeDelay = (level) => {
  level = Math.floor(level / 10);
  switch (level) {
    case 0:
      return 1200;
    case 1:
      return 1100;
    case 2:
      return 1000;
    case 3:
      return 900;
    case 4:
      return 800;
    case 5:
      return 700;
    case 6:
      return 600;
    case 7:
      return 500;
    case 8:
      return 400;
    case 9:
      return 400;
    case 10:
      return 300;
    default:
      return 250;
  }
};

const nextLevel = async () => {
  console.log(Math.floor(level / 10));
  level++;
  gameStatus.textContent = `Level ${level}`;

  const nextColor = generateColor();
  correctSequence.push(nextColor);
  await playSequence(correctSequence);

  const isCorrect = await check();
  if (isCorrect) {
    setTimeout(() => {
      nextLevel();
    }, changeDelay(level));
  } else {
    gameOver();
  }
};

const toggleButtonState = (value) => {
  buttons.forEach((button) => {
    button.disabled = value;
  });
};

const gameOver = () => {
  playSound("wrong");
  document.querySelector("body").classList.add("game__over--background");
  panel.classList.add("game__over--animation");
  toggleButtonState(true);
  gameStatus.textContent = `Game Over, Press Any Key to Restart`;
  document.addEventListener("keydown", start);
};

const start = () => {
  document.querySelector("body").classList.remove("game__over--background");
  panel.classList.remove("game__over--animation");
  toggleButtonState(false);

  correctSequence = [];
  level = 0;
  document.removeEventListener("keydown", start);
  nextLevel();
};

document.addEventListener("keydown", start);
