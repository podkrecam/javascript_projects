"use strict";

const answers = [
  "Yes!",
  "It is certain",
  "It is decidedly so",
  "Without a doubt",
  "Yes - definitely",
  "You may rely on",
  "As I see it, yes",
  "Most likely",
  "Outlook good",
  "Signs point to yes",
  "Reply hazy, try again",
  "Ask again later",
  "Better not tell you now",
  "Cannot predict now",
  "Concentrate and ask again",
  "Don't count on it",
  "My reply is no",
  "My sources say no",
  "Outlook not so good",
  "Very doubtful",
];

// DOM ELEMENTS
const ball = document.querySelector(".image");
const inputAsk = document.querySelector(".input__ask");
const answer = document.querySelector(".answer");
const error = document.querySelector(".error");

const shakeBall = () => {
  ball.classList.add("shake-animation");
  setTimeout(() => {
    checkInput();
    ball.classList.remove("shake-animation");
  }, 1000);
};

const randomAnswer = () => {
  const random = Math.floor(Math.random() * answers.length);
  return answers[random];
};

const checkInput = () => {
  const inputValue = inputAsk.value.trim();

  answer.textContent = "";
  error.textContent = "";

  if (!inputValue) {
    return (error.textContent = "Ask a question!");
  }

  if (!inputValue.endsWith("?")) {
    return (error.textContent = "Question must ends with question mark!");
  }

  answer.innerHTML = `<span class="answer_span">Answer: </span>${randomAnswer()}`;
};

ball.addEventListener("click", shakeBall);
