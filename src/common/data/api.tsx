import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; // Replace with your Django backend URL

const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
      'Authorization': `Bearer ${token}`,
    };
  };

  export const fetchConversations = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/chat/`, {
        headers: getAuthHeaders(),
      });
      return response.data;
      
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };
  
  export const fetchMessagesByConversationId = async (conversationId: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/chat/with-list/${conversationId}/`, {
            headers: getAuthHeaders(),
      });
      console.log("Response:",response.data);
      console.log("id: ",conversationId)
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  

  export const fetchPdfDocuments = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/pdf/`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching PDF documents:', error);
    }
  };