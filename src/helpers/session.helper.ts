import nookies, { parseCookies } from "nookies";
import axios from "axios";
import jwt_decode from "jwt-decode";
import ENV from "@constants/env";

/**
 * Seed access token and refresh token to cookies
 * @param data
 */
export const seed = (
  data: {
    access_token: string;
    refresh_token: string;
  },
  // eslint-disable-next-line
  ctx: any
): void => {
  if (data.access_token) {
    nookies.set(ctx ?? null, "access_token", data.access_token, {
      sameSite: "Lax",
      path: "/",
    });
  }

  if (data.refresh_token) {
    nookies.set(ctx ?? null, "refresh_token", data.refresh_token, {
      sameSite: "Lax",
      path: "/",
    });
  }
};

/**
 * Logout user and clear cookies
 */
export const logout = (): void => {
  nookies.destroy(null, "access_token", { path: "/" });
  nookies.destroy(null, "refresh_token", { path: "/" });
  nookies.destroy(null, "user_details", { path: "/" });
};

/**
 * decode jwt token
 * @param token
 */
// eslint-disable-next-line
const decodeToken = (token: string): any => jwt_decode(token);

/**
 * Check if token is valid
 * @param token
 */
const isTokenValid = (token: string): boolean => {
  const now = Date.now() / (1000 * 60);
  const data = decodeToken(token);

  if (data && data.exp) {
    const expiry = data.exp / 60;

    return expiry - 1 > now;
  }

  return false;
};

/**
 * Refresh access token using refresh token
 */
// eslint-disable-next-line
const refreshAccessToken = (refreshToken: string, ctx: any) =>
  axios({
    method: "post",
    url: `${ENV.API_HOST}/refresh-token`,
    data: {
      token: `${refreshToken}`,
    },
    headers: {
      "Content-Type": "application/json",
    },
  }).then(
    (res) => {
      seed(res.data, ctx);
      return res.data.access_token;
    },
    () => null
  );

/**
 * Get access token
 */
// eslint-disable-next-line
export const getAccessToken = (): any => {
  /* If we already have a access token, try to get a existing access token */
  const { access_token: accessToken } = parseCookies();

  if (accessToken && isTokenValid(accessToken)) {
    return accessToken;
  }

  /* If we already have a refresh token, try to get a new access token */
  const { refresh_token: refreshToken } = parseCookies();
  if (refreshToken && isTokenValid(refreshToken)) {
    return refreshAccessToken(refreshToken, null);
  }

  return null;
};

/**
 * Get access token for server api calls
 */
export const getAccessTokenForServerApi = (
  // eslint-disable-next-line
  ctx: any
  // eslint-disable-next-line
): any => {
  const { access_token: accessToken } = nookies.get(ctx);

  if (accessToken && isTokenValid(accessToken)) {
    return accessToken;
  }

  /* If we already have a refresh token, try to get a new access token */
  const { refresh_token: refreshToken } = nookies.get(ctx);
  if (refreshToken && isTokenValid(refreshToken)) {
    return refreshAccessToken(refreshToken, ctx);
  }

  return null;
};

/**
 * Save user in cookies
 * @param user
 */
export const saveUser = (user: Record<string, unknown>): void => {
  nookies.set(null, "user_details", JSON.stringify(user), {
    sameSite: "Lax",
    path: "/",
  });
};

/**
 * Get user from cookies
 */
export const getUser = (ctx = null): Record<string, unknown> => {
  let cookies;
  if (ctx) {
    cookies = nookies.get(ctx);
  } else {
    cookies = parseCookies();
  }
  return Object.keys(cookies).length > 0 && cookies.user_details
    ? JSON.parse(cookies.user_details)
    : {};
};
