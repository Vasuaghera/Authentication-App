import React, { useContext , useEffect} from 'react'
import { assets } from '../assets/assets'
import { MainContext } from '../context/MainContext'
import AOS from 'aos';
import 'aos/dist/aos.css'

const Header = () => {

  useEffect(() => {
    AOS.init({
      duration: 700, 
    });
  }, []);
  const {userData} = useContext(MainContext) ;
  return (
    <div data-aos="zoom-in" className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
        <img className='w-36 h-36 rounded-full mb-6' src={assets.header_img} alt="" />
        <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-3'>Hey {userData ? userData.name : 'Developer'} <img className='w-8 aspect-square' src={assets.hand_wave} alt="" /></h1>
        <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welecome to our Authentication App</h2>
        <p className='mb-8 max-w-md'>Experience Seamless and Protected Authentication at Your Fingertips.</p>
        <button className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all'>Get Started</button>
    </div>
  )
}

export default Header