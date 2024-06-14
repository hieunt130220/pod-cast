import { AxiosRequestConfig } from "axios";
import axios from "../axios";

export const getAllPodcastsApi = async (token: string) => {
  const configs: AxiosRequestConfig = {
    url: `/admin/podCasts`,
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios(configs);
  return response;
};

export const getDetailPodcastsApi = async (token: string, id: string) => {
  const configs: AxiosRequestConfig = {
    url: `/admin/podCasts/${id}`,
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios(configs);
  return response;
};

export const deletePodcastApi = async (
  token: string,
  idPodcast: string,
  idUser: string
) => {
  const configs: AxiosRequestConfig = {
    url: `/admin/podCasts/${idPodcast}`,
    method: "delete",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      idUser,
    },
  };
  const response = await axios(configs);
  return response;
};

export const deleteCommentPodcastApi = async (
  token: string,
  idPodcast: string,
  idComment: string
) => {
  const configs: AxiosRequestConfig = {
    url: `/admin/podCasts/${idPodcast}/comment`,
    method: "delete",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      idComment,
    },
  };
  const response = await axios(configs);
  return response;
};
