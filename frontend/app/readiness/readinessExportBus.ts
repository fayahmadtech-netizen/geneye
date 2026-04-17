/** Lets the global Topbar Export trigger the same download as the Executive Review card. */

export type ReadinessExportFormat = "pdf" | "xlsx" | "json";

let exportFn: ((format: ReadinessExportFormat) => void) | null = null;

export function registerReadinessExport(fn: (format: ReadinessExportFormat) => void): () => void {
  exportFn = fn;
  return () => {
    exportFn = null;
  };
}

export function triggerReadinessExport(format: ReadinessExportFormat): void {
  exportFn?.(format);
}
