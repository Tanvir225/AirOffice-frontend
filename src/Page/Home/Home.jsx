import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell,
    LineChart, Line
} from "recharts";
import { format } from "date-fns";
import { useEffect, useState } from "react";

const Home = () => {

    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/bookings")
            .then(res => res.json())
            .then(data => setBookings(data));
    }, []);


    /* =====================
       METRICS
    ===================== */


    const totalBookings = bookings.reduce(
        (sum, b) => sum + (b.flight?.passengers || 0), 0
    );

    const totalSegments = bookings.reduce(
        (sum, b) => sum + (b.flight?.segments?.length || 0), 0
    );

    const totalCapacityUsed = bookings.reduce(
        (sum, b) => sum + (b.flight?.passengers || 0), 0
    );

    const totalCapacity = bookings.reduce(
        (sum, b) => sum + (b.flight?.capacity || 0), 0
    );

    const capacityUsedPercent = totalCapacity
        ? ((totalCapacityUsed / totalCapacity) * 100).toFixed(1)
        : 0;

    const totalSales = bookings.reduce(
        (sum, b) => sum + (b.fare?.totalFare || 0), 0
    );

    const totalDue = bookings.reduce(
        (sum, b) => sum + (b.payment?.dueAmount || 0), 0
    );

    /* =====================
       LAST FLIGHT BOOKING
    ===================== */

    const lastBooking = bookings
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    const lastFlightPassengers = lastBooking?.flight?.passengers || 0;

    const lastFlightRoute = lastBooking?.flight?.segments
        ?.map(s => `${s.from.toUpperCase()} → ${s.to.toUpperCase()}`)
        .join(" | ");

    const lastFlightDate = lastBooking?.flight?.segments
        ?.map(s => `${s.date}`)
        .join(" | ")


    console.log(lastFlightDate);

    /* =====================
       CHART DATA
    ===================== */

    // Top Agencies by Seats
    const agencySeatData = Object.values(
        bookings.reduce((acc, b) => {
            const name = b.agency?.name;
            if (!name) return acc;
            acc[name] = acc[name] || { name, seats: 0 };
            acc[name].seats += b.flight?.passengers || 0;
            return acc;
        }, {})
    ).sort((a, b) => b.seats - a.seats).slice(0, 5);

    // Fare vs Passengers
    const farePassengerData = bookings.map(b => ({
        fare: b.fare?.totalFare,
        passengers: b.flight?.passengers
    }));

    // Sales vs Due
    const salesDueData = [
        { name: "Sales", value: totalSales - totalDue },
        { name: "Due", value: totalDue }
    ];

    // Booking Trend (NEW LINE CHART)
    const bookingTrendData = Object.values(
        bookings.reduce((acc, b) => {
            const date = format(new Date(b.createdAt), "dd MMM");
            acc[date] = acc[date] || { date, count: 0 };
            acc[date].count += 1;
            return acc;
        }, {})
    );

    return (
        <div className="h-screen overflow-y-auto p-5 space-y-6">

            {/* ===== HEADER ===== */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#003E3A]">
                    Hi there, Welcome Back!
                </h2>

                <section>
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="Tailwind CSS Navbar component"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                            </div>
                        </div>
                        <ul
                            tabIndex="-1"
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li>
                                <a className="justify-between">
                                    Profile
                                    <span className="badge">New</span>
                                </a>
                            </li>
                            <li><a>Settings</a></li>
                            <li><a>Logout</a></li>
                        </ul>
                    </div>
                </section>
            </div>

            {/* ===== METRIC CARDS ===== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Metric title="Total Bookings" value={totalBookings} />
                <Metric title="Total Flights (Segments)" value={totalSegments} />
                <Metric title="Capacity Used %" value={`${capacityUsedPercent}%`} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Metric title="Total Sales" value={totalSales.toLocaleString()} />
                <Metric title="Total Due" value={totalDue.toLocaleString()} />

                {/* ===== LAST FLIGHT BOOKING ===== */}
                <div className="bg-base-100 p-4 rounded shadow">
                    <h3 className="font-semibold mb-2">
                        Last Flight Booking
                    </h3>
                    <p className="text-sm">
                        <strong>Date:</strong> {lastFlightDate}
                    </p>
                    <p className="text-sm">
                        <strong>Route:</strong> {lastFlightRoute}
                    </p>
                    <p className="text-sm">
                        <strong>Passengers:</strong> {lastFlightPassengers}
                    </p>
                </div>
            </div>

            {/* ===== CHARTS ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Top Agencies */}
                <ChartCard title="Top Agencies by Seats">
                    <BarChart data={agencySeatData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Bar dataKey="seats" fill="#0f766e" />
                    </BarChart>
                </ChartCard>

                {/* Fare vs Passenger */}
                <ChartCard title="Fare vs Passengers">
                    <BarChart data={farePassengerData}>
                        <XAxis dataKey="fare" />
                        <YAxis />
                        <Tooltip />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Bar dataKey="passengers" fill="#2563eb" />
                    </BarChart>
                </ChartCard>

                {/* Sales vs Due (Pie) */}
                <ChartCard title="Sales vs Due">
                    <PieChart>
                        <Tooltip />
                        <Pie
                            data={salesDueData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={100}
                        >
                            <Cell fill="#22c55e" />
                            <Cell fill="#ef4444" />
                        </Pie>
                    </PieChart>
                </ChartCard>

                {/* NEW LINE CHART */}
                <ChartCard title="Booking Trend">
                    <LineChart data={bookingTrendData}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#9333ea"
                            strokeWidth={3}
                        />
                    </LineChart>
                </ChartCard>

            </div>


        </div>
    );
};

/* ===== SMALL COMPONENTS ===== */

const Metric = ({ title, value }) => (
    <div className="bg-base-100 p-4 rounded shadow">
        <p className="text-sm opacity-70">{title}</p>
        <h3 className="text-xl font-bold">{value}</h3>
    </div>
);

const ChartCard = ({ title, children }) => (
    <div className="bg-base-100 p-4 rounded shadow">
        <h3 className="font-semibold mb-2">{title}</h3>
        <ResponsiveContainer width="100%" height={300}>
            {children}
        </ResponsiveContainer>
    </div>
);

export default Home;
