import { Sidebar } from "./components/Sidebar";
import { EmailList } from "./components/EmailList";
import { EmailDetail } from "./components/EmailDetail";
import { ComposeModal } from "./components/ComposeModal";
import { TopBar } from "./components/TopBar";
import { useEmailStore } from "./components/emailStore";

export default function App() {
  const { selectedEmail, composeOpen } = useEmailStore();

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{
            backgroundColor: "var(--orb-color-1)",
            opacity: "var(--orb-opacity)",
          }}
        ></div>
        <div
          className="absolute top-40 right-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"
          style={{
            backgroundColor: "var(--orb-color-2)",
            opacity: "var(--orb-opacity)",
          }}
        ></div>
        <div
          className="absolute bottom-20 left-1/2 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"
          style={{
            backgroundColor: "var(--orb-color-3)",
            opacity: "var(--orb-opacity)",
          }}
        ></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 h-full flex flex-col">
        <TopBar />

        <div className="flex-1 flex overflow-hidden p-4 gap-4">
          <Sidebar />

          <div className="flex-1 flex gap-4 overflow-hidden">
            <EmailList />

            {selectedEmail && (
              <div className="flex-1">
                <EmailDetail />
              </div>
            )}
          </div>
        </div>
      </div>

      {composeOpen && <ComposeModal />}
    </div>
  );
}
