import axios from 'axios';
import Cookies from "js-cookie";

const BASE_URL = process.env.REACT_APP_DJANGO_BASE_URL
const csrftoken = Cookies.get("csrftoken");

export const createConversation = async (token: string, pdfId: string | null = null) => {
  try {
    const payload = pdfId ? { pdf_document_id: pdfId } : {};
    console.log("payload",payload)
    const response = await axios.post(`${BASE_URL}/chat/conversations/`, payload, {
      headers: {
        'X-CSRFToken': csrftoken,
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log('Response from createConversation:', response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating a new conversation:", error);
    console.log("Error response data:", error.response.data);
    throw error;
  }
};
