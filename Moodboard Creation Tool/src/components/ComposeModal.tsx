import { X, Paperclip, Image, Smile, Send } from "lucide-react";
import { useState } from "react";
import { useEmailStore } from "./emailStore";

export function ComposeModal() {
  const { setComposeOpen } = useEmailStore();
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSend = () => {
    // Add send logic here
    setComposeOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setComposeOpen(false)}
      ></div>

      {/* Modal */}
      <div className="relative glass-strong rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border-2 border-indigo-500/30">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="glow-primary">New Message</h2>
          <button
            onClick={() => setComposeOpen(false)}
            className="glass-button rounded-lg p-2 hover:scale-105 transition-transform"
          >
            <X className="glow-accent" size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* To */}
          <div className="flex items-center gap-3">
            <label style={{ color: "var(--text-tertiary)" }} className="w-20">
              To:
            </label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="flex-1 glass rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              style={{ color: "var(--input-text)" }}
            />
          </div>

          {/* Subject */}
          <div className="flex items-center gap-3">
            <label style={{ color: "var(--text-tertiary)" }} className="w-20">
              Subject:
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              className="flex-1 glass rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              style={{ color: "var(--input-text)" }}
            />
          </div>

          {/* Body */}
          <div className="flex gap-3">
            <label
              style={{ color: "var(--text-tertiary)" }}
              className="w-20 pt-3"
            >
              Message:
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message..."
              rows={12}
              className="flex-1 glass rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
              style={{ color: "var(--input-text)" }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex items-center justify-between">
          <div className="flex gap-2">
            <button className="glass-button rounded-lg p-3 hover:scale-105 transition-transform">
              <Paperclip className="glow-accent" size={18} />
            </button>
            <button className="glass-button rounded-lg p-3 hover:scale-105 transition-transform">
              <Image className="glow-accent" size={18} />
            </button>
            <button className="glass-button rounded-lg p-3 hover:scale-105 transition-transform">
              <Smile className="glow-accent" size={18} />
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setComposeOpen(false)}
              className="glass-button rounded-xl px-6 py-3"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              className="glass-button-primary rounded-xl px-6 py-3 flex items-center gap-2"
            >
              <Send size={18} />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
