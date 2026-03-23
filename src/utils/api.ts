import { BASE_URL } from './constants';
import { setCookie } from './cookie';

interface IServerResponse {
  success: boolean;
}

interface IRefreshResponse extends IServerResponse {
  refreshToken: string;
  accessToken: string;
}

export const checkResponse = <T>(res: Response): Promise<T> => {
  return res.ok ? res.json() : res.json().then((err) => Promise.reject(err));
};

export const refreshTokenRequest = (): Promise<IRefreshResponse> => {
  return fetch(`${BASE_URL}/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      token: localStorage.getItem("refreshToken"),
    }),
  }).then(res => checkResponse<IRefreshResponse>(res));
};

export const fetchWithRefresh = async <T>(url: string, options: RequestInit): Promise<T> => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err: any) {
    if (err.message === "jwt expired") {
      const refreshData = await refreshTokenRequest();
      
      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }
      
      localStorage.setItem("refreshToken", refreshData.refreshToken);
      setCookie("accessToken", refreshData.accessToken);
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization = refreshData.accessToken;
      }
      
      const res = await fetch(url, options); 
      return await checkResponse<T>(res);
    } else {
      return Promise.reject(err);
    }
  }
};
