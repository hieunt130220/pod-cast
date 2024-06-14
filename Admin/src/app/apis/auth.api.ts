import { AxiosRequestConfig } from "axios";
import axios from "../axios";

export const loginAdminApi = async (email: string, password: string) => {
  const configs: AxiosRequestConfig = {
    url: `/admin/login`,
    method: "post",
    data: {
      email,
      password,
    },
  };
  const response = await axios(configs);
  return response;
};
