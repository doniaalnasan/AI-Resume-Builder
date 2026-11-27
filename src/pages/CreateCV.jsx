import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/CreateCV.css";
import AiSuggestion from "./AISuggestions";
import Navbar from "../components/Navbar";
import { cvApi } from "../api/cvApi";
import { extractResumeId, extractShareUrl } from "../api/cvMappers";

// ================= icon =================

const Icon = ({ children, size = 20 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        {children}
    </svg>
);

const UploadCloudIcon = (p) => (
    <Icon {...p}>
        <path d="M16 16l-4-4-4 4M12 12v9" />
        <path d="M20.4 18.1A5 5 0 0018 9h-1.3A8 8 0 104 16.3" />
    </Icon>
);

const UserIcon = (p) => (
    <Icon {...p}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0116 0" />
    </Icon>
);

const MailIcon = (p) => (
    <Icon {...p}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
    </Icon>
);

const PhoneIcon = (p) => (
    <Icon {...p}>
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
    </Icon>
);

const BriefcaseIcon = (p) => (
    <Icon {...p}>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18" />
    </Icon>
);

const SparkIcon = (p) => (
    <Icon {...p}>
        <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
    </Icon>
);

const EditIcon = (p) => (
    <Icon {...p}>
        <path d="M4 20h4L19 9l-4-4L4 16v4z" />
        <path d="M13.5 6.5l4 4" />
    </Icon>
);

const LayersIcon = (p) => (
    <Icon {...p}>
        <path d="M12 3l9 5-9 5-9-5 9-5z" />
        <path d="M3 13l9 5 9-5" />
    </Icon>
);

const LinkIcon = (p) => (
    <Icon {...p}>
        <path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1" />
        <path d="M14 10a4 4 0 00-5.7 0l-3 3A4 4 0 0011 18.7l1-1" />
    </Icon>
);

const CheckIcon = (p) => (
    <Icon {...p}>
        <path d="M5 12l5 5L20 7" />
    </Icon>
);

const CopyIcon = (p) => (
    <Icon {...p}>
        <rect x="9" y="9" width="11" height="11" rx="2" />
        <path d="M5 15V6a2 2 0 012-2h9" />
    </Icon>
);

const CloseIcon = (p) => (
    <Icon {...p}>
        <path d="M6 6l12 12M18 6L6 18" />
    </Icon>
);



// ================= data form =================

const emptyForm = {
    fullName: "",
    email: "",
    phone: "",
    jobTitle: "",
    skills: [],
    summary: "",
};

const mapProfileDraft = (profile) => ({
    fullName: profile?.full_name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    jobTitle: profile?.job_title || "",
    skills: Array.isArray(profile?.skills)
        ? profile.skills
        : [],
    summary: profile?.professional_summary || "",
});


export default function CvBuilder() {
    
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const fileInputRef = useRef(null);

    const [form, setForm] = useState(emptyForm);
    const [skillInput, setSkillInput] = useState("");
    const [fileName, setFileName] = useState("");
    const [dragging, setDragging] = useState(false);

    const [uploading, setUploading] = useState(false);
    const [approving, setApproving] = useState(false);

    const [uploadMsg, setUploadMsg] = useState(null);
    const [resumeId, setResumeId] = useState(null);

    const [aiRecommendations, setAiRecommendations] = useState(null);
    const [recommendationsError, setRecommendationsError] = useState("");

    const [shareUrl, setShareUrl] = useState("");
    const [showShare, setShowShare] = useState(false);
    const [copied, setCopied] = useState(false);

    const [view, setView] = useState(null);
    const [loadingCV, setLoadingCV] = useState(false);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);

    


    useEffect(() => {
    if (!id) return;

    const loadCV = async () => {
        setLoadingCV(true);
        setUploadMsg(null);

        try {
            const response = await cvApi.get(id);

            const resume = response?.data;
            const profile = resume?.profile_draft;

            if (!resume) {
                throw new Error("CV data was not found.");
            }

            // Save the current CV ID
            setResumeId(resume.id);

            // Set the original file name
            setFileName(resume.original_name || "");

            // Fill the form fields
            setForm(mapProfileDraft(profile));

            setUploadMsg({
                type: "success",
                text: "CV loaded successfully. You can now edit your details.",
            });

        } catch (error) {
            console.error("Load CV Error:", error);

            setUploadMsg({
                type: "error",
                text: error.message || "Unable to load CV details.",
            });
        } finally {
            setLoadingCV(false);
        }
    };

    loadCV();
}, [id]);


    const uploadFile = async (file) => {
        if (!file) return;

        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        const allowedExtensions = /\.(pdf|doc|docx)$/i;

        if (
            (!allowedTypes.includes(file.type) && !allowedExtensions.test(file.name)) ||
            file.size > 10 * 1024 * 1024
    ) {
            setUploadMsg({
                type: "error",
                text: "The file must be PDF or Word and its size must not exceed 10 MB",
        });
            return;
        }

        setUploading(true);
        setUploadMsg(null);
        setFileName(file.name);
        setResumeId(null);
        setAiRecommendations(null);
        setRecommendationsError("");
        setShareUrl("");
        setShowShare(false);
        setForm({ ...emptyForm });

        try {
            const uploadResponse = await cvApi.upload({
                title: file.name.replace(/\.[^/.]+$/, ""),
                file,
            });

            const id = extractResumeId(uploadResponse);

            if (!id) {
                throw new Error(
                    "The file has been uploaded, but the resume number could not be found."
                );
            }

            setResumeId(id);

            //  Request a Groq key
            const groqKey = prompt(
                "Enter your Groq API Key to analyze the resume:"
            );

            if (!groqKey?.trim()) {
                setUploadMsg({
                    type: "error",
                    text: "The file has been uploaded, but the analysis was not performed because the key was not entered.",
                });
                return;
            }

        // Resume Analysis
            setUploadMsg({
                type: "success",
                text: "The file has been uploaded; the resume is being analyzed...",
            });

            const analysisResponse = await cvApi.analyze(
                id,
                groqKey.trim()
            );

            const profile = analysisResponse?.data?.profile_draft;

            if (profile) {
                setForm(mapProfileDraft(profile));
            }

            //  Fetch recommendations once
            try {
                const recommendationsResponse = await cvApi.recommend(
                    id,
                    profile?.job_title || "",
                    groqKey.trim()
                );

                const recommendations =
                    recommendationsResponse?.data?.recommendations;

                if (!recommendations) {
                    throw new Error(
                        "Recommendation data was not received from the server."
                    );
                }

                setAiRecommendations(recommendations);
                setRecommendationsError("");

                setUploadMsg({
                    type: "success",
                    text: "The resume has been uploaded and analyzed, and recommendations have been successfully retrieved.",
                });
            } catch (error) {
                setRecommendationsError(
                    error.message || "Unable to load AI recommendations"
                );

                setUploadMsg({
                    type: "success",
                    text: "The resume was analyzed, but the recommendations could not be loaded.",
                });
            }
        } catch (error) {
            console.error("CV Upload/Analysis Error:", error);

            setUploadMsg({
                type: "error",
                text: error.message || "An error occurred while uploading or parsing the resume.",
            });
        } finally {
            setUploading(false);
        }
    };


    const onFileChange = (e) => {
        uploadFile(e.target.files?.[0]);
        e.target.value = "";
    };

    const onDrop = (e) => {
        e.preventDefault();
        setDragging(false);

        uploadFile(e.dataTransfer.files?.[0]);
    };

// =============== handled with cv ===============

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const addSkill = (value) => {
        const skill = value.trim();

        if (!skill || form.skills.includes(skill)) return;

        setForm((current) => ({
            ...current,
            skills: [...current.skills, skill],
        }));
    };

    const removeSkill = (skill) => {
        setForm((current) => ({
            ...current,
            skills: current.skills.filter((item) => item !== skill),
        }));
    };

    const onSkillKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addSkill(skillInput);
            setSkillInput("");
        } else if (
            e.key === "Backspace" &&
            !skillInput &&
            form.skills.length
        ) {
            removeSkill(form.skills[form.skills.length - 1]);
        }
    };

    // ================= Finalizing the resume and creating a shareable link=================

    
const approveCv = async () => {
    if (!resumeId) {
        setUploadMsg({
            type: "error",
            text: "Upload your resume first.",
        });
        return;
    }

    setApproving(true);
    setUploadMsg(null);

    try {
        await cvApi.update(resumeId, {
            title:
                form.jobTitle ||
                fileName.replace(/\.[^/.]+$/, ""),
        });

        const response = await cvApi.share(resumeId);

        const apiShareUrl = extractShareUrl(response);

            if (!apiShareUrl) {
                throw new Error(
                    "The share link was not found in the server response."
                );
            }

            const shareToken = apiShareUrl
                .split("/")
                .filter(Boolean)
                .pop();

                const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

                const url = `${window.location.origin}${basePath}/shared-cv/${encodeURIComponent(shareToken)}`;
                
                setShareUrl(url);
                setCopied(false);
                setShowShare(true);

                setUploadMsg({
                    type: "success",
                    text: "The sharing link has been created successfully.",
                });

            } catch (error) {
                console.error("Approve CV Error:", error);

                setUploadMsg({
                    type: "error",
                    text: error.message ||
                    "An error occurred while approving the resume.",
                });
    } finally {
                setApproving(false);
    }
        };


    // ================= copy link share =================

    const copyLink = async () => {
        if (!shareUrl) return;

        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);

        } catch (error) {
            console.error("Copy Link Error:", error);
            setUploadMsg({
                type: "error",
                text: "Unable to copy the link",
            });
        }
    };

    // ================= AI Suggestions =================

    const getCurrentValue = (type) => {
        if (type === "title") return form.jobTitle;
        if (type === "summary") return form.summary;
        if (type === "skills") return form.skills.join(", ");

        return "";
    };

    const applySuggestion = (type, value) => {
        setForm((current) => {
            if (type === "title") {
                return {
                    ...current,
                    jobTitle: value,
                };
            }

            if (type === "summary") {
                return {
                    ...current,
                    summary: value,
                };
            }

            if (type === "skills") {
                const skills = [
                    ...new Set(
                        value
                            .split(/[,،\n]/)
                            .map((item) => item.trim())
                            .filter(Boolean)
                    ),
                ];

                return {
                    ...current,
                    skills,
                };
            }

            return current;
        });

        setUploadMsg({
            type: "success",
            text: "The suggestion has been applied to your data.",
        });

        setView(null);
    };

    const openSuggestion = async (type) => {
    if (!resumeId) return;

    // If recommendations already exist, open directly
    if (aiRecommendations) {
        setView(type);
        return;
    }

    const groqKey = prompt(
        "Enter your Groq API Key to generate CV recommendations:"
    );

    if (!groqKey?.trim()) return;

    setLoadingRecommendations(true);
    setRecommendationsError("");

    try {
        const response = await cvApi.recommend(
            resumeId,
            form.jobTitle || "",
            groqKey.trim()
        );

        const recommendations =
            response?.data?.recommendations;

        if (!recommendations) {
            throw new Error("No AI recommendations were received.");
        }

        setAiRecommendations(recommendations);
        setView(type);

    } catch (error) {
        console.error("AI Recommendations Error:", error);

        setRecommendationsError(
            error.message || "Unable to generate recommendations."
        );

        setView(type);

    } finally {
        setLoadingRecommendations(false);
    }
};




    const suggestions = [
        {
            type: "title",
            icon: <BriefcaseIcon />,
            title: "Job Title Optimization",
            text: "Proposing a more professional and market-aligned version.",
        },
        {
            type: "summary",
            icon: <EditIcon />,
            title: "Rewriting the summary/abstract",
            text: "Optimize your summary to highlight your experience and professional value.",
        },
        {
            type: "skills",
            icon: <LayersIcon />,
            title: "Adding suggested skills",
            text: "Suggesting skills relevant to your field and target job.",
        },
    ];

    // ================= page AI =================

    if (view) {
        return (
            <AiSuggestion
                key={view}
                type={view}
                resumeId={resumeId}
                targetRole={form.jobTitle}
                currentValue={getCurrentValue(view)}
                recommendations={aiRecommendations}
                recommendationsError={recommendationsError}
                onApprove={(value) => applySuggestion(view, value)}
                onBack={() => setView(null)}
            />
        );
    }


    return (
        <div className="cv-build">
            <Navbar />

            <div className="cv-page" dir="rtl">

                {/* Header */}

                {loadingCV && (
                    <p className="cv-msg">
                        Loading CV data...
                    </p>
                )}
                <header className="cv-header">
                    <div className="cv-header__text">
                        <h1>Creating and Analyzing a CV</h1>
                        <p>
                            Upload your resume or enter your details to create, update,
                            and analyze your CV using artificial intelligence.
                        </p>
                    </div>
                </header>

                <div className="cv-grid">

                    {/* upload cv */}
                    <section className="cv-card">
                        <div className="cv-card__head">
                            <UploadCloudIcon />
                            <h2>{isEditMode ? "Replace CV file" : "Upload CV file"}</h2>
                        </div>

                        <p className="cv-card__sub">
                            Upload your resume to have it analyzed and your information filled in automatically.
                        </p>

                        <div
                            className={`cv-dropzone ${
                                dragging ? "is-dragging" : ""
                            }`}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragging(true);
                            }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={onDrop}
                        >
                            <UploadCloudIcon size={44} />

                            <strong>Drag and drop your CV file here</strong>

                            <span className="cv-muted">
                                Or select the file from your device
                            </span>

                            <button
                                type="button"
                                className="cv-btn cv-btn--primary"
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                                disabled={uploading}
                            >
                                {uploading
                                    ? "Uploading..."
                                    : "Upload your CV"}
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx"
                                hidden
                                onChange={onFileChange}
                            />

                            <span className="cv-muted">
                                PDF / Word
                            </span>

                            {fileName && (
                                <span className="cv-file-name">
                                    {fileName}
                                </span>
                            )}

                            {uploadMsg && (
                                <span
                                    className={`cv-msg cv-msg--${uploadMsg.type}`}
                                >
                                    {uploadMsg.text}
                                </span>
                            )}
                        </div>
                    </section>

                    {/* data cv */}
                    <section className="cv-card">
                        <div className="cv-card__head">
                            <UserIcon />
                            <h2>CV Details</h2>
                        </div>

                        <p className="cv-card__sub">
                            You can enter and edit your data.
                        </p>

                        <label className="cv-field">
                            <span>Full Name<b>*</b></span>

                            <div className="cv-input">
                                <UserIcon size={18} />

                                <input
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </label>

                        <label className="cv-field">
                            <span>Email<b>*</b></span>

                            <div className="cv-input">
                                <MailIcon size={18} />

                                <input
                                    type="email"
                                    name="email"
                                    dir="ltr"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="example@email.com"
                                />
                            </div>
                        </label>

                        <label className="cv-field">
                            <span>Phone number<b>*</b></span>

                            <div className="cv-input">
                                <PhoneIcon size={18} />

                                <input
                                    type="tel"
                                    name="phone"
                                    dir="ltr"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="+970"
                                />
                            </div>
                        </label>

                        <label className="cv-field">
                            <span>Job Title<b>*</b></span>

                            <div className="cv-input">
                                <BriefcaseIcon size={18} />

                                <input
                                    name="jobTitle"
                                    value={form.jobTitle}
                                    onChange={handleChange}
                                    placeholder="Enter the job title"
                                />
                            </div>
                        </label>

                        <div className="cv-field">
                            <span>Core Skills<b>*</b></span>

                            <div className="cv-tags">
                                {form.skills.map((skill) => (
                                    <span
                                        className="cv-tag"
                                        key={skill}
                                    >
                                        {skill}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeSkill(skill)
                                            }
                                            aria-label={`حذف ${skill}`}
                                        >
                                            <CloseIcon size={12} />
                                        </button>
                                    </span>
                                ))}

                                <input
                                    dir="ltr"
                                    value={skillInput}
                                    onChange={(e) =>
                                        setSkillInput(e.target.value)
                                    }
                                    onKeyDown={onSkillKeyDown}
                                    onBlur={() => {
                                        addSkill(skillInput);
                                        setSkillInput("");
                                    }}
                                    placeholder={
                                        form.skills.length
                                            ? ""
                                            : "Enter a skill and press"
                                    }
                                />
                            </div>
                        </div>
                    </section>

                    {/* AI Suggestions */}
                    <section className="cv-card">
                        <div className="cv-card__head">
                            <SparkIcon />
                            <h2>AI Suggestions</h2>
                        </div>

                        <p className="cv-card__sub">
                            Smart improvements to enhance your resume.
                        </p>

                        <div className="cv-suggestions">
                            {suggestions.map((suggestion) => (
                                <button
                                    key={suggestion.type}
                                    type="button"
                                    className="cv-suggestion"
                                    disabled={!resumeId || loadingRecommendations}
                                    onClick={() => openSuggestion(suggestion.type)}
                                >
                                    <span className="cv-suggestion__icon">
                                        {suggestion.icon}
                                    </span>

                                    <span className="cv-suggestion__body">
                                        <strong>
                                            {loadingRecommendations
                                                ? "Generating recommendations..."
                                                : suggestion.title}
                                        </strong>

                                        <small>
                                            {suggestion.text}
                                        </small>
                                    </span>
                                </button>
                            ))}
                        </div>

                        {!resumeId && (
                            <p className="cv-muted">
                                Upload your resume first to use AI suggestions.
                            </p>
                        )}
                    </section>
                </div>


                <div className="cv-actions">
                    <button
                        type="button"
                        className="cv-btn cv-btn--primary cv-btn--lg"
                        onClick={approveCv}
                        disabled={approving || !resumeId}
                    >
                        <CheckIcon size={18} />

                        {approving
                            ? "Pending approval."
                            : "CV Approval and Updating"}
                    </button>
                </div>

                {/* Share link message */}
                <aside
                    className={`cv-toast ${
                        showShare ? "is-open" : ""
                    }`}
                    role="status"
                    aria-live="polite"
                >
                    <button
                        type="button"
                        className="cv-toast__close"
                        onClick={() => setShowShare(false)}
                        aria-label="إغلاق"
                    >
                        <CloseIcon size={16} />
                    </button>

                    <div className="cv-toast__head">
                        <LinkIcon />
                        <h3>Share link</h3>
                    </div>

                    <p>
                        The resume sharing link has been successfully created.
                    </p>

                    <div className="cv-toast__link">
                        <button
                            type="button"
                            className="cv-btn cv-btn--primary cv-btn--sm"
                            onClick={copyLink}
                        >
                            <CopyIcon size={16} />

                            {copied ? "Copied " : "Copy link "}
                        </button>

                        <div
                            className="cv-toast__url"
                            dir="ltr"
                        >
                            <LinkIcon size={16} />

                            <input
                                readOnly
                                value={shareUrl}
                                onFocus={(e) => e.target.select()}
                            />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
