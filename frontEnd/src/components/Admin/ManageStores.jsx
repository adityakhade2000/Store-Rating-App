import React, { useState, useEffect } from 'react'
import { Button, Col, Row } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import StoreModal, { storeSchema } from './Stores/StoreModal';
import StoresTable from './Stores/StoresTable';


const ManageUsers = () => {
    const [show, setShow] = useState(false);
    const [stores, setStores] = useState([]);

    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(storeSchema),
        mode: 'all'
    });


    const handleShow = () => {
        setShow(true);
    }

    const handleClose = () => {
        reset();
        setShow(false);
    }

    const addStore = async (formData) => {
        try {
            const { data } = await axios.post('http://localhost:3000/auth/add_Store', formData);
            fetchStores();
            handleClose();
        } catch (error) {
            console.log(error, "************");
        }
        handleClose();
    }

    const fetchStores = () => {
        axios.get('http://localhost:3000/auth/stores')
            .then(result => {
                if (result.data.Status) {
                    setStores(result.data.Result);
                } else {
                    alert(result.data.error)
                }
            }).catch(err => console.log(err))
    }

    useEffect(() => {
        fetchStores()
    }, [])

    return (
        <>
            <Col xs={12} md={10} className='mx-auto p-3 mb-5 mt-5'>
                <Row className='my-5'>
                    <Col className='text-center'>
                        <h3 className='text-primary'>Stores List</h3>
                    </Col>
                    <Col xs={3} className='text-end'>
                        <Button variant='success' onClick={handleShow}>Add Store</Button>
                    </Col>
                </Row>

                <Row>
                    <StoresTable show={show} store={stores} handleOpen={handleShow} handleClose={handleClose} />
                </Row>
            </Col>

            <StoreModal show={show} handleClose={handleClose} handleOpen={handleShow}
                register={register} formSubmit={handleSubmit} errors={errors}
                store={stores} onSubmit={addStore} isValid={isValid} />
        </>)
}

export default ManageUsers