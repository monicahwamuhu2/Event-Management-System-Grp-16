import React from 'react'
import Login from '../../components/Login'
import Register from '../../components/Register'
import { useAuth } from '../../context/AuthContext'

const AuthPage = () => {
  const { isLogin} = useAuth();
    
    
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
         <div className="form-container relative w-[26rem] h-[26rem]">
            <div
              className={`absolute inset-0 transform transition-all duration-500 ${
                isLogin ? "opacity-100 scale-100 z-10" : "opacity-0 scale-90 -z-10"
              }`}
            >
              <Login />
            </div>
            <div
              className={`absolute inset-0 transform transition-all duration-500 ${
                isLogin ? "opacity-0 scale-90 -z-10" : "opacity-100 scale-100 z-10"
              }`}
            >
              <Register />
            </div>
        </div>
    </div>
  )
}

export default AuthPage