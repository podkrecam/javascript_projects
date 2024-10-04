"use strict";

const buttons = document.querySelector(".modal__buttons");
const closeModalBtn = document.querySelector(".modal__btn--close");
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal");

const showModal = () => {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const hideModal = () => {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

buttons.addEventListener("click", (e) => {
  if (e.target.matches(".modal__btn--show")) {
    showModal();
  }
});

closeModalBtn.addEventListener("click", (e) => {
  e.preventDefault();
  hideModal();
});

document.addEventListener("keydown", (e) => {
  console.log(e.key);
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    hideModal();
  }
});

overlay.addEventListener("click", hideModal);
