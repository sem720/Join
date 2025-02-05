let logStatus;

// Login function

function login() {
  let email = document.getElementById("Email").value;
  let password = document.getElementById("Password").value;

  fetch(`${dbUrl}/users/${email.replace(".", "_")}.json`)
    .then((response) => response.json())
    .then((user) => {
      if (user && user.password === password) {
        setTimeout(function () {
          window.location.href = "main.html";
        }, 1500);
        logStatus = user.name;
        console.log(logStatus);
      } else {
        alert("Falsche Zugangsdaten!");
      }
    })
    .catch((error) => console.error("Fehler:", error));
}

function guestLogin() {
  logStatus = "Guest";
  setTimeout(function () {
    window.location.href = "main.html";
  }, 1500);
}
