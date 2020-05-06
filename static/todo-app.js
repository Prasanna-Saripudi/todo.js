class Task {
    constructor(taskId, name, dueDate, isDone) {
        this.taskId = taskId;
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
    var req = new XMLHttpRequest();
    var url = "/api/get";
    console.log(url);
    req.open("GET", url);
    req.send();
    req.onload = function () {
        var tasks = JSON.parse(req.responseText);
        if (req.status === 200) {
            tasks.forEach((task) => {
                t = new Task(task.taskId, task.taskName, task.dueDate, task.status)
                listUI.innerHTML += t.toString();
            })
        }
        else {
            listUI.innerHTML = "No tasks found.."
        }
    }

}

function marked(taskId) {
    console.log("in marked")
    var req = new XMLHttpRequest();
    var url = "/api/updateStatus?taskId=" + taskId;
    console.log(url);
    req.open("GET", url);
    req.send();
    req.onload = function () {
        var msg = JSON.parse(req.responseText);
        if (msg['status'] === 200) {
            alert('Updated the status to Done')
        }
        else {
            alert('Not found')
        }
    }
}

function deleteTask(taskId) {
    console.log("in delete")
    console.log(taskId);
    var req = new XMLHttpRequest();
    var url = "/api/delete?taskId=" + taskId;
    console.log(url);
    req.open("GET", url);
    req.send();
    req.onload = function () {
        var msg = JSON.parse(req.responseText);
        if (msg['status'] === 200) {
            render()
        }
        else {
            alert('No record found to delete');
        }
    }
    // call a web api to update the database on the server
    // update the DOM
}

function createTask() {
    const taskName = document.getElementById("taskName").value;
    const dueDate = document.getElementById("dueDate").value + "";
    if (taskName === "") alert("Can't add an empty task")
    else {
        addTask(new Task(Date.now(), taskName, dueDate, false));
        document.getElementById("taskName").value = "";
        document.getElementById("dueDate").value = "dd-mm-yy";
    }
}

function addTask(t) {
    // taskList.push(t)
    console.log(t.taskId, t.name, t.dueDate, t.isDone)
    var req = new XMLHttpRequest();
    var url = "/api/add?taskId=" + t.taskId + "&taskName=" + t.name + "&dueDate=" + t.dueDate + "&status=" + t.isDone;
    console.log(url);
    req.open("GET", url);
    req.send();
    req.onload = function () {
        var msg = JSON.parse(req.responseText);
        if (msg['status'] === 200) {
            render()
        }
        else {
            alert('Duplicate task')
        }
    }
    // call a web api to update the database on the server
}

function init() {
    console.log("init called");

    // call a web api to retrieve the task list
    // write a function to send a api request
}

init();