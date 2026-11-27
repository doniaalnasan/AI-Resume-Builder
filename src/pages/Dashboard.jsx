
import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ShareDialog from "../components/ShareDialog";
import Cvimages from "../assets/photo_cv .png";
import Str_cv from "../assets/structure-cv.png";
import { FiPlus, FiCalendar, FiEye, FiShare2, FiMoreVertical, FiTrash2, FiEdit2} from "react-icons/fi";
import { cvApi } from "../api/cvApi";
import { extractList, mapResume, extractShareUrl } from "../api/cvMappers";
import "../styles/Dashboard.css";

const formatDate = (iso) => {
    if (!iso) return "";

    const date = new Date(iso);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

export default function MyCVs() {
    const navigate = useNavigate();

    const [cvs, setCvs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);
    const [busyId, setBusyId] = useState(null);
    const [shareTarget, setShareTarget] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    // Handling login expiration
    const handleAuthError = useCallback(
        (err) => {
            if (err.status === 401) {
                navigate("/login", { replace: true });
                return true;
            }

            return false;
        },
        [navigate]
    );

    // Fetching resumes
    useEffect(() => {
        let ignore = false;

        const fetchCvs = async () => {
            try {
                const res = await cvApi.list({ perPage: 50 });

                if (!ignore) {
                    setCvs(extractList(res).map(mapResume));
                }
            } catch (err) {
                if (!ignore && !handleAuthError(err)) {
                    setError(err.message);
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        fetchCvs();

        return () => {
            ignore = true;
        };
    }, [handleAuthError, reloadKey]);

    // Reload the list of resumes

    const handleRetry = () => {
        setError("");
        setLoading(true);
        setReloadKey((k) => k + 1);
    };

    // Add a resume and open the CV file selection window
    const handleAdd = () => {
        fileInputRef.current?.click();
    };

    // upload CV
    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const allowedExtensions = /\.(pdf|doc|docx)$/i;

        if (!allowedExtensions.test(file.name)) {
            setError("Please select a PDF or Word file.");
            e.target.value = "";
            return;
        }

        setUploading(true);
        setError("");

        try {
            const title = file.name.replace(/\.(pdf|doc|docx)$/i, "");

            await cvApi.upload({
                title,
                file,
            });

            setReloadKey((key) => key + 1);
        } catch (err) {
            if (!handleAuthError(err)) {
                setError(err.message || "Failed to upload CV.");
            }
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    // view cv
    const handleView = (cv) => navigate(`/cv/${cv.id}`);

    // delete cv
    const handleDelete = async (cv) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${cv.title}"?`
        );

        if (!confirmed) return;

        setBusyId(cv.id);
        setError("");
        setOpenMenuId(null);

        try {
            await cvApi.remove(cv.id);

            setCvs((prev) =>
                prev.filter((item) => item.id !== cv.id)
            );
        } catch (err) {
            if (!handleAuthError(err)) {
                setError(err.message || "Failed to delete CV.");
            }
        } finally {
            setBusyId(null);
        }
    };

    // share cv
    const handleShare = async (cv) => {
        setBusyId(cv.id);
        setError("");

        try {
            const res = await cvApi.share(cv.id);
            const url = extractShareUrl(res);

            if (!url) {
                throw new Error("No share URL was returned.");
            }

            setShareTarget({
                url,
                title: cv.title,
            });
        } catch (err) {
            if (!handleAuthError(err)) {
                setError(err.message);
            }
        } finally {
            setBusyId(null);
        }
    };

    return (
        <main className="cvs" dir="rtl">
            <Navbar />
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                hidden
                onChange={handleFileUpload}
            />
            <div className="cvs__container">

                {/* Hero */}
                <section className="cvs__hero">
                    <div className="cvs__hero-text">
                        <h1>My CV</h1>

                        <p>
                            Manage, view, and share your resumes with ease.
                        </p>

                        <button
                            type="button"
                            className="cvs__add"
                            onClick={handleAdd}
                            disabled={uploading}
                        >
                            <FiPlus size={18} />
                            {uploading ? "Uploading..." : "Add a new CV"}
                        </button>
                    </div>

                    <div className="cvs__images">
                        <img src={Cvimages} alt="CV Art" />
                    </div>
                </section>

                {error && (
                    <p
                        className="cvs__alert cvs__alert--error"
                        role="alert"
                    >
                        {error}

                        <button
                            type="button"
                            className="cvs__retry"
                            onClick={handleRetry}
                        >
                            Retry
                        </button>
                    </p>
                )}

                {/* CV Cards */}
                {loading ? (
                    <p className="cvs__status">
                        Loading your CVs...
                    </p>
                ) : cvs.length === 0 && !error ? (
                    <p className="cvs__status">
                        You haven't uploaded any CVs yet.
                        Click Add a new CV to get started.
                    </p>
                ) : (
                    <section
                        className="cvs__grid"
                        aria-label="List of biographies"
                    >
                        {cvs.map((cv) => (
                            <article
                                key={cv.id}
                                className="cvs__card"
                            >

                                {/* Three dots menu */}
                                <div className="cvs__menu-wrapper">
                                    <button
                                        type="button"
                                        className="cvs__menu-trigger"
                                        aria-label="CV options"
                                        aria-expanded={openMenuId === cv.id}
                                        onClick={() =>
                                            setOpenMenuId(
                                                openMenuId === cv.id
                                                    ? null
                                                    : cv.id
                                            )
                                        }
                                        disabled={busyId === cv.id}
                                    >
                                        <FiMoreVertical size={20} />
                                    </button>

                                    {openMenuId === cv.id && (
                                        <div className="cvs__dropdown">
                                            <button
                                                type="button"
                                                className="cvs__delete-option"
                                                onClick={() => handleDelete(cv)}
                                            >
                                                <FiTrash2 size={16} />
                                                Delete CV
                                            </button>

                                            <button
                                                type="button"
                                                className="cvs__edit-option"
                                                onClick={() => {
                                                    setOpenMenuId(null);
                                                    navigate(`/create-cv/${cv.id}`);
                                                }}
                                            >
                                                <FiEdit2 size={16} />
                                                Edit CV
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="cvs__card-icon">
                                    <img
                                        src={Str_cv}
                                        alt="CV Icon"
                                    />
                                </div>

                                <h2
                                    className="cvs__card-title"
                                    dir="auto"
                                >
                                    {cv.title}
                                </h2>

                                {cv.updatedAt && (
                                    <p className="cvs__card-date">
                                        <FiCalendar size={15} />
                                        Last edit: {formatDate(cv.updatedAt)}
                                    </p>
                                )}

                                {/* Card Actions */}
                                <div className="cvs__card-actions">
                                    <button
                                        type="button"
                                        className="cvs__btn cvs__btn--primary"
                                        onClick={() => handleView(cv)}
                                    >
                                        <FiEye size={16} />
                                        View
                                    </button>

                                    <button
                                        type="button"
                                        className="cvs__btn cvs__btn--outline"
                                        onClick={() => handleShare(cv)}
                                        disabled={busyId === cv.id}
                                    >
                                        <FiShare2 size={16} />
                                        Share
                                    </button>
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </div>

            {/* Share */}
            {shareTarget && (
                <ShareDialog
                    url={shareTarget.url}
                    title={shareTarget.title}
                    onClose={() => setShareTarget(null)}
                />
            )}
        </main>
    );
}
