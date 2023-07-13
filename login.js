const btnLogin = document.getElementById("btn-login");
btnLogin.addEventListener("click", () => {
    login();
});
const inputUsername = document.getElementById("input-username");
const inputPassword = document.getElementById("input-password");

function isLogin() {
    const user = window.localStorage.getItem("user");
    if (user) {
        if (window.location.pathname !== "/index.html" && window.location.pathname !== "/front-end/index.html") {
          window.location.href = "index.html";
        }
      } else {
        if (window.location.pathname !== "/login.html" && window.location.pathname !== "/front-end/login.html") {
          window.location.href = "login.html";
        }
      }
}

function login() {
    if (inputUsername.value === "Angel" && inputPassword.value === "123"){
        window.localStorage.setItem("user", inputUsername.value);
        window.localStorage.setItem("history", [])
        isLogin();
    }
}