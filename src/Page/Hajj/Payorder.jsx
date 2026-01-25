import { useState } from "react";
import useAxios from "../../Hook/useAxios";
import { format } from "date-fns";

const Payorder = () => {
    const axios = useAxios();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const search = async (q) => {
        try {
            setLoading(true);
            const res = await axios.get(`/hajj/search?${q}`);
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 text-black space-y-3 overflow-y-auto h-screen">

            {/* SEARCH BAR */}
            <div className="border border-[#D1FAE5] rounded-xl p-3 grid md:grid-cols-3 gap-4">
                <input
                    placeholder="Agency HL No"
                    className="input input-bordered w-full "
                    onKeyDown={e => e.key === "Enter" && search(`hl=${e.target.value}`)}
                />

                <input
                    placeholder="Tracking No"
                    className="input input-bordered w-full"
                    onKeyDown={e => e.key === "Enter" && search(`trackingNo=${e.target.value}`)}
                />

                <input
                    placeholder="Payorder No"
                    className="input input-bordered w-full "
                    onKeyDown={e => e.key === "Enter" && search(`payorderNo=${e.target.value}`)}
                />
            </div>

            {/* LOADING */}
            {loading && (
                <div className="text-center">
                    <span className="loading loading-dots loading-md"></span>
                </div>
            )}

            {/* RESULT CARDS */}
            {data.map((r) => (
                <div
                    key={r._id}
                    className="bg-white border border-[#D1FAE5] rounded-xl p-5 shadow-sm space-y-4"
                >

                    {/* HEADER */}
                    <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="text-lg font-semibold text-[#003E3A]">
                            {r.agency?.name}
                        </h3>

                        <span className="text-sm font-semibold text-green-600">
                            Per Pax Fare: {r.fare?.farePerPilgrim} BDT
                        </span>
                        <span className="text-sm font-semibold text-green-600">
                            Total Fare: {r.fare?.totalFare.toLocaleString()} BDT
                        </span>
                    </div>

                    {/* AGENCY META */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div><strong>HL No:</strong> {r.agency?.hl}</div>
                        <div><strong>Tracking No:</strong> {r.agency?.trackingNo}</div>
                        <div><strong>Payorder No:</strong> {r.agency?.payorderNo}</div>
                        <div><strong>Pilgrims:</strong> {r.flight?.pilgrims}</div>
                    </div>

                    {/* SEGMENTS */}
                    <div>
                        <h4 className="font-semibold text-[#003E3A] mb-2">
                            Flight Segments
                        </h4>

                        <div className="overflow-x-auto">
                            <table className="table table-sm border">
                                <thead className="bg-[#ECFDF5]">
                                    <tr>
                                        <th>Route</th>
                                        <th>Date</th>
                                        <th>Flight No</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {r.flight?.segments?.map((s, i) => (
                                        <tr key={i}>
                                            <td>{s.from} → {s.to}</td>
                                            <td>{format(new Date(s.date), "dd MMM yyyy")}</td>
                                            <td>{s.flightNo}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            ))}

            {/* EMPTY STATE */}
            {!loading && data.length === 0 && (
                <p className="text-center text-gray-500">
                    No records found. Search by HL / Tracking / Payorder number.
                </p>
            )}
        </div>
    );
};

export default Payorder;
