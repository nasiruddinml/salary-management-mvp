import { AxiosResponse } from "axios";
import ENV from "@constants/env";
import UsersEndpointsEnum from "../constants/users.endpoint";
import api from "@api/api";

// eslint-disable-next-line import/prefer-default-export
export const meApi = (): Promise<AxiosResponse> =>
  api.get(`${ENV.API_HOST}/${UsersEndpointsEnum.ME}`);
