# ML Algorithms Panorama — Interactive Learning Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![UI UX Pro Max](https://img.shields.io/badge/UI_UX_Pro_Max-v2.0-7c3aed?style=flat-square)](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](/LICENSE)

> A production-ready, interactive dashboard for dynamically learning the Top 10 Machine Learning Algorithms.
> **Next.js 14 · Tailwind CSS · Framer Motion · Face API Integration · UI UX Pro Max Design System**

---

## 🌐 Live Demo

| Platform | URL | Description |
|----------|-----|-------------|
| **Vercel** | [hw-6-machine-learning-all-in-one-8n.vercel.app](https://hw-6-machine-learning-all-in-one-8n.vercel.app/) | Production deployment |
| **Local Dev** | [http://localhost:3000](http://localhost:3000) | `npm run dev` |

> 📥 **[Download Python implementations](https://hw-6-machine-learning-all-in-one-8n.vercel.app/ml_algorithms.py)** — All 10 algorithms implemented from scratch in a single `.py` file.

---

## ✨ Features

### Algorithm Panorama

- 🔍 **Searchable Sidebar** — Filter 10 ML algorithms by name or summary in real-time
- 🏷 **Type Tagging** — Supervised (Green) / Unsupervised (Yellow) badges with Lucide icons
- 🎯 **ID Badge + Mini Summary** — Quick-glance overview of core logic per algorithm

### Dynamic Content View

- 📖 **Concept Deep-Dive** — Definition, real-world use cases, pros & cons grid for each algorithm
- 🧮 **Interactive Math Sandbox** — LaTeX-rendered formulas with live sliders; tweak coefficients and see dynamic computation results
- 📊 **Visual Diagram Placeholder** — SVG-based structure diagrams (Regression, Decision Tree, SVM, K-Means, PCA)

### Face API Integration Hub

- 📷 **Webcam Overlay** — `<video>` + absolute-positioned `<canvas>` with face detection bounding box simulation
- 😊 **Mood Tracking** — Real-time metrics: Attention %, Engagement %, Blink Rate
- 🆘 **Auto Help Modal** — Triggers a "Need Help?" popup when `confused` mood is detected

### Design & UX

- 🖤 **Dark Dashboard** — Slate-950 base with glass-morphism cards and blue gradient accents
- 🎞 **Framer Motion Animations** — Smooth layout transitions, spring-based slider bars, entrance animations
- 📱 **Responsive Layout** — Sidebar + Main Content flex layout

---

## 📊 Algorithms Coverage

| ID   | Name                    | Type         |
|------|-------------------------|--------------|
| 01   | Linear Regression       | Supervised   |
| 02   | Logistic Regression     | Supervised   |
| 03   | Decision Tree           | Supervised   |
| 04   | Random Forest           | Supervised   |
| 05   | SVM                     | Supervised   |
| 06   | Naive Bayes             | Supervised   |
| 07   | KNN                     | Supervised   |
| 08   | Gradient Boosting       | Supervised   |
| 09   | K-Means                 | Unsupervised |
| 10   | PCA                     | Unsupervised |

---

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> Node.js 18+ and npm 9+ are required.

---

## 🚀 Deployment

```bash
# Production build
npm run build

# Start production server
npm start
```

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push to GitHub
2. Import repo on [Vercel](https://vercel.com)
3. Vercel auto-detects Next.js — zero config needed

---

## 📁 Project Structure

```
ML-Algorithms-Panorama/
├── app/
│   ├── globals.css              # Tailwind directives + custom glass/tag utilities
│   ├── layout.tsx               # Root layout (dark theme, KaTeX CDN, metadata)
│   └── page.tsx                 # Main dashboard entry (sidebar + content + widgets)
├── components/
│   ├── AlgorithmNav.tsx          # Sidebar: searchable algorithm list with animated cards
│   ├── MainContentView.tsx       # Concept / Math / Visual tabs + SVG diagrams
│   ├── MathSandbox.tsx           # Interactive LaTeX sliders with dynamic computation
│   ├── FaceApiWidget.tsx         # Floating webcam overlay with face metrics display
│   └── HelpModal.tsx             # Auto-triggered "Need Help?" modal
├── lib/
│   └── data.ts                  # Algorithm data source (ID, name, formula, pros/cons)
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 14](https://nextjs.org) | React framework (App Router) |
| [TypeScript](https://www.typescriptlang.org) | Type-safe development |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | Declarative animations |
| [Lucide React](https://lucide.dev) | Icon library |
| [KaTeX](https://katex.org) | LaTeX math rendering |
| [react-katex](https://github.com/talyssonoc/react-katex) | React KaTeX wrapper |

---

## 📄 Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Create optimized production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 📄 License

MIT
