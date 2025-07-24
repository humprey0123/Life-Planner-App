import './App.css';
import TaskItem from './components/TaskItem';
import tasks from './data/tasks';
import GoalCard from './components/GoalCard';
import goals from './data/goals';
import EventCard from './components/EventCard';
import events from './data/events';

function App() {
  return (
    <>
      <h1>Life Planner 🧠</h1>

      <div className="dashboard-row">
        <section>
          <h2>✅ Tasks</h2>
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </section>

        <section>
          <h2>🎯 Goals</h2>
          {goals.map(goal => (
            <GoalCard
              key={goal.id}
              id={goal.id}
              goal={goal.goal}
              progress={goal.progress}
            />
          ))}
        </section>
      </div>

      <section>
        <h2>📅 Events</h2>
        <div className="event-list">
          {events.map(event => (
            <EventCard 
              key={event.id}
              id={event.id}
              image={event.image} 
              title={event.title}
              date={event.date}
              location={event.location}
              link={event.link}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default App;
