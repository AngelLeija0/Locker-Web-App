const btnLogout = document.getElementById("btn-logout");
btnLogout.addEventListener("click", logout);

function logout() {
  if (window.localStorage.getItem("user")) {
    window.localStorage.removeItem("user");
    window.location.href = "index.html";
  }
}

function isLogin() {
  const user = window.localStorage.getItem("user");
  if (user) {
    if (
      window.location.pathname !== "/index.html" &&
      window.location.pathname !== "/front-end/index.html"
    ) {
      window.location.href = "index.html";
    }
  } else {
    if (
      window.location.pathname !== "/login.html" &&
      window.location.pathname !== "/front-end/login.html"
    ) {
      window.location.href = "login.html";
    }
  }
}

const arduinoState = document.getElementById("arduino-state");
const btnLocker = document.getElementById("btn-locker");
const btnIconLocker = document.getElementById("btn-icon-locker");
const timmerLock = document.getElementById("timmer-lock");

btnLocker.addEventListener("click", btnActivated);

const lockerHistory = document.getElementById("p-history");
showHistory();

let countdownTimeout;
let countdownValue = 5;

function btnActivated() {
  const state = JSON.parse(btnLocker.getAttribute("data-state"));
  btnLocker.setAttribute("data-state", !state);
  if (!state) {
    toggleLocker(true);
    btnIconLocker.classList.replace("bi-lock", "bi-unlock");
    timmerLock.innerHTML = countdownValue + "s";
    countdownTimeout = setTimeout(countdown, 1000);
    addToHistory();
  } else {
    clearTimeout(countdownTimeout);
    btnIconLocker.classList.replace("bi-unlock", "bi-lock");
    toggleLocker(false);
    timmerLock.innerHTML = "";
    countdownValue = 5;
  }
}

function addToHistory() {
  const user = window.localStorage.getItem("user");
  const history = window.localStorage.getItem("history");
  const date = new Date().toISOString();

  const entry = `Open by ${user} at ${date}`;

  if (history) {
    const updatedHistory = `${history}, ${entry}`;
    window.localStorage.setItem("history", updatedHistory);
  } else {
    window.localStorage.setItem("history", entry);
  }
  showHistory();
}

function showHistory() {
  const history = window.localStorage.getItem("history");
  lockerHistory.innerHTML = '';
  history.split(",").map((value) => {
    value !== "" ? lockerHistory.innerHTML += `· ${value}<br>` : '';    
  });
}


function countdown() {
  countdownValue--;
  if (countdownValue > 0) {
    timmerLock.innerHTML = countdownValue + "s";
    countdownTimeout = setTimeout(countdown, 1000);
  } else {
    btnIconLocker.classList.replace("bi-unlock", "bi-lock");
    btnLocker.setAttribute("data-state", false);
    timmerLock.innerHTML = "";
    toggleLocker(false);
    countdownValue = 5;
  }
}

function toggleLocker(state) {
  return fetch(`https://192.168.155.180/${state ? "relay-on" : "relay-off"}`, {
    method: "GET",
  })
    .then((response) => response.text())
    .then((response) => {
      console.log(response);
    });
}

function connectingToArduino() {
  try {
    fetch('https://192.168.155.180/board-state', {
      method: "GET",
    })
      .then((response) => response.text())
      .then((response) => {
        console.log(response);
        if (response === "NodeMCU Connected") {
          arduinoState.innerHTML = "Connected";
          arduinoState.classList.replace('disconnected', 'connected');
        }
      });
  } catch (error) {
    arduinoState.innerHTML = "Disconnected";
    arduinoState.classList.replace('connected', 'disconnected');
  }
}

setInterval(connectingToArduino, 5000);
