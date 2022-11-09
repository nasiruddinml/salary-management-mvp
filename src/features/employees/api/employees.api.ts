import { AxiosRequestConfig, AxiosResponse } from "axios";

import api from "@api/api";
import ENV from "@constants/env";
import EmployeesEndpointsEnum from "../constants/employees.constants";

export const employeesApi = (
  config: AxiosRequestConfig
): Promise<AxiosResponse> => {
  return api.get(
    `${ENV.BASE_URL}/api/${EmployeesEndpointsEnum.Employees}`,
    config
  );
};

export const employeesDeleteApi = (
  empId: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse> => {
  return api.delete(
    `${ENV.BASE_URL}/api/${EmployeesEndpointsEnum.Employees}/${empId}`,
    config
  );
};

export const employeesUpdate = (
  empId: string,
  config?: any
): Promise<AxiosResponse> => {
  return api.put(
    `${ENV.BASE_URL}/api/${EmployeesEndpointsEnum.Employees}/${empId}`,
    config
  );
};
