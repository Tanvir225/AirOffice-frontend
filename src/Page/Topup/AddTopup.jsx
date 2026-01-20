import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import useAxios from "../../Hook/useAxios";
import useAuth from "../../Hook/useAuth";

const AddTopup = ({ onSuccess }) => {
    const [type, setType] = useState("credit");
    const [profile, setProfile] = useState();
    const { user } = useAuth();

    const axios = useAxios();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        date: "",
        time: "",
        amount: "",
        pnr: "",
        description: ""
    });


    // user get 
    useEffect(() => {
        if (user?.email) {
            axios.get(`/users/${user.email}`)
                .then(res => {
                    setProfile(res?.data)
                })
                .catch(err => {
                    console.log(err);
                })

        }
    }, [axios, user])

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        axios.post("/topups", {
            type,
            ...form,
            callerName: profile?.name
        }).then(res => {
            if (res?.data) {
                setForm({ date: "", time: "", amount: "", pnr: "", description: "" });
                ;

                toast.success("Topup added successfully");
                navigate("/flynas/topup");
            }
        })


    };



    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded border w-full">
            <div className="flex items-center justify-between flex-row-reverse">
                <h3 className="font-semibold mb-3">Add Topup</h3>
                <Link to={'/flynas/topup'} className="btn btn-outline btn-sm mb-3">back</Link >
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

            {/* caller name */}
            <div className="bg-white border border-blue-300 p-4 rounded-lg my-2">
                <h2 className="text-[#003E3A] font-semibold mb-3">
                    Caller Name <span className="text-red-600 text-base">*</span>
                </h2>
                <input
                    type="text"
                    required
                    value={profile?.name}
                    disabled
                    className="input p-2 w-full bg-gray-100 border border-blue-300 focus:outline-none focus:ring-0"
                    placeholder="Caller Name"
                />
            </div>

            <button className="btn btn-success mt-3">
                Save
            </button>
        </form>
    );
};

export default AddTopup;
