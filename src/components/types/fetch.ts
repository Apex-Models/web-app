export interface ApiResponse {
    code?: number;
    data?: unknown;
    message?: string;
    success?: boolean;
}

export interface FetchParams {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
    token?: string;
}