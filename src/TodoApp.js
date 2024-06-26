import React, { useState, useEffect } from 'react';
import TodoList from './TodoList';
import AddTodo from './AddTodo';
import Filter from './Filter';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('https://dummyjson.com/todos?limit=7')
      .then(response => response.json())
      .then(data => setTasks(data.todos))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const addTask = (taskText) => {
    console.log(taskText)
    const newTask = {
        todo: taskText,
      completed: false,
      userId:5
    };

    fetch('https://dummyjson.com/todos/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTask)
    })
      .then(response => response.json())
      .then(data => setTasks([...tasks, data]))
      .catch(error => console.error('Error adding task:', error));
  };

  const toggleTask = (id) => {
    const taskToToggle = tasks.find(task => task.id === id);
    const updatedTask = { ...taskToToggle, completed: !taskToToggle.completed };

    fetch(`https://dummyjson.com/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedTask)
    })
      .then(response => response.json())
      .then(data => {
        setTasks(tasks.map(task => (task.id === id ? data : task)));
      })
      .catch(error => console.error('Error updating task:', error));
  };

  const deleteTask = (id) => {
    fetch(`https://dummyjson.com/todos/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  return (
    <div className="todo-app">
      <h1>Todo List</h1>
      <AddTodo addTask={addTask} />
      <Filter filter={filter} setFilter={setFilter} />
      <TodoList tasks={filteredTasks} toggleTask={toggleTask} deleteTask={deleteTask} />
    </div>
  );
};

export default TodoApp;
