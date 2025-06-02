import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { MainContext } from '../context/MainContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ForgotPassword = () => {
    useEffect(() => {
        AOS.init({
            duration: 700,
        });
    }, []);

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${BackendUrl}/api/auth/send-reset-otp`, { email });
            if (data.success) {
                toast.success(data.message);
                setIsButtonDisabled(true);
                setTimeRemaining(60);
                navigate('/reset-password');
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-300 to-purple-400">
            <img
                onClick={() => navigate('/')}
                className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
                src={assets.logo}
                alt=""
            />

            <form 
                data-aos="fade-right" 
                onSubmit={handleSubmit} 
                className='bg-slate-900 p-8 rounded-lg shadow-lg w-98 text-sm'
            >
                <h1 className="text-white text-2xl font-semibold text-center mb-4">Forgot Password</h1>
                <p className="text-center mb-6 text-indigo-300">
                    Enter your registered email address to receive a password reset code.
                </p>

                {/* Email Input */}
                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                    <img className='w-3 h-3' src={assets.mail_icon} alt="" />
                    <input
                        className='bg-transparent underline-none text-white focus:outline-none w-full'
                        type="email"
                        placeholder='Email Address'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isButtonDisabled}
                    className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {isButtonDisabled ? `Resend Code in ${timeRemaining}s` : 'Send Reset Code'}
                </button>

                {/* Back to Login */}
                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="text-indigo-300 hover:text-indigo-400 transition-colors duration-200"
                    >
                        Back to Login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword; 