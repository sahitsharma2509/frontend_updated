import axios from 'axios'

const BASE_URL = process.env.REACT_APP_DJANGO_BASE_URL


const API_URL = `${BASE_URL}/api`;
const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
        'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
    };
  };
  console.log("Auth",getAuthHeaders())

export const uploadSinglePDF = async (data: FormData) => {
  try {
    const response = await axios.post(`${API_URL}/upload/single`, data, {
      headers: getAuthHeaders()
      
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
const getYouTubeHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};



export const createYTConversation = async (token: string, ytLinkId: number) => {
  try {
    const payload = { yt_link_id: ytLinkId, type: 'yt_chat' };
    console.log("payload", payload);

    const response = await axios.post(`${BASE_URL}/chat/conversations/`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Response from createYTConversation:', response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating a new conversation:", error);
    console.log("Error response data:", error.response.data);
    throw error;
  }
};


export const sendYouTubeUrl = async (url: string, token: string) => {
  try {
    const response = await axios.post(`${API_URL}/yt`, { url }, {
      headers: getYouTubeHeaders()
    });

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status}`);
    }

    // Create a YouTube conversation if the YouTube URL is successfully stored
    if (response.data.success) {
      const ytLinkId = response.data.yt_link_id;
      await createYTConversation(token, ytLinkId);
    }

    return response.data;
  } catch (error: any) {
    console.error("Error sending YouTube URL:", error);
    throw error;
  }
};