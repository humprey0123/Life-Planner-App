import EventSection from "../components/EventSection";
import GoalSection from "../components/GoalSection";
import TaskSection from "../components/TaskSection";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import './Dashboard.css';
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where
} from "firebase/firestore";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("home");

  // TASK STATE
  const [taskList, setTaskList] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [showForm, setShowForm] = useState(false);
  
  // Fetch tasks from Firestore
  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      const q = query(collection(db, "tasks"), where("uid", "==", user.uid));
      const snapshot = await getDocs(q);
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTaskList(tasksData);
    };

    fetchTasks();
  }, [user]);

  // Goal List State
  const [goalList, setGoalList] = useState(() => {
    const savedGoals = localStorage.getItem("lifeplanner-goals");
    return savedGoals ? JSON.parse(savedGoals) : [];
  });
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newGoalText, setNewGoalText] = useState("");

  // Defined Event List
  const [eventList, setEventList] = useState(() => {
    const savedEvents = localStorage.getItem("lifeplanner-events");
    return savedEvents ? JSON.parse(savedEvents) : []; 
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

  // Save for Goal List to Local Storage
  useEffect(() => {
    localStorage.setItem("lifeplanner-goals", JSON.stringify(goalList));
  }, [goalList]);

  // Toggle task check
  async function handleToggleTaskDone(id, currentValue) {
    await updateDoc(doc(db, "tasks", id), { completed: !currentValue });
    setTaskList(
      taskList.map((task) =>
        task.id === id ? { ...task, completed: !currentValue } : task
      )
    );
  }

  // Add task Firebase
  async function handleAddTask(e) {
    e.preventDefault();
    if (!newTask.trim()) return;
    if (!user) {
      alert("You must be logged in to add tasks.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        text: newTask,
        completed: false,
        uid: user.uid,
        createdAt: Date.now(),
      });

      setTaskList([{ id: docRef.id, text: newTask, completed: false }, ...taskList]);
      setNewTask("");
      setShowForm(false);
    } catch (err) {
      console.error("Error adding task:", err);
      alert("Failed to add task. Check the console for details.");
    }
  }

  // Delete task
  async function handleDeleteTask(id) {
    await deleteDoc(doc(db, "tasks", id));
    setTaskList(taskList.filter((task) => task.id !== id));
  }

  // Edit task
  async function handleEditTask(id, newText) {
    try {
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, { text: newText });

      setTaskList(
        taskList.map((task) =>
          task.id === id ? { ...task, text: newText } : task
        )
      );
    } catch (error) {
      console.error("Error editing task:", error);
      alert("Failed to update task. Check console for details.");
    }
  }

  // GOAL FUNCTIONS
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

  // EVENT FUNCTIONS
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
            onToggleDone={(id) => {
              const t = taskList.find((task) => task.id === id);
              handleToggleTaskDone(id, t.completed);
              }}
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
                onToggleDone={(id) => {
                  const t = taskList.find((task) => task.id === id);
                  handleToggleTaskDone(id, t.completed);
                  }}
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
