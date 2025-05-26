import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';


export const schema = yup.object().shape({
  name: yup.string().required(' Name is required'),
  email: yup.string().required(' Email is required').email('invalid email'),
  password: yup.string().required(' Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
  ,
  address: yup.string().required(' Address is required'),
});


export const SignUpForm = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    id: '', name: '', emial: '', address: '', password: '', userTypeId: ''
  })

  const onAddUserClick = async (newUser) => {
    try {
      console.log(newUser);
      const { data } = await axios.post('http://127.0.0.1:3000/auth/signup', newUser);
    } catch (error) {
      console.log(error);
    }
  }

  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });
  const navigate = useNavigate();

  const onSubmit = (data) => {
    onAddUserClick(data);
    console.log(data);
    return navigate("/");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">

      <div className="Auth-form-container ">
        <form className="Auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className='Auth-form-content'>
            <h3 className='mb-4 Auth-form-title'>Create new account:</h3>
            <div className="form-group mt-2">
              <label htmlFor="name" className="form-label"> Name<span className='text-danger'>*</span> :</label>
              {errors.name && <span className='text-danger'>{errors.name.message}</span>}
              <input className="form-control mt-1" placeholder='Enter first name'  {...register("name")} />
            </div>

            <div className="form-group mt-2">
              <label htmlFor="email" className="form-label">Email<span className='text-danger'>*</span> :</label>
              {errors.email && <span className='text-danger'>{errors.email.message}</span>}
              <input className="form-control mt-1" type='email' placeholder='Enter your email'  {...register("email")} />
            </div>

            <div className="form-group mt-2">
              <label htmlFor="password" className="form-label">Password<span className='text-danger'>*</span> :</label>
              {errors.password && <span className='text-danger'>{errors.password.message}</span>}
              <input className="form-control mt-1" type='password' placeholder='Enter password' {...register("password")} />
            </div>
            <div className="form-group mt-2">
              <label htmlFor="address" className="form-label">Address<span className='text-danger'>*</span> :</label>
              {errors.address && <span className='text-danger'>{errors.address.message}</span>}
              <input className="form-control mt-1" type='text' placeholder='Enter password' {...register("address")} />
            </div>


            <div className='d-grid gap-2 mt-4 px-4'>
              <button className='btn btn-success' type="submit" disabled={!isValid}>
                Sign Up
              </button>
            </div>
            <p className='forgot-password text-right mt-2'>
              Already registered <a href='/'>sign in?</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}


export default SignUpForm;
