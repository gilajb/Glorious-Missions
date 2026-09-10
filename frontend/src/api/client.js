/**
 * Thin fetch wrapper for the Django backend.
 *
 * Every page-level API call should go through `apiGet`/`apiPost` in
 * `endpoints.js` (which call `request()` here) rather than calling `fetch`
 * directly, so 404 / 429 / 400 / network failures are classified the same
 * way everywhere and each page only has to render `error.kind`.
 */

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
).replace(/\/+$/, "");

/**
 * @typedef {"not_found"|"rate_limited"|"validation"|"server"|"network"} ApiErrorKind
 */

export class ApiError extends Error {
  /**
   * @param {string} message - user-facing message, safe to render as-is
   * @param {object} [options]
   * @param {number} [options.status] - HTTP status code, absent for network errors
   * @param {ApiErrorKind} [options.kind]
   * @param {Record<string, string[]>|null} [options.fieldErrors] - DRF-style
   *   `{field: ["message", ...]}` map, only present when kind === "validation"
   * @param {number|null} [options.retryAfter] - seconds, only present when
   *   kind === "rate_limited" and the response sent a Retry-After header
   */
  constructor(message, { status = null, kind = "server", fieldErrors = null, retryAfter = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.kind = kind;
    this.fieldErrors = fieldErrors;
    this.retryAfter = retryAfter;
  }
}

async function parseJsonSafely(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * @param {string} path - e.g. "/api/missions/", leading slash required
 * @param {object} [options]
 * @param {"GET"|"POST"} [options.method]
 * @param {object} [options.body] - JSON-serialisable request body
 */
async function request(path, { method = "GET", body } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Unable to reach the server. Check your connection and try again.",
      { kind: "network" }
    );
  }

  if (response.status === 404) {
    throw new ApiError("Not found.", { status: 404, kind: "not_found" });
  }

  if (response.status === 429) {
    const retryAfterHeader = Number(response.headers.get("Retry-After"));
    throw new ApiError(
      "Too many requests. Please wait a while before trying again.",
      {
        status: 429,
        kind: "rate_limited",
        retryAfter: Number.isFinite(retryAfterHeader) ? retryAfterHeader : null,
      }
    );
  }

  if (response.status === 400) {
    const fieldErrors = (await parseJsonSafely(response)) || {};
    throw new ApiError("Please fix the highlighted fields and try again.", {
      status: 400,
      kind: "validation",
      fieldErrors,
    });
  }

  if (!response.ok) {
    throw new ApiError("Something went wrong on our end. Please try again shortly.", {
      status: response.status,
      kind: "server",
    });
  }

  if (response.status === 204) {
    return null;
  }
  return parseJsonSafely(response);
}

export const apiGet = (path) => request(path);
export const apiPost = (path, body) => request(path, { method: "POST", body });
