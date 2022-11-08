# Api Interceptor

One of the most common use cases for interceptors is handling authorization. Typically, the way a client app proves to a server that the user is logged in is by sending a secret token in the authorization header. Interceptors let you set the authorization header automatically on all requests as needed.

## Global Api Interceptor

Here we have defined a function which handles both client side and server side api calls and handles authorization:

```jsx
/**
 * Global api interceptor
 * @param {AxiosRequestConfig} request
 */

const apiInterceptor = async (request: AxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    // Handle client side api interceptor
    return handleClientApiInterceptor(request);
  }

  // Handle server side api interceptor
  return handleServerApiInterceptor(request);
};
```

## Client Side API Interceptor

For client side api requests, we get the valid access token from the cookie. We then check whether the api is anonymous or not, if the api is not anonymous, attach the access token to the authorization header and return the request, else just return the request as is. If no valid access token is found and the api is not anonymous, the user is logged out as they are not authorized and the api request is cancelled.

```jsx
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
    Router.push(
      `/logout?redirectUrl=${encodeURIComponent(
        Router.router ? Router.router.asPath : "/dashboard"
      )}`
    );

    cancelApiRequest();
  }

  return request;
};
```

### Server Side API Interceptor

For server side api requests, first we separate the context object ( Context object is sent from `GetServerSideProps` via the headers object in an api request ) and headers in different variables. The context object is needed to access the cookies in the server. Then we get the valid access token from the cookie. We then check whether the api is anonymous or not, if the api is not anonymous, attach the accesstoken to the authorization header and return the request, else just return the request as is. If no valid access token is found and the api is not anonymous, the api request is cancelled and an error is thrown which can be caught in `GetServerSideProps`, which in turn redirects the user to the logout page and logs out the user.

```jsx
/**
 * Server side API interceptor
 * @param {AxiosRequestConfig} request
 */
const handleServerApiInterceptor = async (request: AxiosRequestConfig) => {
  // Handle server side api authorization
  const { ctx, ...headers } = request.headers;
  const accessToken = await getAccessTokenForServerApi(ctx);

  // remove next js context from headers
  request.headers = headers;

  const isAnonymous = isEndpointAnonymous(request);

  if (accessToken && !isAnonymous) {
    return addAuthorizationToApi(request, accessToken);
  }

  if (!accessToken && !isAnonymous) {
    cancelApiRequest();
  }

  return request;
};
```

#### Server side api call from component example

```jsx
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  try {
    // need to send context ( ctx ) in server calls, so we can access tokens stored in cookies
    const projectsRes = await projectsApi({
      headers: {
        ctx,
      },
    });
    projects = projectsRes.data;
  } catch (err) {
    if (err.message === "Operation canceled as no valid access token found.")
      return {
        redirect: {
          destination: "/logout?redirectUrl=dashboard",
          permanent: false,
        },
      };
  }
};
```
