import './GoalCard.css';

function GoalCard({ id, goal, progress, onDelete, onUpdateProgress }) {

  const increase = () => {
    onUpdateProgress(id, 10);
  };

  const decrease = () => {
    onUpdateProgress(id, -10);
  };

  return (
    <div className="goal-card">
      <h4>{goal}</h4>

      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <p>{progress}% complete</p>

      <div>
        <button onClick={decrease} style={{ marginRight: "10px" }}>➖</button>
        <button onClick={increase}>➕</button>
        <button onClick={() => onDelete(id)} className="delete-btn">🗑️</button>
      </div>

      {progress === 100 && (
        <p style={{ color: "lightgreen", fontWeight: "bold" }}> Goal Achieved!</p>
      )}
    </div>
  );
}


export default GoalCard;
