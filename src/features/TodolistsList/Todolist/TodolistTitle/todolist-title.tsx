import { Delete } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton/IconButton";
import { EditableSpan } from "components/EditableSpan/EditableSpan";
import { TodolistDomainType, todolistsThunks } from "features/TodolistsList/todolists-reducer";
import { useActions } from "hooks";
import React, { FC } from "react";

interface Props {
  todolist: TodolistDomainType;
}

export const TodolistTitle: FC<Props> = ({ todolist }) => {
  const { removeTodolist, changeTodolistTitle } = useActions(todolistsThunks);

  const removeTodolistHandler = () => {
    removeTodolist(todolist.id);
  };
  const changeTodolistTitleHandler = (title: string) => {
    changeTodolistTitle({ id: todolist.id, title });
  };
  return (
    <h3>
      <EditableSpan value={todolist.title} onChange={changeTodolistTitleHandler} />
      <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === "loading"}>
        <Delete />
      </IconButton>
    </h3>
  );
};
