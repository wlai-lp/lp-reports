interface AuthResponse {
  token: string;
  userId: string;
}

let authToken: string | null = null;

export async function getAuthToken() {
  console.log('getAuthTokenxxxx');
  if (authToken) {
    console.log('return in memory token');
    return authToken;
  }

  try {
    console.log(`${process.env.LP_USERNAME}:${process.env.LP_PASSWORD}`);
    const credentials = btoa(`${process.env.LP_USERNAME}:${process.env.LP_PASSWORD}`);
    const response = await fetch(process.env.LP_CCS_LOGIN_URL!, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(JSON.stringify(response));

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data: AuthResponse = await response.json();
    authToken = data.token;
    console.log('authToken', authToken);
    return authToken;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

export function clearAuthToken() {
  authToken = null;
}
