// components/GoalsSection.jsx
import './GoalCard.css';

function GoalsSection({
  goalList,
  showGoalForm,
  setShowGoalForm,
  newGoalText,
  setNewGoalText,
  onAddGoal,
  onDeleteGoal,
  onUpdateProgress
}) {
  return (
    <>
      <h2>🎯 Goals</h2>
        {goalList.map(goal => (
          <GoalCard
            key={goal.id}
            id={goal.id}
            goal={goal.goal}
            progress={goal.progress}
            onDelete={onDeleteGoal}
            onUpdateProgress={onUpdateProgress}
          />
        ))}

      {showGoalForm && (
        <form onSubmit={onAddGoal} className="task-form">
          <input
            type="text"
            value={newGoalText}
            onChange={(e) => setNewGoalText(e.target.value)}
            placeholder="Enter your goal..."
            required
          />
          <button type="submit">Save</button>
        </form>
      )}

      <button onClick={() => setShowGoalForm(!showGoalForm)}>
        {showGoalForm ? "Cancel" : "Add Goal"}
      </button>
    </>
  );
}

// Inline GoalCard component
function GoalCard({ id, goal, progress, onDelete, onUpdateProgress }) {
  const increase = () => onUpdateProgress(id, 10);
  const decrease = () => onUpdateProgress(id, -10);

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
        <p style={{ color: "lightgreen", fontWeight: "bold" }}>Goal Achieved!</p>
      )}
    </div>
  );
}

export default GoalsSection;
