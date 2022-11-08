import axios, { AxiosRequestConfig } from 'axios';
import {
  getAccessToken,
  getAccessTokenForServerApi,
} from '@helpers/session.helper';

import AuthEndpointsEnum from '@features/auth/constants/auth.constants';
import ENV from '@constants/env';
import Router from 'next/router';

/**
 * All the endpoint that do not require an access token
 */
const anonymousEndpoints: string[] = [AuthEndpointsEnum.LOGIN.toString()];

/**
 * Cancel API request
 */
const cancelApiRequest = () => {
  throw new axios.Cancel('Operation canceled as no valid access token found.');
};

/**
 * Add authorization header to API
 * @param {AxiosRequestConfig} request
 * @param accessToken
 */
const addAuthorizationToApi = (
  request: AxiosRequestConfig,
  accessToken: string
) => {
  if (request.headers) request.headers.Authorization = `Bearer ${accessToken}`;
  return request;
};

/**
 * Check if endpoint is anonymous
 * @param {AxiosRequestConfig} request
 */
const isEndpointAnonymous = (request: AxiosRequestConfig) =>
  anonymousEndpoints.some(endpoint =>
    request.url?.startsWith(`${ENV.API_HOST}/${endpoint}`)
  );

/**
 * Client side API interceptor
 * @param {AxiosRequestConfig} request
 */
const handleClientApiInterceptor = async (request: AxiosRequestConfig) => {
  const accessToken = await getAccessToken();

  const isAnonymous = isEndpointAnonymous(request);

  if (accessToken && !isAnonymous) {
    return addAuthorizationToApi(request, accessToken);
  }

  if (!accessToken && !isAnonymous) {
    // Router.push(
    //   `/logout?redirectUrl=${encodeURIComponent(
    //     Router.router ? Router.router.asPath : '/dashboard'
    //   )}`
    // );

    // cancelApiRequest();
  }

  return request;
};

/**
 * Server side API interceptor
 * @param {AxiosRequestConfig} request
 */
const handleServerApiInterceptor = async (request: AxiosRequestConfig | any) => {
  // Handle server side api authorization
  const { ctx, ...headers } = request.headers;
  const accessToken = await getAccessTokenForServerApi(ctx);

  // remove next js context from headers
  request.headers = headers;

  const isAnonymous = isEndpointAnonymous(request);

  if (accessToken && !isAnonymous) {
    return addAuthorizationToApi(request, accessToken);
  }

  // if (!accessToken && !isAnonymous) {
  //   cancelApiRequest();
  // }

  return request;
};

/**
 * Global api interceptor
 * @param {AxiosRequestConfig} request
 */
const apiInterceptor = async (request: AxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    // Handle client side api interceptor
    return handleClientApiInterceptor(request);
  }

  // Handle server side api interceptor
  return handleServerApiInterceptor(request);
};

/** Setup an API instance */
const api = axios.create({
  baseURL: `${ENV.API_HOST}`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(apiInterceptor);

export default api;
