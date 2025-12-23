import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AddBooking = () => {
  const [loading, setLoading] = useState(false);

  const [booking, setBooking] = useState({
    agency: {
      name: "",
      contactPerson: "",
      phone: "",
      address: ""
    },
    flight: {
      segments: [{ date: "", from: "", to: "", flightNo: "" }],
      passengers: "",
      capacity: 0,
      PNR: ""
    },
    fare: {
      perPassenger: "",
      totalFare: 0
    },
    payment: {
      paidAmount: 0
    },

  });

  /* ================= AUTO TOTAL FARE ================= */
  useEffect(() => {
    const passengers = Number(booking.flight.passengers) || 0;
    const perPassenger = Number(booking.fare.perPassenger) || 0;

    setBooking((prev) => ({
      ...prev,
      fare: {
        ...prev.fare,
        totalFare: passengers * perPassenger
      }
    }));
  }, [booking.flight.passengers, booking.fare.perPassenger]);

  /* ================= HANDLERS ================= */

  const handleAgencyChange = (e) => {
    setBooking({
      ...booking,
      agency: { ...booking.agency, [e.target.name]: e.target.value }
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
        segments: [...booking.flight.segments, { date: "", from: "", to: "", flightNo: "" }]
      }
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
      await axios.post("http://localhost:5000/api/bookings", booking);
      toast.success("Booking added successfully");
    } catch (error) {
      toast.error("Failed to add booking");
    }

    setLoading(false);
  };

  /* ================= UI ================= */

  return (
    <div className=" rounded-xl p-6">
      <div className=" pr-2">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* AGENCY */}
          <div className="bg-white border border-[#96ddba] p-4 rounded-lg">
            <h2 className="text-[#003E3A] font-semibold mb-3">
              Agency Information <span className="text-red-600 text-base">*</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-3">
              {["name", "contactPerson", "phone", "address"].map((field) => (
                <input
                  key={field}
                  name={field}
                  placeholder={field}
                  required
                  className="input border border-blue-300 p-2 focus:outline-none focus:ring-0"
                  onChange={handleAgencyChange}
                />
              ))}
            </div>
          </div>

          {/* FLIGHT */}
          <div className="bg-white border border-blue-300 p-4 rounded-lg">
            <h2 className="text-[#003E3A] font-semibold mb-3">
              Flight Details <span className="text-red-600 text-base">*</span>
            </h2>

            {booking.flight.segments.map((_, i) => (
              <div key={i} className="border border-blue-300 p-3 rounded mb-3">
                <div className="grid md:grid-cols-4 gap-3">
                  {["date", "from", "to", "flightNo"].map((field) => (
                    <input
                      key={field}
                      required
                      type={field === "date" ? "date" : "text"}
                      name={field}
                      placeholder={field}
                      className="input border border-blue-300 p-2 focus:outline-none focus:ring-0"
                      onChange={(e) => handleSegmentChange(i, e)}
                    />
                  ))}
                </div>

                {booking.flight.segments.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm bg-red-600 p-2 text-white mt-2"
                    onClick={() => removeSegment(i)}
                  >
                    Remove Segment
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className="btn  border bg-[#00A651] text-white p-2"
              onClick={addSegment}
            >
              + Add Segment
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <input
                type="number"
                required
                placeholder="Flight Capacity"
                className="input border p-2 border-blue-300 focus:outline-none focus:ring-0"
                onChange={(e) =>
                  setBooking({
                    ...booking,
                    flight: { ...booking.flight, capacity: e.target.value }
                  })
                }
              />

              <input
                type="number"
                required
                placeholder="Booked Passengers"
                className="input border p-2 border-blue-300 focus:outline-none focus:ring-0"
                onChange={(e) =>
                  setBooking({
                    ...booking,
                    flight: { ...booking.flight, passengers: e.target.value }
                  })
                }
              />
              <input
                type="text"
                placeholder="PNR"
                className="input border p-2 border-blue-300 focus:outline-none focus:ring-0"
                onChange={(e) =>
                  setBooking({
                    ...booking,
                    flight: { ...booking.flight, PNR: e.target.value }
                  })
                }
              />
            </div>
          </div>

          {/* FARE */}
          <div className="bg-white border border-blue-300 p-4 rounded-lg">
            <h2 className="text-[#003E3A] font-semibold mb-3">
              Fare Information <span className="text-red-600 text-base">*</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-3">
              <input
                required
                type="number"
                placeholder="Fare per Passenger"
                className="input p-2 border border-blue-300 focus:outline-none focus:ring-0"
                onChange={(e) =>
                  setBooking({
                    ...booking,
                    fare: { ...booking.fare, perPassenger: e.target.value }
                  })
                }
              />

              <input
                type="number"
                required
                value={booking.fare.totalFare}
                disabled
                className="input p-2 bg-gray-100 border border-blue-300 focus:outline-none focus:ring-0"
                placeholder="Total Fare (Auto)"
              />
            </div>
          </div>



          <button
            type="submit"
            className={`btn w-full bg-[#00A651] text-white ${loading && "loading"}`}
          >
            Save Booking
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddBooking;
