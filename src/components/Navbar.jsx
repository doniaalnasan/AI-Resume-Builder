
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {  FiHome,  FiLayers,  FiGrid,  FiFileText,  FiLogIn,  FiMenu } from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";
import "../styles/Navbar.css";

const DEFAULT_LINKS = [
  { to: "/dashboard", label: "الرئيسية", icon: FiHome, end: true },
  { to: "/create-cv", label: "السير الذاتية الخاصة بي", icon: FiLayers },
  { to: "/templates", label: "القوالب", icon: FiGrid },
  { to: "/ai-suggestions", label: "اقتراحات الذكاء الاصطناعي", icon: LuSparkles },
];

export default function Navbar({
  brand = "AI Resume Builder",
  loginTo = "/login",
}) {
  const [navOpen, setNavOpen] = useState(false);

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
          aria-label="القائمة"
          aria-expanded={navOpen}
          onClick={() => setNavOpen((v) => !v)}
        >
          <FiMenu size={22} />
        </button>

        <nav
          className={`nb__nav ${navOpen ? "is-open" : ""}`}
          aria-label="التنقل الرئيسي"
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

        <div className="nb__auth">
          <Link className="nb__login" to={loginTo}>
            <FiLogIn size={18} />
            تسجيل الدخول
          </Link>
        </div>

      </div>
    </header>
  );
}
