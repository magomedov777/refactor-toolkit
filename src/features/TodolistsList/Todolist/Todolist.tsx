/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, memo, useEffect } from "react";
import { AddItemForm } from "components/AddItemForm/AddItemForm";
import { TodolistDomainType } from "../todolists-reducer";
import { tasksThunks } from "../tasks-reducer";
import { useActions } from "hooks";
import { TaskType } from "api/tasks-api";
import { FilterTasksButtons } from "./FilterTasksButtons/filter-tasks-buttons";
import { Tasks } from "./Task/Tasks";
import { TodolistTitle } from "./TodolistTitle/todolist-title";

type Props = {
  todolist: TodolistDomainType;
  tasks: Array<TaskType>;
  demo?: boolean;
};

export const Todolist: FC<Props> = memo(({ todolist, tasks, demo }) => {
  const { fetchTasks, addTask } = useActions(tasksThunks);

  useEffect(() => {
    if (demo) {
      return;
    }
    fetchTasks(todolist.id);
  }, []);

  const addTaskHandler = (title: string) => {
    //@ts-ignore
    return addTask({ title, todolistId: todolist.id }).unwrap();
  };

  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <AddItemForm addItem={addTaskHandler} disabled={todolist.entityStatus === "loading"} />
      <Tasks tasks={tasks} todolist={todolist} />
      <div style={{ paddingTop: "10px" }}>
        <FilterTasksButtons todolist={todolist} />
      </div>
    </div>
  );
});
