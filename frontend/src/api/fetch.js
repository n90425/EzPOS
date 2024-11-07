import axios from "axios"

export const getfetch = async(url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("error fetch",error);
        throw error;
    }
};

export default getfetch;