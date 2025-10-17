import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1/camping-sites";

export const getCampingSites = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rooms`);
    console.log("Camping sites fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching camping sites:", error);
    throw error;
  }
};
