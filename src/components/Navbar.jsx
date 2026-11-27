import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiHome, FiLayers, FiFileText, FiLogIn, FiLogOut, FiMenu, FiUser, FiSettings } from "react-icons/fi";
import { authApi } from "../api/authApi";
import { tokenStore } from "../api/client";
import "../styles/Navbar.css";

const DEFAULT_LINKS = [
  { to: "/dashboard", label: "Home", icon: FiHome, end: true },
  { to: "/create-cv", label: "My CV", icon: FiLayers },
];


let cachedUser = null;

export default function Navbar({
  brand = "AI Resume Builder",
  loginTo = "/login",
}) {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const [navOpen, setNavOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(cachedUser);

  const isLoggedIn = !!tokenStore.get();

  // Retrieve user data
  useEffect(() => {
    if (!isLoggedIn || cachedUser) return;

    let ignore = false;
    authApi
      .getProfile()
      .then((res) => {
        cachedUser = res?.data ?? null;
        if (!ignore) setUser(cachedUser);
      })
      .catch((err) => {
        if (err.status === 401) navigate("/login", { replace: true });
      });

    return () => {
      ignore = true;
    };
  }, [isLoggedIn, navigate]);

  
  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
        await authApi.logout();
    } finally {
        cachedUser = null;
        setUser(null);
        setMenuOpen(false);
        navigate("/login", { replace: true });
    }
};
  return (
    <header className="nb" dir="rtl">
      <div className="nb__inner">
        <Link className="nb__brand" to="/">
          <span className="nb__brand-icon">
            <FiFileText size={24} />
          </span>
          <span className="nb__brand-text" dir="ltr">
            {brand}
          </span>
        </Link>

        <button
          type="button"
          className="nb__burger"
          aria-label="Menu"
          aria-expanded={navOpen}
          onClick={() => setNavOpen((v) => !v)}
        >
          <FiMenu size={22} />
        </button>

        <nav
          className={`nb__nav ${navOpen ? "is-open" : ""}`}
          aria-label="Main navigation "
        >
          {DEFAULT_LINKS.map(({ to, label, icon: IconComp, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setNavOpen(false)}
              className={({ isActive }) =>
                `nb__link ${isActive ? "is-active" : ""}`
              }
            >
              <IconComp size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="nb__auth" ref={menuRef}>
          {isLoggedIn ? (
            <>
              <button
                type="button"
                className="nb__user"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
              >
                <span className="nb__avatar">
                  <FiUser size={18} />
                </span>
                <span className="nb__user-name">{user?.name ?? "..."}</span>
              </button>

              {menuOpen && (
                <div className="nb__menu" role="menu">
                  {user?.email && (
                    <p className="nb__menu-email" dir="ltr">
                      {user.email}
                    </p>
                  )}
                  <Link
                    to="/settings"
                    role="menuitem"
                    className="nb__menu-item nb__menu-item--link"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FiSettings size={16} />
                    الإعدادات
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    className="nb__menu-item"
                    onClick={handleLogout}
                  >
                    <FiLogOut size={16} />
                    Log out
                  </button>
                  
                </div>
              )}
            </>
          ) : (
            <Link className="nb__login" to={loginTo}>
              <FiLogIn size={18} />
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}