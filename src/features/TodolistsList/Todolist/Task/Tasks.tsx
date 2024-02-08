import { TaskType } from "api/tasks-api";
import { Task } from "./Task";
import { FC, memo } from "react";
import { TodolistDomainType } from "features/TodolistsList/todolists-reducer";
import React from "react";
import { TaskStatuses } from "utils";

interface Params {
  tasks: TaskType[];
  todolist: TodolistDomainType;
}

export const Tasks: FC<Params> = memo(({ todolist, tasks }) => {
  if (todolist.filter === "active") {
    tasks = tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (todolist.filter === "completed") {
    tasks = tasks.filter((t) => t.status === TaskStatuses.Completed);
  }
  return (
    <>
      {tasks.map((t) => (
        <Task key={t.id} task={t} todolistId={todolist.id} />
      ))}
    </>
  );
});
