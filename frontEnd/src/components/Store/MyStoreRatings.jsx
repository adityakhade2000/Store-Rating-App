import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyStoreRatings = () => {
    const [ratings, setRatings] = useState([]);

    const StoreRatingsRecords = async () => {
        try {
            const res = await axios.get("http://localhost:3000/store/myStoreRatings", {
                withCredentials: true
            });
            setRatings(res.data.ratings);
        } catch (err) {
            console.error("Failed to fetch ratings:", err);
        }
    };

    useEffect(() => {
        StoreRatingsRecords();
    }, []);

    return (
        <div className='mt-4 mb-5 px-5 pt-3 pb-4'>
            <h3>List of Store Ratings:</h3>
            <table className='table table-bordered text-center'>
                <thead className='table-dark'>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {ratings.length > 0 ? (
                        ratings.map((r) => (
                            <tr key={r.ratingid || r.id}>
                                <td>{r.name}</td>
                                <td>{r.email}</td>
                                <td>{r.address}</td>
                                <td>{r.rating}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className='text-center'>No ratings yet</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MyStoreRatings;
