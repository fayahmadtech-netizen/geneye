"use client";

import type { jsPDF } from "jspdf";
import type { DiagnosticFull } from "../types/readiness";
import { buildReadinessExportPayload, readinessExportBaseName } from "./buildExportPayload";

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function lastAutoTableY(doc: jsPDF): number {
  const d = doc as jsPDF & { lastAutoTable?: { finalY: number } };
  return d.lastAutoTable?.finalY ?? 20;
}

function summaryTableRows(payload: ReturnType<typeof buildReadinessExportPayload>): string[][] {
  const s = payload.summary;
  return [
    ["Company", s.company_name ?? ""],
    ["Industry", s.industry ?? ""],
    ["Business units", String(s.num_business_units ?? "")],
    ["Current maturity", s.current_maturity ?? ""],
    ["AI org structure", s.ai_org_structure ?? ""],
    ["Average score ( / 5)", String(s.avg_score ?? "")],
    ["Roadmap", s.roadmap_label ?? ""],
    ["Roadmap (months)", String(s.roadmap_months ?? "")],
    ["Wizard step", String((s.current_step ?? 0) + 1)],
    ["Stakeholders", s.stakeholders.join("; ")],
    ["Strategic AI goals", s.strategic_ai_goals.join("; ")],
  ];
}

export async function downloadReadinessExportPdf(diagnostic: DiagnosticFull): Promise<void> {
  const [{ jsPDF }, autoTableMod, payload] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
    Promise.resolve(buildReadinessExportPayload(diagnostic)),
  ]);
  const autoTable = autoTableMod.default;

  const doc = new jsPDF();
  const margin = 14;
  let y = 16;
  doc.setFontSize(15);
  doc.text("GenEye — AI Readiness Diagnostic", margin, y);
  y += 7;
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text(`Exported: ${payload.exported_at}`, margin, y);
  doc.setTextColor(0);
  y += 10;

  autoTable(doc, {
    startY: y,
    head: [["Field", "Value"]],
    body: summaryTableRows(payload),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [30, 64, 175] },
    margin: { left: margin, right: margin },
  });
  y = lastAutoTableY(doc) + 10;

  doc.setFontSize(11);
  doc.text("Company maturity heatmap", margin, y);
  y += 6;
  autoTable(doc, {
    startY: y,
    head: [["Dimension", "Score"]],
    body: payload.heatmap.map((h) => [h.dimension, String(h.score)]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [30, 64, 175] },
    margin: { left: margin, right: margin },
  });
  y = lastAutoTableY(doc) + 10;

  doc.setFontSize(11);
  doc.text("Enterprise risk–value position", margin, y);
  y += 6;
  const ep = payload.enterprise_position;
  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value"]],
    body: [
      ["Quadrant", ep.quadrant],
      ["Value score", String(ep.value_score)],
      ["Risk score", String(ep.risk_score)],
    ],
    styles: { fontSize: 9 },
    headStyles: { fillColor: [30, 64, 175] },
    margin: { left: margin, right: margin },
  });
  y = lastAutoTableY(doc) + 8;
  doc.setFontSize(9);
  const descLines = doc.splitTextToSize(ep.description, 180);
  doc.text(descLines, margin, y);
  y += descLines.length * 4.5 + 10;

  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(11);
  doc.text("6-month ATO roadmap (reference phases)", margin, y);
  y += 6;
  autoTable(doc, {
    startY: y,
    head: [["Weeks", "Engine", "Focus", "Deliverables"]],
    body: payload.roadmap_phases.map((p) => [
      p.weeks,
      p.engine,
      p.title,
      String(p.deliverable_count),
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [30, 64, 175] },
    margin: { left: margin, right: margin },
  });
  y = lastAutoTableY(doc) + 10;

  if (y > 240) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(11);
  doc.text("Recommended next steps", margin, y);
  y += 6;
  autoTable(doc, {
    startY: y,
    head: [["#", "Action"]],
    body: payload.recommended_next_steps.map((t, i) => [String(i + 1), t]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [30, 64, 175] },
    margin: { left: margin, right: margin },
    columnStyles: { 0: { cellWidth: 12 }, 1: { cellWidth: 170 } },
  });

  const { stem, stamp } = readinessExportBaseName(diagnostic);
  doc.save(`GenEye-Readiness-${stem}-${stamp}.pdf`);
}

function prioritizationRows(p: Record<string, unknown>): string[][] {
  return Object.entries(p).map(([k, v]) => [
    k,
    typeof v === "object" && v !== null ? JSON.stringify(v) : String(v),
  ]);
}

export async function downloadReadinessExportExcel(diagnostic: DiagnosticFull): Promise<void> {
  const XLSX = await import("xlsx");
  const payload = buildReadinessExportPayload(diagnostic);

  const wb = XLSX.utils.book_new();

  const summarySheet = XLSX.utils.aoa_to_sheet([
    ["Field", "Value"],
    ...summaryTableRows(payload),
  ]);
  XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

  const heatmapSheet = XLSX.utils.aoa_to_sheet([
    ["Dimension", "Score"],
    ...payload.heatmap.map((h) => [h.dimension, h.score]),
  ]);
  XLSX.utils.book_append_sheet(wb, heatmapSheet, "Maturity");

  const pos = payload.enterprise_position;
  const positionSheet = XLSX.utils.aoa_to_sheet([
    ["Metric", "Value"],
    ["Quadrant", pos.quadrant],
    ["Value score", pos.value_score],
    ["Risk score", pos.risk_score],
    ["Description", pos.description],
  ]);
  XLSX.utils.book_append_sheet(wb, positionSheet, "RiskValue");

  const roadmapSheet = XLSX.utils.aoa_to_sheet([
    ["Weeks", "Engine", "Title", "Deliverable count"],
    ...payload.roadmap_phases.map((p) => [p.weeks, p.engine, p.title, p.deliverable_count]),
  ]);
  XLSX.utils.book_append_sheet(wb, roadmapSheet, "Roadmap");

  const nextSheet = XLSX.utils.aoa_to_sheet([
    ["Step", "Recommendation"],
    ...payload.recommended_next_steps.map((t, i) => [i + 1, t]),
  ]);
  XLSX.utils.book_append_sheet(wb, nextSheet, "NextSteps");

  const prio = payload.prioritization as Record<string, unknown>;
  if (prio && Object.keys(prio).length > 0) {
    const prioSheet = XLSX.utils.aoa_to_sheet([["Key", "Value"], ...prioritizationRows(prio)]);
    XLSX.utils.book_append_sheet(wb, prioSheet, "Prioritization");
  }

  const bp = payload.blueprint_summary;
  if (Array.isArray(bp) && bp.length > 0) {
    const blueprintSheet = XLSX.utils.json_to_sheet(bp as Record<string, unknown>[]);
    XLSX.utils.book_append_sheet(wb, blueprintSheet, "Blueprint");
  }

  const { stem, stamp } = readinessExportBaseName(diagnostic);
  const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  triggerDownload(
    new Blob([out], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `GenEye-Readiness-${stem}-${stamp}.xlsx`
  );
}
