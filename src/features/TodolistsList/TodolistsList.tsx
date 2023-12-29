/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AppRootStateType } from 'app/store'
import {
    addTodolistTC,
    FilterValuesType,
    removeTodolistTC,
    TodolistDomainType,
    todolistsActions,
    todolistsThunks
} from './todolists-reducer'
import { TasksStateType, tasksThunks } from './tasks-reducer'
import { Grid, Paper } from '@mui/material'
import { AddItemForm } from 'components/AddItemForm/AddItemForm'
import { Todolist } from './Todolist/Todolist'
import { Navigate } from 'react-router-dom'
import { useAppDispatch } from 'hooks/useAppDispatch';
import { TaskStatuses } from 'utils'

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        dispatch(todolistsThunks.fetchTodolists({ todolists }))
    }, [])

    const removeTask = useCallback(function (taskId: string, todolistId: string) {
        dispatch(tasksThunks.removeTask({ taskId, todolistId }))
    }, [])

    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(tasksThunks.addTask({ todolistId, title }))
    }, [])

    const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
        dispatch(tasksThunks.updateTask({ taskId, todolistId, domainModel: { status } }))
    }, [])

    const changeTaskTitle = useCallback(function (taskId: string, title: string, todolistId: string) {
        dispatch(tasksThunks.updateTask({ taskId, todolistId, domainModel: { title } }))

    }, [])

    const changeFilter = useCallback(function (filter: FilterValuesType, todolistId: string) {
        dispatch(todolistsActions.changeTodolistFilter({ filter, id: todolistId }))
    }, [])

    const removeTodolist = useCallback(function (id: string) {
        const thunk = removeTodolistTC(id)
        dispatch(thunk)
    }, [])

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        dispatch(todolistsActions.changeTodolistTitle({ id, title }))
    }, [])

    const addTodolist = useCallback((title: string) => {
        const thunk = addTodolistTC(title)
        dispatch(thunk)
    }, [dispatch])

    if (!isLoggedIn) {
        return <Navigate to={"/login"} />
    }

    return <>
        <Grid container style={{ padding: '20px' }}>
            <AddItemForm addItem={addTodolist} />
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{ padding: '10px' }}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
