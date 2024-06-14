import { AxiosRequestConfig } from "axios";
import axios from "../axios";

export const getAllUsersApi = async (token: string) => {
  const configs: AxiosRequestConfig = {
    url: `/admin/users`,
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios(configs);
  return response;
};

export const getDetailUserApi = async (token: string, id: string) => {
  const configs: AxiosRequestConfig = {
    url: `/admin/users/${id}`,
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios(configs);
  return response;
};

export const deleteAvatarApi = async (token: string, id: string) => {
  const configs: AxiosRequestConfig = {
    url: `/admin/users/deleteAvatar`,
    method: "put",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      id,
    },
  };
  const response = await axios(configs);
  return response;
};

export const deleteUserApi = async (token: string, id: string) => {
  const configs: AxiosRequestConfig = {
    url: `/admin/users/deleteUser`,
    method: "delete",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      id,
    },
  };
  const response = await axios(configs);
  return response;
};

export const deleteUsernameApi = async (token: string, id: string) => {
  const configs: AxiosRequestConfig = {
    url: `/admin/users/deleteUsername`,
    method: "put",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      id,
    },
  };
  const response = await axios(configs);
  return response;
};
