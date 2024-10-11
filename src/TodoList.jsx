// TodoList.js
import React, { useState } from 'react';
import { useTasks } from './TaskContext'; // Import the useTasks hook
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircleCheck, faTimesCircle, faUndo, faRedo, faEdit } from '@fortawesome/free-solid-svg-icons';

const TodoList = () => {
  const { tasks, toggleComplete, deleteTask, addTask, undo, redo,setSearchQuery } = useTasks();
  const [newTask, setNewTask] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editTask, setEditTask] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'Completed') return task.completed;
    if (filter === 'Incomplete') return !task.completed;
    return true;
  });

  const handleAddTask = () => {
    addTask(newTask);
    setNewTask('');
  };

  const handleEditTask = (index) => {
    setEditIndex(index);
    setEditTask(tasks[index].text);
  };

  const saveEditedTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].text = editTask;
    toggleComplete(index); // Reusing the toggle function for edit
    setEditIndex(null);
    setEditTask('');
  };

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h1>Today</h1>
        <input
          type="text"
          placeholder="Search"
          className="search-input"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="filter-buttons">
          <button onClick={() => setFilter('All')} className={filter === 'All' ? 'active' : ''}>All</button>
          <button onClick={() => setFilter('Completed')} className={filter === 'Completed' ? 'active' : ''}>Completed</button>
          <button onClick={() => setFilter('Incomplete')} className={filter === 'Incomplete' ? 'active' : ''}>Incomplete</button>
        </div>
        <div className="undo-redo-buttons">
          <button onClick={undo}><FontAwesomeIcon icon={faUndo} /></button>
          <button onClick={redo}><FontAwesomeIcon icon={faRedo} /></button>
        </div>
      </div>
      <div className="task-list">
        {filteredTasks.map((task, index) => (
          <div key={index} className={`task-item ${task.completed ? 'completed' : ''}`}>
            {editIndex === index ? (
              <input
                type="text"
                className="search-input"
                value={editTask}
                onChange={(e) => setEditTask(e.target.value)}
                onBlur={() => saveEditedTask(index)}
                autoFocus
              />
            ) : (
              <span onClick={() => toggleComplete(index)} className="task-text">
                {task.completed ? <FontAwesomeIcon icon={faCircleCheck} /> : <span className="circle"></span>}
                {task.text}
              </span>
            )}
            {!task.completed && <FontAwesomeIcon icon={faEdit} className="edit-icon" onClick={() => handleEditTask(index)} />}
            <FontAwesomeIcon icon={faTimesCircle} className="delete-icon" onClick={() => deleteTask(index)} />
          </div>
        ))} 
      </div>
      <div className="add-task">
        <input
          type="text"
          placeholder="Type something"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          required
        />
        <button onClick={handleAddTask}  disabled={newTask.trim() === ''}>Add Task</button>
      </div>
    </div>
  );
};

export default TodoList;
