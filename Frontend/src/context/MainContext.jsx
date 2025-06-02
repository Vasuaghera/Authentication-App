import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const MainContext = createContext() ;

export const MainContextProvider = (props) => {
    
    axios.defaults.withCredentials = true ;
    const BackendUrl = import.meta.env.VITE_BACKEND_URL ;
    const [isLoggedIn , setIsLoggedIn] = useState(false) ;
    const [userData , setUserData] = useState(false) ;

    const getUserData = async() => {
        try {
            const {data} = await axios.get(BackendUrl+'/api/user/data') ;
            data.success ? setUserData(data.userData) : toast.error(data.message) ;
        }
        catch(error){
            toast.error(error.message) ;
        }
    }

    const getAuthState = async() => {
        try{
            const {data} = await axios.get(BackendUrl + '/api/auth/isAuthenticated') ;
            if(data.success) {
                setIsLoggedIn(true) ;
                getUserData() ;
            }

        }
        catch(error) {
            toast.error(error.message) ;
        }
    }

    useEffect(() => {
        getAuthState() ;
    },[])

    const value = {
        BackendUrl ,
        isLoggedIn , setIsLoggedIn ,
        userData , setUserData ,
        getUserData
    }
    
    return (
        <MainContext.Provider value={value}> 
            {props.children}
        </MainContext.Provider> 
    )
}