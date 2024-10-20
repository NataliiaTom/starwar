import axios, { AxiosError } from "axios";

const API_BASE_URL = "https://sw-api.starnavi.io";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const retryWithExponentialBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = 10,
  baseDelay = 1000
): Promise<T> => {
  let lastError: any;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          const delay = baseDelay * Math.pow(2, attempt);
          console.log(
            `Received 429 error. Retrying after ${delay}ms (attempt ${
              attempt + 1
            })`
          );
          await wait(delay);
        } else if (
          error.response?.status === 0 &&
          error.message.includes("Network Error")
        ) {
          console.log("CORS error detected. Retrying...");
          await wait(1000);
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
  }
  console.error(`Max retries reached. Last error:`, lastError);
  throw lastError;
};

const queue = new Set<Promise<any>>();
const MAX_CONCURRENT_REQUESTS = 3;

const enqueueRequest = async <T>(fn: () => Promise<T>): Promise<T> => {
  while (queue.size >= MAX_CONCURRENT_REQUESTS) {
    await Promise.race(queue);
  }
  const request = retryWithExponentialBackoff(fn);
  queue.add(request);
  try {
    return await request;
  } finally {
    queue.delete(request);
  }
};

export const fetchCharacters = async (page: number) => {
  return retryWithExponentialBackoff(async () => {
    const response = await axiosInstance.get(`/people/?page=${page}`);
    return response.data;
  });
};

export const fetchCharacterDetails = async (id: number) => {
  return enqueueRequest(async () => {
    const response = await axiosInstance.get(`/people/${id}/`);
    return response.data;
  });
};

export const fetchFilm = async (urlOrId: string | number) => {
  return enqueueRequest(async () => {
    const url = typeof urlOrId === "string" ? urlOrId : `/films/${urlOrId}/`;
    const response = await axiosInstance.get(url);
    return response.data;
  });
};

export const fetchStarship = async (urlOrId: string | number) => {
  return enqueueRequest(async () => {
    const url =
      typeof urlOrId === "string" ? urlOrId : `/starships/${urlOrId}/`;
    const response = await axiosInstance.get(url);
    return response.data;
  });
};
