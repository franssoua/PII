import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { isAuthenticated } from "./utils/auth";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div>
          <h1>My Movie App</h1>
          {loggedIn ? (
            <p>Vous êtes connecté waw ✅</p>
          ) : (
            <p>Veuillez vous connecter.</p>
          )}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
