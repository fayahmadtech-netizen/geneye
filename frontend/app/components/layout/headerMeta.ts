/** Titles shown in the top bar (matches deployed Control Plane). */
const DEFAULT_SUBTITLE = "AI Transformation Office - GF";

export function getHeaderMeta(pathname: string): { title: string; subtitle: string } {
  const exact: Record<string, { title: string; subtitle?: string }> = {
    "/": { title: "AI Transformation Control Plane" },
    "/readiness": {
      title: "AI Transformation Office",
      subtitle: "Enterprise AI Readiness & Operating Model Diagnostic",
    },
    "/blueprint": { title: "AI Org Blueprint" },
    "/portfolio": { title: "UseCaseX Portfolio" },
    "/portfolio/capital": { title: "Portfolio & Capital" },
    "/governance-stack": { title: "AI Governance Stack" },
    "/value-forecast": { title: "Value Forecast" },
    "/agentic": { title: "AI AgentCore Platform" },
    "/engineering": { title: "AI Engineering Platform" },
    "/command-center": { title: "AI Command Center" },
    "/mlops": { title: "ML Studio" },
    "/industrial": { title: "Physical AI Platform" },
    "/control-tower": { title: "Control Tower" },
    "/governance": { title: "Governance & Risk" },
    "/maturity": { title: "Maturity Engine" },
    "/admin": { title: "Admin" },
    "/chat": { title: "GenEye Chat" },
    "/login": { title: "Sign in", subtitle: "GenEye" },
  };

  const hit = exact[pathname];
  if (hit) {
    return { title: hit.title, subtitle: hit.subtitle ?? DEFAULT_SUBTITLE };
  }

  if (pathname.startsWith("/readiness")) {
    return {
      title: "AI Transformation Office",
      subtitle: "Enterprise AI Readiness & Operating Model Diagnostic",
    };
  }

  if (pathname.startsWith("/chat")) {
    return { title: "GenEye Chat", subtitle: DEFAULT_SUBTITLE };
  }

  return { title: "GenEye", subtitle: DEFAULT_SUBTITLE };
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (parts.length === 1 && parts[0].length === 1) {
    return `${parts[0][0]}`.toUpperCase();
  }
  return "PL";
}
