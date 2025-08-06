import './App.css';
import TasksSection from './components/TaskSection';
import tasks from './data/tasks';
import GoalSection from './components/GoalSection';
import goals from './data/goals';
import EventsSection from './components/EventSection';
import events from './data/events';
import { useState, useEffect } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState("home");

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

  function handleDeleteEvent(id) {
  setEventList(eventList.filter(event => event.id !== id));
  }

  function handleEditEvent(id, updatedEvent) {
  setEventList(prevList =>
    prevList.map(event =>
      event.id === id ? { ...event, ...updatedEvent } : event
    )
  );
}


  return (
    <>
      <header className='planner-header'>
        <h1>Life Planner 📘✅📆</h1>
        <div className="tab-buttons">
          <button onClick={() => setActiveTab("home")}>🏠 Home</button>
          <button onClick={() => setActiveTab("tasks")}>✅ Tasks</button>
          <button onClick={() => setActiveTab("goals")}>🎯 Goals</button>
          <button onClick={() => setActiveTab("events")}>📅 Events</button>
        </div>
        <div className='user-info'>
          <span>Welcome, Ian</span>
          <button>Logout</button>
        </div>
      </header>

      {activeTab === "tasks" && (
        <section>
          <div className='tab-scroll'>
            <TasksSection
              taskList={taskList}
              newTask={newTask}
              setNewTask={setNewTask}
              showForm={showForm}
              setShowForm={setShowForm}
              onAdd={handleAddTask}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
              onToggleDone={handleToggleTaskDone}
            />
          </div>
        </section>
      )}

        {activeTab === "goals" && (
          <section>
            <div className='tab-scroll'>
              <GoalSection
                goalList={goalList}
                showGoalForm={showGoalForm}
                setShowGoalForm={setShowGoalForm}
                newGoalText={newGoalText}
                setNewGoalText={setNewGoalText}
                onAddGoal={(e) => {
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
                onDeleteGoal={handleDeleteGoal}
                onUpdateProgress={handleUpdateProgress}
              />
            </div>
          </section>
        )}

        {activeTab === "events" && (
          <section>
            <EventsSection
              eventList={eventList}
              newEvent={newEvent}
              setNewEvent={setNewEvent}
              showEventForm={showEventForm}
              setShowEventForm={setShowEventForm}
              onAddEvent={handleAddEvent}
              onDeleteEvent={handleDeleteEvent}
              onEditEvent={handleEditEvent}
            />
          </section>
        )}

        {activeTab === "home" && (
          <section>
          <div className="dashboard-row">
                  {/* TASKS */}
            <section className="content-scroll">
                <TasksSection 
                  taskList={taskList}
                  newTask={newTask}
                  setNewTask={setNewTask}
                  showForm={showForm}
                  setShowForm={setShowForm}
                  onAdd={handleAddTask}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                  onToggleDone={handleToggleTaskDone}
                />
            </section>

            <section className="content-scroll">
                  {/* GOALS */}
              <GoalSection
                goalList={goalList}
                showGoalForm={showGoalForm}
                setShowGoalForm={setShowGoalForm}
                newGoalText={newGoalText}
                setNewGoalText={setNewGoalText}
                onAddGoal={(e) => {
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
                onDeleteGoal={handleDeleteGoal}
                onUpdateProgress={handleUpdateProgress}
              />
            </section>
          </div>

          <section>
            <EventsSection
              eventList={eventList}
              newEvent={newEvent}
              setNewEvent={setNewEvent}
              showEventForm={showEventForm}
              setShowEventForm={setShowEventForm}
              onAddEvent={handleAddEvent}
              onDeleteEvent={handleDeleteEvent}
              onEditEvent={handleEditEvent}
            />
          </section>
        </section>
    )}
    </>
  );
}

export default App;
