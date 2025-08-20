// src/components/GoalSection.jsx
import React from "react";
import "./GoalSection.css";

function GoalSection({
  goalList,
  showGoalForm,
  setShowGoalForm,
  newGoalText,
  setNewGoalText,
  onAddGoal,
  onDeleteGoal,
  onUpdateProgress,
}) {
  return (
    <div>
      <h2>🎯 Goals</h2>

      {/* Goal List */}
      {goalList.length === 0 && <p>No goals yet. Add your first one!</p>}

      {goalList.map((goal) => (
        <div key={goal.id} className="goal-card">
          <p>{goal.goal}</p>

          {/* Progress Bar */}
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${goal.progress || 0}%` }}
            ></div>
          </div>

          {/* Achieved Message */}
          {goal.progress >= 100 && (
            <p className="achieved">✅ Goal Achieved!</p>
          )}

          {/* Buttons */}
          <div style={{ marginTop: "20px" }}>
            <button style={{marginRight: "10px"}} onClick={() => onUpdateProgress(goal.id, -10)}>➖</button>
            <button onClick={() => onUpdateProgress(goal.id, 10)}>➕</button>
            <button
              className="delete-btn"
              onClick={() => onDeleteGoal(goal.id)}
            >
              🗑 Delete
            </button>
          </div>
        </div>
      ))}

      {/* Add Goal Form & Button at Bottom */}
      {showGoalForm ? (
        <form onSubmit={onAddGoal} style={{ marginTop: "15px" }}>
          <input
            type="text"
            value={newGoalText}
            onChange={(e) => setNewGoalText(e.target.value)}
            placeholder="Enter a new goal..."
          />
          <button type="submit">Add</button>
          <button type="button" onClick={() => setShowGoalForm(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <button onClick={() => setShowGoalForm(true)}>
          ➕ Add Goal
        </button>
      )}
    </div>
  );
}

export default GoalSection;
