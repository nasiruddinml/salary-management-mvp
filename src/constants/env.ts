const ENV = {
  NODE_ENV: process.env.type,
  API_HOST: process.env.apiUrl ?? "",
  BASE_URL: process.env.baseUrl ?? "",
};

export default ENV;
