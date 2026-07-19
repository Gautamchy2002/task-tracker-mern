import axios from "axios";

export const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Request failed"
    );
  }

  return error instanceof Error ? error.message : "Something went wrong";
};

export const getResponseData = <T>(payload: any): T => {
  if (payload?.data?.data) return payload.data.data as T;
  if (payload?.data) return payload.data as T;
  return payload as T;
};
