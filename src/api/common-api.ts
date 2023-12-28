/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";

export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "851ccd71-58c3-4f92-b794-f803a4080a69",
  },
});

export type ResponseType<D = {}> = {
  resultCode: number;
  messages: Array<string>;
  data: D;
};
