import { useState } from "react";
import axios from "axios";

function StoreItem({ store, fetchStores }) {
    const [isEditable, setIsEditable] = useState(!store.user_rating);
    const [rating, setRating] = useState(store.user_rating || "");
    const [comments, setComments] = useState(store.user_comment || "");

    const handleSubmit = async () => {
        if (!rating) return alert("Please enter a rating");

        try {
            await axios.post(
                "http://localhost:3000/store/rate",
                {
                    storeId: store.id,
                    rating: parseInt(rating),
                    comments,
                },
                { withCredentials: true }

            );
            console.log("Rendering store:", store.id, store.storename, rating);

            setIsEditable(false);
            fetchStores();
        } catch (err) {
            console.error("Error submitting rating:", err);
        }
    };

    const isInitialRating = !store.user_rating;

    return (
        <tr className={store.user_rating ? "bg-light" : "bg-warning-subtle"}>
            <td>{store.storename}</td>
            <td>{store.address}</td>
            <td>{store.overall_rating}</td>
            <td>{store.user_count}</td>
            <td>
                <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    disabled={!isEditable}
                    className="form-select"
                >
                    <option value="">Select rating</option>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                    ))}
                </select>
            </td>
            <td>
                <textarea rows={1}
                    type="text"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    readOnly={!isEditable}
                    className="form-control"
                    placeholder="Your comment"
                />
            </td>
            <td className="d-flex gap-2">
                <button
                    className="btn btn-sm btn-primary w-50"
                    onClick={() => {
                        if (isEditable) handleSubmit();
                        else setIsEditable(true);
                    }}
                >
                    {isEditable ? "Submit" : "Edit "}
                </button>

                {/* Only show Cancel button if it's in Edit mode AND user already has a rating */}
                {isEditable && !isInitialRating && (
                    <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => {
                            setRating(store.user_rating || "");
                            setComments(store.user_comment || "");
                            setIsEditable(false);
                        }}
                    >
                        Cancel
                    </button>
                )}
            </td>
        </tr>
    );
}

export default StoreItem;
