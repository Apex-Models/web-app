// useFetch.js
"use client";
import { useState } from "react";
import { ApiResponse, FetchParams } from "../types/fetch";

const useFetch = ({ url, method, body, token }: FetchParams) => {  
  const [data, setData] = useState<ApiResponse>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true)
    try {
      const fetchOptions: RequestInit = {
          method: method,
          credentials: 'include',
          headers: {
              "Content-Type": "application/json",
              ...(token && { "authorization": token })
          }
      };

      if (body) {
          fetchOptions.body = JSON.stringify(body);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, fetchOptions);
      const dataJson = await response.json();
      if(dataJson.code && dataJson.code !== 200) {
        setError(dataJson.message);
      }
      setData(dataJson);
    }
    catch(error) {
      setError(error instanceof Error ? error.message : String(error))
    }
    finally {
        setLoading(false)
    }
  }
  return {fetchData, data, error, loading};
}
export default useFetch