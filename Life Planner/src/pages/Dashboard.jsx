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
  where,
  onSnapshot,
  serverTimestamp
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
  const [goalList, setGoalList] = useState([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newGoalText, setNewGoalText] = useState("");

  // Fetch goals from Firestore
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "goals"), where("uid", "==", user.uid));
    // Real-time listener
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => {
          const data = d.data();
          // Normalize: accept old docs with `text`, default progress to 0
          return {
            id: d.id,
            goal: data.goal ?? data.text ?? "",
            progress: typeof data.progress === "number" ? data.progress : 0,
            ...data,
          };
        });
        setGoalList(items);
      },
      (err) => console.error("onSnapshot(goals) error:", err)
    );

    return unsub;
  }, [user]);



  // EVENT STATE
  const [eventList, setEventList] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    location: "",
    link: "",
    image: "",
  });

  // Fetch events from Firestore
  useEffect(() => {
    if (!user) return;

    const fetchEvents = async () => {
      const q = query(collection(db, "events"), where("uid", "==", user.uid));
      const snapshot = await getDocs(q);
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEventList(eventsData);
    };

    fetchEvents();
  }, [user]);

  // TASK FUNCTIONS
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
  // Add goal
  async function handleAddGoal(e) {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    if (!user) return alert("You must be logged in to add goals.");

    try {
      await addDoc(collection(db, "goals"), {
        goal: newGoalText,
        progress: 0,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });
      setNewGoalText("");
      setShowGoalForm(false);
    } catch (err) {
      console.error("Error adding goal:", err);
      alert("Failed to add goal. Check the console.");
    }
  }
  // Delete goal
  async function handleDeleteGoal(id) {
    try {
      await deleteDoc(doc(db, "goals", id));
    } catch (err) {
      console.error("Error deleting goal:", err);
      alert("Failed to delete goal.");
    }
  }
  // Update goal progress
  async function handleUpdateProgress(id, delta) {
    try {
      const g = goalList.find((x) => x.id === id);
      if (!g) return;

      const next = Math.max(0, Math.min(100, (g.progress ?? 0) + delta));
      await updateDoc(doc(db, "goals", id), { progress: next });
    } catch (err) {
      console.error("Error updating progress:", err);
      alert("Failed to update progress.");
    }
  }

  // EVENT FUNCTIONS
  // Add event
  async function handleAddEvent(e) {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to add events.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "events"), {
        ...newEvent,
        uid: user.uid,
        createdAt: Date.now(),
      });

      setEventList([{ id: docRef.id, ...newEvent }, ...eventList]);
      setNewEvent({ title: "", date: "", location: "", link: "", image: "" });
      setShowEventForm(false);
    } catch (err) {
      console.error("Error adding event:", err);
      alert("Failed to add event. Check the console for details.");
    }
  }

  // Delete event
  async function handleDeleteEvent(id) {
    try {
      await deleteDoc(doc(db, "events", id));
      setEventList(eventList.filter((event) => event.id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event.");
    }
  }

  //Edit event
  async function handleEditEvent(id, updatedEvent) {
    try {
      const eventRef = doc(db, "events", id);
      await updateDoc(eventRef, updatedEvent);

      setEventList(eventList.map((event) =>
        event.id === id ? { ...event, ...updatedEvent } : event
      ));
    } catch (err) {
      console.error("Error editing event:", err);
      alert("Failed to edit event.");
    }
  }

  // Render the dashboard
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
            onAddGoal={handleAddGoal}          // ✅ use Firestore handler
            onDeleteGoal={handleDeleteGoal}    // ✅ Firestore delete
            onUpdateProgress={handleUpdateProgress}  // ✅ Firestore update
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
                onAddGoal={handleAddGoal}          // ✅ use Firestore handler
                onDeleteGoal={handleDeleteGoal}    // ✅ Firestore delete
                onUpdateProgress={handleUpdateProgress}  // ✅ Firestore update
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
