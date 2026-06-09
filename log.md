# Work Log — 2026-06-08

## Vercel Deployment

- Removed `output: "export"` and `basePath` from `next.config.js` to enable native Next.js serving
- Created `vercel.json` with `framework: "nextjs"` preset
- Project deployed to Vercel at: https://hw-6-machine-learning-all-in-one-8n.vercel.app/

## Python ML Algorithms Download

- Created `public/ml_algorithms.py` — scratch implementations of all 10 ML algorithms:
  - Linear Regression, Logistic Regression, Decision Tree, Random Forest
  - SVM, Naive Bayes, KNN, Gradient Boosting, K-Means, PCA
- Includes a `demo()` function that runs each algorithm on synthetic data
- Only dependency: `numpy`
- Added "Download .py" button in the header navigation (`app/page.tsx`)

## README Updates

- Added Vercel live demo URL
- Added Python download link
- Updated design description: Dark → Light theme
- Updated project structure to include `public/`, `vercel.json`, `.github/workflows/`
- Removed localhost references from Live Demo section

## 2026-06-09 — Interactive SVG Visualizations

- **Fixed**: Slider values in MathSandbox were isolated from SVG visualization components
- **Root cause**: Slider state was local to `MathSandbox.tsx` (`useState`); Visual tab SVGs were all hardcoded static coordinates
- **Solution**: Lifted slider state to `app/page.tsx`, threaded through `MainContentView` to both `MathSandbox` and all visualization sub-components
- **Changes** (3 files):
  - `components/MathSandbox.tsx` — Exported `sliderConfigs`; changed to receive `values` and `onSliderChange` from parent props
  - `app/page.tsx` — Added `sliderValues` state with `useEffect` reset on algorithm change; `handleSliderChange` callback
  - `components/MainContentView.tsx` — Updated props to accept `sliderValues`/`onSliderChange`; made all 6 SVG viz components data-driven:
    - **RegressionVisualization** — Dynamic line/sigmoid curve from β₀/β₁/ε or w/b
    - **TreeVisualization** — Node colors reflect Gini impurity from P₁/P₂; Random Forest tree count from B
    - **KMeansVisualization** — Cluster count from K, centroid positions from μ₁/μ₂
    - **SVMVisualization** — Margin width computed from 2/‖w‖
    - **PCAVisualization** — PC arrow lengths scaled by eigenvalues λ₁/λ₂
- Bumped version to v1.2 for deployment verification
- No backend/Python involved — project is pure client-side Next.js/React
