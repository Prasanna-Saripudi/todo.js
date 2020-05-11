
function Task(props) {


    return <li> {props.name}, {props.dueDate == null ? "Invalid Date" : props.dueDate.toLocaleString()}

        <input type="submit" value="Delete Task" onClick={() => { props.onDeleteTask(props.id) }} />

    </li>
}

class TodoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { list: props.list };
        this.handleDeleteTask = this.handleDeleteTask.bind(this);
        this.handleAddTask = this.handleAddTask.bind(this);
    }

    handleDeleteTask(id) {
        console.log("Delete task clicked", id);
        let list = this.state.list;
        this.state.list = this.state.list.filter(task => {
            if (task.id != id)
                return task;

        })
        this.setState({ list: this.state.list })
    }

    handleAddTask(task) {
        console.log("add task clicked");
        this.state.list.push(task);
        this.setState({ list: this.state.list })
    }
    render() {
        return (
            <div>
                <h1>TODO List</h1>
                <ol>
                    {
                        this.state.list.map((t) =>
                            <Task key={t.id} name={t.name} dueDate={t.dueDate} onDeleteTask={this.handleDeleteTask} id={t.id} />)
                    }
                </ol>
                <TaskNameForm onAddTask={this.handleAddTask} />
            </div>
        );
    }
}

class TaskNameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: '', 'date': null };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        const taskList = this.props.taskList;
        // create a task object
        event.preventDefault();
        const task = {
            id: Date.now(), name: this.state.value,
            dueDate: this.state.date
        };
        // add the task object to the task list
        this.props.onAddTask(task);
    }

    handleChange(event) {
        // code to set the state of the component
        this.setState({ value: event.target.value });
    }



    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="text" onChange={this.handleChange} placeholder="Write the task.." />
                <input type="date" onChange={() => {
                    this.setState({ date: new Date(event.target.value) })
                }} />
                <input type="submit" value="Add Task" />
            </form>
        );
    }
}

ReactDOM.render(
    <TodoList list={[]} />,
    document.getElementById('todo')
);