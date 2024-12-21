import './App.css'
import { Routes , Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import PasswordReset from './pages/PasswordReset'
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
    <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/email-verify' element={<VerifyEmail/>}/>
        <Route path='/reset-password' element={<PasswordReset/>}/>
      </Routes>
    </>
  )
}

export default App
