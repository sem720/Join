const dbUrl =
  "https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app";

// Add User function

function addUser() {
  if (!validateForm()) {
    return; // break when validation is false
  }

  let email = document.getElementById("idEmail").value.trim().toLowerCase();
  let password = document.getElementById("idPassword").value;
  let name = document.getElementById("idName").value.toLowerCase();
  let signupAlert = document.getElementById("sign-up-alert");

  const randomColor = getRandomColor();

  let userData = {
    name,
    email,
    password,
    bgcolor: randomColor,
  };

  const firebaseKey = email.replace(/\./g, "_").replace(/@/g, "-");

  fetch(`${dbUrl}/users/${firebaseKey}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  })
    .then(() => {
      signupAlert.classList.add("anim-sign-up");
      resetForm();
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1500);
    })
    .catch((error) => console.error("Fehler:", error));
}

function resetForm() {
  document.getElementById("idName").value = "";
  document.getElementById("idEmail").value = "";
  document.getElementById("idPassword").value = "";
  document.getElementById("idPasswordCon").value = "";
  document.getElementById("idPolicy").checked = false;
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
  const name = document.getElementById("idName").value.trim().toLowerCase();
  const email = document.getElementById("idEmail").value.trim().toLowerCase();
  const password = document.getElementById("idPassword").value;
  const confirmPassword = document.getElementById("idPasswordCon").value;
  const checkPolicy = document.getElementById("idPolicy").checked;

  let error = "";

  switch (true) {
    case !name:
      error = "Please enter your name";
      break;
    case !email:
      error = "Please enter your email address";
      break;
    case !validateEmail(email):
      error = "Please enter a valid email address";
      break;
    case !password:
      error = "Please enter a password";
      break;
    case !confirmPassword:
      error = "Please confirm your password";
      break;
    case password !== confirmPassword:
      error = "The passwords do not match.";
      break;
    case !checkPolicy:
      error = "Please accept the Privacy policy";
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
