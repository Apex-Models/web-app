export interface FetchParams {
    url: string;
    method: string;
    body?: any;
    token?: string;
}
  
export interface ApiResponse<T = any> {
    code: number;
    message?: string;
    data?: T;
    success?: boolean;
}