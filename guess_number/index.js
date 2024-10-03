"use strict";

// DOM ELEMENTS
// --BODY
const body = document.querySelector("body");
// --BUTTONS
const btnAgain = document.querySelector(".game__btn--again");
const btnCheck = document.querySelector(".game__btn--check");
// SCORES AND FEEDBACK
const feedback = document.querySelector(".game__feedback");
const currentScore = document.querySelector(".game__score");
const highScoreEl = document.querySelector(".game__highscore");
const result = document.querySelector(".game__result");
// --INPUT
const userInput = document.querySelector(".game__input");

// GAME LOGIC
const generateNumber = () => {
  return Math.floor(Math.random() * 20) + 1;
};

const updateHighscore = (score) => {
  highscore = score > highscore ? score : highscore;
  highScoreEl.textContent = `🎖️ Highscore: ${highscore}`;
  // save highscore to local storage
  localStorage.setItem("highscore", highscore);
};

const updateScoreAndFeedback = (message) => {
  if (score > 1) {
    feedback.textContent = message;
    currentScore.textContent = `💯 Score: ${--score}`;
  } else {
    feedback.textContent = "Game Over!";
    currentScore.textContent = `💯 Score: 0`;
    btnCheck.disabled = true;
    setBackgroundColor("red");
  }
};

const setBackgroundColor = (color) => {
  body.style.backgroundColor = color;
  userInput.style.backgroundColor = color;
};

// CHECK VALUE
const check = (guess) => {
  // cast String to number
  const myGuess = Number(guess);

  // check if guess is a correct value
  if (myGuess < 1 || myGuess > 20 || isNaN(myGuess)) {
    feedback.textContent = "Wrong value!";
    userInput.classList.add("game__input-shake");
    setTimeout(() => {
      userInput.classList.remove("game__input-shake");
    }, 500);
    return;
  }

  if (myGuess === number) {
    btnCheck.disabled = true;
    result.textContent = number;
    feedback.textContent = "🎉 Correct number!";
    setBackgroundColor("green");
    updateHighscore(score);
  } else {
    const message = myGuess > number ? "📉 Too high!" : "📈 Too low!";
    updateScoreAndFeedback(message);
  }
};
// RESET ELEMENTS
const reset = () => {
  number = generateNumber(); // generate random number again
  setBackgroundColor("rgb(34, 34, 34)");
  result.textContent = "?";
  userInput.value = "";
  feedback.textContent = "Start guessing...";
  currentScore.textContent = "💯 Score: 20";
  btnCheck.disabled = false;
  score = 20;
};

// START VARIABLES
// var to store number to guess
let number = generateNumber();
// var to store the highscore of each session
let highscore = 0;
// var to store the current score
let score = 20;

// EVENT LISTENERS - PLAY GAME
// CHECK USER INPUT - BUTTON
btnCheck.addEventListener("click", () => {
  const guess = userInput.value;
  check(guess);
});

// CHECK USER INPUT - KEY ENTER
userInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    check(userInput.value);
  }
});

// RESET THE GAME
btnAgain.addEventListener("click", () => {
  reset();
});

// check if the highscore is stored in the browser
if (localStorage.getItem("highscore")) {
  highscore = localStorage.getItem("highscore");
  highScoreEl.textContent = `🎖️ Highscore: ${highscore}`;
}
