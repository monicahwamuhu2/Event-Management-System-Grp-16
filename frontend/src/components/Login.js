import React, { useState } from 'react'
import { FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';



const Login = () => {
    const { toggleAuthForm } = useAuth();
    const [password, setPassword] = useState('')
    const [isAlert, setIsAlert] = useState('')
   

    // validate the form
    const validateForm = () => {
        if(!password){ 
            setIsAlert('Password is required')
            setTimeout(() => {
                setIsAlert('');
            }, 3000);
        }else if(password.length < 6){
            setIsAlert('Password must be at least 6 characters');
            setTimeout(() => {
                setIsAlert('');
            }, 3000);
            
        }
    }

    // prevent the default form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsAlert('Form submitted')
          }
    }
  return (
    <div className='w-auto max-h-[23rem] bg-gray-100 dark:bg-gray-700 dark:text-white shadow-xl rounded-lg flex flex-col justify-between p-4'>
            
        <div className='w-full flex justify-center'>
            <h1 className='text-2xl font-bold flex items-center'><FaCalendarAlt /> EventPro</h1>
        </div>
        <div>
           <form onSubmit={handleSubmit}>
                <div className='flex flex-col my-2'>
                    <label htmlFor='email'></label>
                    <input 
                    type='email' 
                    id='email' 
                    placeholder='Email' 
                    className='border border-gray-300 p-2 my-2 text-black' 
                    required/>
                </div>
                <div className='flex flex-col my-2 relative'>
                    <label htmlFor='password'></label>
                    <input
                     type='password'
                     id='password' 
                     placeholder='Password' 
                     className='border border-gray-300 p-2 my-2 text-black' 
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required />

                    <div className=' absolute text-xs -bottom-3 text-red-600'>
                        <p> {isAlert} </p>
                    </div>
                </div>
                
                <div className='flex justify-center'>
                    <button className='bg-gray-900 text-white p-2 w-full my-2'>Login</button>
                </div>
           </form>
        </div>
        <div className='flex flex-col items-center'>
            <p className='mb-2'><a href='#reset'>Forgot password?</a></p>
            <p>Don't have an account? <span className='text-gray-600 dark:text-gray-200 cursor-pointer' onClick={toggleAuthForm}>Sign Up</span></p>
        </div>
    </div>
  )
}

export default Login