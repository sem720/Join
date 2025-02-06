const dbUrl =
  "https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app";

let logStatus;

// Login function

function login() {
  let email = document.getElementById("Email").value.trim().toLowerCase();
  let password = document.getElementById("Password").value;

  const firebaseKey = email.replace(/\./g, "_").replace(/@/g, "-");

  fetch(`${dbUrl}/users/${firebaseKey}.json`)
    .then((response) => response.json())
    .then((user) => {
      if (user && user.password === password) {
        alert(`Willkommen zurück, ${user.name}!`);
        /*
        setTimeout(() => {
          window.location.href = "../register/register.html";
          console.log("eingeloggt");
        }, 1500);
        */
        logStatus = user.name;
        console.log("Eingeloggt als:", logStatus);
      } else {
        alert("Falsche Zugangsdaten! Bitte überprüfen Sie Ihre Eingabe.");
      }
    })
    .catch((error) => console.error("Fehler:", error));

  document.getElementById("Password").value = "";
  document.getElementById("Email").value = "";
}

function guestLogin() {
  logStatus = "Guest";
  setTimeout(function () {
    window.location.href = "index.html";
  }, 1500);
}
