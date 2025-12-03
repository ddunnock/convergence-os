import { create } from "zustand";

export interface Email {
  id: string;
  from: string;
  email: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  read: boolean;
  starred: boolean;
  folder: string;
  labels?: string[];
  hasAttachment?: boolean;
  attachments?: { name: string; size: string }[];
  avatarColor: string;
}

interface EmailStore {
  emails: Email[];
  selectedEmail: Email | null;
  selectedFolder: string;
  searchQuery: string;
  composeOpen: boolean;
  setSelectedEmail: (email: Email | null) => void;
  setSelectedFolder: (folder: string) => void;
  setSearchQuery: (query: string) => void;
  setComposeOpen: (open: boolean) => void;
  filteredEmails: Email[];
}

const avatarColors = [
  "bg-gradient-to-br from-indigo-500 to-purple-500",
  "bg-gradient-to-br from-blue-500 to-cyan-500",
  "bg-gradient-to-br from-purple-500 to-pink-500",
  "bg-gradient-to-br from-teal-500 to-blue-500",
];

const mockEmails: Email[] = [
  {
    id: "1",
    from: "Sarah Chen",
    email: "sarah.chen@techcorp.com",
    subject: "Q4 Project Timeline Update",
    preview:
      "Hey team, I wanted to share the updated timeline for our Q4 deliverables...",
    body: `Hey team,

I wanted to share the updated timeline for our Q4 deliverables. We've made significant progress on the main features and are on track to meet our December deadline.

Key Updates:
- Phase 1 completed ahead of schedule
- Phase 2 currently in progress (85% complete)
- Phase 3 planning has begun

Please review the attached timeline and let me know if you have any concerns.

Best regards,
Sarah`,
    date: "2025-11-29T10:30:00",
    read: false,
    starred: true,
    folder: "inbox",
    labels: ["Work"],
    hasAttachment: true,
    attachments: [
      { name: "Q4_Timeline.pdf", size: "2.3 MB" },
      { name: "Progress_Report.xlsx", size: "856 KB" },
    ],
    avatarColor: avatarColors[0],
  },
  {
    id: "2",
    from: "Marcus Johnson",
    email: "marcus@design.studio",
    subject: "New Design System Components",
    preview:
      "I have finished the new component library. Check out the preview link below...",
    body: `Hi everyone,

I have finished the new component library for our design system. The components are now fully responsive and include dark mode support.

Preview Link: https://figma.com/preview/12345

Please take a look and share your feedback by end of week.

Thanks,
Marcus`,
    date: "2025-11-28T14:22:00",
    read: false,
    starred: false,
    folder: "inbox",
    labels: ["Work", "Important"],
    hasAttachment: false,
    avatarColor: avatarColors[1],
  },
  {
    id: "3",
    from: "Netflix",
    email: "info@netflix.com",
    subject: "Your monthly update is here!",
    preview:
      "See what is new this month - new releases, trending shows, and personalized recommendations...",
    body: `Hello!

This month we have added tons of new content just for you:

NEW RELEASES:
- The Crown Season 6
- Stranger Things: The Final Chapter
- Documentary: Planet Earth III

TRENDING NOW:
- Wednesday
- The Night Agent
- Love is Blind

Happy watching!
The Netflix Team`,
    date: "2025-11-27T09:15:00",
    read: true,
    starred: false,
    folder: "inbox",
    labels: ["Personal"],
    hasAttachment: false,
    avatarColor: avatarColors[2],
  },
  {
    id: "4",
    from: "Alex Rivera",
    email: "alex.rivera@startup.io",
    subject: "Coffee catch-up?",
    preview:
      "Hey! It has been a while. Want to grab coffee this week and catch up?",
    body: `Hey!

It has been a while since we last caught up. I would love to hear about what you have been working on.

Are you free for coffee sometime this week? I am flexible on Thursday or Friday afternoon.

Let me know!
Alex`,
    date: "2025-11-26T16:45:00",
    read: true,
    starred: false,
    folder: "inbox",
    labels: ["Personal"],
    hasAttachment: false,
    avatarColor: avatarColors[3],
  },
  {
    id: "5",
    from: "Jennifer Liu",
    email: "jliu@enterprise.com",
    subject: "URGENT: Server Maintenance Tonight",
    preview:
      "Quick heads up - we will be performing critical server maintenance tonight from 11 PM to 2 AM...",
    body: `Team,

Quick heads up - we will be performing critical server maintenance tonight from 11 PM to 2 AM EST.

IMPACT:
- All services will be offline during this window
- Database backups will be created before maintenance
- Expected downtime: 3 hours maximum

Please plan accordingly and notify your teams.

Thanks,
Jennifer Liu
IT Operations`,
    date: "2025-11-29T08:00:00",
    read: false,
    starred: true,
    folder: "inbox",
    labels: ["Work", "Important"],
    hasAttachment: false,
    avatarColor: avatarColors[0],
  },
  {
    id: "6",
    from: "David Park",
    email: "dpark@agency.com",
    subject: "Re: Campaign Performance Report",
    preview:
      "Thanks for the detailed report! The numbers look great. A few questions about the metrics...",
    body: `Hi,

Thanks for the detailed report! The numbers look fantastic - we are seeing a 45% increase in engagement.

A few questions:
1. What is driving the spike in mobile traffic?
2. Can we replicate this success for the next campaign?
3. What is our budget allocation looking like?

Let us schedule a call to discuss further.

Best,
David`,
    date: "2025-11-25T11:30:00",
    read: true,
    starred: false,
    folder: "inbox",
    labels: ["Work"],
    hasAttachment: true,
    attachments: [{ name: "Campaign_Report.pdf", size: "1.8 MB" }],
    avatarColor: avatarColors[1],
  },
  {
    id: "7",
    from: "Emma Thompson",
    email: "emma.t@creative.co",
    subject: "Weekend Hiking Trip",
    preview: "Planning a hiking trip to Mount Rainier this weekend. You in?",
    body: `Hey!

Planning a hiking trip to Mount Rainier this weekend. The weather looks perfect!

DETAILS:
- Saturday, 6 AM departure
- Moderate difficulty trail (8 miles)
- Packed lunch at the summit
- Back by 6 PM

Let me know if you're interested!

Emma`,
    date: "2025-11-24T19:20:00",
    read: true,
    starred: false,
    folder: "inbox",
    labels: ["Personal"],
    hasAttachment: false,
    avatarColor: avatarColors[2],
  },
  {
    id: "8",
    from: "LinkedIn",
    email: "notifications@linkedin.com",
    subject: "You appeared in 47 searches this week",
    preview:
      "Your profile is getting noticed! See who has been viewing your profile...",
    body: `Hi there,

Your profile is getting noticed! Here is your weekly summary:

PROFILE VIEWS: 47 (↑ 23%)
SEARCH APPEARANCES: 156 (↑ 15%)
POST IMPRESSIONS: 2,341 (↑ 67%)

Top viewers:
- Senior recruiters in your industry
- Professionals at top tech companies
- Former colleagues

Keep your profile updated to maximize opportunities!

The LinkedIn Team`,
    date: "2025-11-23T10:00:00",
    read: true,
    starred: false,
    folder: "inbox",
    labels: ["Personal"],
    hasAttachment: false,
    avatarColor: avatarColors[3],
  },
  {
    id: "9",
    from: "Rachel Martinez",
    email: "rachel@finance.com",
    subject: "Budget Approval Required",
    preview:
      "The Q1 2026 budget proposal is ready for your review and approval...",
    body: `Hi,

The Q1 2026 budget proposal is ready for your review and approval.

SUMMARY:
- Total Budget: $2.4M
- Marketing: $850K
- Development: $1.1M
- Operations: $450K

Please review the attached spreadsheet and approve by end of day Wednesday.

Thanks,
Rachel Martinez
Finance Department`,
    date: "2025-11-29T07:15:00",
    read: false,
    starred: true,
    folder: "inbox",
    labels: ["Work", "Important"],
    hasAttachment: true,
    attachments: [{ name: "Q1_2026_Budget.xlsx", size: "1.2 MB" }],
    avatarColor: avatarColors[0],
  },
  {
    id: "10",
    from: "Tom Anderson",
    email: "tom@photography.pro",
    subject: "Photo Shoot Scheduled",
    preview:
      "Confirmed for next Tuesday at 2 PM. Studio address and details attached...",
    body: `Hey!

Confirmed for next Tuesday at 2 PM.

LOCATION:
Studio 4
123 Photography Lane
Downtown Arts District

WHAT TO BRING:
- 2-3 outfit changes
- Any props you'd like to include
- Your energy and creativity!

Looking forward to it!

Tom Anderson
Professional Photography`,
    date: "2025-11-22T13:45:00",
    read: true,
    starred: false,
    folder: "inbox",
    labels: ["Personal"],
    hasAttachment: false,
    avatarColor: avatarColors[1],
  },
  {
    id: "11",
    from: "GitHub",
    email: "noreply@github.com",
    subject: "[repo-name] Pull Request #234 merged",
    preview:
      'Your pull request "Add authentication module" has been merged into main...',
    body: `Your pull request has been merged!

PULL REQUEST: #234
TITLE: Add authentication module
MERGED BY: @senior-dev
BRANCH: feature/auth → main

3 files changed
+245 additions
-12 deletions

View on GitHub: https://github.com/repo/pulls/234

Happy coding!
GitHub`,
    date: "2025-11-21T15:30:00",
    read: true,
    starred: false,
    folder: "inbox",
    labels: ["Work"],
    hasAttachment: false,
    avatarColor: avatarColors[2],
  },
  {
    id: "12",
    from: "Spotify",
    email: "no-reply@spotify.com",
    subject: "Your Discover Weekly is ready",
    preview:
      "Fresh music picks just for you. 30 new songs based on your listening...",
    body: `Hi there!

Your personalized Discover Weekly playlist is ready with 30 fresh tracks.

This week's highlights:
🎵 New indie releases you will love
🎵 Hidden gems from artists you follow
🎵 Throwbacks that match your vibe

Start listening now and let us know what you think!

Happy listening,
Spotify`,
    date: "2025-11-29T06:00:00",
    read: false,
    starred: false,
    folder: "inbox",
    labels: ["Personal"],
    hasAttachment: false,
    avatarColor: avatarColors[3],
  },
];

export const useEmailStore = create<EmailStore>((set, get) => ({
  emails: mockEmails,
  selectedEmail: null,
  selectedFolder: "inbox",
  searchQuery: "",
  composeOpen: false,
  setSelectedEmail: (email) => set({ selectedEmail: email }),
  setSelectedFolder: (folder) =>
    set({ selectedFolder: folder, selectedEmail: null }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setComposeOpen: (open) => set({ composeOpen: open }),
  get filteredEmails() {
    const { emails, selectedFolder, searchQuery } = get();

    let filtered = emails.filter((email) => email.folder === selectedFolder);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (email) =>
          email.from.toLowerCase().includes(query) ||
          email.subject.toLowerCase().includes(query) ||
          email.preview.toLowerCase().includes(query)
      );
    }

    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },
}));
