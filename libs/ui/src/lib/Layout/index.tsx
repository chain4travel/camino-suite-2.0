'use client'

import Footer from '../Footer';
import Navbar from '../NavBar';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-between w-full h-auto min-h-screen dark:bg-slate-950">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
