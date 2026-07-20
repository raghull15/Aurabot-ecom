import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Message from "./components/message";
import WaveBackground from "./components/WaveBackground";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;
const SHOWCASE = [
  { name: "Sony WH-1000XM5", cat: "Headphones", price: "₹2,990", img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80" },
  { name: "Apple AirPods Pro 2", cat: "Earbuds", price: "₹2,499", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80" },
  { name: "Samsung Galaxy Tab S9", cat: "Tablet", price: "₹7,499", img: "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=400&q=80" },
  { name: "Logitech MX Master 3S", cat: "Mouse", price: "₹999", img: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&q=80" },
];

const ACTIONS = [
  { icon: "🔍", label: "Find Products", query: "Show me the best gadgets available" },
  { icon: "⚖️", label: "Compare Prices", query: "Compare Sony headphones vs Apple AirPods" },
  { icon: "⭐", label: "Top Rated", query: "What are the highest rated products?" },
  { icon: "🎁", label: "Gift Ideas", query: "Gift ideas under ₹5000" },
  { icon: "💎", label: "Best Deals", query: "Show me the best deals right now" },
  { icon: "📈", label: "Trending", query: "What's trending right now?" },
];

const SUGGESTIONS = [
  "Phone under ₹20K", "Laptop for coding", "Gaming Mouse",
  "Wireless Earbuds", "Best monitor", "Smart watch",
];

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8l1.8-1.8M18 6l1.8-1.8" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.5 14.2A8.5 8.5 0 019.8 3.5a.6.6 0 00-.75-.75A10 10 0 1021.25 15a.6.6 0 00-.75-.8z" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0014 0M12 19v3" />
    </svg>
  );
}

function ClipIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.5l-8.5 8.5a4.5 4.5 0 01-6.4-6.4l9-9a3 3 0 014.3 4.2l-9 9a1.5 1.5 0 01-2.2-2.1l8-8" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <motion.svg
      className="ps-icon"
      viewBox="0 0 24 24"
      fill="none"
      animate={{ rotate: [0, 14, -10, 0], scale: [1, 1.18, 1] }}
      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <path
        d="M12 2.2c.65 3.55 1.5 5.85 2.75 7.1 1.25 1.25 3.55 2.1 7.1 2.75-3.55.65-5.85 1.5-7.1 2.75-1.25 1.25-2.1 3.55-2.75 7.1-.65-3.55-1.5-5.85-2.75-7.1-1.25-1.25-3.55-2.1-7.1-2.75 3.55-.65 5.85-1.5 7.1-2.75 1.25-1.25 2.1-3.55 2.75-7.1z"
        fill="currentColor"
      />
      <circle cx="19.5" cy="4.5" r="1" fill="currentColor" opacity="0.85" />
    </motion.svg>
  );
}

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [opened, setOpened] = useState(false);
  const [attachment, setAttachment] = useState(null); // { file, name, type, previewUrl }
  const bodyRef = useRef(null);
  const fileInputRef = useRef(null);
  const MAX_FILE_MB = 8;

  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);
  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [messages, loading]);
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await axios.get(`${API_URL}/health`);
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 5000);
    return () => clearInterval(interval);
  }, []);

  const send = async (overrideText) => {
    const text = overrideText || input;
    const currentAttachment = attachment;
    if (!text.trim() && !currentAttachment) return;
    if (loading) return;

    const userMsg = {
      sender: "user",
      text: text || (currentAttachment
        ? `Sent ${currentAttachment.type === "application/pdf" ? "a PDF" : "an image"}`
        : ""),
      attachmentPreview: currentAttachment
        ? { type: currentAttachment.type, previewUrl: currentAttachment.previewUrl, name: currentAttachment.name }
        : null,
    };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    if (!overrideText) setInput("");
    setAttachment(null);
    setLoading(true);
    try {
      let res;
      if (currentAttachment) {
        const formData = new FormData();
        formData.append("message", text);
        formData.append("file", currentAttachment.file);
        res = await axios.post(`${API_URL}/chat`, formData);
      } else {
        res = await axios.post(`${API_URL}/chat`, { message: text });
      }
      setMessages([...newMsgs, { sender: "bot", text: res.data.message, products: res.data.products }]);
    } catch {
      setMessages([...newMsgs, { sender: "bot", text: "Something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  const chatSend = (q) => { if (!opened) setOpened(true); setTimeout(() => send(q), 300); };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    if (!isImage && !isPdf) {
      setMessages(m => [...m, { sender: "bot", text: "I can only look at images or PDFs right now — try attaching one of those." }]);
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setMessages(m => [...m, { sender: "bot", text: `That file's a bit large — please attach something under ${MAX_FILE_MB}MB.` }]);
      return;
    }
    setAttachment({
      file,
      name: file.name,
      type: file.type,
      previewUrl: isImage ? URL.createObjectURL(file) : null,
    });
  };

  const removeAttachment = () => {
    if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl);
    setAttachment(null);
  };

  return (
    <>
      <WaveBackground />

      <nav className="navbar">
        <div className="nav-brand">🛒Aura.com</div>
        <div className="nav-right">
          <motion.button
            className="theme-btn"
            whileHover={{ y: -2, scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{ display: "flex" }}
              >
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      <section className="hero">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Shop Smarter with <span className="grad">Aura Assistant</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          Smart recommendations. Honest answers. A seamless shopping experience designed to help you choose with confidence.
        </motion.p>
      </section>

      <div className="showcase">
        {SHOWCASE.map((s, i) => (
          <motion.div
            key={i}
            className="show-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            onClick={() => chatSend(`Tell me about ${s.name}`)}
          >
            <div className="show-card-img"><img src={s.img} alt={s.name} loading="lazy" /></div>
            <div className="show-card-body">
              <div className="sc-name">{s.name}</div>
              <div className="sc-cat">{s.cat}</div>
              <div className="sc-price">{s.price}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="fab-wrap">
        <span className="fab-tooltip">Chat with Aura</span>
        <motion.span
          className="fab-ring"
          animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.button
          className="fab"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setOpened(!opened)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={opened ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ display: "flex" }}
            >
              {opened ? "✖️" : "🤖"}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence>
        {opened && (
          <>
            <motion.div
              className="chat-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpened(false)}
            />
            <motion.div
              className="chat-panel"
              initial={{ opacity: 0, scale: 0.92, x: "-50%", y: "-46%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              exit={{ opacity: 0, scale: 0.94, x: "-50%", y: "-47%" }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              style={{ position: "fixed", left: "50%", top: "50%" }}
            >
              <div className="chat-header">
                <div className="chat-avatar">🤖</div>
                <div className="chat-header-info">
                  <div className="ch-name">Aura Assistant</div>
                  <div className={`ch-status ${isOnline ? "online" : "offline"}`}>
                    <span className="status-dot"></span>
                    {isOnline ? "Online" : "Offline"}
                  </div>
                </div>
                <div className="chat-header-actions">
                  <button className="chat-min-btn" onClick={() => setOpened(false)}>—</button>
                  <button className="chat-close" onClick={() => setOpened(false)}>✕</button>
                </div>
              </div>

              {messages.length === 0 ? (
                <div className="welcome">
                  <div className="welcome-head">
                    <div className="welcome-icon">👋</div>
                    <h3>Welcome!</h3>
                    <p>I'm your shopping assistant. How can I help?</p>
                  </div>

                  <div className="quick-actions-row">
                    {ACTIONS.map((a, i) => (
                      <motion.button
                        key={i}
                        className="qa-btn"
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => send(a.query)}
                      >
                        <span className="qa-icon">{a.icon}</span>{a.label}
                      </motion.button>
                    ))}
                  </div>

                  <div className="popular-searches-box">
                    <div className="ps-header">
                      <SparkleIcon />
                      Popular searches
                    </div>
                    <div className="ps-chips">
                      {SUGGESTIONS.map((s, i) => (
                        <motion.button key={i} className="ps-chip" whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => send(s)}>
                          {s}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="chat-body" ref={bodyRef}>
                  {messages.map((m, i) => <Message key={i} {...m} />)}
                  {loading && <Message sender="bot" animating />}
                </div>
              )}

              <div className="chat-input-wrap">
                <div className="chat-input">
                  <input
                    placeholder={isOnline ? "Ask about any product..." : "Assistant is offline..."}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && send()}
                    disabled={!isOnline || loading}
                  />
                  <motion.button
                    className="send-btn"
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => send()}
                    disabled={!isOnline || loading || (!input.trim())}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </motion.button>
                </div>
                <div className="chat-disclaimer">
                  Aura can make mistakes. Please verify details.
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}