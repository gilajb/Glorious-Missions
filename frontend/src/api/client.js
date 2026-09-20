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
 * @typedef {"not_found"|"rate_limited"|"validation"|"server"|"network"|"auth"} ApiErrorKind
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
 * @param {"GET"|"POST"|"PATCH"|"DELETE"} [options.method]
 * @param {object} [options.body] - JSON-serialisable request body
 * @param {string} [options.token] - admin auth token, sent as `Authorization: Token <token>`
 * @param {FormData} [options.formData] - multipart body (file upload); takes
 *   precedence over `body` and skips JSON encoding so the browser can set
 *   its own multipart boundary
 */
async function request(path, { method = "GET", body, token, formData } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Token ${token}`;
  if (formData === undefined && body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: formData !== undefined ? formData : body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Unable to reach the server. Check your connection and try again.",
      { kind: "network" }
    );
  }

  if (response.status === 401 || response.status === 403) {
    throw new ApiError("You must be logged in to do that.", {
      status: response.status,
      kind: "auth",
    });
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

export const apiGet = (path, options) => request(path, options);
export const apiPost = (path, body, options) => request(path, { ...options, method: "POST", body });
export const apiPatch = (path, body, options) => request(path, { ...options, method: "PATCH", body });
export const apiDelete = (path, options) => request(path, { ...options, method: "DELETE" });

/**
 * GET a DRF list endpoint and return just the array.
 *
 * The backend paginates every list endpoint (`{count, next, previous,
 * results}`) so a growing table can't turn into one unbounded response.
 * Nothing here pages through `next` yet -- PAGE_SIZE is generous enough
 * that today's content never gets close to a second page -- so this just
 * unwraps `results` centrally rather than every caller re-checking for it.
 */
export const apiGetList = (path, options) =>
  apiGet(path, options).then((data) => data?.results ?? data ?? []);

/** POST/PATCH a FormData body (file upload) with an admin token attached. */
export const apiUpload = (path, formData, { token, method = "POST" } = {}) =>
  request(path, { method, formData, token });
