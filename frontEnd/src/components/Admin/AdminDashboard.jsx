import React from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from 'axios';


const AdminDashboard = () => {
    const navigate = useNavigate()
    axios.defaults.withCredentials = true;

    const handleLogout = () => {
        axios.post('http://localhost:3000/auth/logout')
            .then(result => {
                if (result.data.logoutStatus) {
                    localStorage.removeItem("valid")
                    localStorage.removeItem("role")
                    navigate('/')
                }
            })
            .catch(err => console.error("Logout error", err));

    }

    return (
        <div className='container-fluid vh-100 ' >
            <div className='row flex-nowrap fixed-top' >
                <div className='col-auto col-md-3 col-xl-2 px-sm-0 px-0 navbar fixed-left' >
                    <div className='d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100 ' >

                        <ul
                            className='nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start'
                            id='menu'>
                            <li className='w-100 navItem'>
                                <NavLink to="/admindashboard" end
                                    className='nav-link text-white align-middle ' >
                                    <i className='fs-4 bi-speedometer2 ms-2'></i>
                                    <span className='ms-2 d-none d-sm-inline'>Dashboard</span>
                                </NavLink>
                            </li>
                            <li className='w-100 navItem'>
                                <NavLink to="/admindashboard/users"
                                    className='nav-link text-white  align-middle'>
                                    <i className='fs-4 bi-people ms-2'></i>
                                    <span className='ms-2 d-none d-sm-inline'>Manage Users</span>
                                </NavLink>
                            </li>
                            <li className='w-100 navItem'>
                                <NavLink to="/admindashboard/stores"
                                    className='nav-link text-white  align-middle'>
                                    <i className='fs-4 bi-columns ms-2'></i>
                                    <span className='ms-2 d-none d-sm-inline'>Manage Stores</span>
                                </NavLink>
                            </li>


                            <li className='w-100' onClick={handleLogout}>
                                <Link to="/"
                                    className='nav-link text-white align-middle'>
                                    <i className='fs-4 bi-power ms-2'></i>
                                    <span className='ms-2 d-none d-sm-inline'>Logout</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='col p-0 m-0 content  '>
                    <div className='p-2 d-flex justify-content-center align-items-center shadow bg-light navbar1 '>
                        <h4>Store Rating system</h4>
                    </div>
                    <div className='data'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default AdminDashboard