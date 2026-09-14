import React, { useContext, useEffect, useState } from "react";
import logo from "/notes.png";
import "./navbar.css";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useOutsideClick } from "../../hooks/useOutsideClick";

const DEFAULT_PROFILE_IMAGE =
  "https://res.cloudinary.com/dqlasoiaw/image/upload/v1686688962/tech-social/blank-profile-picture-973460_1280_d1qnjd.png";

const getSafeImageSrc = (value) => {
  if (typeof value !== "string" || value.trim() === "") return null;

  try {
    const parsed = new URL(value, window.location.origin);
    const isHttp = parsed.protocol === "http:" || parsed.protocol === "https:";
    const isRelative = value.startsWith("/");

    return isHttp || isRelative ? parsed.href : null;
  } catch {
    return null;
  }
};

const Navbar = () => {
  const { user, logOut, query, setQuery } = useContext(AuthContext);

  const [showProfile, setShowProfile] = useState(false);

  const userData = JSON.parse(localStorage.getItem("user"));

  console.log(userData);

  const navigate = useNavigate();

  const navbarNode = useOutsideClick(() => setShowProfile(false));
  const profileImageSrc =
    getSafeImageSrc(user?.photoURL) ||
    getSafeImageSrc(userData?.photoURL) ||
    DEFAULT_PROFILE_IMAGE;

  return (
    <div className="navbar">
      <nav>
        <div className="left-nav">
          <img src={logo} alt="logo" />
          <h2>Note Zone</h2>
        </div>
        <div className="middle-nav">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search notes"
              value={query}
              onClick={() => navigate("/search")}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query.trim() === "" ? (
              <i className="fa-solid fa-magnifying-glass"></i>
            ) : (
              <i className="fa-solid fa-xmark" onClick={() => setQuery("")}></i>
            )}
          </div>
        </div>
        <div className="right-nav">
          <div className="profile-image-container">
            <img
              src={profileImageSrc}
              alt={user?.displayName}
              onClick={(e) => {
                e.stopPropagation();
                setShowProfile(!showProfile);
              }}
            />
            {showProfile && (
              <div className="profile-logout-modal" ref={navbarNode}>
                <div onClick={() => navigate("/profile")}>Profile</div>
                <div
                  onClick={() => {
                    logOut();
                    toast.success("Logged out!");
                  }}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
