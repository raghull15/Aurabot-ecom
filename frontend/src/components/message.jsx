import { motion } from "framer-motion";
import ProductCards from "./productcards";

function formatText(text) {
  if (!text) return null;
  return text.split("\n").map((line, i) => {
    const parts = line.split(/\*\*([\s\S]*?)\*\*/g);
    return (
      <span key={i}>
        {parts.map((p, j) => (j % 2 === 1 ? <strong key={j}>{p}</strong> : p))}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    );
  });
}

const dotTransition = (delay) => ({
  duration: 0.9,
  repeat: Infinity,
  ease: "easeInOut",
  delay,
});

export default function Message({ sender, text, products, animating, attachmentPreviewUrl }) {
  if (animating) {
    return (
      <motion.div
        className="typing"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
      >
        <div className="typing-dots">
          {[0, 0.15, 0.3].map((delay, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
              transition={dotTransition(delay)}
            />
          ))}
        </div>
        <span className="typing-label">Aura is thinking...</span>
      </motion.div>
    );
  }

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {attachmentPreviewUrl && sender === "user" && (
        <motion.div
          className={`msg-wrapper ${sender}`}
          initial={{ opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
        >
          <div className="msg-bubble-container">
            <div className={`msg ${sender}`} style={{ padding: "4px" }}>
              <img src={attachmentPreviewUrl} alt="attachment" style={{
                maxWidth: "220px",
                maxHeight: "220px",
                borderRadius: "8px",
                objectFit: "cover",
              }} />
            </div>
          </div>
        </motion.div>
      )}
      {text && (
        <motion.div
          className={`msg-wrapper ${sender}`}
          initial={{ opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
        >
          {sender === "bot" && <div className="msg-avatar">🤖</div>}
          <div className="msg-bubble-container">
            <div className={`msg ${sender}`}>
              <div className="msg-content">{formatText(text)}</div>
              {sender === "bot" && <span className="msg-time">{timeStr}</span>}
            </div>
            {sender === "user" && (
              <div className="msg-status">
                {timeStr} <span className="status-check">✓✓</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
      {attachmentPreviewUrl && sender === "user" && (
        <motion.div
          className="device-scroll"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          style={{ marginTop: "4px" }}
        />
      )}
      {products?.length > 0 && (
        <motion.div
          className="device-scroll"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
            >
              <ProductCards product={p} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </>
  );
}