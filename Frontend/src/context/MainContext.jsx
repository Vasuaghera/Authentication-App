import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const MainContext = createContext() ;

export const MainContextProvider = (props) => {
    
    const BackendUrl = import.meta.env.VITE_BACKEND_URL ;
    const [isLoggedIn , setIsLoggedIn] = useState(false) ;
    const [userData , setUserData] = useState(false) ;
    const [isLoading, setIsLoading] = useState(true);

    // Configure axios defaults
    axios.defaults.withCredentials = true ;
    axios.defaults.headers.common['Content-Type'] = 'application/json' ;
    axios.defaults.headers.common['Accept'] = 'application/json' ;
    axios.defaults.timeout = 10000; // 10 seconds timeout
    
    // Add request interceptor
    axios.interceptors.request.use(
        (config) => {
            // Add timestamp to prevent caching
            if (config.method === 'get') {
                config.params = { ...config.params, _t: Date.now() };
            }
            // Ensure withCredentials is set
            config.withCredentials = true;
            return config;
        },
        (error) => {
            console.error('Request error:', error);
            return Promise.reject(error);
        }
    );

    // Add response interceptor to handle 401 errors
    axios.interceptors.response.use(
        (response) => response,
        async (error) => {
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
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Network error:', error.request);
                toast.error("Network error. Please check your connection and try again.");
            } else {
                // Something happened in setting up the request
                console.error('Error:', error.message);
                toast.error("An unexpected error occurred. Please try again.");
            }
            return Promise.reject(error) ;
        }
    )

    const getUserData = async() => {
        try {
            const {data} = await axios.get(BackendUrl+'/api/user/data', {
                withCredentials: true,
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
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
        } finally {
            setIsLoading(false);
        }
    }

    const getAuthState = async() => {
        try{
            const {data} = await axios.get(BackendUrl + '/api/auth/isAuthenticated', {
                withCredentials: true,
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            }) ;
            if(data.success) {
                setIsLoggedIn(true) ;
                await getUserData() ;
            } else {
                setIsLoggedIn(false) ;
                setUserData(false) ;
            }
        }
        catch(error) {
            console.error("Error checking auth state:", error) ;
            setIsLoggedIn(false) ;
            setUserData(false) ;
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getAuthState() ;
    },[])

    const value = {
        BackendUrl ,
        isLoggedIn , setIsLoggedIn ,
        userData , setUserData ,
        getUserData,
        isLoading
    }
    
    return (
        <MainContext.Provider value={value}> 
            {props.children}
        </MainContext.Provider> 
    )
}