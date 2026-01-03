import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const AddTopup = ({ onSuccess }) => {
    const [type, setType] = useState("credit");
    const navigate = useNavigate();
    const [form, setForm] = useState({
        date: "",
        time: "",
        amount: "",
        pnr: "",
        description: ""
    });

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        await axios.post("http://localhost:5000/api/topups", {
            type,
            ...form
        });

        setForm({ date: "", time: "", amount: "", pnr: "", description: "" });
        onSuccess(
        );

        toast.success("Topup added successfully");
        navigate("/topup");
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded border w-full">
            <div className="flex items-center justify-between flex-row-reverse">
                <h3 className="font-semibold mb-3">Add Topup</h3>
                <Link to={'/topup'} className="btn btn-outline btn-sm mb-3">back</Link >
            </div>

            <div className="grid grid-cols-2 gap-3">
                <select
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="border p-2"
                >
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                </select>

                <input type="date" name="date" value={form.date} onChange={handleChange} className="border p-2" required />
                <input type="time" name="time" value={form.time} onChange={handleChange} className="border p-2" required />
                <input type="number" name="amount" value={form.amount} onChange={handleChange} className="border p-2" placeholder="Amount" required />

                {type === "debit" && (
                    <input
                        type="text"
                        name="pnr"
                        value={form.pnr}
                        onChange={handleChange}
                        className="border p-2"
                        placeholder="PNR"
                        required
                    />
                )}

                <input
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="border p-2 col-span-2"
                    placeholder="Description"
                />
            </div>

            <button className="btn btn-success mt-3">
                Save
            </button>
        </form>
    );
};

export default AddTopup;
