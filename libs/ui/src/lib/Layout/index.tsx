'use client'

import Footer from '../Footer';
import Navbar from '../NavBar';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-between w-full h-full min-h-screen dark:bg-slate-950">
      <Navbar />
      <div className='flex items-center justify-center flex-1 w-full h-full min-h-[70vh] py-10'>
      {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
