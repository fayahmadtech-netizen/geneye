import axios, { AxiosError } from "axios";

/** Turns axios/FastAPI errors into a short user-facing string. */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }
  const ax = error as AxiosError<{ detail?: string | Array<{ msg?: string } | string> }>;
  const status = ax.response?.status;
  const detail = ax.response?.data?.detail;

  if (status === 401) {
    return "Session expired or not authenticated. Please sign in again.";
  }

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => (typeof item === "string" ? item : item?.msg ?? JSON.stringify(item)))
      .join("; ");
  }

  if (ax.message) {
    return ax.message;
  }

  return fallback;
}
