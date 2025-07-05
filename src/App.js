import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./Signup";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const fetchTask = async (token) => {
    const response = await fetch(
      "https://todolist-production-9637.up.railway.app/tasks",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    console.log("Fetched tasks", data);
    setTasks(Array.isArray(data) ? data : data.tasks || []);
  };

  useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/get`)
    .then(res => res.json())
    .then(data => console.log(data));
}, []);

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setTasks([]);
  };

  const addTasks = async (text) => {
    const response = await fetch(
      "https://todolist-production-9637.up.railway.app/tasks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text,
          status: "pending",
          priority: "medium",
        }),
      }
    );
    const newTask = await response.json();
    setTasks([...tasks, newTask]);
  };

  const deleteTask = async (id) => {
    await fetch(`https://todolist-production-9637.up.railway.app/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setTasks(tasks.filter((task) => task._id !== id));
  };

  const updateTasksStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "complete" : "pending";
    const response = await fetch(
      `https://todolist-production-9637.up.railway.app/tasks/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );
    const updatedTask = await response.json();
    setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
  };

  const updateTaskPriority = async (id, newPriority) => {
    const response = await fetch(
      `https://todolist-production-9637.up.railway.app/tasks/${id}/priority`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priority: newPriority }),
      }
    );
    const updatedTask = await response.json();
    setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
  };

  const filteredTasks = tasks.filter(
    (task) =>
      (filterStatus === "all" || task.status === filterStatus) &&
      (filterPriority === "all" || task.priority === filterPriority)
  );

  const MainApp = () => (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      <nav className="bg-orange-500 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="text-xl font-bold">📝 Aima's To-Do List</div>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-full font-semibold transition-colors duration-200 hover:bg-orange-600 focus:outline-none"
        >
          Logout
        </button>
      </nav>

      <main className="flex-1 p-8">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-orange-600">
          MERN To-Do App
        </h1>

        {/* Add Task Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTasks(e.target[0].value);
            e.target[0].value = "";
          }}
          className="mb-6 flex gap-2 justify-center"
        >
          <input
            type="text"
            className="p-3 border-2 border-orange-300 rounded-lg w-2/3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Add a task"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-colors"
          >
            ADD
          </button>
        </form>

        {/* Filters */}
        <div className="mb-6 flex gap-4 justify-center">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="complete">Completed</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="p-2 border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Filtered Task List */}
        <ul className="space-y-4">
          {filteredTasks.map((task) => (
            <li
              key={task._id}
              className="p-4 bg-white rounded-xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-pink-100 transition duration-300"
            >
              <div className="flex-1">
                <span className="text-lg font-semibold">{task.text}</span>
                <p className="text-sm text-gray-500">
                  Status: {task.status} | Priority: {task.priority}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateTasksStatus(task._id, task.status)}
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full transition-colors"
                >
                  {task.status === "pending" ? "Mark Done" : "Undo"}
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full transition-colors"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>

      <footer className="bg-orange-500 text-white p-4 mt-auto text-center shadow-inner">
        © 2026 Your To Do App
      </footer>
    </div>
  );

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={token ? <MainApp /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}
