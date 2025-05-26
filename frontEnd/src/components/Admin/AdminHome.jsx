import React, { useState, useEffect } from 'react'
import axios from 'axios';

const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - halfStar;

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
        stars.push(<span key={`full-${i}`} className="text-warning">&#9733;</span>); // &#9733 = ★ ->https://www.toptal.com/designers/htmlarrows/symbols/
    }

    if (halfStar) {
        stars.push(<span key="half" className="text-warning">&#189;</span>);
    }

    for (let i = 0; i < emptyStars; i++) {
        stars.push(<span key={`empty-${i}`} className="text-secondary">&#9734;</span>); // ☆
    }

    return stars;
};


const AdminHome = () => {
    const [adminTotal, setAdminTotal] = useState(0);
    const [userTotal, setUserTotal] = useState(0);
    const [storeTotal, setStoresTotal] = useState(0);
    const [submittedRatings, setSubmittedRatings] = useState(0);
    const [admins, setAdmins] = useState([]);
    const [storeRatings, setStoreRatings] = useState([]);

    const TotalAdmin = () => {
        axios.get('http://localhost:3000/auth/admin_count')
            .then(result => {
                if (result.data.Status) {
                    setAdminTotal(result.data.Result[0].admin)
                }
            })
    }
    const TotalUsers = () => {
        axios.get('http://localhost:3000/auth/users_count')
            .then(result => {
                if (result.data.Status) {
                    setUserTotal(result.data.Result[0].users)
                }
            })
    }
    const TotalStores = () => {
        axios.get('http://localhost:3000/auth/store_count')
            .then(result => {
                if (result.data.Status) {
                    setStoresTotal(result.data.Result[0].stores)
                }
            })
    }
    const TotalSubRatings = () => {
        axios.get('http://localhost:3000/auth/rating_count')
            .then(result => {
                if (result.data.Status) {
                    setSubmittedRatings(result.data.Result[0].subratings)
                }
            })
    }
    const AdminRecords = () => {
        axios.get('http://localhost:3000/auth/admins')
            .then(result => {
                if (result.data.Status) {
                    setAdmins(result.data.Result)
                } else { alert(result.data.Error) }
            })
    }

    const StoreRatingsRecords = async () => {
        const res = await axios.get("http://localhost:3000/store/ratings");
        console.log(res.data)
        setStoreRatings(res.data);
    }

    useEffect(() => {
        TotalAdmin()
        TotalUsers()
        TotalStores()
        TotalSubRatings()
        AdminRecords()
        StoreRatingsRecords()
    }, [])
    return (
        <div className='a'>
            <div className='p-3 justify-content-center mt-3 ' >
                <div className="row d-flex justify-content-evenly">
                    <div className='px-4 pt-5 pb-5 border rounded-5 mt-3 card shadow-lg bg-light col-md-3'>
                        <div className='text-center pb-1'>
                            <h4>Admin</h4>
                        </div>
                        <hr className='p-2' />
                        <div className='d-flex justify-content-between'>
                            <h5>Total :</h5>
                            <h4 className=''>{adminTotal}</h4>
                        </div>
                    </div>
                    <div className='px-4 pt-5 pb-5 border rounded-5 mt-3 card shadow-lg bg-white col-md-3'>
                        <div className='text-center pb-1'>
                            <h4>Users</h4>
                        </div>
                        <hr className='p-2' />
                        <div className='d-flex justify-content-between'>
                            <h5>Total :</h5>
                            <h4 className=''> {userTotal}</h4>
                        </div>
                    </div>

                </div>
                <div className="row d-flex justify-content-evenly mt-4">
                    <div className='px-4 pt-5 pb-5 border rounded-5 mt-3 card shadow-lg bg-white col-md-3 '>
                        <div className='text-center pb-1'>
                            <h4>Stores</h4>
                        </div>
                        <hr className='p-2' />
                        <div className='d-flex justify-content-between'>
                            <h5>Total :</h5>
                            <h4 className=''> {storeTotal}</h4>
                        </div>
                    </div>
                    <div className='px-4 pt-5 pb-5 border rounded-5 mt-3 card shadow-lg bg-light col-md-3'>
                        <div className='text-center pb-1'>
                            <h4>Submitted Rettings</h4>
                        </div>
                        <hr className='p-2' />
                        <div className='d-flex justify-content-between'>
                            <h5>Total :</h5>
                            <h4 className=''> {submittedRatings}</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div className='mt-4 mb-5 px-5 pt-3 pb-4'>
                <h3>List of Store Ratings: </h3>
                <table className='table table-bordered text-center'>
                    <thead className='thead-dark'>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Ratings</th>
                        </tr>
                    </thead>
                    <tbody >{

                        storeRatings.map((sr) => (
                            <tr key={sr.id}>
                                <td>{sr.storename}</td>
                                <td>{sr.email}</td>
                                <td>{sr.address}</td>
                                <td style={{ fontSize: '1.5rem' }}>{renderStars(sr.overall_rating)} <small className='ms-2'>({sr.overall_rating})</small></td>
                            </tr>)
                        )
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminHome