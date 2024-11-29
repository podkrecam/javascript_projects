"use strict";

// Data
// Each account object stores the owner's information, transactions, interest rate, pin,
// dates of movements, currency, and locale for formatting.
const account1 = {
  owner: "Jack Schwarz",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2024-10-25T23:36:17.929Z",
    "2024-10-28T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pl-PL", // de-DE
};

const account2 = {
  owner: "Jonathan Dockerman",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2024-06-09T18:49:59.371Z",
    "2024-06-10T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// DOM ELEMENTS
// Selection of key HTML elements for the login form, app interface, transaction display, etc.
const loginInput = document.querySelector(".bank__login-input--user");
const passInput = document.querySelector(".bank__login-input--pass");
const loginBtn = document.querySelector(".bank__login--btn");
const loginError = document.querySelector(".bank__login-error");
const welcomeMsg = document.querySelector(".bank__user-info-message");

const app = document.querySelector(".bank__app");
const footer = document.querySelector(".bank__footer");
const transactionsEl = document.querySelector(".bank__transaction-list");

const currentDateEl = document.querySelector(".bank__myaccount-date-now");
const balanceEl = document.querySelector(".bank__balance-value");
const incomesEl = document.querySelector(".bank__summary-item-value--incomes");
const expensesEl = document.querySelector(
  ".bank__summary-item-value--expenses"
);
const interestEl = document.querySelector(".bank__interest-value");

const transferTo = document.querySelector(".bank__form-input--to");
const transferAmount = document.querySelector(".bank__form-input--amount");
const transferBtn = document.querySelector(".bank__form-button--transfer");
const transferError = document.querySelector(".bank__action-transfer-error");

const loanAmount = document.querySelector(".bank__form-input--loan");
const loanBtn = document.querySelector(".bank__form-button--loan");
const loanError = document.querySelector(".bank__action-loan-error");

const closeAccountUser = document.querySelector(".bank__form-input--user");
const closeAccountPass = document.querySelector(".bank__form-input--pass");
const closeAccountBtn = document.querySelector(".bank__form-button--close");
const closeAccountError = document.querySelector(".bank__action-close-error");

const sortBtn = document.querySelector(".bank__transaction--sort");
const incomesSelect = document.querySelector(
  ".bank__summary-item-img--incomes"
);
const expensesSelect = document.querySelector(
  ".bank__summary-item-img--expenses"
);

const logoutTimeEl = document.querySelector(".bank__footer-time");

// Generate login for each account by taking the initials of the owner's name
const generateLogins = function (accountsArr) {
  accountsArr.forEach((account) => {
    account.login = account.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name?.[0])
      .join("");
  });
};
generateLogins(accounts);

// Login function to authenticate users based on login and pin input
const login = function (inputLogin, inputPin) {
  const login = inputLogin.trim().toLowerCase();
  const pin = +inputPin.trim();

  currentUser = accounts.find((account) => {
    return account.login === login && account.pin === pin;
  });

  if (currentUser) {
    sorted = false;
    type = "";
    welcomeMsg.textContent = `Good morning, ${
      currentUser.owner.split(" ")[0]
    }!`;
    loginInput.value = passInput.value = "";
    currentDateEl.textContent = displayDate(
      new Date(),
      false,
      currentUser.locale
    );

    updateUI(currentUser);
    app.classList.remove("hidden");
    footer.classList.remove("hidden");

    // Logout timer set for inactivity
    let logoutTimeMinutes = 5;
    if (timer) clearInterval(timer);
    timer = startLogoutTimer(logoutTimeMinutes);
  } else {
    loginError.textContent = "Wrong login or PIN!";
    setTimeout(() => {
      loginError.textContent = "";
    }, 2000);
  }
};

const startLogoutTimer = function (time) {
  time *= 60;

  const tick = function () {
    const minutes = Math.floor(time / 60);
    const seconds = String(time % 60).padStart(2, "0");
    logoutTimeEl.textContent = `You will be logged out in ${minutes}:${seconds}`;

    if (time < 1) {
      clearInterval(intervalTimer);
      logout();
    }
    time--;
  };

  tick();
  const intervalTimer = setInterval(tick, 1000);
  return intervalTimer;
};

const resetTimer = function () {
  clearInterval(timer);
  timer = startLogoutTimer(5);
};

// Date formatting function for transactions and current date
const getIntlDate = function (date, locale) {
  const options = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };
  return new Intl.DateTimeFormat(locale, options).format(date);
};

// Display formatted date based on how long ago the transaction occurred
const displayDate = function (date, isMovement, locale) {
  const calcDaysBetween = function (date1, date2) {
    return Math.round(Math.abs(date1 - date2) / (1000 * 3600 * 24));
  };

  const daysAgo = calcDaysBetween(new Date(), date);

  if (isMovement) {
    if (daysAgo === 0) return "Today";
    if (daysAgo === 1) return "Yesterday";
    if (daysAgo < 7) return `${daysAgo} days ago`;
  }

  return getIntlDate(date, locale);
};

// Currency and value formatting function based on locale and currency type
const getIntlValue = function (value, locale, currency) {
  const options = {
    minimumFractionDigits: 2,
    style: "currency",
    currency,
  };
  return new Intl.NumberFormat(locale, options).format(value);
};

// Calculate and display the current balance of the user
const displayBalance = function ({ movements, locale, currency }) {
  const balance = movements.reduce((acc, mov) => acc + mov, 0);
  balanceEl.textContent = `${getIntlValue(balance, locale, currency)}`;
  currentUser.balance = balance;
};

// Calculate and display the total interest based on deposits and interest rate
const displayInterest = function ({
  movements,
  interestRate,
  locale,
  currency,
}) {
  const interest = movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  interestEl.textContent = `${getIntlValue(interest, locale, currency)}`;
};

// Display transactions based on sorting and filtering options (all, deposits, withdrawals)
const displayTransactions = function (
  { movements, movementsDates, currency, locale },
  sort,
  type
) {
  transactionsEl.innerHTML = "";

  const transactionsAll = movements.map((mov, i) => ({
    mov: mov.toFixed(2),
    movDate: movementsDates[i],
  }));
  const transactionsSorted = sort
    ? transactionsAll.slice().sort((a, b) => a.mov - b.mov)
    : transactionsAll;

  const transactions =
    (type === "deposits" && transactionsSorted.filter(({ mov }) => mov > 0)) ||
    (type === "withdrawals" &&
      transactionsSorted.filter(({ mov }) => mov < 0)) ||
    transactionsSorted;

  transactions.forEach(({ mov, movDate }, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const date = new Date(movDate);

    const html = `
      <li class="bank__transaction-item ${
        (i + 1) % 2 === 0 ? "bank__transaction-item-even" : ""
      }">
        <p class="bank__transaction-type  bank__transaction-${type}">
          ${i + 1} ${type}
        </p>
        <p class="bank__transaction-date">
          ${displayDate(date, true, locale)}
        </p>
        <p class="bank__transaction-value-${type}">
          ${getIntlValue(mov, locale, currency)}
        </p>
      </li>`;
    transactionsEl.insertAdjacentHTML("afterbegin", html);
  });
};

// Updates income and expense totals from movements and displays them.
const displaySummary = function ({ movements }) {
  const { incomes, expenses } = movements.reduce(
    (acc, mov) => {
      mov > 0 ? (acc.incomes += mov) : (acc.expenses += mov);
      return acc;
    },
    { incomes: 0, expenses: 0 }
  );
  incomesEl.textContent = `${incomes.toFixed(2)}$`;
  expensesEl.textContent = `${(expenses * -1).toFixed(2)}$`;
};

// Update user interface after performing key actions like login, transactions, etc.
const updateUI = function (user) {
  displayTransactions(user, sorted, type);
  displayBalance(user);
  displaySummary(user);
  displayInterest(user);
};

const transferMoney = function (currentUser, receiver, amount) {
  const amountNum = +amount;

  if (!receiver || isNaN(amountNum) || amountNum <= 0) {
    transferError.textContent = "Invalid amount or receiver!";
    setTimeout(() => (transferError.textContent = ""), 1000);
    return;
  }

  const transferReceiver = accounts.find(
    (account) => account.login === receiver
  );

  const date = new Date();

  if (
    transferReceiver &&
    transferReceiver !== currentUser &&
    currentUser.balance >= amount
  ) {
    currentUser.movements.push(-amountNum);
    currentUser.movementsDates?.push(date);
    transferReceiver.movements.push(amountNum);
    transferReceiver.movementsDates?.push(date);
    updateUI(currentUser);

    transferTo.value = transferAmount.value = "";
  } else {
    transferError.textContent = "Wrong data. Try again!";
    setTimeout(() => {
      transferError.textContent = "";
    }, 1000);
  }
};

const loanMoney = function (currentUser, amount) {
  const amountNum = Math.round(amount);

  if (isNaN(amountNum) || amountNum <= 0) {
    loanError.textContent = "Invalid amount!";
    setTimeout(() => (loanError.textContent = ""), 1000);
    return;
  }

  if (currentUser.movements.some((movement) => movement >= amountNum / 10)) {
    setTimeout(() => {
      currentUser.movements.push(amountNum);
      currentUser.movementsDates.push(new Date());
      updateUI(currentUser);
    }, 3000);
    loanAmount.value = "";
  } else {
    loanError.textContent = "We can not borrow you this amount of money!";
    setTimeout(() => (loanError.textContent = ""), 2000);
  }
};

const closeAccount = function (login, pin) {
  const inputLogin = login.trim();
  const inputPin = +pin;

  if (currentUser.balance < 0) {
    displayCloseError(
      "You have to pay your debts before closing account!",
      2000
    );
  } else if (currentUser.login === inputLogin && currentUser.pin === inputPin) {
    const index = accounts.findIndex(
      (account) => account.login === currentUser.login
    );
    accounts.splice(index, 1);
    let timer = 5;

    const countdown = setInterval(() => {
      displayCloseError(
        `Your account is closed. You will be logged out in ${timer} seconds!`,
        5000
      );
      timer--;

      if (timer < 0) {
        clearInterval(countdown);
        logout();
      }
    }, 1000);
  } else displayCloseError("Wrong data!", 2000);
};

const displayCloseError = function (message, time, optionalFunc) {
  closeAccountError.textContent = message;
  setTimeout(() => {
    closeAccountError.textContent = "";
    if (optionalFunc) optionalFunc();
  }, time);
};

const logout = function () {
  closeAccountUser.value = closeAccountPass.value = "";
  app.classList.add("hidden");
  footer.classList.add("hidden");
  welcomeMsg.textContent = "sBank";
  sorted = false;
  type = "";
};

let currentUser, timer;
let sorted = false;
let type = "";

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  login(loginInput.value, passInput.value);
});

transferBtn.addEventListener("click", (e) => {
  e.preventDefault();
  transferMoney(currentUser, transferTo.value, transferAmount.value);
  resetTimer();
});

loanBtn.addEventListener("click", (e) => {
  e.preventDefault();
  loanMoney(currentUser, loanAmount.value);
  resetTimer();
});

closeAccountBtn.addEventListener("click", (e) => {
  e.preventDefault();
  closeAccount(closeAccountUser.value, closeAccountPass.value);
});

sortBtn.addEventListener("click", (e) => {
  e.preventDefault();
  sorted = !sorted;
  displayTransactions(currentUser, sorted, type);
});

incomesSelect.addEventListener("click", () => {
  type = type === "deposits" ? "" : "deposits";
  displayTransactions(currentUser, sorted, type);
});

expensesSelect.addEventListener("click", () => {
  type = type === "withdrawals" ? "" : "withdrawals";
  displayTransactions(currentUser, sorted, type);
});
