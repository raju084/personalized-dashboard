# 🚀 Pulse | Personalized Content Dashboard

An interactive, responsive, and dynamic **Personalized Content Dashboard** built for users to track, customize, and engage with content across multiple categories (Technology, Finance, Sports, Entertainment, Science, Health, Gaming) and content types (News Articles, Movie/Music Recommendations, Social Media Posts).

Built with **Next.js 14 (App Router), React 18, TypeScript, Redux Toolkit, Tailwind CSS, Framer Motion, Vitest, and Cypress**.

---

## 🌟 Key Features

### 1. Personalized Content Feed
* **User Preferences:** Configure favorite categories (Technology, Finance, Sports, etc.) from a slide-out settings panel or sidebar. Preferences persist across page reloads via Redux + `localStorage`.
* **API Integration & Fallbacks:** Fetches content dynamically. Supports live **NewsAPI** key integration in settings while providing realistic, rich fallback mock generators out-of-the-box.
* **Interactive Content Cards:** Display cards for News, Movies/Music recommendations, and Social posts with images, video/audio preview modals, reading time, ratings, likes, comments, and bookmark actions.

### 2. User Dashboard Layout
* **Responsive Layout:** Glassmorphism UI with a collapsible sidebar and top sticky header.
* **Sections:**
  * **Personalized Feed (`/`):** Unified reorderable feed of News, Recommendations, and Social Media posts.
  * **Trending Section (`/trending`):** High-engagement viral content across categories.
  * **Favorites Collection (`/favorites`):** Bookmarked items saved for offline reading.
  * **Content Analytics (`/analytics`):** Real-time engagement graphs, category counts, and live stream status.

### 3. Search & Filtering
* **Debounced Search:** 300ms debounced search bar with instant cross-category matching across titles, descriptions, authors, and tags.
* **Category & Content Type Pills:** Filter by content types (News, Recommendations, Social) or specific categories.

### 4. Advanced UI/UX & Interactive Reordering
* **Drag-and-Drop Reordering:** Reorder cards in real time using **Framer Motion `Reorder`**.
* **Dark Mode:** Dark / Light theme toggle persisted in Redux store and root HTML class.
* **Real-time Live Stream (WebSocket/SSE Simulation):** Periodically pushes new breaking news and social updates directly into the feed with animated toast notifications.
* **Multi-Language Support (i18n):** Internationalization dictionary supporting **English 🇺🇸, Spanish 🇪🇸, French 🇫🇷, and German 🇩🇪**.
* **Audio & Video Previews:** Built-in modal media player for movie trailers and music preview tracks.

### 5. Testing Best Practices
* **Unit Testing (Vitest):** Tests for Redux slices (`preferencesSlice`, `feedSlice`), state mutations, category toggling, and real-time prepending logic.
* **E2E Testing (Cypress):** Test suites covering search input debouncing, bookmarking to favorites, settings modal execution, and navigation.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **State Management** | Redux Toolkit (`@reduxjs/toolkit`, `react-redux`) |
| **Styling** | Tailwind CSS + CSS Variables (Dark Mode & Glassmorphism) |
| **Animations & DnD** | Framer Motion (`Reorder.Group`, `Reorder.Item`) |
| **Icons** | Lucide React |
| **Unit Tests** | Vitest + `@testing-library/react` |
| **E2E Tests** | Cypress |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `v18.0.0` or higher (Tested on `v22.18.0`)
* **npm**: `v9.0.0` or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/personalized-content-dashboard.git
   cd personalized-content-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   npm run start
   ```

---

## 🧪 Running Tests

### Run Unit Tests (Vitest)
```bash
npm run test
```

### Run Cypress E2E Tests
```bash
# Open Cypress Test Runner GUI
npm run cypress:open

# Run Cypress headless in terminal
npm run cypress:run
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx            # Root Layout with Redux Provider & Metadata
│   ├── page.tsx              # Main Dashboard Page (Personalized Feed)
│   ├── globals.css           # Tailwind base, dark mode, glassmorphism CSS
│   ├── trending/page.tsx     # Trending Section Page
│   ├── favorites/page.tsx    # Favorites Section Page
│   └── analytics/page.tsx    # Content Analytics & Insights Dashboard
├── components/
│   ├── layout/               # Header & Sidebar Navigation
│   ├── feed/                 # ContentFeed, ContentCard, ContentModal
│   ├── search/               # Debounced SearchBar
│   ├── settings/             # SettingsModal (Categories, API keys, Dark Mode, i18n)
│   ├── ui/                   # Button, Badge, Modal, Toast
│   └── auth/                 # UserProfileModal & Mock Auth
├── store/
│   ├── index.ts              # Redux Store Configuration & Custom Hooks
│   ├── feedSlice.ts          # State for feed items, reordering, pagination
│   ├── preferencesSlice.ts   # Category preferences, theme, i18n language
│   ├── favoritesSlice.ts     # Bookmarked content items & localStorage
│   └── authSlice.ts          # User profile state
├── services/
│   ├── api.ts                # NewsAPI fetcher & fallback mock generator
│   ├── mockData.ts           # Realistic fallback content pool
│   ├── websocket.ts          # Real-time WebSocket feed simulator
│   └── i18n.ts               # Multi-language dictionary (EN, ES, FR, DE)
└── test/                     # Vitest unit test suites
cypress/
└── e2e/                      # Cypress end-to-end test specs
```
