import React, { useState, useEffect } from 'react'
import { Button, Col, Row } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import UserModal, { schema } from './Users/UserModal';
import axios from 'axios';
import UserTable from './Users/UserTable';


const ManageUsers = () => {
    const [show, setShow] = useState(false);
    const [users, setUsers] = useState([]);
    const [userType, setUserType] = useState([]);


    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(schema),
        mode: 'all'
    });


    const handleShow = () => {
        setShow(true);
    }

    const handleClose = () => {
        reset();
        setShow(false);
    }

    const addUser = async (formData) => {
        try {
            const { data } = await axios.post('http://localhost:3000/auth/add_User', formData);
            fetchUser();
            handleClose();
        } catch (error) {
            console.log(error, "************");
        }
        handleClose();
    }

    const fetchUser = () => {
        axios.get('http://localhost:3000/auth/users')
            .then(result => {
                if (result.data.Status) {
                    setUsers(result.data.Result);
                } else {
                    alert(result.data.error)
                }
            }).catch(err => console.log(err))
    }

    const fetchUserType = async () => {
        const { data } = await axios.get('http://localhost:3000/auth/userType');

        setUserType(data.Result.slice(1));
        // console.log(data.Result);
    }


    useEffect(() => {
        fetchUser(),
            fetchUserType()
    }, [])

    return (
        <>
            <Col xs={12} md={10} className='mx-auto p-3 mb-5 mt-5'>
                <Row className='my-5'>
                    <Col className='text-center'>
                        <h3 className='text-primary'>User List</h3>
                    </Col>
                    <Col xs={3} className='text-end'>
                        <Button variant='success' onClick={handleShow}>Add User</Button>
                    </Col>
                </Row>

                <Row>
                    <UserTable show={show} user={users} handleOpen={handleShow} handleClose={handleClose} />
                </Row>
            </Col>

            <UserModal show={show} handleClose={handleClose} handleOpen={handleShow}
                register={register} formSubmit={handleSubmit} errors={errors}
                user={users} userType={userType} onSubmit={addUser} isValid={isValid} />
        </>)
}

export default ManageUsers