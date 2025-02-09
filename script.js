let logStatus;

const dbUrl =
  "https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app";

// Login function
function login() {
  if (!validateForm()) {
    return; // break when validation is false
  }

  let email = document.getElementById("Email").value.trim().toLowerCase();
  let password = document.getElementById("Password").value;

  const firebaseKey = email.replace(/\./g, "_").replace(/@/g, "-");

  fetch(`${dbUrl}/users/${firebaseKey}.json`)
    .then((response) => response.json())
    .then((user) => {
      if (user && user.password === password) {
        saveUserToLocalStorage(user, email);

        setTimeout(() => {
          window.location.href = "../summary/summary.html";
        }, 500);
      } else {
        document.getElementById("render-alert").innerHTML =
          "the email or password is incorrect";
      }
    })
    .catch((error) => console.error("Fehler:", error));

  document.getElementById("Password").value = "";
  document.getElementById("Email").value = "";
}

function saveUserToLocalStorage(user, email) {
  const userData = {
    name: user.name,
    email: email,
    color: user.color,
  };

  localStorage.setItem("user", JSON.stringify(userData));
}

function guestLogin() {
  const guestData = {
    name: "Guest",
    email: "guest@example.com",
    color: getRandomColor(),
  };

  localStorage.setItem("user", JSON.stringify(guestData));

  setTimeout(() => {
    window.location.href = "../summary/summary.html";
  }, 500);
}

function checkUserStatus() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("Bitte loggen Sie sich ein.");
    window.location.href = "../index.html";
  } else {
    console.log(`Willkommen zurück, ${user.name}!`);
  }
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// form validation

function validateForm() {
  const email = document.getElementById("Email").value.trim().toLowerCase();
  const password = document.getElementById("Password").value;

  let error = "";

  switch (true) {
    case !email:
      error = "Please enter your email address";
      break;
    case !validateEmail(email):
      error = "Please enter a valid email address";
      break;
    case !password:
      error = "Please enter a password";
      break;
  }

  if (error) {
    document.getElementById("render-alert").innerHTML = error;
    return false;
  }

  return true;
}

// email validation
function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}
