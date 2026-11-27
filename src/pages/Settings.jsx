import { Link } from "react-router-dom";
import { FiSettings, FiKey, FiChevronLeft } from "react-icons/fi";
import Navbar from "../components/Navbar";
import "../styles/Settings.css";


const SECTIONS = [
  {
    title: "Security",
    items: [
      {
        to: "/change-password",
        icon: FiKey,
        title: "change password",
        text: "Update your account password to keep it secure.",
      },
    ],
  },
];

export default function Settings() {
  return (
    <div className="set-wrap" dir="rtl">
      <Navbar />

      <main className="set-page">
        <section className="set-card">
          <header className="set-head">
            <span className="set-icon">
              <FiSettings size={24} />
            </span>
            <div>
              <h1 className="set-title">Settings</h1>
              <p className="set-sub">Manage your account settings</p>
            </div>
          </header>

          {SECTIONS.map((section) => (
            <div className="set-section" key={section.title}>
              <h2 className="set-section__title">{section.title}</h2>

              <ul className="set-list">
                {section.items.map(({ to, icon: IconComp, title, text }) => (
                  <li key={to}>
                    <Link className="set-item" to={to}>
                      <span className="set-item__icon">
                        <IconComp size={20} />
                      </span>
                      <span className="set-item__body">
                        <strong>{title}</strong>
                        <small>{text}</small>
                      </span>
                      <FiChevronLeft className="set-item__arrow" size={18} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
