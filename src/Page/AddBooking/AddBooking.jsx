import { useState } from "react";
import axios from "axios";

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
      passengers: 1
    },
    fare: {
      perPassenger: "",
      totalFare: ""
    },
    file: {
      excelPath: ""
    }
  });

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
        segments: [
          ...booking.flight.segments,
          { date: "", from: "", to: "", flightNo: "" }
        ]
      }
    });
  };

  const removeSegment = (index) => {
    const segments = booking.flight.segments.filter((_, i) => i !== index);
    setBooking({
      ...booking,
      flight: { ...booking.flight, segments }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/bookings", booking);
      alert("Booking Added Successfully ✅");
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Failed to add booking ❌");
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#E9F7F1] rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ========== AGENCY INFO ========== */}
        <div className="card bg-white shadow-md border border-[#D1FAE5]">
          <div className="card-body">
            <h2 className="text-lg font-semibold text-[#003E3A] border-b border-[#D1FAE5] pb-2">
              Agency Information
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <input
                name="name"
                placeholder="Agency Name"
                className="input input-bordered border-[#D1FAE5] focus:border-[#00A651] focus:outline-none"
                onChange={handleAgencyChange}
                required
              />

              <input
                name="contactPerson"
                placeholder="Contact Person"
                className="input input-bordered border-[#D1FAE5] focus:border-[#00A651]"
                onChange={handleAgencyChange}
              />

              <input
                name="phone"
                placeholder="Contact Number"
                className="input input-bordered border-[#D1FAE5] focus:border-[#00A651]"
                onChange={handleAgencyChange}
              />

              <input
                name="address"
                placeholder="Address"
                className="input input-bordered border-[#D1FAE5] focus:border-[#00A651]"
                onChange={handleAgencyChange}
              />
            </div>
          </div>
        </div>

        {/* ========== FLIGHT SEGMENTS ========== */}
        <div className="card bg-white shadow-md border border-[#D1FAE5]">
          <div className="card-body">
            <h2 className="text-lg font-semibold text-[#003E3A] border-b border-[#D1FAE5] pb-2">
              Flight Segments
            </h2>

            {booking.flight.segments.map((_, index) => (
              <div
                key={index}
                className="mt-4 border border-[#D1FAE5] rounded-lg p-4"
              >
                <div className="grid md:grid-cols-4 gap-3">
                  <input
                    type="date"
                    name="date"
                    className="input input-bordered border-[#D1FAE5] focus:border-[#00A651]"
                    onChange={(e) => handleSegmentChange(index, e)}
                    required
                  />

                  <input
                    name="from"
                    placeholder="From (DAC)"
                    className="input input-bordered border-[#D1FAE5] focus:border-[#00A651]"
                    onChange={(e) => handleSegmentChange(index, e)}
                    required
                  />

                  <input
                    name="to"
                    placeholder="To (JED)"
                    className="input input-bordered border-[#D1FAE5] focus:border-[#00A651]"
                    onChange={(e) => handleSegmentChange(index, e)}
                    required
                  />

                  <input
                    name="flightNo"
                    placeholder="Flight No"
                    className="input input-bordered border-[#D1FAE5] focus:border-[#00A651]"
                    onChange={(e) => handleSegmentChange(index, e)}
                  />
                </div>

                {booking.flight.segments.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-xs mt-3 bg-[#DC2626] text-white hover:bg-red-700"
                    onClick={() => removeSegment(index)}
                  >
                    Remove Segment
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className="btn btn-sm mt-4 border border-[#00A651] text-[#00A651] bg-white hover:bg-[#00A651] hover:text-white"
              onClick={addSegment}
            >
              + Add Segment
            </button>
          </div>
        </div>

        {/* ========== FARE INFO ========== */}
        <div className="card bg-white shadow-md border border-[#D1FAE5]">
          <div className="card-body">
            <h2 className="text-lg font-semibold text-[#003E3A] border-b border-[#D1FAE5] pb-2">
              Fare Information
            </h2>

            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <input
                type="number"
                placeholder="Passengers"
                className="input input-bordered border-[#D1FAE5] focus:border-[#00A651]"
                onChange={(e) =>
                  setBooking({
                    ...booking,
                    flight: {
                      ...booking.flight,
                      passengers: Number(e.target.value)
                    }
                  })
                }
              />

              <input
                type="number"
                placeholder="Fare per Passenger"
                className="input input-bordered border-[#D1FAE5] focus:border-[#00A651]"
                onChange={(e) =>
                  setBooking({
                    ...booking,
                    fare: {
                      ...booking.fare,
                      perPassenger: Number(e.target.value)
                    }
                  })
                }
              />

              <input
                type="number"
                placeholder="Total Fare"
                className="input input-bordered border-[#D1FAE5] focus:border-[#00A651]"
                onChange={(e) =>
                  setBooking({
                    ...booking,
                    fare: {
                      ...booking.fare,
                      totalFare: Number(e.target.value)
                    }
                  })
                }
              />
            </div>
          </div>
        </div>



        {/* ========== SUBMIT ========== */}
        <button
          type="submit"
          className={`btn w-full bg-[#00A651] text-white hover:bg-[#008F46] ${
            loading && "loading"
          }`}
        >
          Save Booking
        </button>

      </form>
    </div>
  );
};

export default AddBooking;
