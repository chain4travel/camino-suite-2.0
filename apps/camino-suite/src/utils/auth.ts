import { getCookie, setCookie, deleteCookie } from 'cookies-next';

const AUTH_TOKEN_KEY = 'isAuthenticated';

export const getAuthToken = () => {
  return getCookie(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token: string) => {
  setCookie(AUTH_TOKEN_KEY, token);
};

export const removeAuthToken = () => {
  deleteCookie(AUTH_TOKEN_KEY);
};

// Add auth token to all API requests
export const addAuthHeader = (headers: Headers) => {
  const token = getAuthToken();
  if (token) {
    headers.set('x-auth-token', token);
  }
  return headers;
}; 