/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useState } from "react";
import { useAuth } from "../useAuth";

type HttpParams = {
  params?: any;
  payload?: any;
};

type UseHttpResult<T> = [
  sendRequest: (httpParams?: HttpParams) => Promise<T>,
  loading: boolean,
  errors: string[] | null
];

export const useHttp = <T extends any>(
  config: AxiosRequestConfig
): UseHttpResult<T> => {
  const { isAuth, user, signOut } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[] | null>(null);

  const api = axios.create({ baseURL: import.meta.env.VITE_API });

  if (isAuth) {
    api.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
      return config;
    });
  }

  const sendRequest = async (httpParams?: HttpParams): Promise<T> => {
    setLoading(true);
    setErrors(null);
    try {
      const response: AxiosResponse<T> = await api.request<T>({
        ...config,
        params: httpParams?.params,
        data: httpParams?.payload,
      });
      return response.data;
    } catch (err) {
      const data = (err as any)?.response?.data;
      const status = (err as any)?.response?.status;

      if (status === 401 && isAuth) {
        signOut();
      }

      if (data?.errors) {
        setErrors(data.errors);
      } else if (typeof data === "string") {
        setErrors([data]);
      } else {
        setErrors(["Erro desconhecido"]);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return [sendRequest, loading, errors];
};
