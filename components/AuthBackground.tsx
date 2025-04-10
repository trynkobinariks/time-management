import React from 'react'

const AuthBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="auth-triangle auth-triangle-1 z-0"></div>
      <div className="auth-triangle auth-triangle-2 z-0 hidden sm:block"></div>
      <div className="auth-triangle auth-triangle-3 z-0"></div>
      <div className="auth-triangle auth-triangle-4 z-0 hidden sm:block"></div>
      <div className="auth-triangle auth-triangle-5 z-0 hidden md:block"></div>
    </div>
  );
}

export default AuthBackground