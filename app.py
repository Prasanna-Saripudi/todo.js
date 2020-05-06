import os
import re
from flask import Flask, session, render_template, request, redirect,jsonify 
from models import *
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session
from sqlalchemy.orm import class_mapper
from sqlalchemy import and_

app = Flask(__name__)

# Check for environment variable
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


# Set up database
# engine = create_engine(os.getenv("DATABASE_URL"))
# db = scoped_session(sessionmaker(bind=engine))
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)
with app.app_context():
    db.create_all()


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/get")
def getList():
    tasks = Task.query.all()
    if tasksis None:
        return jsonify({
            'message':"No tasks present"
        }), 404
    taskList = {}
    for t in tasks:
        taskDetails = {
            'taskId':t.taskId,
            'taskName':t.taskName,
            'dueDate':t.dueDate,
            'status':t.status,
        }
        taskList[t.taskId]=taskDetails
    return jsonify(taskList), 200

@app.route("/api/add")
def addTask():
    taskId = request.args.get("taskId")
    taskName = request.args.get("taskName")
    dueDate = request.args.get("dueDate")
    status = request.args.get("status")
    print(taskId, taskName, dueDate)
    task = Task(taskId=taskId, taskName=taskName, dueDate=dueDate, status=status)
    check = Task.query.filter(and_(Task.taskName==taskName, Task.taskId==taskId)).all()
    if check is None:
        return jsonify({
            'message':"Duplicate task added"
        }), 404
    else:
        db.session.add(task)
        db.session.commit()
        return jsonify({
            'message':"Task added"
        }), 200

@app.route("/api/delete")
def deleteTask():
    taskId = request.args.get("taskId")
    taskName = request.args.get("taskName")
    print(taskId, taskName)
    check = Task.query.filter(and_(Task.taskName==taskName, Task.taskId==taskId))
    if check is None:
        return jsonify({
            'message':"No record found to delete"
        }), 404
    else:
        check.delete()
        db.session.commit()
        return jsonify({
            'message':"Task deleted"
        }), 200
        

