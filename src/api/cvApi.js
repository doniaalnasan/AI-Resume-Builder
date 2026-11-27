import { request, requestBlob } from "./client";

const buildForm = ({ title, file }) => {
    const fd = new FormData();

    if (title) fd.append("title", title);
    if (file) fd.append("file", file);

    return fd;
};

export const cvApi = {

    list: ({ page = 1, perPage = 20 } = {}) =>
        request(`/cv/resumes?page=${page}&per_page=${perPage}`),


    get: (id) =>
        request(`/cv/resumes/${id}`),


    upload: ({ title, file }) =>
        request("/cv/resumes", {
            method: "POST",
            body: buildForm({ title, file }),
        }),

    // Editing the resume
    update: (id, { title, file }) =>
        request(`/cv/resumes/${id}`, {
            method: "POST",
            body: buildForm({ title, file }),
        }),


    remove: (id) =>
        request(`/cv/resumes/${id}`, {
            method: "DELETE",
        }),


    analyze: (id, groqKey) =>
    request(`/cv/resumes/${id}/analyze`, {
        method: "POST",
        headers: {
            "X-Groq-Api-Key": groqKey,
        },
    }),


    recommend: (id, targetRole, groqKey) =>
    request(`/cv/resumes/${id}/recommendations`, {
        method: "POST",
        headers: {
            "X-Groq-Api-Key": groqKey,
        },
        body: {
            target_role: targetRole,
        },
    }),


    share: (id, expiresInDays = 365) =>
        request(`/cv/resumes/${id}/share`, {
            method: "POST",
            body: {
                expires_in_days: expiresInDays,
            },
        }),


    unshare: (id) =>
        request(`/cv/resumes/${id}/share`, {
            method: "DELETE",
        }),


    fileBlob: (id, { download = false } = {}) =>
        requestBlob(
            `/cv/resumes/${id}/file${download ? "?download=1" : ""}`
        ),


    sharedResume: (shareToken) =>
        request(`/cv/shared-resumes/${encodeURIComponent(shareToken)}`),

    
    sharedFileBlob: (shareToken, { download = false } = {}) =>
        requestBlob(
            `/cv/shared-resumes/${encodeURIComponent(shareToken)}/file${download ? "?download=1" : ""}`
        ),
};
