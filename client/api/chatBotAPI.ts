import apiClient, { setHeaders } from "./apiClient";
import { currentLocation } from "./other";
import { getItem } from "./tokenOperation";
import useLocation from "./useLocation";

interface INewChatAPI {
  text: string;
  sender?: "user" | "bot";
  timestamp?: number;
}
interface IBotChat {
  text: string;
  timestamp: number;
  sender?: string;
}

export const newChatAPI = async (
  chatDetails: INewChatAPI
): Promise<IBotChat> => {
  try {

    if (!chatDetails || !chatDetails.text) {
      throw new Error("Chat not Provided");
    }

    const response = await apiClient.post("chatBot/create-chat", chatDetails, {
      headers: await setHeaders(),
    });
    return response.data.data;
  } catch (error: any) {
    console.error(error);
    if (error.response) {
      if (error.response.status === 400) {
        throw new Error(
          error.response.data?.message || "Invalid or Expired OTP."
        );
      }
      throw new Error(error.response.data?.message || "Verification failed.");
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};

export const getAllChatAPI = async (): Promise<IBotChat[]> => {
  try {
    const token = await getItem();
    if (!token) {
      throw new Error("No token found, please log in again.");
    }

    const response = await apiClient.get("chatBot/get-chat", {
      headers: await setHeaders(),
    });
    return response.data.data;
  } catch (error: any) {
    console.error(error);
    if (error.response) {
      if (error.response.status === 400) {
        throw new Error(
          error.response.data?.message || "Invalid or Expired OTP."
        );
      }
      throw new Error(error.response.data?.message || "Verification failed.");
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};
