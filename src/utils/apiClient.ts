// Use Vite's same-origin proxy in development; deployments can set
// VITE_API_BASE_URL when the API is hosted on a separate origin.
const API_BASE = `${(import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')}/api`;

export function getStoredToken(): string | null {
  return localStorage.getItem('finsight_token');
}

export function setStoredToken(token: string) {
  localStorage.setItem('finsight_token', token);
}

export function clearStoredToken() {
  localStorage.removeItem('finsight_token');
}

// 1. Health Check
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  } catch (e) {
    return { status: 'offline', error: e };
  }
}

// 2. Local Registration API
export async function registerWithFlask(payload: {
  username: string;
  email: string;
  password: string;
  confirm_password?: string;
}) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Registration failed');
  }
  if (data.token) setStoredToken(data.token);
  return data;
}

// 3. Local Login API
export async function loginWithFlask(usernameOrEmail: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: usernameOrEmail, password })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Authentication failed');
  }
  if (data.token) setStoredToken(data.token);
  return data;
}

// 4. Google OAuth 2.0 / OpenID Connect Verification API
export async function verifyGoogleAuthWithFlask(payload: {
  id_token?: string;
  access_token?: string;
  email?: string;
  name?: string;
  picture?: string;
  google_id?: string;
}) {
  const res = await fetch(`${API_BASE}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Google authentication verification failed');
  }
  if (data.token) setStoredToken(data.token);
  return data;
}

// 5. Authenticated Current User Profile (/api/auth/me)
export async function getCurrentUserFromFlask() {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) {
      if (res.status === 401) clearStoredToken();
      return null;
    }
    return await res.json();
  } catch (e) {
    console.warn('Flask /auth/me check failed:', e);
    return null;
  }
}

// 6. Logout API
export async function logoutWithFlask() {
  try {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
  } catch (e) {
    console.warn('Logout API notification failed:', e);
  } finally {
    clearStoredToken();
  }
}

// 7. Holdings API
export async function fetchHoldingsFromFlask() {
  try {
    const res = await fetch(`${API_BASE}/holdings`);
    if (!res.ok) throw new Error('Failed to fetch holdings');
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function createHoldingInFlask(holding: any) {
  try {
    const res = await fetch(`${API_BASE}/holdings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(holding)
    });
    return await res.json();
  } catch (e) {
    return null;
  }
}

// 8. Market Indices API
export async function fetchMarketIndicesFromFlask() {
  try {
    const res = await fetch(`${API_BASE}/market/indices`);
    if (!res.ok) throw new Error('Failed to fetch indices');
    return await res.json();
  } catch (e) {
    return null;
  }
}
