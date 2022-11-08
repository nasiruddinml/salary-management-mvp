import AuthEndpointsEnum from '../constants/auth.constants';
import { AxiosResponse } from 'axios';
import ENV from '@constants/env';
import { LoginCredentials } from '@features/auth/types/auth.type';
import api from '@api/api';

// eslint-disable-next-line import/prefer-default-export
export const loginApi = (data: LoginCredentials): Promise<AxiosResponse> => {
  // TODO: uncomment when real api is used api.post(`${ENV.API_HOST}/${AuthEndpointsEnum.LOGIN}`, data);
  return api.get(`${ENV.API_HOST}/${AuthEndpointsEnum.LOGIN}`);
};
