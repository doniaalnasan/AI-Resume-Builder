
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { FiLock, FiMail, FiArrowLeft } from "react-icons/fi";

import "../styles/Login.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

    if (!email || !password) {
        return;
    }

    // Mock Login
    navigate("/dashboard");
    };

    return (
    <div className="container">
        <form className="loginForm" onSubmit={handleSubmit}>

        <div className="welcome">
            <div>
                <h3>تسجيل الدخول</h3>
                <h4>
                    أهلاً بعودتك، سجّل دخولك لإدارة سيرك الذاتية
                </h4>
            </div>

        <FiLock size={24} />
        </div>

        <div className="form">

            <label htmlFor="email">البريد الإلكتروني</label>

        <div className="inputGroup">
            <FiMail />
            <input
                id="email"
                type="email"
                placeholder="أدخل البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
        </div>

        <label htmlFor="password">كلمة المرور</label>

        <div className="inputGroup">
            <FiLock />
            <input
                id="password"
                type="password"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
        </div>

        <div className="loginOptions">
            <label>
                <input type="checkbox" />
                تذكرني
            </label>

            <Link to="/forgot-password">نسيت كلمة المرور؟</Link>
        </div>

        <button type="submit">
            <span>تسجيل الدخول</span>
            <FiArrowLeft size={18} />
        </button>

        </div>

        <div className="divider">
          <span></span>
          <p>أو</p>
          <span></span>
        </div>

        <div className="signup">
          <p>
            ليس لديك حساب؟
            <span> إنشاء حساب جديد</span>
          </p>
        </div>

      </form>
    </div>
  );
}

export default Login;
