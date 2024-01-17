/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, memo, useEffect } from "react";
import { AddItemForm } from "components/AddItemForm/AddItemForm";
import { EditableSpan } from "components/EditableSpan/EditableSpan";
import { Task } from "./Task/Task";
import { TodolistDomainType, todolistsActions, todolistsThunks } from "../todolists-reducer";
import { Button, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { tasksThunks } from "../tasks-reducer";
import { TaskStatuses } from "utils";
import { useActions } from "hooks";
import { TaskType } from "api/tasks-api";

type Props = {
  todolist: TodolistDomainType;
  tasks: Array<TaskType>;
  demo?: boolean;
};

export const Todolist: FC<Props> = memo(({ todolist, tasks, demo }) => {
  const { fetchTasks, addTask } = useActions(tasksThunks);
  const { removeTodolist, changeTodolistTitle } = useActions(todolistsThunks);
  const { changeTodolistFilter } = useActions(todolistsActions);

  useEffect(() => {
    if (demo) {
      return;
    }
    fetchTasks(todolist.id);
  }, []);

  const addTaskHandler = (title: string) => {
    addTask({ title, todolistId: todolist.id });
  };

  const removeTodolistHandler = () => {
    removeTodolist(todolist.id);
  };
  const changeTodolistTitleHandler = (title: string) => {
    changeTodolistTitle({ id: todolist.id, title });
  };

  const onAllClickHandler = () => changeTodolistFilter({ filter: "all", id: todolist.id });
  const onActiveClickHandler = () => changeTodolistFilter({ filter: "active", id: todolist.id });
  const onCompletedClickHandler = () => changeTodolistFilter({ filter: "completed", id: todolist.id });

  let tasksForTodolist = tasks;

  if (todolist.filter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (todolist.filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed);
  }

  return (
    <div>
      <h3>
        <EditableSpan value={todolist.title} onChange={changeTodolistTitleHandler} />
        <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTaskHandler} disabled={todolist.entityStatus === "loading"} />
      <div>
        {tasksForTodolist.map((t) => (
          <Task key={t.id} task={t} todolistId={todolist.id} />
        ))}
      </div>
      <div style={{ paddingTop: "10px" }}>
        <Button variant={todolist.filter === "all" ? "outlined" : "text"} onClick={onAllClickHandler} color={"inherit"}>
          All
        </Button>
        <Button
          variant={todolist.filter === "active" ? "outlined" : "text"}
          onClick={onActiveClickHandler}
          color={"primary"}
        >
          Active
        </Button>
        <Button
          variant={todolist.filter === "completed" ? "outlined" : "text"}
          onClick={onCompletedClickHandler}
          color={"secondary"}
        >
          Completed
        </Button>
      </div>
    </div>
  );
});
