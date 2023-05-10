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

