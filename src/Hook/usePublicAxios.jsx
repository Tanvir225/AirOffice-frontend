import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:5000/api/', // Base URL for the API
    withCredentials: true,
    
});

const usePublicAxios = () => {
    return instance;
};

export default usePublicAxios;