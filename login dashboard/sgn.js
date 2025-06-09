let btn = document.getElementById("Cbtn");
let msg = document.getElementById("finalMsg");

function dataValitation(event) {
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("Cpassword").value;
  let message = document.getElementById("message");
  let username = document.getElementById("username").value;
  let email = document.getElementById("email").value;

  
  if (username.length < 4) {
    event.preventDefault();
    message.textContent = "❌ Username must be at least 3 characters long.";
    message.className = "error";
    return;
  }

  if (password.length < 8) {
    event.preventDefault();
    message.textContent = "❌ Password must be at least 8 characters long.";
    message.className = "error";
    return;
  }

  if (!/[A-Z]/.test(password)) {
    event.preventDefault();
    message.textContent = "❌ Password must contain at least one uppercase letter.";
    message.className = "error";
    return;
  }

  if (!/[0-9]/.test(password)) {
    event.preventDefault();
    message.textContent = "❌ Password must contain at least one number.";
    message.className = "error";
    return;
  }

  if (password !== confirmPassword) {
    event.preventDefault();
    message.textContent = "❌ Passwords do not match.";
    message.className = "error";
    return;
  }

  
  let existingUser = JSON.parse(localStorage.getItem("user"));
  if (
    existingUser &&
    existingUser.email === email &&
    existingUser.username === username
  ) {
    event.preventDefault();
    message.textContent = "❌ User already exists.";
    message.className = "error";
    return;
  }

  // Save new user
  const userData = { email, username, password };
  localStorage.setItem("user", JSON.stringify(userData));
  localStorage.setItem("registrationSuccess", "true");
}

window.addEventListener("DOMContentLoaded", () => {
  const success = localStorage.getItem("registrationSuccess");
  if (success === "true") {
    msg.textContent = "✅ Registration successful! You may login now.";
    localStorage.removeItem("registrationSuccess");
  }
});

btn.addEventListener("click", dataValitation);
