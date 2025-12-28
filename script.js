const $ = id => document.getElementById(id);

let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveData() {
  localStorage.setItem("subjects", JSON.stringify(subjects));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateDashboard() {
  $("total-subjects").textContent = subjects.length;
  $("total-tasks").textContent = tasks.length;

  const done = tasks.filter(t => t.completed).length;
  $("completed-tasks").textContent = done;

  $("progress-fill").style.width =
    tasks.length ? (done / tasks.length) * 100 + "%" : "0%";

  $("motivation").textContent =
    done === tasks.length && tasks.length
      ? "🔥 All tasks completed!"
      : "💪 Keep going!";
}

/* SUBJECTS */
function addSubject() {
  const name = $("subject-name").value.trim();
  if (!name || subjects.includes(name)) return;

  subjects.push(name);
  $("subject-name").value = "";
  saveData();
  renderSubjects();
  updateDashboard();
}

function renderSubjects() {
  $("subjects-list").innerHTML = "";
  $("task-subject").innerHTML = "";

  subjects.forEach((s, i) => {
    $("subjects-list").innerHTML +=
      `<li>${s} <button onclick="removeSubject(${i})">Remove</button></li>`;

    $("task-subject").innerHTML +=
      `<option value="${s}">${s}</option>`;
  });
}

function removeSubject(i) {
  const removed = subjects[i];
  subjects.splice(i,1);
  tasks = tasks.filter(t => t.subject !== removed);
  saveData();
  renderSubjects();
  renderTasks();
  updateDashboard();
}

/* TASKS */
function addTask() {
  const subject = $("task-subject").value;
  const name = $("task-name").value.trim();

  if (!subject) return alert("Add subject first!");
  if (!name) return alert("Task name required!");

  tasks.push({
    subject,
    name,
    type: $("task-type").value,
    priority: $("task-priority").value,
    date: $("task-date").value,
    completed: false
  });

  ["task-name","task-date"].forEach(id => $(id).value = "");
  saveData();
  renderTasks();
  updateDashboard();
}

function renderTasks() {
  $("tasks-list").innerHTML = "";
  const today = new Date().toISOString().split("T")[0];

  tasks.forEach((t,i) => {
    let cls = "";
    if (t.completed) cls = "completed";
    else if (t.date && t.date < today) cls = "overdue";

    $("tasks-list").innerHTML += `
      <li class="${cls}">
        ${t.subject} - ${t.name} (${t.priority}) | ${t.date || "No date"}
        <br>
        <button onclick="toggleTask(${i})">✔</button>
        <button onclick="removeTask(${i})">✖</button>
      </li>`;
  });
}

function toggleTask(i) {
  tasks[i].completed = !tasks[i].completed;
  saveData();
  renderTasks();
  updateDashboard();
}

function removeTask(i) {
  tasks.splice(i,1);
  saveData();
  renderTasks();
  updateDashboard();
}

/* INIT */
renderSubjects();
renderTasks();
updateDashboard();
