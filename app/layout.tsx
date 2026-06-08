import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ML Algorithms Panorama — Interactive Learning Dashboard",
  description: "Top 10 Machine Learning Algorithms — dynamic, interactive learning platform with face-aware engagement tracking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          integrity="sha384-n8MVd4RsNHpzWDII3o62i1w6nT/e2QCxMm2i5hCxBJPmuWQoGLQK7VMx5GM4HqVG"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans min-h-screen bg-slate-950 text-slate-100">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
