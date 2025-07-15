const API_BASE_URL = "https://url-shortener-backend-3pnk.onrender.com";
console.log("Frontend is using:", API_BASE_URL); // <--- Log it
export async function apiCall(path: string, options: RequestInit = {}) {
  // Get token from localStorage if available
  const token = localStorage.getItem('token');
  // Always merge headers as plain objects
  let baseHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.headers) {
    baseHeaders = Object.assign({}, baseHeaders, options.headers as Record<string, string>);
  }
  if (token) {
    baseHeaders['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: baseHeaders,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} - ${errorText}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  } else {
    return response.text(); // fallback for non-JSON response
  }
}