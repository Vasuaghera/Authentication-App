import React, { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import axios from 'axios';
import { MainContext } from '../context/MainContext';
import { toast } from 'react-toastify';
import AOS from 'aos';
import 'aos/dist/aos.css'

const VerifyEmail = () => {
  useEffect(() => {
          AOS.init({
            duration: 700, 
          });
        }, []);
  axios.defaults.withCredentials = true ;
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const {BackendUrl , isLoggedIn , userData , getUserData} = useContext(MainContext);
  const handleInput = (e,index) => {
    if(e.target.value.length > 0 && index < inputRefs.current.length-1) {
      inputRefs.current[index+1].focus() ;
    }
  }
  const handleDelete = (e,index) => {
    if(e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index-1].focus() ;
    } 
  }
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text') ;
    const pasteArray = paste.split('') ;
    pasteArray.forEach((char,index) => {
      if(inputRefs.current[index]) {
        inputRefs.current[index].value = char ;
      }
    });
  }
  const onSubmitHandler = async(e) => {
    try{
      e.preventDefault() ;
      const otpArray = inputRefs.current.map(e=>e.value)
      const otp = otpArray.join('')
      const {data} = await axios.post(BackendUrl+'/api/auth/verify-account',{otp})
      if(data.success) {
        toast.success(data.message) ;
        getUserData() ;
        navigate('/') ;
      }
      else{
        toast.error(data.message) ;
      }
    }
    catch(error) {
      toast.error(error.message) ;
    }
  }
  useEffect(() => {
    if(isLoggedIn && userData && userData.isVerified ) {
      navigate('/')
    }
  },[isLoggedIn,userData]);
  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-300 to-purple-400">
      <img
        onClick={() => navigate('/')}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        src={assets.logo}
        alt=""
      />
      <form data-aos="zoom-in" onSubmit={onSubmitHandler} className="bg-slate-900 p-8 rounded-lg shadow-lg w-98 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">Email Verify otp</h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter the 6-digit code sent to your Email Id.
        </p>
        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 m-[6px] p-4 bg-[#333A5C] text-white text-center text-xl rounded-md"
                ref={(e) => (inputRefs.current[index] = e)} // Storing the refs in inputRefs.current
                onInput={(e) => handleInput(e,index)} 
                onKeyDown={(e)=>handleDelete(e,index)}
              />
            ))}
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;