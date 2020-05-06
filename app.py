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

@app.route("/api/get", methods=["GET"])
def getList():
    tasks = Task.query.all()
    count = Task.query.count()
    if count==0:
        print("no tasks")
        return jsonify({
            'message':"No tasks present"
        }), 404
    taskList = []
    for t in tasks:
        taskDetails = {
            'taskId':t.taskId,
            'taskName':t.taskName,
            'dueDate':t.dueDate,
            'status':t.status,
        }
        taskList.append(taskDetails)
    return jsonify(taskList), 200

@app.route("/api/add", methods=["GET"])
def addTask():
    taskId = request.args.get("taskId")
    taskName = request.args.get("taskName")
    dueDate = str(request.args.get("dueDate"))
    # status = request.args.get("status")
    print(taskId, taskName, dueDate)
    task = Task(taskId=taskId, taskName=taskName, dueDate=dueDate, status=False)
    check = Task.query.filter(and_(Task.taskName==taskName, Task.taskId==taskId)).all()
    if check is None:
        return jsonify({
            'message':"Duplicate task added",
            'status':404,
        })
    else:
        db.session.add(task)
        db.session.commit()
        return jsonify({
            'message':"Task added",
            'status':200,
        })

@app.route("/api/delete", methods=["GET"])
def deleteTask():
    taskId = request.args.get("taskId")
    # print(taskId)
    check = Task.query.filter(Task.taskId==taskId).first()
    if check is None:
        return jsonify({
            'message':"No record found to delete",
            'status':404,
        })
    else:
        db.session.delete(check)
        db.session.commit()
        return jsonify({
            'message':"Task deleted",
            'status':200,
        })

@app.route("/api/updateStatus", methods=["GET"])
def updateStatus():
    taskId = request.args.get("taskId")
    # print(taskId)
    check = Task.query.filter(Task.taskId==taskId).first()
    if check is None:
        return jsonify({
            'message':"No record found to update",
            'status':404,
        })
    else:
        check.status=True
        db.session.commit()
        return jsonify({
            'message':"Task updated to completion",
            'status':200,
        })
        

