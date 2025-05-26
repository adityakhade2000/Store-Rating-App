import { useEffect, useState } from "react";
import axios from "axios";
import StoreItem from "./StoreItem";

function StoreList() {
    const [stores, setStores] = useState([]);
    const [nameSearch, setNameSearch] = useState("");
    const [addressSearch, setAddressSearch] = useState("");

    const fetchStores = async () => {
        try {
            const res = await axios.get("http://localhost:3000/store/ratings", {
                withCredentials: true,
            });
            setStores(res.data);
        } catch (err) {
            console.error("Error fetching stores:", err);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    const filteredStores = stores.filter((store) => {
        const name = store.storename?.toLowerCase() || "";
        const address = store.address?.toLowerCase() || "";
        return (
            name.includes(nameSearch.toLowerCase()) &&
            address.includes(addressSearch.toLowerCase())
        );
    });

    return (
        <div className="container mt-4">
            <div className="row mb-3">
                <div className="col-md-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Store Name"
                        value={nameSearch}
                        onChange={(e) => setNameSearch(e.target.value)}
                    />
                </div>
                <div className="col-md-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Address"
                        value={addressSearch}
                        onChange={(e) => setAddressSearch(e.target.value)}
                    />
                </div>
            </div>

            <table className="table table-bordered table-striped">
                <thead className="table-dark">
                    <tr>
                        <th className="col-md-2">Store Name</th>
                        <th className="col-md-2">Address</th>
                        <th>Overall Rating</th>
                        <th>User's Submitted Rating</th>
                        <th>Your Rating</th>
                        <th>Your Comment</th>
                        <th className="col-md-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStores.map((store) => (
                        <StoreItem key={store.id} store={store} fetchStores={fetchStores} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StoreList;
