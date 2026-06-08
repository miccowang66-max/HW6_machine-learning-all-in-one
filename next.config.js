/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  reactStrictMode: true,
  ...(isGitHubPages
    ? {
        output: "export",
        basePath: "/HW6_machine-learning-all-in-one",
        images: { unoptimized: true },
      }
    : {}),
};

module.exports = nextConfig;
