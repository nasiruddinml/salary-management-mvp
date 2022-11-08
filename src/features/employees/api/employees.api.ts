import { AxiosRequestConfig, AxiosResponse } from 'axios';

import ENV from '@constants/env';
import EmployeesEndpointsEnum from '../constants/employees.constants';
import api from '@api/api';

// eslint-disable-next-line import/prefer-default-export
export const employeesApi = (
  config: AxiosRequestConfig
): Promise<AxiosResponse> =>
  api.get(`${ENV.API_HOST}/${EmployeesEndpointsEnum.Employees}`, config);
