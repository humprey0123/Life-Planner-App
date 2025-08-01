import './App.css';
import TaskItem from './components/TaskItem';
import tasks from './data/tasks';
import GoalCard from './components/GoalCard';
import goals from './data/goals';
import EventCard from './components/EventCard';
import events from './data/events';
import { useState, useEffect } from 'react';

function App() {
  // Defined Task List
  const [showForm, setShowForm] = useState(false);
  const [taskList, setTaskList] = useState(() => {
  const savedTasks = localStorage.getItem('lifeplanner-tasks');
  return savedTasks ? JSON.parse(savedTasks) : tasks;
  });
  // Defined Goal
  const [goalList, setGoalList] = useState(() => {
    const savedGoals = localStorage.getItem('lifeplanner-goals');
    return savedGoals ? JSON.parse(savedGoals) : goals;
  });
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newGoalText, setNewGoalText] = useState('');
  // Defined Event
  const [eventList, setEventList] = useState(() => {
  const savedEvents = localStorage.getItem('lifeplanner-events');
  return savedEvents ? JSON.parse(savedEvents) : events;
  });

  // Save for Event List to Local Storage
  useEffect(() => {
    localStorage.setItem('lifeplanner-events', JSON.stringify(eventList));
  }, [eventList]);

    const [showEventForm, setShowEventForm] = useState(false);
    const [newEvent, setNewEvent] = useState({
      title: '',
      date: '',
      location: '',
      link: '',
      image: ''
    });

    // Save for Task List to Local Storage
  useEffect(() => {
  localStorage.setItem('lifeplanner-tasks', JSON.stringify(taskList));
  }, [taskList]);
  const [newTask, setNewTask] = useState('');
  // Save for Goal List to Local Storage
  useEffect(() => {
  localStorage.setItem('lifeplanner-goals', JSON.stringify(goalList));
  }, [goalList]);

  function handleToggleTaskDone(id) {
  setTaskList(taskList.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  ));
  }

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

  function handleDeleteTask(id) {
  setTaskList(taskList.filter(task => task.id !== id));
  }

  function handleEditTask(id, newText) {
    setTaskList(
      taskList.map(task =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  }

  function handleDeleteGoal(id) {
  setGoalList(goalList.filter(goal => goal.id !== id));
  }

  function handleUpdateProgress(id, amount) {
    setGoalList(prevGoals =>
      prevGoals.map(goal =>
        goal.id === id
          ? { ...goal, progress: Math.max(0, Math.min(100, goal.progress + amount)) }
          : goal
      )
    );
  }

  function handleAddEvent(e) {
  e.preventDefault();
  const newEventObj = {
    id: Date.now(),
    ...newEvent
  };
  setEventList([newEventObj, ...eventList]);
  setNewEvent({ title: '', date: '', location: '', link: '', image: '' });
  setShowEventForm(false);
}


  return (
    <>
      <header className='planner-header'>
        <h1>Life Planner 📘✅📆</h1>
        <div className='user-info'>
          <span>Welcome, Ian</span>
          <button>Logout</button>
        </div>
      </header>
                    
      <div className="dashboard-row">
              {/* TASKS */}
        <section>
          <h2>✅ Tasks</h2>
          <div className='content-scroll'>
            {/* Render Task List */}
            {taskList.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
                onToggleDone={handleToggleTaskDone}
              />
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
              {/* GOALS */}
          <h2>🎯 Goals</h2>
          <div className="content-scroll">
            {goalList.map(goal => (
              <GoalCard
                key={goal.id}
                id={goal.id}
                goal={goal.goal}
                progress={goal.progress}
                onDelete={handleDeleteGoal}
                onUpdateProgress={handleUpdateProgress}
              />
            ))}
          </div>

          {/* Goal Form */}
          {showGoalForm && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newGoal = {
                  id: Date.now(),
                  goal: newGoalText,
                  progress: 0
                };
                setGoalList([newGoal, ...goalList]);
                setNewGoalText('');
                setShowGoalForm(false);
              }}
              className="task-form"
            >
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

          {/* Toggle Button */}
          <button onClick={() => setShowGoalForm(!showGoalForm)}>
            {showGoalForm ? "Cancel" : "Add Goal"}
          </button>
        </section>

      </div>

        <section>
          <div className="section-header">
            <h2>📅 Events</h2>
            <button onClick={() => setShowEventForm(!showEventForm)}>
              {showEventForm ? "Cancel" : "Add Event"}
            </button>
          </div>

          {/* Event Form (toggleable) */}
          {showEventForm && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Add New Event</h3>
                <form onSubmit={handleAddEvent} className="modal-form">
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Title"
                    required
                  />
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="Location"
                  />
                  <input
                    type="url"
                    value={newEvent.link}
                    onChange={(e) => setNewEvent({ ...newEvent, link: e.target.value })}
                    placeholder="Link"
                  />
                  <input
                    type="url"
                    value={newEvent.image}
                    onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
                    placeholder="Image URL"
                  />
                  <div className="modal-buttons">
                    <button type="button" onClick={() => setShowEventForm(false)}>Cancel</button>
                    <button type="submit">Save</button>
                  </div>
                </form>
              </div>
            </div>
          )}




          {/* Render Events */}
          <div className='content-scroll'>
            <div className="event-list">
              {eventList.map(event => (
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
          </div>
        </section>

    </>
  );
}

export default App;
