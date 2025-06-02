import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { MainContext } from '../context/MainContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Login = () => {
    useEffect(() => {
        AOS.init({
            duration: 700,
        });
    }, []);

    const [state, setState] = useState('Sign up');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { BackendUrl, setIsLoggedIn, getUserData } = useContext(MainContext);

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            axios.defaults.withCredentials = true;

            if (state === 'Sign up') {
                const { data } = await axios.post(`${BackendUrl}/api/auth/register`, {
                    name,
                    email: email.toLowerCase(),
                    password
                });

                if (data.success) {
                    toast.success("Registration Successful!");
                    setIsLoggedIn(true);
                    getUserData();
                    navigate('/');
                } else {
                    toast.error(data.message || "Registration failed");
                }
            } else {
                const { data } = await axios.post(`${BackendUrl}/api/auth/login`, {
                    email: email.toLowerCase(),
                    password
                });

                if (data.success) {
                    toast.success("Login Successful!");
                    setIsLoggedIn(true);
                    getUserData();
                    navigate('/');
                } else {
                    toast.error(data.message || "Login failed");
                }
            }
        } catch (e) {
            console.error('Auth error:', e);
            toast.error(e.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    const handleGoogleLogin = async () => {
        try {
            // Open Google OAuth popup
            const width = 500;
            const height = 600;
            const left = window.screenX + (window.outerWidth - width) / 2;
            const top = window.screenY + (window.outerHeight - height) / 2;
            
            const popup = window.open(
                `${BackendUrl}/api/auth/google`,
                'Google Login',
                `width=${width},height=${height},left=${left},top=${top}`
            );

            // Listen for the OAuth response
            window.addEventListener('message', async (event) => {
                if (event.origin === BackendUrl) {
                    const { data } = event.data;
                    if (data.success) {
                        toast.success("Google Login Successful!");
                        setIsLoggedIn(true);
                        getUserData();
                        navigate('/');
                    } else {
                        toast.error(data.message || "Google login failed");
                    }
                    popup.close();
                }
            });
        } catch (error) {
            console.error('Google login error:', error);
            toast.error('Failed to login with Google. Please try again.');
        }
    };

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
                {/* Left Side - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                    <div data-aos="fade-up" className="w-full max-w-md space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {state === 'Sign up' ? 'Create Account' : 'Welcome Back'}
                            </h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                {state === 'Sign up' 
                                    ? 'Join us and start your secure journey' 
                                    : 'Sign in to your account to continue'}
                            </p>
                        </div>

                        {/* Google Login Button */}
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <form className="mt-8 space-y-6" onSubmit={onSubmitHandler}>
                            {state === 'Sign up' && (
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Full Name
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <img src={assets.person_icon} alt="" className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                            )}

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

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Password
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
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {state === 'Login' && (
                                <div className="flex items-center justify-end">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/reset-password')}
                                        className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                                    >
                                        Forgot your password?
                                    </button>
                                </div>
                            )}

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                >
                                    {state === 'Sign up' ? 'Create Account' : 'Sign In'}
                                </button>
                            </div>
                        </form>

                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {state === 'Sign up' ? 'Already have an account?' : "Don't have an account?"}{' '}
                                <button
                                    type="button"
                                    onClick={() => setState(state === 'Sign up' ? 'Login' : 'Sign up')}
                                    className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                                >
                                    {state === 'Sign up' ? 'Sign in' : 'Sign up'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Image/Pattern */}
                <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-indigo-500 to-purple-600">
                    <div className="h-full flex items-center justify-center p-12">
                        <div className="max-w-lg text-center text-white">
                            <h2 className="text-4xl font-bold mb-6">Secure Authentication</h2>
                            <p className="text-lg text-indigo-100">
                                Experience the next level of security with our advanced authentication system.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
