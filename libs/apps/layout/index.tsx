import React from 'react';
import Navbar from '../../ui/src/lib/NavBar';
import Footer from '../../ui/src/lib/Footer';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col w-full h-auto min-h-screen">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
