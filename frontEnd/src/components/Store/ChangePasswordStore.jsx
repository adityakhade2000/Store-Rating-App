import { useState } from "react";
import axios from "axios";

function ChangePasswordStore() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");

            const res = await axios.post(
                "http://localhost:3000/store/change-password",
                { currentPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCurrentPassword("");
            setNewPassword("");

            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response?.data?.message || "Error occurred");
        }
    };

    return (
        <div className="container mt-5 border p-5 bg-white" style={{ maxWidth: "500px" }}>
            <h2 className="mb-4 text-center">Change Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                    <input
                        type="password"
                        id="currentPassword"
                        className="form-control"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        className="form-control"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Change Password</button>
            </form>
            {message && <div className="alert alert-success mt-3 text-center">{message}</div>}
        </div>
    );
}

export default ChangePasswordStore;
