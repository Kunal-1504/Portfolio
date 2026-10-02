import type { NextConfig } from "next";
const pages = process.env.NEXT_PUBLIC_DEPLOY_TARGET === "github-pages";
const config: NextConfig = {
  poweredByHeader: false,
  ...(pages
    ? {
        output: "export",
        trailingSlash: true,
        basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
        images: { unoptimized: true },
      }
    : {
        async headers() {
          return [
            {
              source: "/api/:path*",
              headers: [
                {
                  key: "Access-Control-Allow-Origin",
                  value:
                    process.env.ALLOWED_WEB_ORIGIN ||
                    "https://kunal-1504.github.io",
                },
                {
                  key: "Access-Control-Allow-Methods",
                  value: "GET, POST, OPTIONS",
                },
                { key: "Access-Control-Allow-Headers", value: "Content-Type" },
                { key: "Vary", value: "Origin" },
              ],
            },
          ];
        },
      }),
  turbopack: { root: process.cwd() },
};
export default config;
