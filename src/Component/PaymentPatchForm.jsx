import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAxios from "../Hook/useAxios";

const PaymentPatchForm = ({ booking, onClose, onSuccess }) => {
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const axios = useAxios();

    const dueAmount = Number(booking?.payment?.dueAmount || 0);

    // ✅ RESET FORM WHEN BOOKING CHANGES
    useEffect(() => {
        setAmount("");
        setNote("");
    }, [booking]);

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
            // ✅ AWAIT PATCH REQUEST
            await axios.patch(
                `/bookings/${booking._id}/payment`,
                {
                    amount: payAmount,
                    note
                }
            );

            toast.success("Payment updated successfully");

            onClose?.();    // close modal first
            onSuccess?.();  // then refresh grid

        } catch (error) {
            console.error(error);
            toast.error("Failed to update payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-xl p-5 border border-[#D1FAE5]">

                <h3 className="text-[#003E3A] font-semibold mb-4">
                    Add Payment
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="text-sm text-gray-600">
                        <strong>Agency:</strong> {booking.agency?.name}
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Due Amount</label>
                        <input
                            value={dueAmount}
                            disabled
                            className="input w-full bg-gray-100 border border-[#D1FAE5] focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Payment Amount</label>
                        <input
                            type="number"
                            value={amount}
                            required
                            className="input w-full border border-[#D1FAE5] focus:outline-none"
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Note</label>
                        <textarea
                            value={note}
                            placeholder="Cash / Bank / Reference"
                            className="textarea w-full border border-[#D1FAE5] focus:outline-none"
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 pt-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`btn flex-1 bg-[#00A651] text-white ${loading && "loading"}`}
                        >
                            Save Payment
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-warning flex-1"
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
