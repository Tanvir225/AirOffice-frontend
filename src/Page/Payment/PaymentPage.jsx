import { useState } from "react";
import { format } from "date-fns";
import useAxios from "../../Hook/useAxios";


const PaymentPage = () => {
    const [date, setDate] = useState("");
    const [agency, setAgency] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const axios = useAxios();
    /* ================= SEARCH ================= */

    const handleSearch = async () => {
        if (!date) {
            alert("Please select departure date");
            return;
        }

        setLoading(true);

        try {
            let res;

            if (agency) {
                axios.get('/bookings/search', {
                    params: { date, agency }
                }).then(response => {
                    res = response?.data;
                    setResults(res);
                });
            } else {
                axios.get('/bookings/by-date', {
                    params: { date }
                }).then(response => {
                    res = response?.data;
                    setResults(res);
                }); 
            }

         
        } catch (err) {
            console.error(err);
            alert("Failed to fetch payment data");
        } finally {
            setLoading(false);
        }
    };

    /* ================= PRINT ================= */

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold text-[#003E3A] mb-4">
                Payment Search
            </h2>

            {/* ================= SEARCH PANEL ================= */}
            <div className="bg-white shadow rounded-lg p-4 mb-5 no-print">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="input input-bordered w-full"
                    />

                    <input
                        type="text"
                        value={agency}
                        onChange={(e) => setAgency(e.target.value)}
                        placeholder="Agency Name (optional)"
                        className="input input-bordered w-full"
                    />

                    <button
                        onClick={handleSearch}
                        className="btn bg-[#7AC143] text-white"
                    >
                        Search
                    </button>

                    <button
                        onClick={handlePrint}
                        className="btn btn-outline btn-success"
                    >
                        Print
                    </button>
                </div>
            </div>

            {/* ================= RESULTS ================= */}
            <div className="">
                {loading && (
                    <p className="text-center text-gray-500">
                        Loading payments...
                    </p>
                )}

                {!loading && results.length === 0 && (
                    <p className="text-center text-gray-400">
                        No payment data found
                    </p>
                )}

                {results.map((b, idx) => (
                    <div
                        key={b._id}
                        className="bg-white border rounded-lg p-4 mb-5 break-inside-avoid"
                    >
                        {/* HEADER */}
                        <div className="flex justify-between items-center border-b pb-2 mb-3">
                            <h3 className="font-semibold text-lg text-[#003E3A]">
                                {b.agency?.name}
                            </h3>

                            <span className="text-sm text-gray-500">
                                Booking #{idx + 1}
                            </span>
                        </div>

                        {/* AGENCY INFO */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                            <div>
                                <strong>Contact:</strong>
                                <div>{b.agency?.contactPerson}</div>
                            </div>

                            <div>
                                <strong>Phone:</strong>
                                <div>{b.agency?.phone}</div>
                            </div>

                            <div>
                                <strong>Route:</strong>
                                <div>
                                    {b.flight?.segments
                                        ?.map(s => `${s.from}-${s.to}`)
                                        .join(" | ")}
                                </div>
                            </div>

                            <div>
                                <strong>Departure:</strong>
                                <div>
                                    {format(
                                        new Date(b.flight?.segments?.[0]?.date),
                                        "dd MMM yyyy"
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* PAYMENT SUMMARY */}
                        <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                            <div>
                                <strong>Total Fare</strong>
                                <div>{b.fare?.totalFare}</div>
                            </div>

                            <div>
                                <strong>Paid</strong>
                                <div>{b.payment?.paidAmount}</div>
                            </div>

                            <div>
                                <strong>Due</strong>
                                <div
                                    className={
                                        b.payment?.dueAmount === 0
                                            ? "text-green-600 font-semibold"
                                            : "text-red-600 font-semibold"
                                    }
                                >
                                    {b.payment?.dueAmount}
                                </div>
                            </div>
                        </div>

                        {/* PAYMENT HISTORY */}
                        <div>
                            <h4 className="font-semibold mb-2">
                                Payment History
                            </h4>

                            <table className="w-full text-sm border">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border p-2">Date</th>
                                        <th className="border p-2">Amount</th>
                                        <th className="border p-2">Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {b.payment?.history?.length > 0 ? (
                                        b.payment.history.map((h, i) => (
                                            <tr key={i}>
                                                <td className="border p-2">
                                                    {format(
                                                        new Date(h.date),
                                                        "dd MMM yyyy"
                                                    )}
                                                </td>
                                                <td className="border p-2">
                                                    {h.amount}
                                                </td>
                                                <td className="border p-2">
                                                    {h.note}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="border p-2 text-center text-gray-400"
                                            >
                                                No payment history
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaymentPage;
