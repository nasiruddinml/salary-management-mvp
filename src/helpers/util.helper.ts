import ENV from "@constants/env";

// eslint-disable-next-line import/prefer-default-export
export const getCurrentEnvironment = (): string | undefined => ENV.NODE_ENV;
