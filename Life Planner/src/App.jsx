import './App.css';
import TaskItem from './components/TaskItem';
import tasks from './data/tasks';
import GoalCard from './components/GoalCard';
import goals from './data/goals';
import EventCard from './components/EventCard';
import events from './data/events';
import { useState } from 'react';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [taskList, setTaskList] = useState(tasks);
  const [newTask, setNewTask] = useState('');

  function handleAddTask(e) {
    e.preventDefault();
    const newTaskObj = {
      id: Date.now(),
      text: newTask,
      completed: false,
    };  
    setTaskList([newTaskObj, ...taskList]);
    setNewTask('');
    setShowForm(false); // optional: auto-close form after submit
  }

  return (
    <>
      <header className='planner-header'>
        <h1>Life Planner 🧠</h1>
        <div className='user-info'>
          <span>Welcome, Ian</span>
          <button>Logout</button>
        </div>
      </header>

      <div className="dashboard-row">
        <section>
          <h2>✅ Tasks</h2>

          <div className='task-scroll'>
            {/* Render Task List */}
            {taskList.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>

                    {/* Task Form (conditionally shown) */}
          {showForm && (
            <form onSubmit={handleAddTask} className="task-form">
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
            
                    {/* Toggle Button */}
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Add Task"}
          </button>
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
