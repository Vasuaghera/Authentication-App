import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const MainContext = createContext() ;

export const MainContextProvider = (props) => {
    
    const BackendUrl = import.meta.env.VITE_BACKEND_URL ;
    const [isLoggedIn , setIsLoggedIn] = useState(false) ;
    const [userData , setUserData] = useState(false) ;

    // Configure axios defaults
    axios.defaults.withCredentials = true ;
    axios.defaults.headers.common['Content-Type'] = 'application/json' ;
    axios.defaults.headers.common['Accept'] = 'application/json' ;
    
    // Add request interceptor
    axios.interceptors.request.use(
        (config) => {
            // You can add any request headers here
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Add response interceptor to handle 401 errors
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        setIsLoggedIn(false) ;
                        setUserData(false) ;
                        toast.error("Session expired. Please login again.") ;
                        break;
                    case 403:
                        toast.error("Access denied. Please check your permissions.") ;
                        break;
                    default:
                        toast.error(error.response.data?.message || "An error occurred") ;
                }
            } else {
                toast.error("Network error. Please check your connection.") ;
            }
            return Promise.reject(error) ;
        }
    )

    const getUserData = async() => {
        try {
            const {data} = await axios.get(BackendUrl+'/api/user/data', {
                withCredentials: true
            }) ;
            if (data.success) {
                setUserData(data.userData) ;
                setIsLoggedIn(true) ;
            } else {
                toast.error(data.message) ;
                setIsLoggedIn(false) ;
            }
        }
        catch(error){
            console.error("Error fetching user data:", error) ;
            setIsLoggedIn(false) ;
            setUserData(false) ;
        }
    }

    const getAuthState = async() => {
        try{
            const {data} = await axios.get(BackendUrl + '/api/auth/isAuthenticated', {
                withCredentials: true
            }) ;
            if(data.success) {
                setIsLoggedIn(true) ;
                getUserData() ;
            } else {
                setIsLoggedIn(false) ;
                setUserData(false) ;
            }
        }
        catch(error) {
            console.error("Error checking auth state:", error) ;
            setIsLoggedIn(false) ;
            setUserData(false) ;
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