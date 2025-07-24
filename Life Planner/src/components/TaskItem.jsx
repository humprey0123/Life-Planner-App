import { useState } from 'react';
import './TaskItem.css';

function TaskItem({ task }) {
  const [isDone, setIsDone] = useState(task.completed);

  const toggleDone = () => {
    setIsDone(!isDone);
  };

  return (
    <div className={`task-item ${isDone ? 'done' : ''}`}>
      <input
        type="checkbox"
        checked={isDone}
        onChange={toggleDone}
      />
      <span>{task.text}</span>
    </div>
  );
}

export default TaskItem;
