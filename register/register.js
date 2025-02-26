const dbUrl =
  "https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app";

// Add User function
async function addUser() {
  if (!validateForm()) return;

  let { email, password, name, phone } = getUserInput();
  let userData = prepareUserData(name, email, password);
  let firebaseKey = formatFirebaseKey(email);

  try {
    await saveUser(firebaseKey, userData);
    let contactId = await saveContact(name, email, phone, userData.bgcolor);
    await updateContact(contactId, name, email, phone, userData.bgcolor);
    finalizeSignup();
  } catch (error) {
    console.error("Fehler:", error);
  }
}

function getUserInput() {
  return {
    email: document.getElementById("idEmail").value.trim().toLowerCase(),
    password: document.getElementById("idPassword").value,
    name: document.getElementById("idName").value.trim(),
    phone: document.getElementById("idPhone")?.value.trim() || "",
  };
}

function prepareUserData(name, email, password) {
  return { name, email, password, bgcolor: getRandomColor() };
}

function formatFirebaseKey(email) {
  return email.replace(/\./g, "_").replace(/@/g, "-");
}

async function saveUser(firebaseKey, userData) {
  await fetch(`${dbUrl}/users/${firebaseKey}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
}

async function saveContact(name, email, phone, bgcolor) {
  let response = await fetch(`${dbUrl}/contacts.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      tel: phone,
      bgcolor,
      initials: getInitials(name),
    }),
  });
  let responseData = await response.json();
  return responseData.name;
}

async function updateContact(contactId, name, email, phone, bgcolor) {
  await fetch(`${dbUrl}/contacts/${contactId}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: contactId,
      name,
      email,
      tel: phone,
      bgcolor,
      initials: getInitials(name),
    }),
  });
  console.log("✅ Neuer Kontakt mit Initialen gespeichert:", {
    id: contactId,
    name,
    email,
    tel: phone,
    bgcolor,
  });
}

function finalizeSignup() {
  document.getElementById("sign-up-alert").classList.add("anim-sign-up");
  resetForm();
  setTimeout(() => (window.location.href = "../index.html"), 1500);
}

// Reset-Formular nach Registrierung
function resetForm() {
  document.getElementById("idName").value = "";
  document.getElementById("idEmail").value = "";
  document.getElementById("idPassword").value = "";
  document.getElementById("idPasswordCon").value = "";
  document.getElementById("idPolicy").checked = false;
  if (document.getElementById("idPhone")) {
    document.getElementById("idPhone").value = "";
  }
}

// Zufällige Farbe für Kontakte generieren
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getInitials(name) {
  if (!name || typeof name !== "string") {
    return "??"; // Falls Name fehlt, Notfallinitialen setzen
  }
  const nameParts = name.trim().split(/\s+/);
  if (nameParts.length > 1) {
    return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
  } else {
    return nameParts[0][0].toUpperCase();
  }
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
