import axios from 'axios';
import Cookies from 'js-cookie';
const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_BASE_URL// Replace with your Django backend URL

const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
      'Authorization': `Bearer ${token}`,
    };
  };

 export const fetchConversations = async ({ pageParam = 1 }) => {
    const response = await axios.get(`${BASE_URL}/chat/?page=${pageParam}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    return response.data;
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
  


  // Inside your component...
  export const fetchKnowledgebases = async () => {
      const response = await axios.get(`${BASE_URL}/knowledgebases/`, {
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
      });
      return response.data;
  };


  export async function getKnowledgeBases() {
    const response = await fetch(`${BASE_URL}/get_knowledgebases/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const data = await response.json();
    return data;
  }


  // api.js



export async function createKnowledgeBase(formData: FormData) {
  const csrftoken = Cookies.get("csrftoken") || '';
  const response = await axios.post(`${BASE_URL}/create_knowledgebase/`, formData, {
    headers: {
      'X-CSRFToken': csrftoken,
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
  });
  return response.data;
}

export async function deleteKnowledgeBase(id: string) {
  const csrftoken = Cookies.get("csrftoken") || '';
  const response = await axios.delete(`${BASE_URL}/delete_knowledgebase/${id}/`, {
    headers: {
      'X-CSRFToken': csrftoken,
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
  });
  return response.data;
}

