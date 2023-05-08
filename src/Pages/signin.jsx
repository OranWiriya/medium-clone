import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import localStorage from '../services/localStorage';

export default function Signin() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();
    const onFinish = async (e) => {
        e.preventDefault()
        console.log(username, password)
        const body = {
            username: username,
            password: password
        }
        setUsername("")
        setPassword("")
        await axios.post("http://localhost:8000/users/login", body)
        .then(result => {
            console.log(result)
            localStorage.setToken(result.data.token)
            navigate("/")
            window.location.reload()
        })
        .catch(err => {
           console.log(err)
        })
    };

    return (
        <>
            <div className='mt-[10.5rem] mb-72'>
                <div className="header">
                    <div className='text-center text-3xl font-semibold'>
                        Signin
                    </div>
                </div>
                <div className="form">
                    <form onSubmit={onFinish} className='flex mt-8 space-y-6 justify-center'>
                        <div className="-space-y-px rounded-md shadow-sm w-60">
                            <div>
                                <label >
                                    <input type="text" value={username} onChange={(e)=> setUsername(e.target.value)} name='username' placeholder='Username' className='relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 px-2 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6' />
                                </label>
                            </div>
                            <div>
                                <label >
                                    <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)} name='password' placeholder='Password' className='relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 px-2 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6' />
                                </label>
                            </div>
                            <br />
                            <div >
                                <button
                                    type="submit"
                                    className="group relative flex w-full justify-center rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                                >
                                    Sign in
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

