"use strict";

// DOM ELEMENTS
const newGameBtn = document.querySelector(".game__btn--new");
const rollBtn = document.querySelector(".game__btn--roll");
const holdBtn = document.querySelector(".game__btn--hold");
const dice = document.querySelector(".game__dice");
const playerPanels = document.querySelectorAll(".game__player");
const totalScoreLabels = document.querySelectorAll(".game__total--score");
const currentScoreLabels = document.querySelectorAll(".game__current--score");

let totalScores, currentScore, activePlayer;

// Initialize game
const init = () => {
  totalScores = [0, 0];
  currentScore = 0;
  activePlayer = 0;

  totalScoreLabels.forEach((score) => (score.textContent = 0));
  currentScoreLabels.forEach((score) => (score.textContent = 0));

  playerPanels.forEach((panel) => panel.classList.remove("opacity"));
  playerPanels[0].classList.add("opacity");

  dice.classList.add("hidden");

  holdBtn.disabled = false;
  rollBtn.disabled = false;
};

const switchPlayer = () => {
  currentScore = 0;
  currentScoreLabels[activePlayer].textContent = currentScore;

  playerPanels[activePlayer].classList.toggle("opacity");
  activePlayer = activePlayer === 1 ? 0 : 1;
  playerPanels[activePlayer].classList.toggle("opacity");
};

const rollDice = () => {
  const diceValue = Math.floor(Math.random() * 6) + 1;
  showDiceValue(diceValue);

  if (diceValue !== 1) {
    currentScore += diceValue;
    currentScoreLabels[activePlayer].textContent = currentScore;
  } else {
    switchPlayer();
  }
};

const showDiceValue = (value) => {
  dice.setAttribute("src", `./images/dice-${value}.png`);
  dice.classList.remove("hidden");
};

const saveTotalResult = () => {
  totalScores[activePlayer] += currentScore;
  totalScoreLabels[activePlayer].textContent = totalScores[activePlayer];

  if (totalScores[activePlayer] >= 100) {
    endGame();
  } else {
    switchPlayer();
  }
};

const endGame = () => {
  holdBtn.disabled = true;
  rollBtn.disabled = true;
  dice.classList.add("hidden");
};

rollBtn.addEventListener("click", (e) => {
  rollDice();
});

holdBtn.addEventListener("click", () => {
  saveTotalResult();
});

newGameBtn.addEventListener("click", () => {
  init();
});

init();
