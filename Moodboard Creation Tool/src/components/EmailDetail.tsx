import {
  Star,
  Reply,
  Forward,
  Trash2,
  Archive,
  MoreVertical,
  Paperclip,
  Download,
} from "lucide-react";
import { useEmailStore } from "./emailStore";

export function EmailDetail() {
  const { selectedEmail } = useEmailStore();

  if (!selectedEmail) return null;

  return (
    <div className="glass-strong rounded-2xl flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-start justify-between mb-4">
          <h2 className="glow-primary flex-1 pr-4">{selectedEmail.subject}</h2>
          <div className="flex gap-2 flex-shrink-0">
            <button className="glass-button rounded-lg p-2 hover:scale-105 transition-transform">
              <Star
                className={
                  selectedEmail.starred
                    ? "text-amber-400 fill-current"
                    : "glow-accent"
                }
                size={18}
              />
            </button>
            <button className="glass-button rounded-lg p-2 hover:scale-105 transition-transform">
              <Archive className="glow-accent" size={18} />
            </button>
            <button className="glass-button rounded-lg p-2 hover:scale-105 transition-transform">
              <Trash2 className="glow-accent" size={18} />
            </button>
            <button className="glass-button rounded-lg p-2 hover:scale-105 transition-transform">
              <MoreVertical className="glow-accent" size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${selectedEmail.avatarColor}`}
          >
            {selectedEmail.from.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="glow-accent">{selectedEmail.from}</p>
                <p style={{ color: "var(--text-tertiary)" }}>
                  {selectedEmail.email}
                </p>
              </div>
              <span style={{ color: "var(--text-muted)" }}>
                {new Date(selectedEmail.date).toLocaleString()}
              </span>
            </div>
            {selectedEmail.labels && selectedEmail.labels.length > 0 && (
              <div className="flex gap-2 mt-2">
                {selectedEmail.labels.map((label) => (
                  <span
                    key={label}
                    className="glass px-3 py-1 rounded-lg text-indigo-600"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div
          className="whitespace-pre-wrap leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {selectedEmail.body}
        </div>

        {/* Attachments */}
        {selectedEmail.hasAttachment && selectedEmail.attachments && (
          <div className="mt-6 space-y-2">
            <p
              className="flex items-center gap-2"
              style={{ color: "var(--text-tertiary)" }}
            >
              <Paperclip size={16} />
              Attachments ({selectedEmail.attachments.length})
            </p>
            <div className="grid grid-cols-2 gap-3">
              {selectedEmail.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="glass-button rounded-xl p-4 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <Paperclip size={18} />
                    </div>
                    <div className="min-w-0">
                      <p
                        className="truncate"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {attachment.name}
                      </p>
                      <p style={{ color: "var(--text-muted)" }}>
                        {attachment.size}
                      </p>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    <Download className="glow-accent" size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-white/10">
        <div className="flex gap-3">
          <button className="glass-button-primary rounded-xl px-6 py-3 flex items-center gap-2">
            <Reply size={18} />
            Reply
          </button>
          <button className="glass-button rounded-xl px-6 py-3 flex items-center gap-2">
            <Forward size={18} />
            Forward
          </button>
        </div>
      </div>
    </div>
  );
}
