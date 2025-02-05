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
  let userData = { name, email, password };

  const firebaseKey = email.replace(/\./g, "_").replace(/@/g, "-");

  fetch(`${dbUrl}/users/${firebaseKey}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  })
    .then(() => {
      alert("Registrierung erfolgreich!");
      document.getElementById("idName").value = "";
      document.getElementById("idEmail").value = "";
      document.getElementById("idPassword").value = "";
      document.getElementById("idPasswordCon").value = "";
      document.getElementById("idPolicy").checked = false;
      setTimeout(function () {
        window.location.href = "../index.html";
      }, 500);
    })
    .catch((error) => console.error("Fehler:", error));
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
      error = "Bitte geben Sie einen Namen ein.";
      break;
    case !email:
      error = "Bitte geben Sie eine E-Mail-Adresse ein.";
      break;
    case !validateEmail(email):
      error = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
      break;
    case !password:
      error = "Bitte geben Sie ein Passwort ein.";
      break;
    case !confirmPassword:
      error = "Bitte bestätigen Sie Ihr Passwort.";
      break;
    case password !== confirmPassword:
      error = "Die Passwörter stimmen nicht überein.";
      break;
    case !checkPolicy:
      error = "Du musst die Datenschutzrichtlinien akzeptieren";
      break;
  }

  if (error) {
    alert(error);
    return false;
  }

  return true;
}

// email validation
function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}
