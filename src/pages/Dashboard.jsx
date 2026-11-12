import Navbar from "../components/Navbar";  
import { useNavigate } from "react-router-dom";
import Cvimages from "../assets/photo_cv .png";
import Str_cv from "../assets/structure-cv.png";
import { FiPlus,  FiCalendar,  FiEye,  FiShare2,} from "react-icons/fi";

import "../styles/Dashboard.css";

const SAMPLE_CVS = [
    { id: 1, title: "CV - أحمد سمور", updatedAt: "2026-11-08" },
    { id: 2, title: "CV - Product Designer", updatedAt: "2026-11-08" },
    { id: 3, title: "CV - Front-End Developer", updatedAt: "2026-11-08" },
];

const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("ar-u-nu-latn", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

export default function MyCVs({ cvs = SAMPLE_CVS, onAdd, onView, onShare }) {
    const navigate = useNavigate();

    const handleAdd = () => (onAdd ? onAdd() : navigate("/create-cv"));
    const handleView = (cv) => (onView ? onView(cv) : navigate(`/cv/${cv.id}`));
    const handleShare = (cv) => {
    if (onShare) return onShare(cv);
    navigator.clipboard?.writeText(`${window.location.origin}/cv/${cv.id}`);
};

    return (
    <main className="cvs" dir="rtl">
    <div className="cvs__container">
        <Navbar />
        {/* ---------- Hero ---------- */}
        <section className="cvs__hero">
        <div className="cvs__hero-text">
            <h1>السير الذاتية الخاصة بي</h1>
            <p>إدارة السير الذاتية الخاصة بك، عرضها، ومشاركتها بسهولة.</p>
            <button type="button" className="cvs__add" onClick={handleAdd}>
                <FiPlus size={18} />
                إضافة CV جديد
            </button>
        </div>

        <div className="cvs__images">
            <img src={Cvimages} alt="CV Art" />
        </div>
        </section>

        {/* ---------- Cards ---------- */}
        <section className="cvs__grid" aria-label="قائمة السير الذاتية">
            {cvs.map((cv) => (
            <article key={cv.id} className="cvs__card">
            <div className="cvs__card-icon">
                <img src={Str_cv} alt="CV Icon" />
            </div>

            <h2 className="cvs__card-title" dir="auto">
                {cv.title}
            </h2>

            <p className="cvs__card-date">
                <FiCalendar size={15} />
                آخر تعديل: {formatDate(cv.updatedAt)}
            </p>

            <div className="cvs__card-actions">
                <button
                    type="button"
                    className="cvs__btn cvs__btn--primary"
                    onClick={() => handleView(cv)}
                >
                <FiEye size={16} />
                عرض
                </button>
                <button
                    type="button"
                    className="cvs__btn cvs__btn--outline"
                    onClick={() => handleShare(cv)}
                >
                    <FiShare2 size={16} />
                    مشاركة
                </button>
            </div>
            </article>
        ))}
        </section>
    </div>
    </main>
);
}