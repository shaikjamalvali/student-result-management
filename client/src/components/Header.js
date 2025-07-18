import React from "react";
import logo from "../images/logo.jpg";
import profileIcon from "../images/profile.png"; // Replace with the path to your profile icon image

const Header = () => {
  return (
    <header className='sticky top-0 z-50 bg-white border-b border-gray-200 px-4 lg:px-8 py-4'>
      <div className='max-w-7xl mx-auto flex items-center justify-between'>
        {/* Left-hand side logo and college name */}
        <div className='flex items-center space-x-3'>
          <div className='relative'>
            <img 
              src={logo} 
              alt='Logo' 
              className='w-12 h-12 rounded-lg shadow-md' 
            />
            <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white'></div>
          </div>
          <div>
            <h1 className='text-lg font-semibold text-gray-900'>NIT Warangal</h1>
            <p className='text-sm text-gray-500'>Student Management System</p>
          </div>
        </div>

        {/* Right-hand side profile and actions */}
        <div className='flex items-center space-x-4'>
          <button className='text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200'>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'></path>
            </svg>
          </button>
          
          <div className='flex items-center space-x-3 border-l pl-4 border-gray-200'>
            <div className='text-right hidden sm:block'>
              <p className='text-sm font-medium text-gray-900'>Admin User</p>
              <p className='text-xs text-gray-500'>admin@nitw.ac.in</p>
            </div>
            <img
              src={profileIcon}
              alt='Profile'
              className='w-10 h-10 rounded-full ring-2 ring-gray-200 cursor-pointer hover:ring-primary-500 transition-all duration-200'
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
