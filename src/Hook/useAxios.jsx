import axios from "axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


//axios instance for private use
const instance = axios.create({
    baseURL: 'http://localhost:5000/api/',
    withCredentials: true, // Include cookies in requests
   
});

const useAxios = () => {

    //user information
    const { logoutUser } = useAuth();

    const navigate = useNavigate();

    //interceptors for handling responses
    instance.interceptors.response.use(
        (response) => {
            // If the response is successful, return it
            return response;
        },
        async (error) => {
            // If the error status is 401, log out the user and redirect to login
            if (error.response && error.response.status === 401 || error.response && error.response.status === 403) {
                try {
                    await logoutUser();
                    navigate("/login");
                } catch (error) {
                    console.error("Error during logout:", error);
                    toast.error("Failed to log out. Please try again.");
                }
            }
            // If the error status is 403, log out the user and redirect to login
            if (error.response && error.response.status === 403) {
                logoutUser();
                navigate("/login");
            }
            // Reject the promise with the error
            return Promise.reject(error);
        }
    );



    return instance;
};


export default useAxios;