import React, { useState } from 'react'
import { FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const { toggleAuthForm } = useAuth()
    const[password, setPassword] = useState('')
    const[isAlert, setIsAlert] = useState('')
    const[confirmPassword, setConfirmPassword] = useState('')

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
            
        }else if(!/[A-Za-z]/.test(password)){
            setIsAlert('Password must contain at least one letter')
            setTimeout(() => {
                setIsAlert('');
            }, 3000);
        }else if(!/\d/.test(password)){
            setIsAlert('Password must contain at least one number')
            setTimeout(() => {
                setIsAlert('');
            }, 3000);
        }else if(!/[^A-Za-z0-9]/.test(password)){
            setIsAlert('Password must contain at least one special character')
            setTimeout(() => {
                setIsAlert('');
            }, 3000);
        }else if (password !== confirmPassword) {
            setIsAlert("Passwords don't match!");
            setTimeout(() => {
                setIsAlert('');
            }, 3000);
          }
    }
    

    //prevent the default form submission
    const handleSubmit = (e) => {
        e.preventDefault()
        if (validateForm()) {
            setIsAlert('Form submitted')
          }
    } 

  return (
    <div className='w-auto h-full bg-gray-100 dark:bg-gray-700 dark:text-white shadow-xl rounded-lg flex flex-col justify-between p-4'>
        <div className='w-full flex justify-center'>
            <h1 className='text-2xl font-bold flex items-center'><FaCalendarAlt />EventPro</h1>
        </div>
        <div>
            <form onSubmit={handleSubmit}>
                <div className='flex flex-col my-2'>
                    <label htmlFor='username'></label>
                    <input 
                    type='username' 
                    id='username' 
                    placeholder='Username' 
                    className='border border-gray-300 p-2 my-2 text-black' 
                    required/>
                </div>
                <div className='flex flex-col my-2'>
                    <label htmlFor='email'></label>
                    <input 
                    type='email' 
                    id='email' 
                    placeholder='Email' 
                    className='border border-gray-300 p-2 my-2 text-black' 
                    required/>
                </div>
                <div className='flex flex-col my-2'>
                    <label htmlFor='password'></label>
                    <input 
                    type='password' 
                    id='password' 
                    placeholder='Password' 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='border border-gray-300 p-2 my-2 text-black' 
                    required/>
                </div>
                <div className='flex flex-col my-2 relative'>
                    <label htmlFor='confirmPassword'></label>
                    <input 
                    type='password' 
                    id='confirmPassword' 
                    placeholder='Confirm Password' 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className='border border-gray-300 p-2 my-2 text-black' 
                    required/>
                    <div className=' absolute text-xs -bottom-3 text-red-600'>
                        <p> {isAlert} </p>
                    </div>
                </div>
                <div>
                    <button className='bg-gray-900 text-white p-2 w-full my-2'>Register</button>
                </div>
            </form>
        </div>
        <div className='flex flex-col items-center'>
            <p>Already have an account? <span className='text-gray-600 dark:text-gray-200 cursor-pointer' onClick={toggleAuthForm}>Sign In</span></p>
        </div>
    </div>
  )
}

export default Register