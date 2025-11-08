import React, { useState } from 'react';
import { Plus, GripVertical } from 'lucide-react';


const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100%',
    backgroundColor: '#111827', // bg-gray-900
    color: 'white',
    fontFamily: 'sans-serif',
  },
  header: {
    padding: '1rem',
    borderBottom: '1px solid #374151', // border-gray-700
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  headerTitle: {
    fontSize: '1.5rem', // text-2xl
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mainBoard: {
    flex: '1 1 0%',
    display: 'flex',
    overflowX: 'auto',
  
  },
  boardContent: {
    display: 'flex',
    gap: '1rem', // space-x-4
    padding: '1rem', 
    minWidth: '100%', 
    boxSizing: 'border-box',
  },
  column: {
    flexShrink: 0,
    width: '320px', // w-80
    backgroundColor: '#1F2937', // bg-gray-800
    borderRadius: '0.5rem', // rounded-lg
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
  },
  columnHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    borderBottom: '1px solid #374151', // border-gray-700
  },
  columnTitle: {
    fontSize: '1.125rem', // text-lg
    fontWeight: '600',
    cursor: 'pointer',
    flex: 1, 
    padding: '0.25rem 0.5rem', 
    borderRadius: '0.25rem',
  },

  columnTitleInput: {
    fontSize: '1.125rem',
    fontWeight: '600',
    backgroundColor: '#374151', // bg-gray-700
    color: 'white',
    border: '1px solid #4B5563',
    borderRadius: '0.25rem',
    padding: '0.25rem 0.5rem',
    flex: 1, // Take up available space
    boxSizing: 'border-box',
    outline: 'none',
  },
  taskCount: {
    fontSize: '0.875rem',
    fontWeight: '500',
    backgroundColor: '#374151', // bg-gray-700
    color: '#D1D5DB', // text-gray-300
    borderRadius: '9999px',
    padding: '0.125rem 0.5rem',
    marginLeft: '0.5rem', // Add space
  },
  tasksContainer: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem', // space-y-3
    minHeight: '200px',
    flex: 1, // Make it flexible
  },
  taskCard: {
    backgroundColor: '#374151', // bg-gray-700
    padding: '0.75rem',
    borderRadius: '0.375rem', // rounded-md
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    cursor: 'grab',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskCardDragging: {
    
    opacity: 0.5,
    transform: 'rotate(3deg)',
  },
  addTaskFormContainer: {
    padding: '1rem',
    borderTop: '1px solid #374151', // border-gray-700
    marginTop: 'auto', 
  },
  addTaskForm: {
    display: 'flex',
    gap: '0.5rem',
  },
  addTaskInput: {
    flex: 1,
    backgroundColor: '#4B5563', // bg-gray-600
    color: 'white',
    border: '1px solid #374151',
    borderRadius: '0.375rem',
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
  },
  addTaskButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    backgroundColor: '#00000363', // bg-indigo-600
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
  },
  dropZone: {
    
    border: '2px dashed #3B82F6', // border-blue-500
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: '0.5rem',
    margin: '0.5rem',
    height: '100px',
  }
};

// --- Main App Component ---
export default function App() {
  const [columns, setColumns] = useState({
    'todo': {
      name: 'To Do',
      tasks: [
        { id: 'task-1', content: 'Design the homepage wireframes' },
        { id: 'task-2', content: 'Set up the project repository' },
      ],
    },
    'inProgress': {
      name: 'In Progress',
      tasks: [
        { id: 'task-3', content: 'Develop the authentication feature' },
      ],
    },
    'review': {
      name: 'In Review',
      tasks: [
        { id: 'task-4', content: 'Review the API documentation' },
      ],
    },
    'done': {
      name: 'Done',
      tasks: [
        { id: 'task-5', content: 'Initial project setup and planning' },
      ],
    },
  });

  const [draggedTask, setDraggedTask] = useState(null); // { taskId, sourceColId }
  const [dragOverCol, setDragOverCol] = useState(null);

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e, taskId, sourceColId) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTask({ taskId, sourceColId });
  };

  const handleDragOver = (e, targetColId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCol(targetColId);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverCol(null);
  };

  const handleDrop = (e, targetColId) => {
    e.preventDefault();
    if (!draggedTask) return;

    const { taskId, sourceColId } = draggedTask;
    if (sourceColId === targetColId) return;

    setColumns(prevColumns => {
      const newColumns = { ...prevColumns };
      const sourceCol = newColumns[sourceColId];
      const taskToMove = sourceCol.tasks.find(task => task.id === taskId);

      if (!taskToMove) return prevColumns;

      newColumns[sourceColId] = {
        ...sourceCol,
        tasks: sourceCol.tasks.filter(task => task.id !== taskId),
      };

      
      const targetCol = newColumns[targetColId]; 
      
      newColumns[targetColId] = {
        ...targetCol, 
        tasks: [...targetCol.tasks, taskToMove], 
      };
      return newColumns;
    });

    setDraggedTask(null);
    setDragOverCol(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverCol(null);
  };

  // --- Task Management ---
  const addTask = (colId, content) => {
    if (!content) return;
    const newTaskId = `task-${Date.now()}`;
    const newTask = { id: newTaskId, content };

    setColumns(prevColumns => {
      const newColumns = { ...prevColumns };
      const targetCol = newColumns[colId];
      newColumns[colId] = {
        ...targetCol,
        tasks: [...targetCol.tasks, newTask],
      };
      return newColumns;
    });
  };

  // --- NEW: Column Name Management ---
  const updateColumnName = (colId, newName) => {
    setColumns(prevColumns => {
      const newColumns = { ...prevColumns };
      newColumns[colId] = {
        ...newColumns[colId],
        name: newName,
      };
      return newColumns;
    });
  };

  // --- Render ---
  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Kanban Board</h1>
      </header>

      <main style={styles.mainBoard}>
        <div style={styles.boardContent}>
          {Object.entries(columns).map(([colId, column]) => (
            <Column
              key={colId}
              colId={colId}
              column={column}
              onDragOver={(e) => handleDragOver(e, colId)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, colId)}
              onAddTask={addTask}
              onUpdateColumnName={updateColumnName} // Pass the new function
              isDragOver={dragOverCol === colId}
            >
              {column.tasks.map(task => (
                <Task
                  key={task.id}
                  task={task}
                  isDragging={draggedTask && draggedTask.taskId === task.id}
                  onDragStart={(e) => handleDragStart(e, task.id, colId)}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </Column>
          ))}
        </div>
      </main>
    </div>
  );
}

// --- Sub-Components ---

function Column({ colId, column, children, onDragOver, onDragLeave, onDrop, onAddTask, onUpdateColumnName, isDragOver }) {
  // State for editing the column title
  const [isEditing, setIsEditing] = useState(false);
  const [editableName, setEditableName] = useState(column.name);

  const handleNameChange = (e) => {
    setEditableName(e.target.value);
  };

  const handleNameSubmit = () => {
    const trimmedName = editableName.trim();
    if (trimmedName) {
      onUpdateColumnName(colId, trimmedName);
    } else {
      setEditableName(column.name); 
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      setEditableName(column.name); 
      setIsEditing(false);
    }
  };

  return (
    <div
      style={styles.column}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div style={styles.columnHeader}>
        {isEditing ? (
          <input
            type="text"
            value={editableName}
            onChange={handleNameChange}
            onBlur={handleNameSubmit} 
            onKeyDown={handleKeyDown} 
            style={styles.columnTitleInput}
            autoFocus 
          />
        ) : (
          <h2
            style={styles.columnTitle}
            onClick={() => setIsEditing(true)} 
          >
            {column.name}
          </h2>
        )}
        <span style={styles.taskCount}>{column.tasks.length}</span>
      </div>

      <div style={styles.tasksContainer}>
        {children}
        {/* Visual drop zone when dragging over */}
        {isDragOver && children.length === 0 && <div style={styles.dropZone}></div>}
      </div>
      
      <AddTaskForm onAddTask={(content) => onAddTask(colId, content)} />
    </div>
  );
}

function Task({ task, isDragging, onDragStart, onDragEnd }) {
  
  const taskStyle = {
    ...styles.taskCard,
    ...(isDragging ? styles.taskCardDragging : {}),
  };

  return (
    <div
      id={task.id}
      style={taskStyle}
      draggable="true"
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <span>{task.content}</span>
      <GripVertical size={18} style={{ color: '#6B7280' }} />
    </div>
  );
}

function AddTaskForm({ onAddTask }) {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedContent = content.trim();
    if (trimmedContent) {
      onAddTask(trimmedContent);
      setContent('');
    }
  };

  return (
    <div style={styles.addTaskFormContainer}>
      <form style={styles.addTaskForm} onSubmit={handleSubmit}>
        <input
          type="text"
          style={styles.addTaskInput}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="New task..."
        />
        <button type="submit" style={styles.addTaskButton}>
          <Plus size={16} />
          Add
        </button>
      </form>
    </div>
  );
}