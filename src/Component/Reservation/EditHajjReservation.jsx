import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAxios from "../../Hook/useAxios";
import useAuth from "../../Hook/useAuth";



const EditHajjReservation = ({ data, onClose, onSuccess }) => {
    const axios = useAxios();
    const {user} = useAuth()
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState();

    const [reservation, setReservation] = useState({
        agency: {
            name: "",
            hl: "",
            trackingNo: "",
            payorderNo: "",
            pnr: ""
        },
        flight: {
            segments: [{ date: "", from: "", to: "", flightNo: "" }],
            pilgrims: "",
        },
        fare: {
            perPassenger: "",
            totalFare: 0
        }
    });

    /* =========================
       LOAD DATA
    ========================= */
    useEffect(() => {
        if (data) {
            setReservation({
                agency: data.agency,
                flight: data.flight,
                fare: data.fare
            });
        }
    }, [data]);

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

    /* =========================
       AUTO TOTAL FARE
    ========================= */
    useEffect(() => {
        const pilgrims = Number(reservation.flight.pilgrims) || 0;
        const perPassenger = Number(reservation.fare.perPassenger) || 0;

        setReservation((prev) => ({
            ...prev,
            fare: {
                ...prev.fare,
                totalFare: pilgrims * perPassenger
            },
            callerName:profile?.name
        }));
    }, [reservation.flight.pilgrims, reservation.fare.perPassenger,profile]);

    /* =========================
       HANDLERS
    ========================= */
    const handleAgencyChange = (e) => {
        setReservation({
            ...reservation,
            agency: {
                ...reservation.agency,
                [e.target.name]: e.target.value
            }
        });
    };

    const handleSegmentChange = (index, e) => {
        const segments = [...reservation.flight.segments];
        segments[index][e.target.name] = e.target.value;

        setReservation({
            ...reservation,
            flight: {
                ...reservation.flight,
                segments
            }
        });
    };

    const addSegment = () => {
        setReservation({
            ...reservation,
            flight: {
                ...reservation.flight,
                segments: [
                    ...reservation.flight.segments,
                    { date: "", from: "", to: "", flightNo: "" }
                ]
            }
        });
    };

    const removeSegment = (index) => {
        setReservation({
            ...reservation,
            flight: {
                ...reservation.flight,
                segments: reservation.flight.segments.filter((_, i) => i !== index)
            }
        });
    };

    /* =========================
       SUBMIT
    ========================= */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.patch(`hajj/reservations/${data._id}`, reservation);
            toast.success("Reservation updated");
            onSuccess && onSuccess();
            onClose && onClose();
        } catch (err) {
            toast.error("Failed to update reservation");
        }

        setLoading(false);
    };

    /* =========================
       UI
    ========================= */
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-3xl rounded-xl p-5 overflow-y-auto max-h-[90vh]">

                <h3 className="font-semibold mb-4">
                    Edit Hajj Reservation
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* AGENCY */}
                    <div className="border p-4 rounded">
                        <h4 className="font-semibold mb-3">Agency Information</h4>
                        <div className="grid md:grid-cols-2 gap-3">
                            {["name", "hl", "trackingNo", "payorderNo", "pnr"].map(field => (
                                <input
                                    key={field}
                                    name={field}
                                    value={reservation.agency[field] || ""}
                                    onChange={handleAgencyChange}
                                    required
                                    placeholder={field}
                                    className="input input-bordered "
                                />
                            ))}
                        </div>
                    </div>

                    {/* FLIGHT */}
                    <div className="border p-4 rounded">
                        <h4 className="font-semibold mb-3">Flight Segments</h4>

                        {reservation.flight.segments.map((_, i) => (
                            <div key={i} className="border p-3 rounded mb-2">
                                <div className="grid md:grid-cols-4 gap-2">
                                    {["date", "from", "to", "flightNo"].map(field => (
                                        <input
                                            key={field}
                                            type={field === "date" ? "date" : "text"}
                                            name={field}
                                            value={reservation.flight.segments[i][field]}
                                            onChange={(e) => handleSegmentChange(i, e)}
                                            required
                                            className="input input-bordered"
                                        />
                                    ))}
                                </div>

                                {reservation.flight.segments.length > 1 && (
                                    <button
                                        type="button"
                                        className="btn btn-xs btn-error mt-2"
                                        onClick={() => removeSegment(i)}
                                    >
                                        Remove Segment
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            className="btn btn-sm btn-info"
                            onClick={addSegment}
                        >
                            + Add Segment
                        </button>

                        <div className="grid md:grid-cols-2 gap-3 mt-4">
                            <input
                                type="number"
                                placeholder="Pilgrims"
                                value={reservation.flight.pilgrims}
                                onChange={(e) =>
                                    setReservation({
                                        ...reservation,
                                        flight: {
                                            ...reservation.flight,
                                            pilgrims: e.target.value
                                        }
                                    })
                                }
                                className="input input-bordered"
                                required
                            />

                            <input
                                type="number"
                                placeholder="Fare per passenger"
                                value={reservation.fare.perPassenger}
                                onChange={(e) =>
                                    setReservation({
                                        ...reservation,
                                        fare: {
                                            ...reservation.fare,
                                            perPassenger: e.target.value
                                        }
                                    })
                                }
                                className="input input-bordered"
                                required
                            />
                        </div>
                    </div>

                    {/* TOTAL */}
                    <div className="border p-4 rounded">
                        <label>Total Fare</label>
                        <input
                            value={reservation.fare.totalFare}
                            disabled
                            className="input input-bordered"
                        />
                    </div>

                    {/* caller name */}
                    <div className="bg-white border border-blue-300 p-4 rounded-lg">
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

                    {/* ACTIONS */}
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className={`btn btn-success flex-1 ${loading && "loading"}`}
                        >
                            Update
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

export default EditHajjReservation;
