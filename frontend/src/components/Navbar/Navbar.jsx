import { useContext, useEffect, useState } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notficationStore";
import { getUserRole, isSeller } from "../../lib/authz";
function Navbar() {
  const [open, setOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const isSellerUser = isSeller(currentUser);
  const roleLabel = getUserRole(currentUser) || "BUYER";

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  useEffect(() => {
    if (currentUser) fetch();
  }, [currentUser, fetch]);
  
  return (
    <nav>
      <div className="left">
        <a href="/" className="logo">
          <img src="/logo.png" alt="" />
          <span>Plotzo</span>
        </a>
        <Link to="/">Home</Link>
        <Link to="aboutus">About</Link>
        <Link to="listings">Listings</Link>
        <Link to="contact">Contact</Link>
      </div>
      <div className="right">
        {currentUser ? (
          <div className="user">
            <img src={currentUser.avatar || "/noavatar.jpg"} alt="" />
            <span>{currentUser.username}</span>
            <span className={`roleBadge ${isSellerUser ? "seller" : "buyer"}`}>
              {roleLabel}
            </span>
            {isSellerUser && (
              <Link to="/add" className="addPropertyLink">
                Add Property
              </Link>
            )}
            <Link to="/profile" className="profile">
              {number > 0 && <div className="notification">{number}</div>}
              <span>Profile</span>
            </Link>
          </div>
        ) : (
          <>
            <Link to="/login">Sign in</Link>
            <Link to="/register" className="register">
              Sign up
            </Link>
          </>
        )}
        <div className="menuIcon">
          <img
            src="/menu.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        <div className={open ? "menu active" : "menu"}>
          <Link to="/">Home</Link>
          <Link to="aboutus">About</Link>
          <Link to="listings">Listings</Link>
          <Link to="contact">Contact</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/disclaimer">Disclaimer</Link>
          {isSellerUser && <Link to="/add">Add Property</Link>}
          {!currentUser && <Link to="/login">Sign in</Link>}
          {!currentUser && <Link to="/register">Sign up</Link>}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
