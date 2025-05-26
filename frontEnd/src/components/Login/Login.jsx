import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as yup from 'yup';


export const schema = yup.object().shape({
    email: yup.string().required(' Email is required').email('invalid email'),
    password: yup.string().required(' Password is required').min(4, 'Password must be at least 4 characters'),
});

const Login = () => {
    const [values, setValues] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState(null) // store error at login

    const navigate = useNavigate();
    axios.defaults.withCredentials = true; // to store token in cookie 

    const handleSubmit = (event) => {
        event.preventDefault()
        axios.post('http://localhost:3000/auth/login', values)
            .then(result => {
                if (result.data.loginStatus) {
                    localStorage.setItem("valid", "true");
                    localStorage.setItem("role", result.data.role);
                    const userRole = result.data.role;

                    if (userRole === "admin") {
                        navigate('/admindashboard');
                    } else if (userRole === "storeOwner") {
                        navigate('/storedashboard');
                    } else {
                        navigate('/userdashboard');
                    }

                    alert("Logged in successfully");
                } else {
                    setError(result.data.Error || result.data.message);
                }
            })
            .catch(err => {
                console.log(err);
                setError("Server error, try again later");
            });

    }
    return (
        <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
            <div className='p-3 rounded w-25 border loginForm'>
                <div className='text-warning'>
                    {error && error}
                </div>
                <div className='text-center'>
                    <img src="vite.svg" alt="logo" className='logo' />
                    <h2>Welcome</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email:</strong></label>
                        <input type="email" name='email' autoComplete='off' placeholder='Enter Email'
                            onChange={(e) => setValues({ ...values, email: e.target.value })} className='form-control rounded-0 input' required />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password:</strong></label>
                        <input type="password" name='password' placeholder='Enter Password'
                            onChange={(e) => setValues({ ...values, password: e.target.value })} className='form-control rounded-0 input' required />
                    </div>
                    <button className='btn btn-info w-100 rounded-2 mb-1'>Log in</button>
                    <p className='forgot-password text-right mt-2'>
                        Don't have an account? <a href='/signup'>sign un?</a>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login