import "./layout.scss";
import Navbar from "../../components/Navbar/Navbar";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { isSeller } from "../../lib/authz";

function Layout() {
  return (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

function RequireAuth() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) return <Navigate to="/login" />;
  return <Outlet />;
}

function RequireSeller() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) return <Navigate to="/login" />;
  if (!isSeller(currentUser)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export { Layout, RequireAuth, RequireSeller };
