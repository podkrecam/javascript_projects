"use strict";

// DOM ELEMENTS
const newGameBtn = document.querySelector(".game__btn--new");
const rollBtn = document.querySelector(".game__btn--roll");
const holdBtn = document.querySelector(".game__btn--hold");
const dice = document.querySelector(".game__dice");
const playerPanels = document.querySelectorAll(".game__player");
const totalScoreLabels = document.querySelectorAll(".game__total--score");
const currentScoreLabels = document.querySelectorAll(".game__current--score");
const gameMessages = document.querySelectorAll(".game__message");

let totalScores,
  currentScore,
  activePlayer,
  winningScore = 100;

// Initialize game
const init = () => {
  totalScores = [0, 0];
  currentScore = 0;
  activePlayer = 0;

  totalScoreLabels.forEach((score) => (score.textContent = 0));
  currentScoreLabels.forEach((score) => (score.textContent = 0));

  playerPanels.forEach((panel) => panel.classList.remove("opacity"));
  playerPanels[0].classList.add("opacity");

  gameMessages.forEach((message) => {
    message.textContent = "";
    message.classList.remove("animation");
  });

  dice.classList.add("hidden");

  toggleButtons(false);
};

// Toggle buttons
const toggleButtons = (isDisabled) => {
  rollBtn.classList.toggle("hidden", isDisabled);
  holdBtn.classList.toggle("hidden", isDisabled);
};

// Switch player
const switchPlayer = () => {
  currentScore = 0;
  currentScoreLabels[activePlayer].textContent = currentScore;

  playerPanels[activePlayer].classList.toggle("opacity");
  activePlayer = activePlayer === 1 ? 0 : 1;
  playerPanels[activePlayer].classList.toggle("opacity");
};

// Roll dice
const rollDice = () => {
  const diceValue = Math.floor(Math.random() * 6) + 1;
  showDiceValue(diceValue);
  diceValue !== 1 ? updateCurrentScore(diceValue) : switchPlayer();
};

// Update current score
const updateCurrentScore = (diceValue) => {
  currentScore += diceValue;
  currentScoreLabels[activePlayer].textContent = currentScore;
};

// Display dice value
const showDiceValue = (value) => {
  dice.setAttribute("src", `./images/dice-${value}.png`);
  dice.classList.remove("hidden");
};

// Save total result and check for winner
const saveTotalResult = () => {
  totalScores[activePlayer] += currentScore;
  totalScoreLabels[activePlayer].textContent = totalScores[activePlayer];

  if (totalScores[activePlayer] >= winningScore) {
    endGame();
  } else {
    switchPlayer();
  }
};

// End game
const endGame = () => {
  toggleButtons(true);
  dice.classList.add("hidden");
  gameMessages[activePlayer].classList.add("animation");
  gameMessages[activePlayer].textContent = "🎉 WIN!";
};

// EVENT LISTENERS
newGameBtn.addEventListener("click", init);
rollBtn.addEventListener("click", rollDice);
holdBtn.addEventListener("click", saveTotalResult);

// Start new game on load
init();
