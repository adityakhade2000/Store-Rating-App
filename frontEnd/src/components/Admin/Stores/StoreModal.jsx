import React from 'react'
import * as yup from 'yup';
import { Modal, Form, Button } from 'react-bootstrap';

export const storeSchema = yup.object().shape({
    storename: yup.string().required('Store Name is required'),
    name: yup.string().required('Owner Name is required'),
    email: yup.string().email('invalid email').required('Email is required'),
    password: yup.string().required(' Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    ,
    address: yup.string().required('address is required'),
});

const StoreModal = ({ show, handleClose, store, userType, register, formSubmit, onSubmit, errors, isValid, }) => {
    function handleReset() {
        handleClose();
    }
    return (
        <>
            <Modal show={show}
                onHide={handleReset}
                backdrop="static"
                keyboard={false}
                size='xl'>
                <Modal.Header closeButton>
                    {store.id ?
                        <Modal.Title className='modalTital text-danger'>Update Store</Modal.Title> :
                        <Modal.Title className='modalTital text-info'>Add Store</Modal.Title>
                    }
                </Modal.Header>
                <Modal.Body >
                    <Form onSubmit={formSubmit(onSubmit)}>
                        <div className="row">
                            <div className="col-lg-4">
                                <Form.Group className="mb-3">
                                    <Form.Label>Store Name:</Form.Label>
                                    <Form.Control autoFocus
                                        type="text"
                                        placeholder="Store name"
                                        {...register("storename")}
                                    />
                                    {errors.name && <span className='text-danger'>{errors.name.message}</span>}
                                </Form.Group>
                            </div>
                            <div className="col-lg-4">
                                <Form.Group className="mb-3">
                                    <Form.Label>Owner Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="owner name"
                                        {...register("name")}
                                    />
                                    {errors.name && <span className='text-danger'>{errors.name.message}</span>}
                                </Form.Group>
                            </div>
                            <div className="col-lg-4">
                                <Form.Group className="mb-3">
                                    <Form.Label>Address:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Address"
                                        {...register("address")}
                                    />
                                    {errors.address && <span className='text-danger'>{errors.address.message}</span>}
                                </Form.Group>
                            </div>

                        </div>

                        <div className="row">
                            <div className="col-lg-4">
                                <Form.Group className="mb-3">
                                    <Form.Label>Email:</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Email"
                                        {...register("email")}
                                    />
                                    {errors.email && <span className='text-danger'>{errors.email.message}</span>}
                                </Form.Group>
                            </div>
                            {!store.id && (
                                <div className="col-lg-4">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Password:</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            {...register("password")}
                                        />
                                        {errors.password && <span className='text-danger'>{errors.password.message}</span>}
                                    </Form.Group>
                                </div>
                            )}

                        </div>

                        <Modal.Footer>
                            <Button type='submit' variant='primary' disabled={!isValid}>
                                {store.id ? 'Save Changes' : 'Add'}
                            </Button>
                            <Button variant="danger" onClick={handleReset}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default StoreModal