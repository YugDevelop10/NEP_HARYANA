import { request } from "./auth";

export function fetchNominations() {
  return request("/nominations/");
}

export function fetchNominationDetails(id) {
  return request(`/nominations/${id}/`);
}

export function saveNomination(id, payload) {
  return request(`/nominations/${id}/save/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function submitNomination(id, payload) {
  return request(`/nominations/${id}/submit/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchCloudinaryConfig() {
  return request("/nominations/config/");
}

export function fetchNominationConfig() {
  return request("/nominations/config/");
}

export async function uploadEvidenceToCloudinary(file) {
  // 1. Fetch credentials from backend
  const config = await fetchCloudinaryConfig();
  const { cloudinary_cloud_name, cloudinary_upload_preset } = config;
  
  if (!cloudinary_cloud_name || !cloudinary_upload_preset) {
    throw new Error("Cloudinary configuration is incomplete on the server.");
  }
  
  // 2. Perform direct unsigned upload
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinary_upload_preset);
  
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinary_cloud_name}/auto/upload`;
  
  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData
  });
  
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || "File upload to Cloudinary failed.");
  }
  
  const data = await response.json();
  return {
    url: data.secure_url,
    original_filename: file.name
  };
}
