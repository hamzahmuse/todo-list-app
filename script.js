document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskList = document.getElementById("taskList");

    if (taskInput.value.trim() === "") {
        alert("Masukkan tugas terlebih dahulu!");
        return;
    }

    let task = { text: taskInput.value, completed: false };
    let tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);

    renderTasks();

    taskInput.value = "";
}

function removeTask(index) {
    let tasks = getTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    renderTasks();
}

function editTask(index) {
    let tasks = getTasks();
    let newText = prompt("Edit tugas:", tasks[index].text);
    
    if (newText !== null && newText.trim() !== "") {
        tasks[index].text = newText;
        saveTasks(tasks);
        renderTasks();
    }
}

function toggleComplete(index) {
    let tasks = getTasks();
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    renderTasks();
}

function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    let tasks = getTasks();

    tasks.forEach((task, index) => {
        let li = document.createElement("li");
        li.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}" onclick="toggleComplete(${index})">
                ${task.text}
            </span>
            <button onclick="editTask(${index})">Edit</button>
            <button onclick="removeTask(${index})">Hapus</button>
        `;
        taskList.appendChild(li);
    });
}

function loadTasks() {
    renderTasks();
}
