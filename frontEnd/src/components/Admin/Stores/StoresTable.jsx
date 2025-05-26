import React from 'react'
import { Button, Col, Table } from 'react-bootstrap'

const StoresTable = ({ show, handleClose, handleOpen, onInputChange, store, addUser, updateUser }) => {
    return (

        <Table responsive bordered striped className='text-center'>
            <thead >
                <tr >
                    <th>Name</th>
                    <th>Email</th>
                    <th>Adress</th>
                </tr>
            </thead>
            <tbody>
                {store?.length ?
                    store.map((s, i) => (
                        <tr key={i}>
                            <td>{s.storename}</td>
                            <td>{s.email}</td>
                            <td>{s.address}</td>
                        </tr>
                    )) :
                    <tr>
                        <td colSpan={4}>No User Found</td>
                    </tr>
                }
            </tbody >

        </Table >
    )
}

export default StoresTable