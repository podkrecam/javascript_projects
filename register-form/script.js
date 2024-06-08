"use strict";

const userName = document.getElementById("username");
const password = document.getElementById("password");
const passwordConfirm = document.getElementById("password-confirm");
const email = document.getElementById("email");
const btnClear = document.querySelector(".clear__btn");
const btnRegister = document.querySelector(".register__btn");
const btnClose = document.querySelector(".close__btn");

const userNameError = document.querySelector(".error__username");
const passwordError = document.querySelector(".error__password");
const passwordConfirmError = document.querySelector(".error__password_confirm");
const emailError = document.querySelector(".error__email");

const formInputs = document.querySelectorAll(".form__input");
const errorMessages = document.querySelectorAll(".error__message");
const popup = document.querySelector(".popup");
const overlay = document.querySelector(".overlay");

// function to valid email address
const validateEmail = function (email) {
  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
};

const validateInput = function (input, errorField, validator, errorMessage) {
  if (validator(input.value.trim())) {
    errorField.textContent = "";
    input.classList.remove("error__input");
    return true;
  } else {
    errorField.textContent = errorMessage;
    input.classList.add("error__input");
    return false;
  }
};
const clearForm = function () {
  errorMessages.forEach((message) => (message.textContent = ""));
  formInputs.forEach((formInput) => {
    formInput.value = "";
    formInput.classList.remove("error__input");
  });
};

const closePopup = function () {
  popup.classList.add("hidden");
  overlay.classList.add("hidden");
};
const openPopup = function () {
  popup.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const checkLength = function (value, min) {
  if (value.length >= min) {
    return true;
  }
  return false;
};

btnRegister.addEventListener("click", (e) => {
  e.preventDefault();

  const isUsernameValid = validateInput(
    userName,
    userNameError,
    (value) => checkLength(value, 3),
    "Name must be at least 3 characters long."
  );

  const isPasswordValid = validateInput(
    password,
    passwordError,
    (value) => checkLength(value, 8),
    "Password must be at least 8 characters long."
  );

  const isPasswordConfirmValid = validateInput(
    passwordConfirm,
    passwordConfirmError,
    (value) => value && value === password.value,
    "Passwords are not the same!"
  );

  const isEmailValid = validateInput(
    email,
    emailError,
    (value) => validateEmail(value),
    "Email is invalid"
  );

  if (
    isUsernameValid &&
    isPasswordValid &&
    isPasswordConfirmValid &&
    isEmailValid
  ) {
    openPopup();
  }
});

btnClear.addEventListener("click", (e) => {
  e.preventDefault();
  clearForm();
});

btnClose.addEventListener("click", (e) => {
  e.preventDefault();
  clearForm();
  closePopup();
});
