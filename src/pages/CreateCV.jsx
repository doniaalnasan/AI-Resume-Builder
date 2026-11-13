import { useRef, useState } from "react";
import "../styles/CreateCV.css";
import AiSuggestion from "./AISuggestions";
import Navbar from "../components/Navbar";

// mock data
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_PARSED_CV = {
  fullName: "أحمد سمور",
  email: "ahmed.samour@example.com",
  phone: "+966 55 123 4567",
  jobTitle: "مطور واجهات أمامية",
  skills: ["JavaScript", "React", "TypeScript", "Tailwind CSS"],
  summary:
    "مطور واجهات أمامية لدي خبرة في بناء صفحات الهبوط ولوحات التحكم والمتاجر الإلكترونية. أعمل على تحسين تجربة المستخدم وتقديم واجهات واضحة وعملية تناسب احتياجات المشروع.",
};

//Dummy Function
const mockUploadCv = async () => {
  await wait(1500);
  return MOCK_PARSED_CV;
};

const mockApproveCv = async (formData) => {
  await wait(800);
  const slug =
    formData.fullName.trim().replace(/\s+/g, "-").toLowerCase() || "my-cv";
  return {
    shareUrl: `https://ai-resume-builder.com/cv/${encodeURIComponent(slug)}`,
  };
};

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
 
/* ========= المكوّن الرئيسي ========= */
const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  jobTitle: "",
  skills: [],
  summary: "",
};
 
export default function CvBuilder() {
  const fileInputRef = useRef(null);
 
  const [form, setForm] = useState(emptyForm);
  const [skillInput, setSkillInput] = useState("");
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [uploadMsg, setUploadMsg] = useState(null); // { type: 'success' | 'error', text }
  const [shareUrl, setShareUrl] = useState("");
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState(null); // null = صفحة الـ CV | "title" | "summary" | "skills"
 
  /* ----- رفع الملف وتعبئة الفورم من الاستجابة ----- */
  const uploadFile = async (file) => {
    if (!file) return;
 
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) {
      setUploadMsg({ type: "error", text: "الملف لازم يكون PDF أو Word" });
      return;
    }
 
    setFileName(file.name);
    setUploading(true);
    setUploadMsg(null);
 
    try {
      const data = await mockUploadCv(file);
 
      // تعبئة الفورم من الاستجابة
      setForm({
        fullName: data.fullName ?? data.name ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        jobTitle: data.jobTitle ?? data.title ?? "",
        skills: Array.isArray(data.skills) ? data.skills : [],
        summary: data.summary ?? "",
      });
      setUploadMsg({ type: "success", text: "تم تحليل الـ CV وتعبئة البيانات" });
    } catch {
      setUploadMsg({ type: "error", text: "صار خطأ أثناء رفع أو تحليل الملف" });
    } finally {
      setUploading(false);
    }
  };
 
  const onFileChange = (e) => uploadFile(e.target.files?.[0]);
 
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    uploadFile(e.dataTransfer.files?.[0]);
  };
 
  /* ----- الفورم ----- */
  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
 
  const addSkill = (value) => {
    const skill = value.trim();
    if (!skill || form.skills.includes(skill)) return;
    setForm((f) => ({ ...f, skills: [...f.skills, skill] }));
  };
 
  const removeSkill = (skill) =>
    setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }));
 
  const onSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(skillInput);
      setSkillInput("");
    } else if (e.key === "Backspace" && !skillInput && form.skills.length) {
      removeSkill(form.skills[form.skills.length - 1]);
    }
  };
 
  /* ----- اعتماد الـ CV وإظهار رابط المشاركة ----- */
  const approveCv = async () => {
    setApproving(true);
    try {
      const data = await mockApproveCv(form);
      setShareUrl(data.shareUrl);
    } finally {
      setApproving(false);
      setCopied(false);
      setShowShare(true); // الرسالة الجانبية
    }
  };
 
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* تجاهل */
    }
  };
 
  /* ----- اقتراحات الـ AI ----- */
  // النص الحالي اللي بيظهر بصفحة الاقتراح
  const getCurrentValue = (type) => {
    if (type === "title") return form.jobTitle;
    if (type === "summary") return form.summary;
    if (type === "skills") return form.skills.join(", ");
    return "";
  };
 
  // لما يضغط "اعتماد" بصفحة الاقتراح: بنحدّث الفورم ونرجع لصفحة الـ CV
  const applySuggestion = (type, value) => {
    setForm((f) => {
      if (type === "title") return { ...f, jobTitle: value };
      if (type === "summary") return { ...f, summary: value };
      if (type === "skills") {
        const skills = [...new Set(value.split(/[,،\n]/).map((s) => s.trim()).filter(Boolean))];
        return { ...f, skills };
      }
      return f;
    });
    setUploadMsg({ type: "success", text: "تم تطبيق الاقتراح على بياناتك" });
    setView(null);
  };
 
  const suggestions = [
    {
      type: "title",
      icon: <BriefcaseIcon />,
      title: "تحسين المسمى الوظيفي",
      text: "اقتراح صيغة أكثر احترافية وتوافقاً مع السوق.",
    },
    {
      type: "summary",
      icon: <EditIcon />,
      title: "إعادة صياغة نبذة الملخص",
      text: "تحسين ملخصك ليبرز خبراتك وقيمتك المهنية.",
    },
    {
      type: "skills",
      icon: <LayersIcon />,
      title: "إضافة مهارات مقترحة",
      text: "اقتراح مهارات مناسبة لمجالك ولوظيفتك المستهدفة.",
    },
  ];
 
  // صفحة اقتراح الـ AI (بتحل مكان صفحة الـ CV مؤقتاً، والبيانات بتضل محفوظة)
  if (view) {
    return (
      <AiSuggestion
        key={view}
        type={view}
        currentValue={getCurrentValue(view)}
        onApprove={(value) => applySuggestion(view, value)}
        onBack={() => setView(null)}
      />
    );
  }
 
  return (
    <div className="cv-build">
      <Navbar />
    <div className="cv-page" dir="rtl">
      {/* ===== الهيدر ===== */}
      <header className="cv-header">
        <div className="cv-header__text">
          <h1>إنشاء وتحليل الـ CV</h1>
          <p>
            ارفع سيرتك الذاتية أو أدخل بياناتك لإنشاء وتحديث وتحليل الـ CV
            بالذكاء الاصطناعي.
          </p>
        </div>
      </header>
 
      <div className="cv-grid">
        {/* ===== رفع ملف الـ CV ===== */}
        <section className="cv-card">
          <div className="cv-card__head">
            <UploadCloudIcon />
            <h2>رفع ملف الـ CV</h2>
          </div>
          <p className="cv-card__sub">ارفع سيرتك الذاتية لتحليلها وتعبئة بياناتك تلقائياً.</p>
 
          <div
            className={`cv-dropzone ${dragging ? "is-dragging" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <UploadCloudIcon size={44} />
            <strong>اسحب وأفلت ملف الـ CV هنا</strong>
            <span className="cv-muted">أو اختر الملف من جهازك</span>
 
            <button
              type="button"
              className="cv-btn cv-btn--primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "جاري التحليل..." : "رفع ملف الـ CV"}
            </button>
 
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              hidden
              onChange={onFileChange}
            />
            <span className="cv-muted">PDF / Word</span>
 
            {fileName && <span className="cv-file-name">{fileName}</span>}
            {uploadMsg && (
              <span className={`cv-msg cv-msg--${uploadMsg.type}`}>{uploadMsg.text}</span>
            )}
          </div>
        </section>
 
        {/* ===== بيانات الـ CV ===== */}
        <section className="cv-card">
          <div className="cv-card__head">
            <UserIcon />
            <h2>بيانات الـ CV</h2>
          </div>
          <p className="cv-card__sub">تم تعبئة البيانات تلقائياً من ملفك ويمكنك تعديلها.</p>
 
          <label className="cv-field">
            <span>الاسم الكامل <b>*</b></span>
            <div className="cv-input">
              <UserIcon size={18} />
              <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="أحمد سمور" />
            </div>
          </label>
 
          <label className="cv-field">
            <span>البريد الإلكتروني <b>*</b></span>
            <div className="cv-input">
              <MailIcon size={18} />
              <input
                type="email"
                name="email"
                dir="ltr"
                value={form.email}
                onChange={handleChange}
                placeholder="ahmed.samour@example.com"
              />
            </div>
          </label>
 
          <label className="cv-field">
            <span>رقم الهاتف <b>*</b></span>
            <div className="cv-input">
              <PhoneIcon size={18} />
              <input
                type="tel"
                name="phone"
                dir="ltr"
                value={form.phone}
                onChange={handleChange}
                placeholder="+966 55 123 4567"
              />
            </div>
          </label>
 
          <label className="cv-field">
            <span>المسمى الوظيفي <b>*</b></span>
            <div className="cv-input">
              <BriefcaseIcon size={18} />
              <input
                name="jobTitle"
                value={form.jobTitle}
                onChange={handleChange}
                placeholder="مطور واجهات أمامية"
              />
            </div>
          </label>
 
          <div className="cv-field">
            <span>المهارات الأساسية <b>*</b></span>
            <div className="cv-tags">
              {form.skills.map((skill) => (
                <span className="cv-tag" key={skill}>
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} aria-label={`حذف ${skill}`}>
                    <CloseIcon size={12} />
                  </button>
                </span>
              ))}
              <input
                dir="ltr"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={onSkillKeyDown}
                onBlur={() => {
                  addSkill(skillInput);
                  setSkillInput("");
                }}
                placeholder={form.skills.length ? "" : "اكتب مهارة واضغط Enter"}
              />
            </div>
          </div>
        </section>
 
        {/* ===== اقتراحات الـ AI ===== */}
        <section className="cv-card">
          <div className="cv-card__head">
            <SparkIcon />
            <h2>اقتراحات الـ AI</h2>
          </div>
          <p className="cv-card__sub">تحسينات ذكية لتطوير سيرتك الذاتية.</p>
 
          <div className="cv-suggestions">
            {suggestions.map((s) => (
              <button
                key={s.type}
                type="button"
                className="cv-suggestion"
                onClick={() => setView(s.type)}
              >
                <span className="cv-suggestion__icon">{s.icon}</span>
                <span className="cv-suggestion__body">
                  <strong>{s.title}</strong>
                  <small>{s.text}</small>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
 
      {/* ===== زر الاعتماد ===== */}
      <div className="cv-actions">
        <button
          type="button"
          className="cv-btn cv-btn--primary cv-btn--lg"
          onClick={approveCv}
          disabled={approving}
        >
          <CheckIcon size={18} />
          {approving ? "جاري الاعتماد..." : "اعتماد الـ CV والتحديث"}
        </button>
      </div>
 
      {/* ===== رسالة رابط المشاركة الجانبية ===== */}
      <aside className={`cv-toast ${showShare ? "is-open" : ""}`} role="status" aria-live="polite">
        <button type="button" className="cv-toast__close" onClick={() => setShowShare(false)} aria-label="إغلاق">
          <CloseIcon size={16} />
        </button>
 
        <div className="cv-toast__head">
          <LinkIcon />
          <h3>رابط المشاركة</h3>
        </div>
        <p>تم اعتماد وتحديث الـ CV بنجاح. يمكنك الآن مشاركة الرابط.</p>
 
        <div className="cv-toast__link">
          <button type="button" className="cv-btn cv-btn--primary cv-btn--sm" onClick={copyLink}>
            <CopyIcon size={16} />
            {copied ? "تم النسخ" : "نسخ الرابط"}
          </button>
          <div className="cv-toast__url" dir="ltr">
            <LinkIcon size={16} />
            <input readOnly value={shareUrl} onFocus={(e) => e.target.select()} />
          </div>
        </div>
      </aside>
    </div>
    </div>
  );
}