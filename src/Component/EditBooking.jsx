import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAxios from "../Hook/useAxios";
import useAuth from "../Hook/useAuth";


const EditBooking = ({ bookingData, onClose, onSuccess }) => {
    const axios = useAxios();
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState();
    const { user } = useAuth()

    const [booking, setBooking] = useState(null);

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

    /* ================= INIT DATA ================= */
    useEffect(() => {
        if (bookingData) {
            setBooking({
                agency: { ...bookingData.agency },
                flight: {
                    ...bookingData.flight,
                    segments: bookingData.flight.segments || []
                },
                fare: { ...bookingData.fare },
                callerName: profile?.name
            });
        }
    }, [bookingData,profile]);

    /* ================= AUTO TOTAL FARE ================= */
    useEffect(() => {
        if (!booking) return;

        const passengers = Number(booking.flight.passengers) || 0;
        const perPassenger = Number(booking.fare.perPassenger) || 0;

        setBooking(prev => ({
            ...prev,
            fare: {
                ...prev.fare,
                totalFare: passengers * perPassenger
            }
        }));
    }, [booking?.flight.passengers, booking?.fare.perPassenger]);

    if (!booking) return null;




    /* ================= HANDLERS ================= */

    const handleAgencyChange = (e) => {
        setBooking({
            ...booking,
            agency: { ...booking.agency, [e.target.name]: e.target.value },
        });
    };

    const handleSegmentChange = (index, e) => {
        const segments = [...booking.flight.segments];
        segments[index][e.target.name] = e.target.value;

        setBooking({
            ...booking,
            flight: { ...booking.flight, segments }
        });
    };

    const addSegment = () => {
        setBooking({
            ...booking,
            flight: {
                ...booking.flight,
                segments: [
                    ...booking.flight.segments,
                    { date: "", from: "", to: "", flightNo: "" }
                ]
            },

        });
    };

    const removeSegment = (index) => {
        setBooking({
            ...booking,
            flight: {
                ...booking.flight,
                segments: booking.flight.segments.filter((_, i) => i !== index)
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.patch(`/bookings/${bookingData._id}`, booking);
            toast.success("Booking updated successfully");
            onSuccess?.();
            onClose?.();
        } catch {
            toast.error("Failed to update booking");
        }

        setLoading(false);
    };

    /* ================= UI ================= */

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-5xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">

                <h2 className="text-[#003E3A] font-semibold mb-4">
                    Edit Booking
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* AGENCY */}
                    <div className="border p-4 rounded">
                        <h3 className="font-semibold mb-2">Agency Information</h3>

                        <div className="grid md:grid-cols-2 gap-3">
                            {["name", "contactPerson", "phone", "address"].map((field) => (
                                <input
                                    key={field}
                                    name={field}
                                    value={booking.agency[field]}
                                    required
                                    className="input input-bordered w-full hover:outline-none"
                                    onChange={handleAgencyChange}
                                />
                            ))}
                        </div>
                    </div>

                    {/* FLIGHT */}
                    <div className="border p-4 rounded">
                        <h3 className="font-semibold mb-2">Flight Details</h3>

                        {booking.flight.segments.map((seg, i) => (
                            <div key={i} className="border p-3 rounded mb-3">
                                <div className="grid md:grid-cols-4 gap-3">
                                    {["date", "from", "to", "flightNo"].map((field) => (
                                        <input
                                            key={field}
                                            type={field === "date" ? "date" : "text"}
                                            name={field}
                                            value={seg[field]}
                                            onChange={(e) => handleSegmentChange(i, e)}
                                            className="input input-bordered w-full hover:outline-none"
                                            required
                                        />
                                    ))}
                                </div>

                                {booking.flight.segments.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeSegment(i)}
                                        className="btn btn-sm bg-red-500 text-white mt-2"
                                    >
                                        Remove Segment
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addSegment}
                            className="btn btn-sm bg-[#00b7ac] text-white"
                        >
                            + Add Segment
                        </button>

                        <div className="grid md:grid-cols-3 gap-3 mt-4">
                            <input
                                type="number"
                                value={booking.flight.capacity}
                                onChange={(e) =>
                                    setBooking({
                                        ...booking,
                                        flight: { ...booking.flight, capacity: e.target.value }
                                    })
                                }
                                className="input input-bordered w-full hover:outline-none"
                                placeholder="Capacity"
                                required
                            />

                            <input
                                type="number"
                                value={booking.flight.passengers}
                                onChange={(e) =>
                                    setBooking({
                                        ...booking,
                                        flight: { ...booking.flight, passengers: e.target.value }
                                    })
                                }
                                className="input input-bordered w-full hover:outline-none"
                                placeholder="Passengers"
                                required
                            />

                            <input
                                type="text"
                                value={booking.flight.PNR || ""}
                                onChange={(e) =>
                                    setBooking({
                                        ...booking,
                                        flight: { ...booking.flight, PNR: e.target.value }
                                    })
                                }
                                className="input input-bordered w-full hover:outline-none"
                                placeholder="PNR"
                            />
                        </div>
                    </div>

                    {/* FARE */}
                    <div className="border p-4 rounded">
                        <h3 className="font-semibold mb-2">Fare Information</h3>

                        <div className="grid md:grid-cols-2 gap-3">
                            <input
                                type="number"
                                value={booking.fare.perPassenger}
                                onChange={(e) =>
                                    setBooking({
                                        ...booking,
                                        fare: { ...booking.fare, perPassenger: e.target.value }
                                    })
                                }
                                className="input input-bordered w-full hover:outline-none"
                                required
                            />

                            <input
                                type="number"
                                value={booking.fare.totalFare}
                                disabled
                                className=" input input-bordered w-full hover:outline-none"
                            />
                        </div>
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

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className={`btn bg-[#00b7ac] hover:bg-neutral text-white flex-1 ${loading && "loading"}`}
                        >
                            Update Booking
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

export default EditBooking;
