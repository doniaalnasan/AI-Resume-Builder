import { useState } from "react";
import "../styles/AISuggestions.css";

// ================= Icons  =================

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

const SparkIcon = (p) => (
    <Icon {...p}>
        <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
    </Icon>
);

const DocIcon = (p) => (
    <Icon {...p}>
        <path d="M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
        <path d="M14 3v5h5M9 13h6M9 17h6" />
    </Icon>
);

const ChipIcon = (p) => (
    <Icon {...p}>
        <rect x="6" y="6" width="12" height="12" rx="2" />
        <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
    </Icon>
);

const ArrowDownIcon = (p) => (
    <Icon {...p}>
        <path d="M12 5v14M6 13l6 6 6-6" />
    </Icon>
);

const CheckIcon = (p) => (
    <Icon {...p}>
        <path d="M5 12l5 5L20 7" />
    </Icon>
);

const BackIcon = (p) => (
    <Icon {...p}>
        <path d="M9 6l6 6-6 6" />
    </Icon>
);



const CONFIG = {
    title: {
        currentTitle: "Your current job title",
        suggestedTitle: "Notes on Job Title Improvement",
        note: "Review the notes and use them when revising the job title.",
        sections: ["work experience", "experience", "job title", "professional summary"],
    },

    summary: {
        currentTitle: "Your current description",
        suggestedTitle: "Notes for Improving the Professional Summary",
        note: "Use these notes to improve your professional summary.",
        sections: ["professional summary", "summary", "profile"],
    },

    skills: {
        currentTitle: "Your current skills",
        suggestedTitle: "AI-suggested skills",
        note: "Only add the skills you actually possess.",
    },
};



const getPriorityLabel = (priority) => {
    const labels = {
        high: "High priority",
        medium: "Medium priority",
        low: "Low priority",
    };

    return labels[priority?.toLowerCase()] || "Proposed improvement";
};

const getRelevantImprovements = (recommendations, type) => {
    const improvements = recommendations?.cv_improvements;

    if (!Array.isArray(improvements)) return [];

    const sections = CONFIG[type]?.sections || [];

    return improvements.filter((item) => {
        const section = String(item?.section || "").toLowerCase();

        return sections.some((keyword) => section.includes(keyword));
    });
};



export default function AiSuggestion({
    type,
    currentValue,
    onApprove,
    onBack,
    recommendations,
    recommendationsError,
}) {
    const cfg = CONFIG[type] || CONFIG.summary;

    const recommendedSkills = Array.isArray(
        recommendations?.recommended_skills
    )
        ? recommendations.recommended_skills
        : [];

    const initialSkills = recommendedSkills
        .map((item) => item?.skill)
        .filter(
            (skill) =>
                typeof skill === "string" && skill.trim()
        );

    const [suggestedSkills, setSuggestedSkills] = useState(
        [...new Set(initialSkills)]
    );

    const [skillInput, setSkillInput] = useState("");
    const [editedValue, setEditedValue] = useState(currentValue || "");

    const improvements = getRelevantImprovements(
        recommendations,
        type
    );

    const strengths = Array.isArray(recommendations?.strengths)
        ? recommendations.strengths
        : [];

    const score = recommendations?.overall_score;

    const hasRecommendations = Boolean(recommendations);

    const isSkills = type === "skills";

    const canApprove = isSkills
    ? hasRecommendations && suggestedSkills.length > 0
    : hasRecommendations && editedValue.trim().length > 0;



    const addSkill = () => {
        const skill = skillInput.trim();

        if (!skill) return;

        const exists = suggestedSkills.some(
            (item) => item.toLowerCase() === skill.toLowerCase()
        );

        if (!exists) {
            setSuggestedSkills((current) => [...current, skill]);
        }

        setSkillInput("");
    };



    const removeSkill = (skill) => {
        setSuggestedSkills((current) =>
            current.filter((item) => item !== skill)
        );
    };



    const handleApprove = () => {
        if (!canApprove) return;

        if (isSkills) {
            onApprove(suggestedSkills.join(", "));
        } else {
            onApprove(editedValue.trim());
        }
    };


    return (
        <div className="ai-page" dir="rtl">

            <button
                type="button"
                className="ai-back"
                onClick={onBack}
            >
                <BackIcon size={16} />
                Back to CV
            </button>

            <section className="ai-card">

                {/* Header */}

                <header className="ai-card__head">
                    <span className="ai-icon-box ai-icon-box--lg">
                        <SparkIcon />
                    </span>

                    <div>
                        <h1>AI Suggestions</h1>

                        <p>
                            Review the analysis results for your resume
                            and take advantage of the recommendations to improve it.
                        </p>
                    </div>
                </header>



                {recommendationsError && !hasRecommendations && (
                    <p className="ai-box__text ai-error">
                        {recommendationsError}
                    </p>
                )}

                {!hasRecommendations && !recommendationsError && (
                    <p className="ai-box__text">
                        There are currently no recommendations available.
                    </p>
                )}

                {hasRecommendations && (
                    <>
                        {/* Overall Assessment*/}

                        {typeof score === "number" && (
                            <div className="ai-box">
                                <div className="ai-box__head">
                                    <span className="ai-icon-box">
                                        <SparkIcon size={18} />
                                    </span>

                                    <h2>Overall assessment of the resume</h2>
                                </div>

                                <p className="ai-box__text">
                                    {score} / 100
                                </p>
                            </div>
                        )}



                        {strengths.length > 0 && (
                            <div className="ai-box">
                                <div className="ai-box__head">
                                    <span className="ai-icon-box">
                                        <CheckIcon size={18} />
                                    </span>

                                    <h2>Strengths</h2>
                                </div>

                                <ul className="ai-strengths">
                                    {strengths.map((strength, index) => (
                                        <li key={`${strength}-${index}`}>
                                            {strength}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* present data */}

                        <div className="ai-box">
                            <div className="ai-box__head">
                                <span className="ai-icon-box">
                                    <DocIcon size={18} />
                                </span>

                                <h2>{cfg.currentTitle}</h2>

                                <span className="ai-pill">
                                    present
                                </span>
                            </div>

                            <p className="ai-box__text">
                                {currentValue || (
                                    <em className="ai-empty">
                                        No current data available
                                    </em>
                                )}
                            </p>
                        </div>

                        <div className="ai-arrow">
                            <ArrowDownIcon size={18} />
                        </div>



                        {isSkills ? (
                            <div className="ai-box ai-box--ai">

                                <div className="ai-box__head">
                                    <span className="ai-icon-box ai-icon-box--ai">
                                        <ChipIcon size={18} />
                                    </span>

                                    <h2>{cfg.suggestedTitle}</h2>

                                    <span className="ai-pill ai-pill--ai">
                                        <SparkIcon size={12} />
                                        Proposed
                                    </span>
                                </div>

                                {suggestedSkills.length > 0 ? (
                                    <div className="ai-skill-list">
                                        {suggestedSkills.map((skill) => (
                                            <span
                                                className="ai-skill-item"
                                                key={skill}
                                            >
                                                {skill}

                                                <button
                                                    type="button"
                                                    onClick={() => removeSkill(skill)}
                                                    aria-label={`حذف ${skill}`}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="ai-box__text ai-empty">
                                        No skills suggested.
                                    </p>
                                )}

                                <div className="ai-add-skill">
                                    <input
                                        type="text"
                                        value={skillInput}
                                        onChange={(e) =>
                                            setSkillInput(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                addSkill();
                                            }
                                        }}
                                        placeholder="Add a new skill"
                                    />

                                    <button
                                        type="button"
                                        onClick={addSkill}
                                        disabled={!skillInput.trim()}
                                    >
                                        addition
                                    </button>
                                </div>


                                <small className="ai-hint">
                                    Select only the skills you have mastered;
                                    you can also add or remove skills.
                                </small>
                            </div>
                        ) : (


                            <div className="ai-box ai-box--ai">

                                <div className="ai-box__head">
                                    <span className="ai-icon-box ai-icon-box--ai">
                                        <ChipIcon size={18} />
                                    </span>

                                    <h2>{cfg.suggestedTitle}</h2>
                                </div>

                                {type === "summary" && recommendations.summary && (
                                    <div className="ai-assessment">
                                        <strong>AI Assessment Summary</strong>

                                        <p className="ai-box__text">
                                            {recommendations.summary}
                                        </p>
                                    </div>
                                )}

                                {improvements.length > 0 ? (
                                    <div className="ai-improvements">
                                        {improvements.map((item, index) => (
                                            <article
                                                className="ai-improvement"
                                                key={`${item.section}-${index}`}
                                            >
                                                <div className="ai-improvement__head">
                                                    <strong>
                                                        {item.section}
                                                    </strong>

                                                    <span className="ai-pill">
                                                        {getPriorityLabel(item.priority)}
                                                    </span>
                                                </div>

                                                {item.issue && (
                                                    <p>
                                                        <strong>Observation:</strong>{" "}
                                                        {item.issue}
                                                    </p>
                                                )}

                                                {item.recommendation && (
                                                    <p>
                                                        <strong>Recommendation:</strong>{" "}
                                                        {item.recommendation}
                                                    </p>
                                                )}
                                            </article>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="ai-box__text ai-empty">
                                        There are no notes specific to this section
                                        in the current analysis report.
                                    </p>
                                )}

                                <div className="ai-edit-section">
                                    <label htmlFor="ai-edited-value">
                                        {type === "title"
                                            ? "Job title after amendment"
                                            : "Professional Summary (Revised)"}
                                    </label>

                                    {type === "title" ? (
                                        <input
                                            id="ai-edited-value"
                                            type="text"
                                            value={editedValue}
                                            onChange={(e) => setEditedValue(e.target.value)}
                                            placeholder="Enter the appropriate job title."
                                        />
                                    ) : (
                                        <textarea
                                            id="ai-edited-value"
                                            value={editedValue}
                                            onChange={(e) => setEditedValue(e.target.value)}
                                            placeholder="Write the professional summary after enhancing it with AI, then approve it."
                                            rows={6}
                                        />
                                    )}

                                    <small>
                                        Edit the text based on the AI's feedback, then approve it.
                                    </small>
                                </div>

                                <small className="ai-hint">
                                    {cfg.note}
                                </small>
                            </div>
                        )}
                    </>
                )}


                <footer className="ai-footer">

                    <p className="ai-footer__note">
                        <SparkIcon size={16} />
                        {cfg.note}
                    </p>

                    <button
                        type="button"
                        className="ai-btn ai-btn--primary"
                        onClick={handleApprove}
                        disabled={!canApprove}
                    >
                        <CheckIcon size={16} />
                        {isSkills ? "Skills Accreditation" : "Adopting Improvement"}
                    </button>

                    <button
                        type="button"
                        className="ai-btn ai-btn--outline"
                        onClick={onBack}
                    >
                        Back 
                    </button>

                </footer>
            </section>
        </div>
    );
}
