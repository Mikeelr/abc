import axios, { AxiosError } from "axios";
import { COMPANYNAME } from "./config";

export const postRequest = async (url: string, data: any, token?: string) => {
  try {
    data.companyName = COMPANYNAME;
    const { data: info } = await axios.post(url, data, { headers: { token } });
    return { message: "success", success: true, data: info };
  } catch (err) {
    const error = err as AxiosError;
    const data = error.isAxiosError
      ? (error.response!.data as { message: string })
      : ({ message: "Some error occured" } as { message: string });
    return { message: data.message, success: false, data: null };
  }
};
export const putRequest = async (url: string, data: any, token?: string) => {
  try {
    data.companyName = COMPANYNAME;
    const { data: info } = await axios.put(url, data, { headers: { token } });
    return { message: "success", success: true, data: info };
  } catch (err) {
    const error = err as AxiosError;
    const data = error.isAxiosError
      ? (error.response!.data as { message: string })
      : ({ message: "Some error occured" } as { message: string });
    return { message: data.message, success: false, data: null };
  }
};
export const getRequest = async (url: string, token?: string) => {
  try {
    const link = new URL(url);
    link.searchParams.append("companyName", COMPANYNAME);

    const { data: info } = await axios.get(link.toString(), {
      headers: { token },
    });
    return { message: "success", success: true, data: info };
  } catch (err) {
    const error = err as AxiosError;
    const data = error.isAxiosError
      ? (error.response!.data as { message: string })
      : ({ message: "Some error occured" } as { message: string });
    return { message: data.message, success: false, data: null };
  }
};
export const deleteRequest = async (url: string, token?: string) => {
  try {
    const link = new URL(url);
    link.searchParams.append("companyName", COMPANYNAME);

    const { data: info } = await axios.delete(link.toString(), {
      headers: { token },
    });
    return { message: "success", success: true, data: info };
  } catch (err) {
    const error = err as AxiosError;
    const data = error.isAxiosError
      ? (error.response!.data as { message: string })
      : ({ message: "Some error occured" } as { message: string });
    return { message: data.message, success: false, data: null };
  }
};
