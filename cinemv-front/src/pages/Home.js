import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { AuthContext } from "../context/AuthContext";

function Home() {
  return (
    <div className="Home">
      <h1>Hello world</h1>
    </div>
  );
}

export default Home;
