import axios from 'axios'

const API_URL = 'http://localhost:8000/api';
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

