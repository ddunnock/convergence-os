import { Inbox, Send, Star, Trash2, Archive, Edit } from "lucide-react";
import { useEmailStore } from "./emailStore";

const folders = [
  { icon: Inbox, label: "Inbox", count: 12, id: "inbox" },
  { icon: Star, label: "Starred", count: 3, id: "starred" },
  { icon: Send, label: "Sent", count: 24, id: "sent" },
  { icon: Archive, label: "Archive", count: 156, id: "archive" },
  { icon: Trash2, label: "Trash", count: 8, id: "trash" },
];

const labels = [
  { name: "Work", color: "bg-pink-500" },
  { name: "Personal", color: "bg-purple-500" },
  { name: "Important", color: "bg-cyan-500" },
];

export function Sidebar() {
  const { selectedFolder, setSelectedFolder, setComposeOpen } = useEmailStore();

  return (
    <div className="w-20 glass-strong rounded-2xl p-3 flex flex-col gap-3">
      {/* Compose Button */}
      <button
        onClick={() => setComposeOpen(true)}
        className="glass-button-primary rounded-xl p-3 flex items-center justify-center group"
        title="Compose"
      >
        <Edit
          className="group-hover:rotate-12 transition-transform"
          size={20}
        />
      </button>

      {/* Folders */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          {folders.map((folder) => {
            const Icon = folder.icon;
            const isActive = selectedFolder === folder.id;

            return (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`relative w-full glass-button rounded-xl p-3 flex items-center justify-center group transition-all ${
                  isActive ? "neon-border-pink" : ""
                }`}
                title={folder.label}
              >
                <Icon
                  className={isActive ? "glow-primary" : "glow-accent"}
                  size={20}
                />
                {folder.count > 0 && (
                  <span
                    className="absolute -top-1 -right-1 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center leading-none"
                    style={{ aspectRatio: "1/1" }}
                  >
                    {folder.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Labels */}
        <div className="mt-6 space-y-2">
          {labels.map((label) => (
            <button
              key={label.name}
              className="w-full glass-button rounded-xl p-3 flex items-center justify-center"
              title={label.name}
            >
              <div className={`w-4 h-4 rounded-full ${label.color}`}></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
