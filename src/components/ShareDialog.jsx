import { useEffect, useRef, useState } from "react";
import { FiCopy, FiCheck, FiLink, FiMail, FiShare2, FiX } from "react-icons/fi";
import { FaWhatsapp, FaTelegramPlane, FaLinkedinIn, FaFacebookF, FaTwitter } from "react-icons/fa";
import "../styles/ShareDialog.css";


const buildTargets = (url, title) => {
    const text = `${title} - my CV`;
    const u = encodeURIComponent(url);
    const t = encodeURIComponent(text);

    return [
        {
            id: "whatsapp",
            label: "WhatsApp",
            icon: FaWhatsapp,
            href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
        },
        {
            id: "telegram",
            label: "Telegram",
            icon: FaTelegramPlane,
            href: `https://t.me/share/url?url=${u}&text=${t}`,
        },
        {
            id: "linkedin",
            label: "LinkedIn",
            icon: FaLinkedinIn,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
        },
        {
            id: "facebook",
            label: "Facebook",
            icon: FaFacebookF,
            href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
        },
        {
            id: "x",
            label: "X",
            icon: FaTwitter,
            href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
        },
        {
            id: "email",
            label: "Email",
            icon: FiMail,
            href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n${url}`)}`,
            internal: true, 
        },
    ];
};

export default function ShareDialog({ url, title = "My CV", onClose }) {
    const inputRef = useRef(null);
    const [copied, setCopied] = useState(false);

    const canNativeShare =
        typeof navigator !== "undefined" && typeof navigator.share === "function";


    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onClose]);


    useEffect(() => {
        if (!copied) return;
        const timer = setTimeout(() => setCopied(false), 2000);
        return () => clearTimeout(timer);
    }, [copied]);

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
        } catch {

            inputRef.current?.select();
        }
    };

    const nativeShare = () => {
        navigator.share({ title, url }).catch(() => {});
    };

    return (
        <div
            className="sd-overlay"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="sd-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="sd-title"
            >
                <button
                    type="button"
                    className="sd-close"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <FiX size={18} />
                </button>

                <header className="sd-head">
                    <span className="sd-icon">
                        <FiLink size={22} />
                    </span>
                    <div>
                        <h2 id="sd-title" className="sd-title">
                            Share your CV
                        </h2>
                        <p className="sd-sub">Anyone with this link can view your CV.</p>
                    </div>
                </header>

                {/* ---------- copy link---------- */}
                <div className="sd-link">
                    <input
                        ref={inputRef}
                        className="sd-link__input"
                        dir="ltr"
                        readOnly
                        value={url}
                        aria-label="Share link"
                        onFocus={(e) => e.target.select()}
                    />
                    <button
                        type="button"
                        className="sd-link__btn"
                        onClick={copyLink}
                    >
                        {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
                        {copied ? "Copied" : "Copy"}
                    </button>
                </div>

                
                <p className="sd-label">Share on</p>
                <ul className="sd-apps">
                    {buildTargets(url, title).map(
                        ({ id, label, icon: IconComp, href, internal }) => (
                            <li key={id}>
                                <a
                                    className={`sd-app sd-app--${id}`}
                                    href={href}
                                    {...(internal
                                        ? {}
                                        : { target: "_blank", rel: "noopener noreferrer" })}
                                >
                                    <span className="sd-app__icon">
                                        <IconComp size={20} />
                                    </span>
                                    <span className="sd-app__label">{label}</span>
                                </a>
                            </li>
                        )
                    )}

                    {canNativeShare && (
                        <li>
                            <button
                                type="button"
                                className="sd-app sd-app--more"
                                onClick={nativeShare}
                            >
                                <span className="sd-app__icon">
                                    <FiShare2 size={20} />
                                </span>
                                <span className="sd-app__label">More</span>
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
