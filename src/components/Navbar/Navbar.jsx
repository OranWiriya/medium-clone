import React, { useEffect, useState } from 'react'
import { NavLink, Navigate } from 'react-router-dom'
import localStorage from '../../services/localStorage'
import DefaultProfile from "/DefaultProfile.jpg"
import jwtDecode from "jwt-decode"
import axios from 'axios'


function Navbar() {
    const [username, setUsername] = useState("test")
    const [image, setImage] = useState(DefaultProfile)
    const [isOpen, setIsOpen] = useState(false)
    const [color, setColor] = useState(false)
    const [where, setWhere] = useState(0)
    const [timeout, setTimeout] = useState(0)
    const [checkTime, setCheckTime] = useState(0)

    const changeColor = () => {
        if (window.scrollY >= 180) {
            setColor(true)
        } else {
            setColor(false)
        }
    }

    let role = localStorage.getRole()
    useEffect(() => {
        if (role === "user") {
            const payload = localStorage.getToken()
            const data = jwtDecode(payload)
            setTimeout(data.exp)
            setWhere(data.id)
            axios.get(`users/getinfo/${data.id}`)
                .then(res => {
                    setUsername(res.data.targetUsername)
                    setImage(res.data.targetImage)
                })
            if (!data) {
                Navigate("/signup")
                setUsername("")
            }
        }
    }, [checkTime, role])

    useEffect(() => {
        if (timeout < Date.now() / 1000) {
            setCheckTime(1)
            role = localStorage.getRole()
        }
    }, [timeout])

    window.addEventListener("scroll", changeColor)

    return (
        <nav className={color ? "navbar-v2" : "navbar"}>
            <div className="navbarlogo">
                <span>
                    <NavLink to="/">
                        Medium
                    </NavLink>
                </span>
            </div>
            <div className="navbar-menu">
                <NavLink to="/" className="hover:text-yellow-600">
                    Home
                </NavLink>
                {role === "user" ? (
                    <>
                        <div>
                            <NavLink to={"/new-article"} className="hover:text-yellow-600"> New Articles</NavLink>
                            <button onClick={() => {
                                setIsOpen((prev) => !prev)
                            }} className='hover:text-yellow-600'>
                                <img src={image ? image : DefaultProfile} alt="DefaultProile" width={30} height={30} className='inline-block rounded-md mx-2 ml-4' />
                                {username}
                            </button>
                            {isOpen === true ? (
                                <div className="dropbox">
                                    <div>
                                        <NavLink to={"/profile/" + where} className="hover:text-yellow-600">Profile</NavLink>
                                        <NavLink to={"/profile/" + where + "/settings"} className="hover:text-yellow-600">Settings</NavLink>
                                        <NavLink to={"/signin"} onClick={() => {
                                            localStorage.removeToken()
                                            window.location.reload()
                                        }} className={"border-t hover:text-yellow-600"}>logout</NavLink>
                                    </div>
                                </div>
                            ) : (null)}
                        </div>
                    </>
                ) : (
                    <>
                        <NavLink to="/signin">
                            Signin
                        </NavLink>
                        <NavLink to="/signup">
                            Signup
                        </NavLink>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar