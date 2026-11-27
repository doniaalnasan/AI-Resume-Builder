
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { renderAsync } from "docx-preview";
import { FiArrowRight, FiDownload, FiFileText } from "react-icons/fi";
import Navbar from "../components/Navbar";
import { cvApi } from "../api/cvApi";
import { mapResume } from "../api/cvMappers";
import "../styles/CVPreview.css";

const EXTENSIONS = { pdf: ".pdf", docx: ".docx", other: "" };

const detectKind = (blob, resume) => {
    const type = (blob.type || "").toLowerCase();

    if (type.includes("pdf")) return "pdf";
    if (type.includes("wordprocessingml")) return "docx";

    const name = [
        resume?.original_name,
        resume?.file_name,
        resume?.filename,
    ].find(Boolean) ?? "";

    if (/\.pdf$/i.test(name)) return "pdf";
    if (/\.docx$/i.test(name)) return "docx";

    return "other";
};

function Viewer({ id, shareToken }) {
    const navigate = useNavigate();
    const docxRef = useRef(null);

    const isShared = Boolean(shareToken);

    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");
    const [cv, setCv] = useState(null);

    useEffect(() => {
        let ignore = false;
        let objectUrl = "";

        const loadCv = async () => {
            try {
                const [details, file] = await Promise.all([
                    isShared
                        ? cvApi.sharedResume(shareToken)
                        : cvApi.get(id),

                    isShared
                        ? cvApi.sharedFileBlob(shareToken)
                        : cvApi.fileBlob(id),
                ]);

                if (ignore) return;

                const responseData =
                    details?.data?.data ??
                    details?.data ??
                    details;

                const resume =
                    responseData?.resume ??
                    responseData;

                const kind = detectKind(file, resume);

                const blob =
                    kind === "pdf" && !file.type.includes("pdf")
                        ? new Blob([file], {
                            type: "application/pdf",
                        })
                        : file;

                objectUrl = URL.createObjectURL(blob);

                setCv({
                    title: mapResume(resume).title,
                    blob,
                    url: objectUrl,
                    kind,
                });

                setStatus("ready");

            } catch (err) {
                if (ignore) return;

                if (!isShared && err.status === 401) {
                    navigate("/login", { replace: true });
                    return;
                }

                setError(
                    err.status === 404
                        ? "This share link is invalid, expired, or revoked."
                        : err.message || "Failed to load the CV."
                );

                setStatus("error");
            }
        };

        loadCv();

        return () => {
            ignore = true;

            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [id, shareToken, isShared, navigate]);

    useEffect(() => {
        if (
            status !== "ready" ||
            cv?.kind !== "docx" ||
            !docxRef.current
        ) return;

        let ignore = false;
        const container = docxRef.current;

        renderAsync(cv.blob, container, undefined, {
            breakPages: true,
        }).catch((err) => {
            if (ignore) return;

            console.error("DOCX rendering error:", err);
            setError("Could not display this Word document.");
            setStatus("error");
        });

        return () => {
            ignore = true;
            container.innerHTML = "";
        };
    }, [status, cv]);

    return (
        <div className="cvp">
            {!isShared && <Navbar />}

            <main className="cvp__container" dir="rtl">

                <header className="cvp__bar">

                    {!isShared ? (
                        <button
                            type="button"
                            className="cvp__back"
                            onClick={() => navigate("/dashboard")}
                        >
                            <FiArrowRight size={16} />
                            Back to Dashboard
                        </button>
                    ) : (
                        <span />
                    )}

                    <h1
                        className="cvp__title"
                        dir="auto"
                        title={cv?.title}
                    >
                        {cv?.title ?? "My CV"}
                    </h1>

                    {cv ? (
                        <a
                            className="cvp__download"
                            href={cv.url}
                            download={`${cv.title}${EXTENSIONS[cv.kind]}`}
                        >
                            <FiDownload size={16} />
                            Download
                        </a>
                    ) : (
                        <span />
                    )}

                </header>

                {status === "loading" && (
                    <p className="cvp__state">Loading CV...</p>
                )}

                {status === "error" && (
                    <p className="cvp__state cvp__state--error">
                        {error}
                    </p>
                )}

                {status === "ready" && cv.kind === "pdf" && (
                    <iframe
                        className="cvp__frame"
                        src={cv.url}
                        title={`${cv.title} preview`}
                    />
                )}

                {status === "ready" && cv.kind === "docx" && (
                    <div
                        ref={docxRef}
                        className="cvp__docx"
                    />
                )}

                {status === "ready" && cv.kind === "other" && (
                    <div className="cvp__state">
                        <FiFileText size={32} />
                        <p>This file format cannot be previewed.</p>
                        <p>Please download the file instead.</p>
                    </div>
                )}

            </main>
        </div>
    );
}

export default function CVPreview() {
    const { id, shareToken } = useParams();

    return (
        <Viewer
            key={shareToken || id}
            id={id}
            shareToken={shareToken}
        />
    );
}
