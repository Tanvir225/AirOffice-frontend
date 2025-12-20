import { format } from "date-fns";
import React from "react";

const BookingView = ({ booking, onClose }) => {
    if (!booking) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start z-50 overflow-y-auto">
            <div className="bg-white w-[210mm]  p-6 my-2 print:m-0 print:shadow-none">

                {/* HEADER */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-bold text-[#003E3A]">
                        Booking Details
                    </h2>

                    <div className="flex gap-2 print:hidden">
                        <button
                            onClick={handlePrint}
                            className="btn btn-warning"
                        >
                            Print
                        </button>

                        <button
                            onClick={onClose}
                            className="btn btn-error"
                        >
                            Close
                        </button>
                    </div>
                </div>

                {/* AGENCY INFO */}
                <section className="mb-4">
                    <h3 className="font-semibold text-[#003E3A] mb-2">
                        Agency Information
                    </h3>

                    <table className="w-full text-sm border text-center">
                        <tbody>
                            <tr><th className="border p-2">Agency Name</th><td className="border p-2">{booking.agency?.name}</td></tr>
                            <tr><th className="border p-2">Contact Person</th><td className="border p-2">{booking.agency?.contactPerson}</td></tr>
                            <tr><th className="border p-2">Phone</th><td className="border p-2">{booking.agency?.phone}</td></tr>
                            <tr><th className="border p-2">Address</th><td className="border p-2">{booking.agency?.address}</td></tr>
                        </tbody>
                    </table>
                </section>

                {/* FLIGHT INFO */}
                <section className="mb-4">
                    <h3 className="font-semibold text-[#003E3A] mb-2">
                        Flight Information
                    </h3>

                    <table className="w-full text-sm border text-center">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Date</th>
                                <th className="border p-2">From</th>
                                <th className="border p-2">To</th>
                                <th className="border p-2">Flight No</th>
                            </tr>
                        </thead>
                        <tbody>
                            {booking.flight?.segments?.map((seg, i) => (
                                <tr key={i}>
                                    <td className="border p-2">{seg.date}</td>
                                    <td className="border p-2">{seg.from}</td>
                                    <td className="border p-2">{seg.to}</td>
                                    <td className="border p-2">{seg.flightNo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                        <div><strong>Passengers:</strong> {booking.flight?.passengers}</div>
                        <div><strong>Capacity:</strong> {booking.flight?.capacity}</div>
                        <div>
                            <strong>Bookload:</strong>{" "}
                            {Math.round(
                                (booking.flight?.passengers / booking.flight?.capacity) * 100
                            )}%
                        </div>
                    </div>
                </section>

                {/* PAYMENT INFO */}
                <section className="mb-4">
                    <h3 className="font-semibold text-[#003E3A] mb-2">
                        Payment Information
                    </h3>

                    <table className="w-full text-sm border text-center">
                        <tbody>
                            <tr><th className="border p-2">Total Fare</th><td className="border p-2">{booking.fare?.totalFare}</td></tr>
                            <tr><th className="border p-2">Paid Amount</th><td className="border p-2">{booking.payment?.paidAmount}</td></tr>
                            <tr><th className="border p-2">Due Amount</th><td className="border p-2">{booking.payment?.dueAmount}</td></tr>
                            <tr><th className="border p-2">Status</th><td className="border p-2">{booking.payment?.status}</td></tr>
                        </tbody>
                    </table>
                </section>

                {/* PAYMENT HISTORY */}
                <section className="mb-4">
                    <h3 className="font-semibold text-[#003E3A] mb-2">
                        Payment History
                    </h3>

                    <table className="w-full text-sm border text-center">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Date</th>
                                <th className="border p-2">Amount</th>
                                <th className="border p-2">Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {booking.payment?.history?.map((h, i) => (
                                <tr key={i}>
                                    <td className="border p-2">
                                        {format(h.date,'dd MMM yy')}
                                    </td>
                                    <td className="border p-2">{h.amount}</td>
                                    <td className="border p-2">{h.note}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>



            </div>
        </div>
    );
};

export default BookingView;
