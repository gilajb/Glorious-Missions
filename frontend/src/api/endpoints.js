import { apiDelete, apiGet, apiGetList, apiPatch, apiPost, apiUpload } from "./client";

/** @returns {Promise<object>} the published SiteContent block; throws ApiError(404) if none */
export const getSiteContent = (section) => apiGet(`/api/site-content/${section}/`);

/** @returns {Promise<object[]>} published missions, newest first */
export const getMissions = () => apiGetList("/api/missions/");

/** @returns {Promise<object>} a single published mission, full article included */
export const getMission = (id) => apiGet(`/api/missions/${id}/`);

/** @returns {Promise<object[]>} published gallery images, newest first */
export const getGalleryImages = () => apiGetList("/api/gallery/");

/** @returns {Promise<object[]>} donate / social / email links, by display_order */
export const getInvolvedLinks = () => apiGetList("/api/get-involved/links/");

/** @returns {Promise<object[]>} published team members, by display_order */
export const getTeamMembers = () => apiGetList("/api/about/team/");

/** @returns {Promise<object[]>} published testimonials, newest first */
export const getTestimonials = () => apiGetList("/api/testimonials/");

/**
 * @param {{name: string, email: string, message: string}} payload
 * @returns {Promise<object>} the created ContactSubmission
 */
export const submitContact = (payload) => apiPost("/api/contact/", payload);

/**
 * @param {{name: string, email: string, message: string}} payload
 * @returns {Promise<object>} the created GetInvolvedSubmission
 */
export const submitGetInvolved = (payload) => apiPost("/api/get-involved/submit/", payload);

// ---------------------------------------------------------------------------
// Admin portal -- every call below requires a staff auth token.
// ---------------------------------------------------------------------------

/** @returns {Promise<{token: string, user: object}>} throws ApiError(400) on bad credentials */
export const login = (username, password) =>
  apiPost("/api/auth/login/", { username, password });

export const logout = (token) => apiPost("/api/auth/logout/", undefined, { token });

/** @returns {Promise<object>} the current user; throws ApiError(kind: "auth") if the token is stale */
export const getMe = (token) => apiGet("/api/auth/me/", { token });

// -- Mission Mondays -----------------------------------------------------

/** @returns {Promise<object[]>} every mission (drafts included) */
export const getAdminMissions = (token) => apiGetList("/api/admin/missions/", { token });

export const getAdminMission = (id, token) => apiGet(`/api/admin/missions/${id}/`, { token });

export const createMission = (payload, token) =>
  apiPost("/api/admin/missions/", payload, { token });

export const updateMission = (id, payload, token) =>
  apiPatch(`/api/admin/missions/${id}/`, payload, { token });

export const deleteMission = (id, token) => apiDelete(`/api/admin/missions/${id}/`, { token });

export const toggleMissionPublish = (id, token) =>
  apiPost(`/api/admin/missions/${id}/toggle-publish/`, undefined, { token });

export const addMissionPhoto = (missionId, file, token) => {
  const formData = new FormData();
  formData.append("image", file);
  return apiUpload(`/api/admin/missions/${missionId}/photos/`, formData, { token });
};

export const reorderMissionPhoto = (photoId, order, token) =>
  apiPatch(`/api/admin/mission-photos/${photoId}/`, { order }, { token });

export const deleteMissionPhoto = (photoId, token) =>
  apiDelete(`/api/admin/mission-photos/${photoId}/`, { token });

// -- Gallery ---------------------------------------------------------------

/** @returns {Promise<object[]>} every gallery entry (drafts included) */
export const getAdminGalleryEntries = (token) => apiGetList("/api/admin/gallery/", { token });

export const getAdminGalleryEntry = (id, token) => apiGet(`/api/admin/gallery/${id}/`, { token });

export const createGalleryEntry = (payload, token) =>
  apiPost("/api/admin/gallery/", payload, { token });

export const updateGalleryEntry = (id, payload, token) =>
  apiPatch(`/api/admin/gallery/${id}/`, payload, { token });

export const deleteGalleryEntry = (id, token) => apiDelete(`/api/admin/gallery/${id}/`, { token });

export const toggleGalleryPublish = (id, token) =>
  apiPost(`/api/admin/gallery/${id}/toggle-publish/`, undefined, { token });

export const addGalleryPhoto = (galleryId, file, token) => {
  const formData = new FormData();
  formData.append("image", file);
  return apiUpload(`/api/admin/gallery/${galleryId}/photos/`, formData, { token });
};

export const reorderGalleryPhoto = (photoId, order, token) =>
  apiPatch(`/api/admin/gallery-photos/${photoId}/`, { order }, { token });

export const deleteGalleryPhoto = (photoId, token) =>
  apiDelete(`/api/admin/gallery-photos/${photoId}/`, { token });
