function initSum() {
  displayInfo();
  getGreeting();
  countTasks();
  countUrgentTasks();
}

function displayInfo() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.name && user.name !== "Guest") {
    document.getElementById("renderName-1").innerText = user.name;
    document.getElementById("renderName-2").innerText = user.name;
  } else {
    document.getElementById("renderName-1").innerText = "";
    document.getElementById("renderName-2").innerText = "";
  }
}

function getGreeting() {
  const hour = new Date().getHours();
  let message;

  if (hour < 12) {
    message = "Good morning";
  } else if (hour < 18) {
    message = "Nice to see you";
  } else {
    message = "Good night";
  }

  document.getElementById("greeting-1").innerText = message;
  document.getElementById("greeting-2").innerText = message;
}

async function countTasks() {
  const url =
    "https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks.json";
  try {
    const response = await fetch(url);
    const data = await response.json();
    const taskCount = data ? Object.keys(data).length : 0;
    document.getElementById("totalTasks").innerText = `${taskCount}`;
  } catch (error) {
    document.getElementById("totalTasks").innerText = "-";
  }
}

async function countUrgentTasks() {
  const url =
    "https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks.json";
  try {
    const response = await fetch(url);
    const data = await response.json();
    let urgentCount = 0;

    if (data) {
      urgentCount = Object.values(data).filter(
        (task) => task.priority === "Urgent"
      ).length;
    }

    document.getElementById("urgentTasks").innerText = `${urgentCount}`;
  } catch (error) {
    document.getElementById("urgentTasks").innerText = "-";
  }
}
