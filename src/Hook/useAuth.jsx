import { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";


const useAuth = () => {
    const authUser = useContext(AuthContext)
    return authUser
};



export default useAuth;