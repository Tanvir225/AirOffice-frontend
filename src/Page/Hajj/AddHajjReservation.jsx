import { useState } from "react";
import toast from "react-hot-toast";

import { Link, useNavigate } from "react-router-dom";
import useAxios from "../../Hook/useAxios";

const AddHajjReservation = ({ onSuccess, onClose }) => {
    const axios = useAxios();
    const navigate = useNavigate();

    /* =========================
       STATE
    ========================= */
    const [agency, setAgency] = useState({
        name: "",
        hl: "",
        trackingNo: "",
        payorderNo: "",
        pnr: ""
    });

    const [segments, setSegments] = useState([
        { from: "", to: "", date: "", flightNo: "" }
    ]);

    const [pilgrims, setPilgrims] = useState("");
    const [farePerPilgrim, setFarePerPilgrim] = useState("");
    const [loading, setLoading] = useState(false);

    /* =========================
       CALCULATIONS
    ========================= */
    const totalFare =
        Number(pilgrims || 0) * Number(farePerPilgrim || 0);

    /* =========================
       SEGMENT HANDLERS
    ========================= */
    const addSegment = () => {
        setSegments([
            ...segments,
            { from: "", to: "", date: "", flightNo: "" }
        ]);
    };

    const removeSegment = (index) => {
        setSegments(segments.filter((_, i) => i !== index));
    };

    const handleSegmentChange = (index, field, value) => {
        const updated = [...segments];
        updated[index][field] = value;
        setSegments(updated);
    };

    /* =========================
       SUBMIT
    ========================= */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!agency.name || !agency.hl) {
            toast.error("Agency Name and HL are required");
            return;
        }

        if (segments.length === 0) {
            toast.error("At least one flight segment required");
            return;
        }

        setLoading(true);

        try {
            await axios.post("hajj/reservations", {
                agency,
                flight: {
                    segments,
                    pilgrims: Number(pilgrims),
                },
                fare: {
                    farePerPilgrim: Number(farePerPilgrim),
                    totalFare
                }
            });

            toast.success("Hajj reservation added");
            navigate("/flynas/hajj-reservation");

            onSuccess && onSuccess();
            onClose && onClose();
        } catch (err) {
            toast.error("Failed to add reservation");
        }

        setLoading(false);
    };

    return (
        <div className=" flex items-center justify-center z-50">
            <div className=" w-full  rounded-xl p-6">

                <div className="flex items-center justify-between border-b-2 mb-2">
                    <Link to="/flynas/hajj-reservation" className="btn btn-sm btn-success text-white">Back</Link>
                    <h3 className="text-lg font-semibold mb-4 text-[#003E3A]">
                        Add Hajj Reservation
                    </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* =========================
                       AGENCY INFO
                    ========================= */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                            placeholder="Agency Name"
                            className="input input-bordered focus:outline-none"
                            value={agency.name}
                            onChange={(e) =>
                                setAgency({ ...agency, name: e.target.value })
                            }
                        />
                        <input
                            placeholder="Agency HL"
                            className="input input-bordered focus:outline-none"
                            value={agency.hl}
                            required
                            onChange={(e) =>
                                setAgency({ ...agency, hl: e.target.value })
                            }
                        />
                        <input
                            placeholder="Tracking No"
                            required
                            className="input input-bordered focus:outline-none"
                            value={agency.trackingNo}
                            onChange={(e) =>
                                setAgency({ ...agency, trackingNo: e.target.value })
                            }
                        />
                        <input
                            placeholder="Payorder No"
                            required
                            className="input input-bordered focus:outline-none"
                            value={agency.payorderNo}
                            onChange={(e) =>
                                setAgency({ ...agency, payorderNo: e.target.value })
                            }
                        />
                        <input
                            placeholder="PNR"
                            className="input input-bordered col-span-2 focus:outline-none"
                            value={agency.pnr}
                            onChange={(e) =>
                                setAgency({ ...agency, pnr: e.target.value })
                            }
                        />
                    </div>

                    {/* =========================
                       FLIGHT SEGMENTS
                    ========================= */}
                    <div className="space-y-3">
                        <h4 className="font-medium">Flight Segments</h4>

                        {segments.map((seg, i) => (
                            <div key={i} className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                <input
                                    placeholder="From"
                                    required
                                    className="input input-bordered focus:outline-none"
                                    value={seg.from}
                                    onChange={(e) =>
                                        handleSegmentChange(i, "from", e.target.value)
                                    }
                                />
                                <input
                                    placeholder="To"
                                    required
                                    className="input input-bordered focus:outline-none"
                                    value={seg.to}
                                    onChange={(e) =>
                                        handleSegmentChange(i, "to", e.target.value)
                                    }
                                />
                                <input
                                    type="date"
                                    required
                                    className="input input-bordered focus:outline-none"
                                    value={seg.date}
                                    onChange={(e) =>
                                        handleSegmentChange(i, "date", e.target.value)
                                    }
                                />
                                <input
                                    placeholder="Flight No"
                                    required
                                    className="input input-bordered focus:outline-none"
                                    value={seg.flightNo}
                                    onChange={(e) =>
                                        handleSegmentChange(i, "flightNo", e.target.value)
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() => removeSegment(i)}
                                    className="btn btn-error btn-sm h-full"
                                >
                                    X
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addSegment}
                            className="btn btn-outline btn-sm"
                        >
                            + Add Segment
                        </button>
                    </div>

                    {/* =========================
                       FARE INFO
                    ========================= */}
                    <div className="grid grid-cols-3 gap-3">
                        <input
                            type="number"
                            required
                            placeholder="Total Pilgrims"
                            className="input input-bordered focus:outline-none"
                            value={pilgrims}
                            onChange={(e) => setPilgrims(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Fare / Pilgrim"
                            required
                            className="input input-bordered focus:outline-none"
                            value={farePerPilgrim}
                            onChange={(e) => setFarePerPilgrim(e.target.value)}
                        />
                        <input
                            disabled
                            className="input input-bordered"
                            value={`Total Fare: ${totalFare}`}
                        />
                    </div>

                    {/* =========================
                       ACTIONS
                    ========================= */}
                    <div className="flex gap-2 pt-3">
                        <button
                            type="submit"
                            className={`btn btn-success flex-1 ${loading && "loading"}`}
                        >
                            Save Reservation
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

export default AddHajjReservation;
