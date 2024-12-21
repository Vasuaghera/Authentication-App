import React, { useContext  } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { MainContext } from '../context/MainContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {

    const navigate = useNavigate() ;
    const {userData , BackendUrl , setUserData , setIsLoggedIn} = useContext(MainContext) ;
    const logout = async () => {
      try{
        axios.defaults.withCredentials = true ;
        const {data} = await axios.post(BackendUrl+'/api/auth/logout');
        data.success && setIsLoggedIn(false);
        data.success && setUserData(false) ;
        navigate('/');
      }
      catch(error) {
        toast.error(error.message) ;
      }
    }
    const sendVerificationotp = async () => {
        try{
          axios.defaults.withCredentials = true ;
          const {data} = await axios.post(BackendUrl+'/api/auth/send-verify-otp') ;
          if(data.success) {
            navigate('/email-verify')
            toast.success(data.message) ;
          }
          else{
            toast.error(data.message) ;
          }
        }
        catch(e) {
          toast.error(error.message) ;
        } 
    }

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
    <img className='w-28 sm:w-32 ' src={assets.logo} alt="" />
    
    {userData ? 
      <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group'>
        {userData.name[0].toUpperCase()}
  
        {/* Dropdown */}
        <div className='absolute hidden group-hover:block top-full right-0 z-10 text-black rounded pt-2'>
          <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
            {!userData.isVerified && 
              <li onClick={sendVerificationotp}  className='py-1 px-2 hover:bg-gray-200 cursor-pointer whitespace-nowrap'>
                Verify Email
              </li>}
            <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer whitespace-nowrap'>
              LogOut
            </li>
          </ul>
        </div> 
      </div> 
      : 
      <button onClick={() => navigate('/login')} className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>
        Login <img src={assets.arrow_icon} alt="" />
      </button>
    }
  </div>
  
  )
}

export default Navbar