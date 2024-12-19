'use client'
import React from 'react';
import Navbar from '../NavBar';
import Footer from '../Footer';

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
