# Changelog

## v1.1.0 — 2026-06-08

### Design System (UI UX Pro Max)

- **Typography** — Added Fira Sans (UI) + Fira Code (monospace/data) via Google Fonts
- **Focus States** — Global `focus-visible` ring (blue/2px) on all interactive elements
- **Reduced Motion** — `prefers-reduced-motion: reduce` media query disables animations
- **Skip Link** — Added "Skip to main content" for keyboard navigation (WCAG)
- **Cursor Pointer** — Added to all buttons, tabs, cards, and clickable elements
- **Icons** — Replaced all emoji icons with Lucide SVG icons (BookOpen, Calculator, BarChart3, Lightbulb, TrendingUp, AlertTriangle, CheckCircle2, Brain, Search, Triangle, Wand2)
- **Glass Cards** — Enhanced with subtle box-shadow for better depth perception
- **Transitions** — Standardized to 200ms duration across all hover/focus states
- **Accessibility** — Added `aria-label` to search input, sliders, camera buttons, close buttons
- **Main Content ID** — Added `id="main-content"` to `<main>` for skip link target

### Files Changed

- `app/globals.css` — fonts, focus-visible, reduced-motion, skip-link, glass-card shadow
- `app/layout.tsx` — font classes, skip link, preconnect for fonts
- `app/page.tsx` — main content id, aria-label on GitHub link
- `components/AlgorithmNav.tsx` — cursor-pointer, aria-label on search
- `components/MainContentView.tsx` — Lucide icons, cursor-pointer on tabs
- `components/MathSandbox.tsx` — Lucide icons, aria-labels on sliders/buttons
- `components/FaceApiWidget.tsx` — cursor-pointer, aria-labels on camera buttons
- `components/HelpModal.tsx` — cursor-pointer, aria-labels on close buttons
- `tailwind.config.ts` — fontFamily config for Fira Sans/Code

## v1.0.0 — 2026-06-08

### Added

- **Algorithm Panorama Sidebar** — searchable list of 10 ML algorithms with supervised/unsupervised tags, Lucide icons, and animated active indicators
- **Concept Deep-Dive View** — definition, pros & cons grid, and real-world use cases per algorithm with tab-based navigation
- **Interactive Math Sandbox** — LaTeX-rendered formulas with per-algorithm sliders for dynamic parameter tuning and live computation results
- **SVG Visualizations** — inline diagrams for Linear Regression, Logistic Regression, Decision Tree, Random Forest, SVM, K-Means, and PCA
- **Face API Widget** — floating webcam overlay with `<video>` + `<canvas>`, simulated face detection bounding box, and mood-based facial landmark drawing
- **Auto Help Modal** — triggers when `confused` mood is detected via Face API, offering learning resources and suggestions
- **Dark Dashboard Theme** — Slate-950 base with glass-morphism cards, gradient accents, and custom scrollbar
- **Framer Motion** — layout transitions, spring-animated progress bars, entrance animations
- **README** — project overview with badges, feature sections, tech stack table, project structure, and deployment guide
- **CHANGELOG** — this file

### Tech

- Next.js 14 (App Router) with TypeScript
- Tailwind CSS 3.x with custom dashboard color palette
- `@matejmazur/react-katex` for LaTeX rendering
- Lucide React for icons
- Framer Motion for animations
