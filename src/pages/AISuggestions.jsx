import { useEffect, useRef, useState } from "react";
import "../styles/AISuggestions.css";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_VARIANTS = {
  title: [
    "مطور واجهات أمامية أول (Senior Frontend Developer)",
    "مهندس واجهات أمامية | React & TypeScript",
    "Frontend Engineer متخصص في بناء تطبيقات ويب قابلة للتوسع",
  ],
  summary: [
    "مطور واجهات أمامية متخصص في بناء تطبيقات الويب باستخدام React وTypeScript، مع خبرة في تحويل التصاميم إلى واجهات سريعة ومتجاوبة. أركز على كتابة كود نظيف وقابل للصيانة، وتقديم تجربة استخدام سلسة تحقق أهداف المشروع وترفع جودة المنتج.",
    "مهندس واجهات أمامية بخبرة عملية في تطوير لوحات التحكم والمتاجر الإلكترونية وصفحات الهبوط. أجمع بين الدقة التقنية والاهتمام بتجربة المستخدم لأقدم حلولاً واضحة وعملية تناسب احتياجات العمل.",
    "مطور واجهات أمامية شغوف بالأداء وسهولة الاستخدام، أعمل بـ React وTailwind CSS لبناء مكوّنات قابلة لإعادة الاستخدام وتجارب تفاعلية جذابة، وأسعى دائماً لرفع جودة المنتج وتسريع التسليم.",
  ],
  skills: [
    "JavaScript, React, TypeScript, Tailwind CSS, Next.js, Redux, Jest, Git",
    "JavaScript, TypeScript, React, Next.js, Tailwind CSS, Testing Library, Figma, REST APIs",
    "React, TypeScript, Tailwind CSS, Vite, Zustand, Cypress, Git, CI/CD",
  ],
};

//mock
const mockGenerateSuggestion = async (type, attempt) => {
  await wait(1000);
  const list = MOCK_VARIANTS[type] ?? [""];
  return list[(attempt - 1) % list.length];
};


const CONFIG = {
  title: {
    currentTitle: "مسماك الحالي",
    suggestedTitle: "المسمى المقترح من AI",
    approve: "اعتماد المسمى",
    note: "تم تحسين المسمى ليكون أكثر احترافية وتوافقاً مع السوق.",
    rows: 2,
  },
  summary: {
    currentTitle: "وصفك الحالي",
    suggestedTitle: "الوصف المقترح من AI",
    approve: "اعتماد الوصف",
    note: "تم تحسين الصياغة لتكون أكثر احترافية ووضوحاً.",
    rows: 6,
  },
  skills: {
    currentTitle: "مهاراتك الحالية",
    suggestedTitle: "المهارات المقترحة من AI",
    approve: "اعتماد المهارات",
    note: "افصل بين المهارات بفاصلة، وعدّل القائمة كما تريد.",
    rows: 3,
  },
};

/* ========= icon ========= */
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
const RefreshIcon = (p) => (
  <Icon {...p}>
    <path d="M20 11a8 8 0 00-14.5-4M4 4v4h4" />
    <path d="M4 13a8 8 0 0014.5 4M20 20v-4h-4" />
  </Icon>
);
const BackIcon = (p) => (
  <Icon {...p}>
    <path d="M9 6l6 6-6 6" />
  </Icon>
);


export default function AiSuggestion({ type, currentValue, onApprove, onBack }) {
  const cfg = CONFIG[type] ?? CONFIG.summary;

  const [suggested, setSuggested] = useState("");
  const [loading, setLoading] = useState(true);
  const requestId = useRef(0);

  useEffect(() => {
    let isMounted = true;
    const currentRequestId = requestId;

    const generate = async () => {
      const id = ++requestId.current;

      setLoading(true);

      try {
        const text = await mockGenerateSuggestion(type, 1);

        if (isMounted && id === requestId.current) {
          setSuggested(text);
          setLoading(false);
        }
      } catch (error) {
        console.error("Suggestion error:", error);

        if (isMounted) {
          setLoading(false);
        }
      }
    };

    generate();

    return () => {
      isMounted = false;
      currentRequestId.current++;
    };
}, [type]);

  const generateAgain = async () => {
    const id = ++requestId.current;

    setLoading(true);

    try {
      const text = await mockGenerateSuggestion(
        type,
        Math.ceil(Math.random() * 3)
      );

      if (id === requestId.current) {
        setSuggested(text);
        setLoading(false);
      }
    } catch (error) {
      console.error("Suggestion error:", error);
      setLoading(false);
    }
  };

  const canApprove = !loading && suggested.trim().length > 0;

    return (
    <div className="ai-page" dir="rtl">
    <button type="button" className="ai-back" onClick={onBack}>
        <BackIcon size={16} />
        رجوع للـ CV
      </button>

      <section className="ai-card">
        {/* ===== الهيدر ===== */}
        <header className="ai-card__head">
          <span className="ai-icon-box ai-icon-box--lg">
            <SparkIcon />
          </span>
          <div>
            <h1>اقتراحات الذكاء الاصطناعي</h1>
            <p>قارن بين وصفك الحالي والوصف المقترح من الذكاء الاصطناعي</p>
          </div>
        </header>

        {/* ===== current ===== */}
        <div className="ai-box">
          <div className="ai-box__head">
            <span className="ai-icon-box">
              <DocIcon size={18} />
            </span>
            <h2>{cfg.currentTitle}</h2>
            <span className="ai-pill">الحالي</span>
          </div>
          <p className="ai-box__text">
            {currentValue || <em className="ai-empty">لا توجد بيانات حالية</em>}
          </p>
        </div>
 
        <div className="ai-arrow">
          <ArrowDownIcon size={18} />
        </div>
 
        {/* ===== Editable AI proposal ===== */}
        <div className="ai-box ai-box--ai">
          <div className="ai-box__head">
            <span className="ai-icon-box ai-icon-box--ai">
              <ChipIcon size={18} />
            </span>
            <h2>{cfg.suggestedTitle}</h2>
            <span className="ai-pill ai-pill--ai">
              <SparkIcon size={12} />
              محسّن
            </span>
          </div>
 
          {loading ? (
            <div className="ai-skeleton" aria-label="جاري توليد الاقتراح">
              <span />
              <span />
              <span />
            </div>
          ) : (
            <textarea
              className="ai-textarea"
              rows={cfg.rows}
              value={suggested}
              onChange={(e) => setSuggested(e.target.value)}
              dir={type === "skills" ? "ltr" : "rtl"}
              aria-label={cfg.suggestedTitle}
            />
          )}
          {!loading && <small className="ai-hint">يمكنك تعديل النص قبل الاعتماد.</small>}
        </div>
 
        {/* ===== button ===== */}
        <footer className="ai-footer">
          <p className="ai-footer__note">
            <SparkIcon size={16} />
            {cfg.note}
          </p>
 
          <button type="button" className="ai-btn ai-btn--outline" onClick={generateAgain} disabled={loading}>
            <RefreshIcon size={16} />
            إعادة التوليد
          </button>
 
          <button
            type="button"
            className="ai-btn ai-btn--primary"
            onClick={() => onApprove(suggested.trim())}
            disabled={!canApprove}
          >
            <CheckIcon size={16} />
            {cfg.approve}
          </button>
        </footer>
      </section>
    </div>
  );
}