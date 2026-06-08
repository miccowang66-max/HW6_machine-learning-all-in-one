# Changelog

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
