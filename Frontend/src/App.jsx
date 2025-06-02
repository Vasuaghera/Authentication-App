import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import PasswordReset from './pages/PasswordReset'
import { ToastContainer } from 'react-toastify';
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Profile from './components/Profile'
import PrivateRoute from './components/PrivateRoute'
import Documentation from './components/Documentation'
import Footer from './components/Footer'
import Privacy from './pages/Privacy'

function App() {
  console.log('App is rendering'); // Debug message
  return (
    <>
      <ToastContainer/>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/reset-password' element={<PasswordReset/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/forgot-password' element={<ForgotPassword/>}/>
            <Route path='/documentation' element={<Documentation/>}/>
            <Route path='/privacy' element={<Privacy/>}/>
            <Route path='/profile' element={
              <PrivateRoute>
                <Profile/>
              </PrivateRoute>
            }/>
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default App
