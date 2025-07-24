import './GoalCard.css';

function GoalCard({ goal, progress }) {
  return (
    <div className="goal-card">
      <h4>{goal}</h4>
      <p>Status: <strong>{progress}</strong></p>
    </div>
  );
}

export default GoalCard;
