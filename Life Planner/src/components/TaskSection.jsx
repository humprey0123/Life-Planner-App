// TasksSection.jsx
import { useState } from 'react';
import './TaskSection.css';

function TaskSection({ taskList, newTask, setNewTask, showForm, setShowForm, onAdd, onDelete, onEdit, onToggleDone }) {
  return (
    <>
      <h2>✅ Tasks</h2>
      <div>
        {taskList.length === 0 ? (
          <p style={{ textAlign: "left" }}>Add your first Task!</p>
        ) : (
          taskList.map(task => (
            <TaskItem 
              key={task.id}
              task={task}
              onDelete={onDelete}
              onEdit={onEdit}
              onToggleDone={onToggleDone}
            />
          ))
        )}
      </div>

      {showForm && (
        <form onSubmit={onAdd} className="task-form">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter a new task..."
            required
          />
          <button type="submit">Save</button>
        </form>
      )}

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add Task"}
      </button>
    </>
  );
}

// Inline TaskItem
function TaskItem({ task, onDelete, onEdit, onToggleDone }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleEditSave = () => {
    onEdit(task.id, editText);
    setIsEditing(false);
  };

  return (
    <div className={`task-item ${task.completed ? 'done' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleDone(task.id)}
      />
      {isEditing ? (
        <>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <button onClick={handleEditSave}>Save</button>
        </>
      ) : (
        <span>{task.text}</span>
      )}
      <div className="task-buttons">
        <button onClick={() => setIsEditing(true)}>✏️</button>
        <button onClick={() => onDelete(task.id)} style={{color: 'red'}}>x</button>
      </div>
    </div>
  );
}
export default TaskSection;


