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
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { BackendUrl } = useContext(MainContext);

  useEffect(() => {
    let timer;
    if (timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
    } else {
      setIsButtonDisabled(false);
      clearInterval(timer);
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
        setIsButtonDisabled(true);
        setTimeRemaining(60);
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
        navigate('/login');
      } else {
        toast.error("You Entered Incorrect OTP");
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Logo */}
      <div className="absolute top-8 left-8 sm:left-12 z-10">
        <div 
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 cursor-pointer group"
        >
          <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
            AuthApp
          </span>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Right Side - Form */}
        <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-indigo-500 to-purple-600">
          <div className="h-full flex items-center justify-center p-12">
            <div className="max-w-lg text-center text-white">
              <h2 className="text-4xl font-bold mb-6">Reset Your Password</h2>
              <p className="text-lg text-indigo-100">
                Follow the simple steps to securely reset your password and regain access to your account.
              </p>
            </div>
          </div>
        </div>

        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div data-aos="fade-up" className="w-full max-w-md space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Reset Password
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Enter your email to receive a reset code
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={onSubmitNewPassword}>
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <img src={assets.mail_icon} alt="" className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Send OTP Button */}
              <button
                type="button"
                onClick={onSubmitEmail}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isButtonDisabled}
              >
                {isButtonDisabled ? `Resend Code in ${timeRemaining}s` : 'Send Reset Code'}
              </button>

              {/* OTP Input */}
              {isEmailSent && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enter the 6-digit code
                  </label>
                  <div 
                    onChange={onSubmitResetEmailotp} 
                    className="flex justify-between gap-2" 
                    required 
                    onPaste={handlePaste}
                  >
                    {Array(6).fill(0).map((_, index) => (
                      <input
                        type="text"
                        maxLength="1"
                        key={index}
                        required
                        className="w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-center text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        ref={(e) => (inputRefs.current[index] = e)}
                        onInput={(e) => handleInput(e, index)}
                        onKeyDown={(e) => handleDelete(e, index)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* New Password Input */}
              {isOtpSubmitted && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <img src={assets.lock_icon} alt="" className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              {isOtpSubmitted && (
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Reset Password
                </button>
              )}
            </form>

            {/* Back to Login */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordReset;
