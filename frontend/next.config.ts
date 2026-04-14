import type { NextConfig } from "next";

/** Paths from the Lovable reference bundle — see docs/phase1-architecture.md */
const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/value", destination: "/value-forecast", permanent: false },
      { source: "/org-blueprint", destination: "/blueprint", permanent: false },
      { source: "/agentcore", destination: "/agentic", permanent: false },
      { source: "/ml-studio", destination: "/mlops", permanent: false },
      { source: "/physical-ai", destination: "/industrial", permanent: false },
      { source: "/ato", destination: "/readiness", permanent: false },
      { source: "/geneye-chat", destination: "/chat", permanent: false },
      { source: "/ai-engineering", destination: "/engineering", permanent: false },
    ];
  },
};

export default nextConfig;
