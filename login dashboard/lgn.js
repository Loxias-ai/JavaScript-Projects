
const logBtn = document.getElementById("lgnbtn");
const inputUser = document.getElementById("username");
const inputPass = document.getElementById("password");
const wrongCreds = document.getElementById("wrongtxt");
const homeLoginBtn = document.querySelector(".login");

if (homeLoginBtn) {
    homeLoginBtn.addEventListener("click", (e) => {
        if (sessionStorage.getItem("isLoggedIn") === "true") {
            e.preventDefault();
            window.location.href = "portal/galleryManager.html";
        }
    });
}
if (logBtn) {
    logBtn.addEventListener("click", function (event) {
        event.preventDefault();

        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData) {
            wrongCreds.textContent = "No user found. Please sign up.";
            return;
        }

        const { username, password } = userData;

        if (inputUser.value === username && inputPass.value === password) {
            sessionStorage.setItem("isLoggedIn", "true");
            window.location.href = "portal/galleryManager.html";
        } else {
            wrongCreds.textContent = "Invalid username or password";
        }
    });
}
