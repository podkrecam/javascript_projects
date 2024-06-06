"use strict";

const errorMessage = document.querySelector(".error__message");
const message = document.querySelector(".message");
const btnCalc = document.querySelector(".calc__btn");

const countDisplayBill = () => {
  const price = parseFloat(document.getElementById("price").value);
  const people = parseInt(document.getElementById("people").value);
  const tip = parseFloat(document.getElementById("tip").value);

  errorMessage.textContent = "";
  message.textContent = "";

  if (isNaN(price) || price <= 0) {
    return (errorMessage.textContent = "Price must be a positive value!");
  }
  if (isNaN(people) || people < 1) {
    return (errorMessage.textContent = "People value must be greater than 0!");
  }
  if (isNaN(tip) || tip <= 0) {
    return (errorMessage.textContent = "Choose a tip value!");
  }

  const bill = calcTip(price, people, tip);
  message.textContent = `Each of you must pay ${bill.toFixed(2)} PLN`;
};

const calcTip = (price, people, tip) => {
  return (price + price * tip) / people;
};

btnCalc.addEventListener("click", countDisplayBill);
