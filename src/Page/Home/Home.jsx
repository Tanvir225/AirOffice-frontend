import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import useAxios from "../../Hook/useAxios";
import { format } from "date-fns";
import useAuth from "../../Hook/useAuth";
import toast from "react-hot-toast";

const COLORS = ["#0f766e", "#2563eb", "#9333ea", "#f59e0b", "#ef4444"];

const Home = () => {

    const axios = useAxios();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, logoutUser } = useAuth()
    const [profile,setProfile]=useState()
    console.log(user);
    /* ================= FETCH BOOKINGS ================= */

    useEffect(() => {
        axios.get("/bookings")
            .then(res => {
                setBookings(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });

     
    }, [axios]);

    // profile fetch
    useEffect(() => {
        if (user?.email) {
            axios.get(`/users/${user.email}`)
                .then(res => {
                    setProfile(res.data);
                })
                .catch(err => {
                    console.error("Error fetching profile:", err);
                });     
        }
    }, [user, axios,setProfile]);


    /* ================= KPIs ================= */
    const {
        totalBookings,
        totalSegments,
        totalPassengers,
        totalCapacity,
        totalSales,
        totalDue,
       
    } = useMemo(() => {

        let segments = 0;
        let passengers = 0;
        let capacity = 0;
        let sales = 0;
        let due = 0;

        const countedFlights = new Set();

        bookings.forEach(b => {
            segments += b.flight?.segments?.length || 0;
            passengers += Number(b.flight?.passengers || 0);
            sales += Number(b.fare?.totalFare || 0);
            due += Number(b.payment?.dueAmount || 0);

            // ✅ UNIQUE FLIGHT KEY = FIRST SEGMENT DATE
            const firstSegment = b.flight?.segments?.[0];
            const flightKey = firstSegment
                ? `${firstSegment.date}-${firstSegment.from}-${firstSegment.to}`
                : null;

            if (flightKey && !countedFlights.has(flightKey)) {
                capacity += Number(b.flight?.capacity || 0);
                countedFlights.add(flightKey);
            }
        });


       
        return {
            totalBookings: bookings.length,
            totalSegments: segments,
            totalPassengers: passengers,
            totalCapacity: capacity,
            totalSales: sales,
            totalDue: due,
           
        };

    }, [bookings]);




    /* =====================
   
    LOGOUT HANDLER
    ===================== */
    // logout user 
    const handleLogout = () => {
        logoutUser()
        toast.success("Logged out successfully")
    }

    /* ================= BAR CHART 1: AGENCY vs SEATS ================= */

    const agencySeats = useMemo(() => {
        const map = {};

        bookings.forEach(b => {
            const agency = b.agency?.name;
            const pax = Number(b.flight?.passengers || 0);
            if (!agency) return;
            map[agency] = (map[agency] || 0) + pax;
        });

        return Object.entries(map)
            .map(([name, seats]) => ({ name, seats }))
            .sort((a, b) => b.seats - a.seats)
            .slice(0, 10);
    }, [bookings]);

    /* ================= BAR CHART 2: FARE vs PASSENGERS ================= */

    const farePassengers = useMemo(() => {
        const map = {};

        bookings.forEach(b => {
            const fare = b.fare?.perPassenger;
            const pax = Number(b.flight?.passengers || 0);
            if (!fare) return;
            map[fare] = (map[fare] || 0) + pax;
        });

        return Object.entries(map)
            .map(([fare, passengers]) => ({
                fare: `৳${fare}`,
                passengers
            }))
            .sort((a, b) => b.passengers - a.passengers)
            .slice(0, 10);
    }, [bookings]);

    /* ================= PIE CHART: SALES vs DUE ================= */

    const salesDueChart = useMemo(() => ([
        { name: "Paid", value: totalSales - totalDue },
        { name: "Due", value: totalDue }
    ]), [totalSales, totalDue]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    const bookingCountByDate = Object.values(
        bookings.reduce((acc, b) => {
            const date = b.flight?.segments?.[0]?.date;
            if (!date) return acc;

            acc[date] = acc[date] || { date, count: 0 };
            acc[date].count += 1;
            return acc;
        }, {})
    );

    console.log(profile);

    return (
        <div className="h-screen overflow-y-auto p-5 space-y-6">

            {/* ================= TITLE ================= */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-mono font-bold text-[#003E3A]">
                    Welcome {profile?.name || "User"} <br /><span className="text-base">Flynas Airoffice</span>
                </h2>

                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt={`${profile?.name || "User"}'s Avatar`}
                                src={`${profile?.photo_url}`} />
                        </div>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-5 shadow">
                        <li>
                            <a className="justify-between text-[#00b7ac]  font-semibold">
                                {profile?.name || "User"}
                               
                            </a>
                        </li>

                        <li><a className="" onClick={handleLogout}>Logout</a></li>
                    </ul>

                </div>
            </div>
            {/* ================= KPI CARDS ================= */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="stat bg-base-100 rounded shadow">
                    <div className="stat-title">Total Capacity</div>
                    <div className="stat-value">{totalCapacity}</div>
                </div>

                <div className="stat bg-base-100 rounded shadow">
                    <div className="stat-title">Total Passengers</div>
                    <div className="stat-value">{totalPassengers}</div>
                </div>

                  <div className="stat bg-base-100 rounded shadow">
                    <div className="stat-title">Capacity Used</div>
                    <div className="stat-value">
                        {totalCapacity
                            ? ((totalPassengers / totalCapacity) * 100).toFixed(1)
                            : 0}%
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">

                <div className="stat bg-base-100 rounded shadow">
                    <div className="stat-title">Bookings</div>
                    <div className="stat-value">{totalBookings}</div>
                </div>

                <div className="stat bg-base-100 rounded shadow">
                    <div className="stat-title">Flight Segments</div>
                    <div className="stat-value">{totalSegments}</div>
                </div>

              

                <div className="stat bg-base-100 rounded shadow">
                    <div className="stat-title">Total Sales</div>
                    <div className="stat-value">৳{totalSales.toLocaleString()}</div>
                </div>

                <div className="stat bg-base-100 rounded shadow">
                    <div className="stat-title">Total Due</div>
                    <div className="stat-value text-error">
                        ৳{totalDue.toLocaleString()}
                    </div>
                </div>

               

            </div>

            {/* ================= CHART SECTION ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* BAR 1 */}
                <div className="bg-base-100 p-4 rounded shadow">
                    <h3 className="font-semibold mb-3">Top Agencies by Seats</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={agencySeats}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Bar dataKey="seats" fill="#0f766e" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* BAR 2 */}
                <div className="bg-base-100 p-4 rounded shadow">
                    <h3 className="font-semibold mb-3">
                        Top Fares by Passenger Count
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={farePassengers}>
                            <XAxis dataKey="fare" />
                            <YAxis />
                            <Tooltip />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Bar dataKey="passengers" fill="#2563eb" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* PIE */}
                <div className="bg-base-100 p-4 rounded shadow">
                    <h3 className="font-semibold mb-3">Sales vs Due</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={salesDueChart}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={100}
                                label
                            >
                                {salesDueChart.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>


                <div>
                    <ResponsiveContainer width="100%" >
                        <BarChart data={bookingCountByDate}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Bar dataKey="count" fill="#9333ea" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>




            </div>
        </div>
    );
};

export default Home;
