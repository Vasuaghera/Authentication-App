import React, { useContext, useEffect } from 'react'
import { MainContext } from '../context/MainContext'
import { Link } from 'react-router-dom'
import AOS from 'aos';
import 'aos/dist/aos.css'

const Header = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  const { userData } = useContext(MainContext);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-white to-white dark:from-blue-500/10 dark:via-slate-900 dark:to-slate-900"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDEtMSAxLTIgMXMtMi0xLTItMiAxLTIgMi0yIDIgMSAyIDJ6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      </div>

      {/* Main Content */}
      <div className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 w-full">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="lg:col-span-7 space-y-8" data-aos="fade-up">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium">
                  <span className="mr-2">🔒</span>
                  Enterprise-Grade Security
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                  Secure Your
                  <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
                    Digital Future
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-slate-300 max-w-2xl">
                  Experience the next generation of authentication. Simple, secure, and seamless.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {userData ? (
                  <>
                    <Link
                      to="/profile"
                      className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-xl font-medium overflow-hidden"
                    >
                      <span className="relative z-10 text-white">View Profile</span>
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </Link>
                    
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-xl font-medium overflow-hidden"
                    >
                      <span className="relative z-10 text-white">Get Started</span>
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </Link>
                   
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Visual Element */}
            <div className="lg:col-span-5 relative" data-aos="fade-left">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 dark:border-white/10">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 p-8">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Secure Authentication</h3>
                        <p className="text-white/80">Protect your data with our advanced security features</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header