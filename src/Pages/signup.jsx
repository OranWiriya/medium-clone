import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Signup() {
    const [username, setUsername] = useState("")
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate();

    const onFinish = async (e) => {
        e.preventDefault()
        console.log(username, password, firstname, lastname, email)
        const body = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            username: username,
            password: password
        }
        setFirstname("")
        setLastname("")
        setEmail("")
        setUsername("")
        setPassword("")
        await axios.post("http://localhost:8000/users/register", body)
            .then(result => {
                if (result.status === 201) {
                    console.log(result)
                    navigate("/signin")
                }
            })
            .catch(err => {
                console.log(err)
                setError("Register failed try again.")
            })
    };


    return (
        <>
            <div className='mt-36 mb-52'>
                <div className="header">
                    <div className='text-center text-3xl font-semibold'>
                        Signup
                    </div>
                </div>
                <div className='text-center pt-5 text-red-500 font-semibold'>{error}</div>
                <div className="form">
                    <form onSubmit={onFinish} className='flex mt-8 space-y-6 justify-center'>
                        <div className="-space-y-px rounded-md shadow-sm w-60">
                            <div>
                                <label >
                                    <input type="text" name='firstname' value={firstname} onChange={(e) => setFirstname(e.target.value)} placeholder='Firstname' required={{ required: true }} className='relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 px-2 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6' />
                                </label>
                            </div>
                            <div>
                                <label >
                                    <input type="text" name='lastname' value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder='Lastname' required={{ required: true }} className='relative block w-full  border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 px-2 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6' />
                                </label>
                            </div>
                            <div>
                                <label >
                                    <input type="email" name='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' required={{ required: true }} className='relative block w-full  border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 px-2 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6' />
                                </label>
                            </div>
                            <div>
                                <label >
                                    <input type="text" name='username' value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' required={{ required: true }} className='relative block w-full  border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 px-2 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6' />
                                </label>
                            </div>
                            <div>
                                <label >
                                    <input type="password" name='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' required={{ required: true }} className='relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 px-2 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6' />
                                </label>
                            </div>
                            <br />
                            <div >
                                <button
                                    type="submit"
                                    className="group relative flex w-full justify-center rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                                >
                                    Register
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Signup