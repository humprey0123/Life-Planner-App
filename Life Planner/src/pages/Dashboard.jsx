import EventSection from "../components/EventSection";
import GoalSection from "../components/GoalSection";
import TaskSection from "../components/TaskSection";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // ✅ IMPORTED
import './Dashboard.css';

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("home");

  // Defined Task List
  const [showForm, setShowForm] = useState(false);
  const [taskList, setTaskList] = useState(() => {
    const savedTasks = localStorage.getItem("lifeplanner-tasks");
    return savedTasks ? JSON.parse(savedTasks) : []; // ✅ FIX: replaced `tasks` with []
  });

  // Defined Goal List
  const [goalList, setGoalList] = useState(() => {
    const savedGoals = localStorage.getItem("lifeplanner-goals");
    return savedGoals ? JSON.parse(savedGoals) : []; // ✅ FIX
  });
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newGoalText, setNewGoalText] = useState("");

  // Defined Event List
  const [eventList, setEventList] = useState(() => {
    const savedEvents = localStorage.getItem("lifeplanner-events");
    return savedEvents ? JSON.parse(savedEvents) : []; // ✅ FIX
  });

  // Save for Event List to Local Storage
  useEffect(() => {
    localStorage.setItem("lifeplanner-events", JSON.stringify(eventList));
  }, [eventList]);

  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    location: "",
    link: "",
    image: "",
  });

  // Save for Task List to Local Storage
  useEffect(() => {
    localStorage.setItem("lifeplanner-tasks", JSON.stringify(taskList));
  }, [taskList]);

  const [newTask, setNewTask] = useState("");

  // Save for Goal List to Local Storage
  useEffect(() => {
    localStorage.setItem("lifeplanner-goals", JSON.stringify(goalList));
  }, [goalList]);

  // ✅ TASK FUNCTIONS
  function handleToggleTaskDone(id) {
    setTaskList(
      taskList.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function handleAddTask(e) {
    e.preventDefault();
    const newTaskObj = {
      id: Date.now(),
      text: newTask,
      completed: false,
    };
    setTaskList([newTaskObj, ...taskList]);
    setNewTask("");
    setShowForm(false);
  }

  function handleDeleteTask(id) {
    setTaskList(taskList.filter((task) => task.id !== id));
  }

  function handleEditTask(id, newText) {
    setTaskList(
      taskList.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  }

  // ✅ GOAL FUNCTIONS
  function handleDeleteGoal(id) {
    setGoalList(goalList.filter((goal) => goal.id !== id));
  }

  function handleUpdateProgress(id, amount) {
    setGoalList((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              progress: Math.max(0, Math.min(100, goal.progress + amount)),
            }
          : goal
      )
    );
  }

  // ✅ EVENT FUNCTIONS
  function handleAddEvent(e) {
    e.preventDefault();
    const newEventObj = {
      id: Date.now(),
      ...newEvent,
    };
    setEventList([newEventObj, ...eventList]);
    setNewEvent({ title: "", date: "", location: "", link: "", image: "" });
    setShowEventForm(false);
  }

  function handleDeleteEvent(id) {
    setEventList(eventList.filter((event) => event.id !== id));
  }

  function handleEditEvent(id, updatedEvent) {
    setEventList((prevList) =>
      prevList.map((event) =>
        event.id === id ? { ...event, ...updatedEvent } : event
      )
    );
  }

  return (
    <>
      <header className="planner-header">
        <h1>Life Planner 📘✅📆</h1>
        <div className="tab-buttons">
          <button onClick={() => setActiveTab("home")}>🏠 Home</button>
          <button onClick={() => setActiveTab("tasks")}>✅ Tasks</button>
          <button onClick={() => setActiveTab("goals")}>🎯 Goals</button>
          <button onClick={() => setActiveTab("events")}>📅 Events</button>
        </div>
        <div className="user-info">
          <p>{user?.displayName || user?.email}</p>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      {activeTab === "tasks" && (
        <section className="tab-scroll">
          <TaskSection
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
      )}

      {activeTab === "goals" && (
        <section className="tab-scroll">
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
                progress: 0,
              };
              setGoalList([newGoal, ...goalList]);
              setNewGoalText("");
              setShowGoalForm(false);
            }}
            onDeleteGoal={handleDeleteGoal}
            onUpdateProgress={handleUpdateProgress}
          />
        </section>
      )}

      {activeTab === "events" && (
        <section>
          <EventSection
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
            <section className="content-scroll">
              <TaskSection
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
                    progress: 0,
                  };
                  setGoalList([newGoal, ...goalList]);
                  setNewGoalText("");
                  setShowGoalForm(false);
                }}
                onDeleteGoal={handleDeleteGoal}
                onUpdateProgress={handleUpdateProgress}
              />
            </section>
          </div>

          <section>
            <EventSection
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

export default Dashboard;
