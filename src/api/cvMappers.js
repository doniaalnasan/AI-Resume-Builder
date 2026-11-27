const pick = (obj, keys) => {
    for (const k of keys) {
        const v = obj?.[k];
        if (v !== undefined && v !== null && v !== "") return v;
    }
    return undefined;
};

const toText = (v) => (typeof v === "string" ? v.trim() : "");

const itemToText = (item) => {
    if (typeof item === "string") return item.trim();
    if (item && typeof item === "object") {
        return String(
            pick(item, ["text", "recommendation", "description", "title", "name", "skill"]) ?? ""
        ).trim();
    }
    return "";
};


const toStringList = (v) => {
    if (Array.isArray(v)) return v.map(itemToText).filter(Boolean);
    if (typeof v === "string") {
        return v.split(/[,،\n]/).map((s) => s.trim()).filter(Boolean);
    }
    return [];
};


export const extractList = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.data?.data)) return res.data.data;
    if (Array.isArray(res?.data?.items)) return res.data.items;
    return [];
};


export const mapResume = (r) => ({
    id: r?.id,
    title: pick(r, ["title", "original_name", "file_name", "name"]) ?? "Untitled CV",
    updatedAt: pick(r, ["updated_at", "created_at"]),
});


export const extractResumeId = (res) =>
    res?.data?.id ?? res?.data?.resume?.id ?? res?.resume?.id ?? res?.id ?? null;


export const mapProfileDraft = (res) => {
    const d = res?.data ?? res ?? {};
    const p = d.profile ?? d.profile_draft ?? d.structured_profile ?? d.draft ?? d;

    return {
        fullName: toText(pick(p, ["full_name", "fullName", "name"])),
        email: toText(pick(p, ["email"])),
        phone: toText(pick(p, ["phone", "phone_number", "mobile"])),
        jobTitle: toText(
            pick(p, ["job_title", "jobTitle", "title", "headline", "current_role"])
        ),
        skills: toStringList(pick(p, ["skills", "key_skills"])),
        summary: toText(pick(p, ["summary", "professional_summary", "about", "objective"])),
    };
};


export const mapRecommendations = (res) => {
    const d = res?.data ?? res ?? {};
    const r =
        d.recommendations && !Array.isArray(d.recommendations) ? d.recommendations : d;

    return {
        score: pick(r, ["score", "cv_score", "overall_score"]),
        overview: toText(pick(r, ["overview", "feedback", "summary"])),
        strengths: toStringList(pick(r, ["strengths"])),
        improvements: toStringList(
            pick(r, [
                "improvements",
                "improvement_recommendations",
                "recommendations",
                "suggestions",
            ])
        ),
        skills: toStringList(pick(r, ["recommended_skills", "suggested_skills", "skills"])),

        title: toText(
            pick(r, [
                "suggested_title",
                "improved_title",
                "recommended_title",
                "recommended_job_title",
                "suggested_job_title",
            ])
        ),
        summary: toText(
            pick(r, [
                "improved_summary",
                "suggested_summary",
                "rewritten_summary",
                "recommended_summary",
            ])
        ),
    };
};




export const extractShareUrl = (res) => {
    const found = [];

    const walk = (value, key = "") => {
        if (typeof value === "string") {
            if (/^https?:\/\//i.test(value)) {
                found.push({ key, url: value });
            }
            return;
        }

        if (value && typeof value === "object") {
            Object.entries(value).forEach(([k, v]) => {
                walk(v, k);
            });
        }
    };

    walk(res?.data ?? res);

    const isFile = (item) =>
        /file|download/i.test(item.key) ||
        /\/file(?:\/|\?|$)/i.test(item.url);

    const best =
        found.find(
            (item) =>
                /share|public|web|view/i.test(item.key) &&
                !isFile(item)
        ) ||
        found.find((item) => !isFile(item));

    return best?.url ?? "";
};
