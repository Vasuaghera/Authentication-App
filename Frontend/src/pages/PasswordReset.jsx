import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { MainContext } from '../context/MainContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import AOS from 'aos';
import 'aos/dist/aos.css'

const PasswordReset = () => {
 useEffect(() => {
          AOS.init({
            duration: 700, 
          });
        }, []);
  axios.defaults.withCredentials = true;
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0); // Timer for 1 minute
  const { BackendUrl, isLoggedIn, userData, getUserData } = useContext(MainContext);

  useEffect(() => {
    let timer;
    if (timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000); // Decrease time by 1 every second
    } else {
      setIsButtonDisabled(false); // Enable the button when the timer reaches 0
      clearInterval(timer); // Clear timer once it reaches 0
    }
    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  const handleDelete = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  }

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(BackendUrl + '/api/auth/send-reset-otp', { email });
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
        setIsButtonDisabled(true); // Disable the button when OTP is sent
        setTimeRemaining(60); // Set timer for 1 minute
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const onSubmitResetEmailotp = async (e) => {
    e.preventDefault();
    try {
      const otpArray = inputRefs.current.map((e) => e.value);
      setOtp(otpArray.join(''));
      setIsOtpSubmitted(true);
    } catch (error) {
      toast.error(error.message);
    }
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(BackendUrl + '/api/auth/reset-password', { email, otp, newPassword });
      if (data.success) {
        toast.success("Password changed successfully");
      } else {
        toast.error("You Entered Incorrect OTP");
      }
      data.success && navigate('/login');
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-300 to-purple-400">
      <img
        onClick={() => navigate('/')}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        src={assets.logo}
        alt=""
      />

      <form data-aos="fade-right" onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-98 text-sm'>
        <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password</h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter your registered Email address.
        </p>

        {/* Email Input */}
        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
          <img className='w-3 h-3' src={assets.mail_icon} alt="" />
          <input
            className='bg-transparent underline-none text-white focus:outline-none'
            type="email"
            placeholder='Email Id'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Send OTP Button */}
        <button
          type="submit"
          onClick={onSubmitEmail}
          className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'
          disabled={isButtonDisabled}
        >
          {isButtonDisabled ? "Resend OTP in " + timeRemaining + "s" : "Send OTP"}
        </button>

        {/* OTP Input */}
        {isEmailSent && (
          <>
            <p className="text-center mb-2 mt-10 text-indigo-300">
              Enter the 6-digit code sent to your Email Id.
            </p>
            <div onChange={onSubmitResetEmailotp} className="flex justify-between mb-8" required onPaste={handlePaste}>
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
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleDelete(e, index)}
                  />
                ))}
            </div>
          </>
        )}

        {/* New Password Input */}
        {isOtpSubmitted && (
          <>
            <p className="text-center mb-6 text-indigo-300">
              Enter your New Password.
            </p>
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img className='w-3 h-3' src={assets.lock_icon} alt="" />
              <input
                className='bg-transparent underline-none text-white focus:outline-none'
                type="password"
                placeholder='Password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>
          Submit
        </button>
      </form>
    </div>
  )
}

export default PasswordReset;
