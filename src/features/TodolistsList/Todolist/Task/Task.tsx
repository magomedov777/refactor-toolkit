/* eslint-disable react-hooks/exhaustive-deps */
import React, { ChangeEvent, FC, memo } from "react";
import { Checkbox, IconButton } from "@mui/material";
import { EditableSpan } from "../../../../components/EditableSpan/EditableSpan";
import { Delete } from "@mui/icons-material";
import { TaskStatuses } from "utils";
import { TaskType } from "api/tasks-api";
import { tasksThunks } from "features/TodolistsList/tasks-reducer";
import { useActions } from "hooks";

type Props = {
  task: TaskType;
  todolistId: string;
};

export const Task: FC<Props> = memo(({ task, todolistId }) => {
  const { removeTask, updateTask } = useActions(tasksThunks);

  const removeTaskHandler = () => {
    removeTask({ taskId: task.id, todolistId: todolistId });
  };

  const changeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
    updateTask({
      taskId: task.id,
      domainModel: {
        status: newStatus,
      },
      todolistId,
    });
  };

  const changeTitleHandler = (newValue: string) => {
    updateTask({ taskId: task.id, domainModel: { title: newValue }, todolistId });
  };

  return (
    <div key={task.id} className={task.status === TaskStatuses.Completed ? "is-done" : ""}>
      <Checkbox checked={task.status === TaskStatuses.Completed} color="primary" onChange={changeStatusHandler} />
      <EditableSpan value={task.title} onChange={changeTitleHandler} />
      <IconButton onClick={removeTaskHandler}>
        <Delete />
      </IconButton>
    </div>
  );
});
