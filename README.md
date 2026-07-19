Streamophone

Streamophone is a language-practice platform where users connect with each other over real-time chat and video calls, with built-in AI-assisted messaging to help learners translate, refine, and adjust the tone of what they're saying — without leaving the conversation.


✨ Features


1:1 Real-time Chat — powered by Stream Chat (stream-chat-react v14)
Video Calling — powered by Stream Video (@stream-io/video-react-sdk)
In-chat AI toolbar for language learners:

🌐 Translate — translate the current draft into a target language
✨ Improve — polish grammar, clarity, and phrasing
😊 Friendly — rewrite in a casual, warm tone
💼 Formal — rewrite in a professional, formal tone



Custom theming — dual daisyUI themes (dark mytheme / light whats) built on Tailwind CSS 4
Auth-aware chat sessions — Stream user tokens issued per authenticated user
In-chat call links — start a video call and share a join link directly as a chat message



🛠 Tech Stack

LayerTechnologyFrameworkReact 19 + Vite 8RoutingReact Router v8Data fetchingTanStack QueryChatstream-chat, stream-chat-react (v14)Video@stream-io/video-react-sdkStylingTailwind CSS 4 + daisyUI 5Notificationsreact-hot-toastHTTP clientaxiosAvatarsDicebear (adventurer, open-peeps)State (misc)zustandIconslucide-react



## 📁 Project Structure

```text
backend/
├── config/          # Database, Stream & AI configuration
├── controllers/     # Route controllers
├── middleware/      # Authentication middleware
├── models/          # MongoDB schemas
├── prompts/         # AI prompt templates
├── routes/          # Express routes
├── services/        # Business logic & AI services
└── utils/           # Helper functions

frontend/
├── assets/
├── components/      # Reusable UI components
├── context/         # React Context
├── hooks/           # Custom hooks
├── lib/             # API & utilities
├── pages/           # Application pages
└── App.jsx
```


🚀 Getting Started

Prerequisites


Node.js (LTS recommended)
A Stream account with a Chat + Video app (API key/secret)
Backend service issuing Stream user tokens (getStreamToken)


Installation

bash git clone https://github.com/xoloAyush/streamophone.git
cd streamophone/frontend
npm install

Environment Variables

Create a .env file in the frontend root:

envVITE_STREAM_API_KEY=your_stream_api_key
VITE_API_BASE_URL=http://localhost:5000/api

Run locally

bashnpm run dev

Build for production

bashnpm run build
npm run preview


🤖 AI Messaging

The AIMessageComposer component sits inside the Stream Window alongside MessageComposer and reads/writes the current draft directly via Stream's textComposer (from useMessageComposerController, introduced in stream-chat-react v14):

jsxconst { textComposer } = useMessageComposerController();

const currentText = textComposer.text;      // read draft
textComposer.setText(res.text);             // write AI-transformed result back

Each action (translate, improve, friendly, formal) is exposed by the useAI hook along with its own loading flag, so buttons disable independently while a request is in flight.


🎨 Theming

Streamophone ships two daisyUI themes defined in index.css:


mytheme — dark mode default
whats — light mode


Both are built from OKLCH color tokens for consistent contrast across light/dark. Custom sidebar navigation styling is scoped to its own class (.nav-btn) to avoid colliding with daisyUI's global .btn.


📌 Known Notes / Gotchas


stream-chat-react v14 is a beta-track major version — hook names differ from v13 (useMessageComposerController replaces useMessageComposer, which itself replaced the older useMessageInputContext). Pin exact versions rather than caret ranges if stability matters.
Keep custom global CSS classes (e.g. sidebar buttons) scoped separately from daisyUI's .btn to avoid style leakage across the app.

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!