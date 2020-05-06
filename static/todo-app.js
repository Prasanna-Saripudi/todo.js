let taskList = []

class Task {
    constructor(name, dueDate, isDone) {
        this.taskId = Date.now();
        this.name = name;
        this.dueDate = dueDate;
        this.isDone = isDone;
    }

    toString() {
        let htmlText = '<li class="task" ><div>';
        htmlText += this.name;
        htmlText += ", " + this.dueDate + " ";
        htmlText += '<input type="checkbox" name="isDone" id="isDone" onclick="marked(';
        htmlText += this.taskId + ')">';
        htmlText += '<button onclick="deleteTask(';
        htmlText += this.taskId;
        htmlText += ')">Delete</button>';
        htmlText += '</div></li>';
        return htmlText;
    }
}

function render() {
    const listUI = document.getElementById("todolist")
    listUI.innerHTML = "";
    if (taskList.length === 0) listUI.innerHTML = "No tasks todo :-)"
    taskList.forEach((task) => {
        listUI.innerHTML += task.toString();
    })
}

function marked(taskId) {
    console.log("in marked")
    taskList = taskList.filter(
        (t) => {
            if (t.taskId === taskId) {
                t.isDone = true;
            }
        }
    );
}

function deleteTask(taskId) {
    console.log("in delete")
    taskList = taskList.filter(
        (t) => {
            if (t.taskId != taskId) {
                console.log(t.name)
                return t;
            }
        }
    );
    // call a web api to update the database on the server

    // update the DOM
    render()
    // console.log(taskList);
}

function createTask() {
    const taskName = document.getElementById("taskName").value;
    const dueDate = document.getElementById("dueDate").value;
    if (taskName === "") alert("Can't add an empty task")
    else {
        addTask(new Task(taskName, dueDate, false));
        document.getElementById("taskName").value = "";
        document.getElementById("dueDate").value = "dd-mm-yy";
    }
}

function addTask(t) {
    taskList.push(t)
    // call a web api to update the database on the server
    render();
    // console.log(taskList)
}

function init() {
    console.log("init called");

    // call a web api to retrieve the task list
    // write a function to send a api request
    // get the JSON
    // assign it to taskList
    // render

    // task = new Task("welcome task", new Date("May 30, 2020"), false);
    // addTask(task);
    // console.log(task);
}

init();