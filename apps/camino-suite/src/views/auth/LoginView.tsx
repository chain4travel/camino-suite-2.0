'use client'

import { Login } from "@camino/auth";

const LoginView = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <Login />
    </div>
  );
};

export default LoginView;
