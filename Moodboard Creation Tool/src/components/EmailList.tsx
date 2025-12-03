import { Star, Paperclip } from "lucide-react";
import { useEmailStore } from "./emailStore";
import { Email } from "./emailStore";

function EmailItem({ email }: { email: Email }) {
  const { selectedEmail, setSelectedEmail } = useEmailStore();
  const isSelected = selectedEmail?.id === email.id;

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const emailDate = new Date(date);
    const diffMs = now.getTime() - emailDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  };

  return (
    <button
      onClick={() => setSelectedEmail(email)}
      className={`w-full glass-button rounded-xl p-4 text-left transition-all ${
        isSelected ? "glow-border-accent" : ""
      } ${!email.read ? "border-l-4 border-l-indigo-500" : ""}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
              email.avatarColor
            }`}
          >
            {email.from.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p
                className={`truncate ${email.read ? "" : "glow-primary"}`}
                style={
                  email.read ? { color: "var(--text-secondary)" } : undefined
                }
              >
                {email.from}
              </p>
              {email.hasAttachment && (
                <Paperclip
                  className="text-indigo-600 flex-shrink-0"
                  size={14}
                />
              )}
            </div>
            <p className="truncate" style={{ color: "var(--text-tertiary)" }}>
              {email.subject}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <span className="text-nowrap" style={{ color: "var(--text-muted)" }}>
            {getTimeAgo(email.date)}
          </span>
          {email.starred && (
            <Star className="text-amber-400 fill-current" size={16} />
          )}
        </div>
      </div>
      <p className="line-clamp-2" style={{ color: "var(--text-tertiary)" }}>
        {email.preview}
      </p>
      {email.labels && email.labels.length > 0 && (
        <div className="flex gap-2 mt-2">
          {email.labels.map((label) => (
            <span
              key={label}
              className="glass px-2 py-1 rounded-lg text-indigo-600"
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

export function EmailList() {
  const { filteredEmails, selectedFolder } = useEmailStore();

  return (
    <div className="w-96 glass-strong rounded-2xl flex flex-col">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="glow-accent capitalize">{selectedFolder}</h2>
          <span
            className="glass px-3 py-1 rounded-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            {filteredEmails.length} emails
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredEmails.map((email) => (
          <EmailItem key={email.id} email={email} />
        ))}

        {filteredEmails.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No emails found</p>
          </div>
        )}
      </div>
    </div>
  );
}
