import { apiGet, apiPost } from "./client";

/** @returns {Promise<object>} the published SiteContent block; throws ApiError(404) if none */
export const getSiteContent = (section) => apiGet(`/api/site-content/${section}/`);

/** @returns {Promise<object[]>} published missions, newest first */
export const getMissions = () => apiGet("/api/missions/");

/** @returns {Promise<object[]>} published gallery images, newest first */
export const getGalleryImages = () => apiGet("/api/gallery/");

/** @returns {Promise<object[]>} donate / social / email links, by display_order */
export const getInvolvedLinks = () => apiGet("/api/get-involved/links/");

/** @returns {Promise<object[]>} published team members, by display_order */
export const getTeamMembers = () => apiGet("/api/about/team/");

/** @returns {Promise<object[]>} published testimonials, newest first */
export const getTestimonials = () => apiGet("/api/testimonials/");

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
