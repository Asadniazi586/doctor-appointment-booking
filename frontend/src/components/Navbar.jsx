import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const navigate = useNavigate()
  const { token, setToken, userData, loadUserProfileData } = useContext(AppContext)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    if (token && !userData) {
      loadUserProfileData()
    }
  }, [token])

  const logout = () => {
    setToken("")
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <header className='bg-white shadow-sm border-b mb-5'>
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center'>
        <img
          onClick={() => navigate('/')} 
          className='w-28 cursor-pointer active:opacity-70' 
          src={assets.logo} 
          alt="Logo" 
        />

        <ul className='hidden md:flex items-center space-x-6 text-gray-700 font-medium'>
          <NavLink to='/'><li className='hover:text-blue-600 transition-colors duration-300'>Home</li></NavLink>
          <NavLink to='/doctors'><li className='hover:text-blue-600 transition-colors duration-300'>All Doctors</li></NavLink>
          <NavLink to='/about'><li className='hover:text-blue-600 transition-colors duration-300'>About</li></NavLink>
          <NavLink to='/contact'><li className='hover:text-blue-600 transition-colors duration-300'>Contact</li></NavLink>
        </ul>

        <div className='flex items-center gap-4'>
          {token && userData ? (
            <div className='relative'>
              {/* Mobile-optimized profile dropdown */}
              <div 
                className='flex items-center gap-2 cursor-pointer active:bg-gray-100 p-2 rounded-lg md:p-0 md:active:bg-transparent' 
                onClick={() => setShowMenu(!showMenu)} // Toggle dropdown on mobile
              >
                <img className='w-9 h-9 rounded-full object-cover border border-gray-300' src={userData.image || assets.default_profile} alt="Profile" />
                <img className='w-2.5' src={assets.dropdown_icon} alt="Dropdown" />
              </div>
              
              {/* Dropdown menu - visible on hover for desktop, on click for mobile */}
              <div className={`absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-md z-50 min-w-[160px] py-2 
                ${window.innerWidth < 768 ? (showMenu ? 'block' : 'hidden') : 'hidden md:group-hover:block md:hidden'}`}
              >
                <p 
                  onClick={() => {
                    navigate('/my-profile');
                    setShowMenu(false);
                  }} 
                  className='px-4 py-2 hover:bg-gray-100 active:bg-gray-200 cursor-pointer text-sm text-gray-700 touch-manipulation'
                >
                  My Profile
                </p>
                <p 
                  onClick={() => {
                    navigate('/my-appointments');
                    setShowMenu(false);
                  }} 
                  className='px-4 py-2 hover:bg-gray-100 active:bg-gray-200 cursor-pointer text-sm text-gray-700 touch-manipulation'
                >
                  My Appointments
                </p>
                <p 
                  onClick={() => {
                    logout();
                    setShowMenu(false);
                  }} 
                  className='px-4 py-2 hover:bg-gray-100 active:bg-gray-200 cursor-pointer text-sm text-gray-700 touch-manipulation'
                >
                  Logout
                </p>
              </div>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className='hidden md:inline-block bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-2 rounded-full text-sm transition-all touch-manipulation'>Create Account</button>
          )}

          <img 
            onClick={() => setShowMenu(true)} 
            className='w-6 md:hidden cursor-pointer active:opacity-70 touch-manipulation' 
            src={assets.menu_icon} 
            alt="Menu" 
          />
        </div>
      </nav>

      {/* Mobile Menu - Improved */}
      <div className={`md:hidden fixed inset-y-0 right-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${showMenu && (!token || !userData) ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className='flex justify-between items-center p-5 border-b'>
          <h2 className='text-lg font-semibold text-gray-800'>Menu</h2>
          <button 
            onClick={() => setShowMenu(false)} 
            className='text-gray-600 hover:text-black text-xl active:text-black p-2 touch-manipulation'
          >
            ×
          </button>
        </div>
        <ul className='flex flex-col p-5 gap-4 text-gray-700 text-sm'>
          <NavLink to='/' onClick={() => setShowMenu(false)}>
            <li className='py-2 active:bg-gray-100 px-2 rounded touch-manipulation'>Home</li>
          </NavLink>
          <NavLink to='/doctors' onClick={() => setShowMenu(false)}>
            <li className='py-2 active:bg-gray-100 px-2 rounded touch-manipulation'>All Doctors</li>
          </NavLink>
          <NavLink to='/about' onClick={() => setShowMenu(false)}>
            <li className='py-2 active:bg-gray-100 px-2 rounded touch-manipulation'>About</li>
          </NavLink>
          <NavLink to='/contact' onClick={() => setShowMenu(false)}>
            <li className='py-2 active:bg-gray-100 px-2 rounded touch-manipulation'>Contact</li>
          </NavLink>
          {!token && (
            <button 
              onClick={() => { 
                navigate('/login'); 
                setShowMenu(false); 
              }} 
              className='bg-blue-600 text-white px-4 py-3 rounded-full mt-4 active:bg-blue-700 touch-manipulation'
            >
              Create Account
            </button>
          )}
        </ul>
      </div>
    </header>
  )
}

export default Navbar