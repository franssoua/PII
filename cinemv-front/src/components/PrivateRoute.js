//Composant utilisé pour restreindre l'accès à certaines routes aux seuls administrateurs
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (user === null) {
    return null; 
  }

  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;
