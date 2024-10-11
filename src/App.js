// App.js
import React from 'react';
import './App.css';
import { TaskProvider } from './TaskContext';
import TodoList from './TodoList'; // Create a separate component for the task list

function App() {
  return (
    <TaskProvider>
      <div className="app">
        <TodoList />
      </div>
    </TaskProvider>
  );
}

export default App;
