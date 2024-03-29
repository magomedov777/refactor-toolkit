/* eslint-disable react-hooks/exhaustive-deps */
import Button from "@mui/material/Button/Button";
import { FilterValuesType, TodolistDomainType, todolistsActions } from "features/TodolistsList/todolists-reducer";
import { useActions } from "hooks";
import React, { FC } from "react";

type Props = {
  todolist: TodolistDomainType;
};

export const FilterTasksButtons: FC<Props> = ({ todolist }) => {
  const { changeTodolistFilter } = useActions(todolistsActions);

  const changeFilterHandler = (filter: FilterValuesType) => {
    changeTodolistFilter({ filter, id: todolist.id });
  };

  return (
    <>
      <Button
        variant={todolist.filter === "all" ? "outlined" : "text"}
        onClick={() => changeFilterHandler("all")}
        color={"inherit"}
      >
        All
      </Button>
      <Button
        variant={todolist.filter === "active" ? "outlined" : "text"}
        onClick={() => changeFilterHandler("active")}
        color={"primary"}
      >
        Active
      </Button>
      <Button
        variant={todolist.filter === "completed" ? "outlined" : "text"}
        onClick={() => changeFilterHandler("completed")}
        color={"secondary"}
      >
        Completed
      </Button>
    </>
  );
};
