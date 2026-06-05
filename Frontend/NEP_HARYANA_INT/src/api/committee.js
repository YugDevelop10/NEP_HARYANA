import { request } from "./auth";

export function fetchCommitteeStats() {
  return request("/nominations/committee/stats/");
}

export function fetchCommitteeSubmissions(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/nominations/committee/submissions/?${query}`);
}

export function fetchCommitteeReviewDetail(id) {
  return request(`/nominations/committee/submissions/${id}/`);
}

export function saveCommitteeReview(id, reviewData) {
  return request(`/nominations/committee/submissions/${id}/`, {
    method: "POST",
    body: JSON.stringify(reviewData),
    headers: {
      "Content-Type": "application/json"
    }
  });
}

export function recommendCommitteeReview(id, recommendationData) {
  return request(`/nominations/committee/submissions/${id}/`, {
    method: "PUT",
    body: JSON.stringify(recommendationData),
    headers: {
      "Content-Type": "application/json"
    }
  });
}

export function requestCommitteeClarification(id, queryData) {
  return request(`/nominations/committee/submissions/${id}/clarification/`, {
    method: "POST",
    body: JSON.stringify(queryData),
    headers: {
      "Content-Type": "application/json"
    }
  });
}

export function fetchPrincipalClarification(formId) {
  return request(`/nominations/${formId}/clarification/`);
}

export function submitPrincipalClarification(formId, responseData) {
  return request(`/nominations/${formId}/clarification/`, {
    method: "POST",
    body: JSON.stringify(responseData),
    headers: {
      "Content-Type": "application/json"
    }
  });
}
