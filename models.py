from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey,PrimaryKeyConstraint

db = SQLAlchemy()


class Task(db.Model):
    __tablename__ = "TASKS"
    taskId = db.Column(db.String, primary_key = True)
    taskName = db.Column(db.String, primary_key = True)
    dueDate = db.Column(db.String, nullable = False) 
    status = db.Column(db.Boolean, nullable = False)
    __table_args__ = (PrimaryKeyConstraint('taskId', 'taskName'),)

