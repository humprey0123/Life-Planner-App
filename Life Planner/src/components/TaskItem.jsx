import { useState } from 'react';
import './TaskItem.css';

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
        <button onClick={() => onDelete(task.id)} style={{ color: 'red' }}>x</button>
      </div>
    </div>
  );
}


export default TaskItem;
