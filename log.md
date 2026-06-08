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
