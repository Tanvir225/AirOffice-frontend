import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const PaymentPatchForm = ({ booking, onClose, onSuccess }) => {
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const dueAmount = booking?.payment?.dueAmount || 0;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payAmount = Number(amount);

        if (payAmount <= 0) {
            toast.error("Payment amount must be greater than zero");
            return;
        }

        if (payAmount > dueAmount) {
            toast.error("Payment amount exceeds due amount");
            return;
        }
        

        setLoading(true);

        try {
            await axios.patch(
                `http://localhost:5000/api/bookings/${booking._id}/payment`,
                {
                    amount: payAmount,
                    note
                }
            );

            toast.success("Payment updated successfully");

            onSuccess && onSuccess(); // refresh grid
            onClose && onClose();     // close modal

        } catch (error) {
           toast.error("Failed to update payment");
        }

        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-xl p-5 border border-[#D1FAE5]">

                <h3 className="text-[#003E3A] font-semibold mb-4">
                    Add Payment
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* AGENCY */}
                    <div className="text-sm text-gray-600">
                        <strong>Agency:</strong> {booking.agency?.name}
                    </div>

                    {/* DUE */}
                    <div>
                        <label className="text-sm text-gray-600">Due Amount</label>
                        <input
                            value={dueAmount}
                            disabled
                            className="input w-full bg-gray-100 border border-[#D1FAE5] focus:outline-none focus:ring-0"
                        />
                    </div>

                    {/* PAYMENT */}
                    <div>
                        <label className="text-sm text-gray-600">Payment Amount</label>
                        <input
                            type="number"
                            value={amount}
                            required
                            className="input w-full border border-[#D1FAE5] focus:outline-none focus:ring-0"
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    {/* NOTE */}
                    <div>
                        <label className="text-sm text-gray-600">Note</label>
                        <textarea
                            value={note}
                            placeholder="Cash / Bank / Reference"
                            className="textarea w-full border border-[#D1FAE5] focus:outline-none focus:ring-0"
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-2 pt-3">
                        <button
                            type="submit"
                            className={`btn flex-1 bg-[#00A651] hover:btn-primary text-white ${loading && "loading"}`}
                        >
                            Save Payment
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-warning flex-1 border border-gray-300"
                        >
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default PaymentPatchForm;
