import React, { createContext, useContext, useState, useEffect } from 'react';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const getInitialTasks = () => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [
    ];
  };

  const getInitialHistory = () => {
    const storedHistory = localStorage.getItem('history');
    return storedHistory ? JSON.parse(storedHistory) : [];
  };

  const getInitialRedoHistory = () => {
    const storedRedoHistory = localStorage.getItem('redoHistory');
    return storedRedoHistory ? JSON.parse(storedRedoHistory) : [];
  };

  const [tasks, setTasks] = useState(getInitialTasks);
  const [history, setHistory] = useState(getInitialHistory);
  const [redoHistory, setRedoHistory] = useState(getInitialRedoHistory);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setFilteredTasks] = useState(tasks);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('redoHistory', JSON.stringify(redoHistory));
  }, [redoHistory]);

  const saveToHistory = () => {
    setHistory([...history, tasks]);
    setRedoHistory([]);  // Clear redoHistory on new task change
  };

  const toggleComplete = (index) => {
    saveToHistory();
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  const deleteTask = (index) => {
    saveToHistory();
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const addTask = (newTask) => {
    if (newTask.trim() !== '') {
      saveToHistory();
      setTasks([...tasks, { text: newTask, completed: false }]);
    }
  };

  const undo = () => {
    if (history.length > 0) {
      setRedoHistory([tasks, ...redoHistory]);
      const lastState = history.pop();  // Get last state from history
      setTasks(lastState);
      setHistory([...history]);  // Update history
    }
  };

  const redo = () => {
    if (redoHistory.length > 0) {
      setHistory([...history, tasks]);
      const nextState = redoHistory.shift();  // Get the next state from redo history
      setTasks(nextState);
      setRedoHistory([...redoHistory]);  // Update redo history
    }
  };

  useEffect(() => {
    console.log('searchQuery',searchQuery)
    const delayDebounceFn = setTimeout(() => {
      const filtered = tasks.filter(task => 
        task.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log('filtered time')
      setFilteredTasks(filtered);
    }, 300);  
    return () => clearTimeout(delayDebounceFn);   
  }, [searchQuery, tasks]);

 
  return (
    <TaskContext.Provider value={{
      tasks: filteredTasks,  // Return filtered tasks based on search
      toggleComplete,
      deleteTask,
      addTask,
      undo,
      redo,
      setSearchQuery,  // Expose searchQuery setter
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  return useContext(TaskContext);
};
