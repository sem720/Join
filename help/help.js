function checkNavigationVisibility() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navContainer = document.getElementById("div-navigation");
  const navConOut = document.getElementById("div-nav-out");

  if (!user) {
    navContainer.style.display = "none";
    navConOut.style.display = "block";
  } else {
    navContainer.style.display = "block";
    navConOut.style.display = "none";
  }
}
