/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, memo, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { AppRootStateType } from "app/store";
import { TodolistDomainType, todolistsActions, todolistsThunks } from "./todolists-reducer";
import { TasksStateType, tasksThunks } from "./tasks-reducer";
import { Grid, Paper } from "@mui/material";
import { AddItemForm } from "components/AddItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { useActions } from "hooks";

interface Props {
  demo?: boolean;
}

export const TodolistsList: FC<Props> = memo(({ demo = false }) => {
  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>((state) => state.todolists);
  const tasks = useSelector<AppRootStateType, TasksStateType>((state) => state.tasks);
  const isLoggedIn = useSelector<AppRootStateType, boolean>((state) => state.auth.isLoggedIn);

  const { fetchTodolists, addTodolist: addTodolistThunk } = useActions({
    ...tasksThunks,
    ...todolistsActions,
    ...todolistsThunks,
  });

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return;
    }
    fetchTodolists({ todolists });
  }, []);

  const addTodolist = useCallback((title: string) => {
    //@ts-ignore
    return addTodolistThunk(title).unwrap();
  }, []);

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id];

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist todolist={tl} tasks={allTodolistTasks} demo={demo} />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
});
