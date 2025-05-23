//can also include decodeToken and isTokenExpired functions here. 

import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  exp: number;
}

export const fetchWithAuth = async (url: string, token: string, options: RequestInit = {}) => {
  if (!token) {
    throw new Error('User is not authenticated');
  }

  if (isTokenExpired(token)) {
    throw new Error('Session expired. Please log in again.');
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
};

export const isTokenExpired = (token: string) => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.exp * 1000 < Date.now(); 
  } catch (e) {
    return true;
  }
};
