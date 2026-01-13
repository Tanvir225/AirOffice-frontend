import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    Legend
} from "recharts";
import useAxios from "../../Hook/useAxios";
import { useEffect, useState } from "react";

const HajjHome = () => {
    const axios = useAxios();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        axios.get("/hajj/stats").then(res => setStats(res.data));
    }, []);

    if (!stats) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-infinity loading-xl"></span>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 text-black min-h-screen">

            {/* HEADER */}
            <h2 className="text-2xl font-semibold text-[#003E3A]">
                Hajj Management Dashboard
            </h2>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Pilgrims" value={stats.pilgrims.toLocaleString()} />
                <StatCard title="Total Fare" value={stats.totalFare.toLocaleString()}  />
                <StatCard title="Reservations" value={stats.totalReservations} />
                <StatCard title="Avg Fare / Pilgrim" value={stats.avgFarePerPilgrim.toLocaleString()}  />
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* TOP AGENCIES */}
                <div className="bg-white p-4 rounded-xl border border-[#D1FAE5]">
                    <h3 className="font-semibold text-[#003E3A] mb-3">
                        Top Agencies by Pilgrims
                    </h3>

                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.topAgencies}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#00A651" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* PILGRIMS vs FARE */}
                <div className="bg-white p-4 rounded-xl border border-[#D1FAE5]">
                    <h3 className="font-semibold text-[#003E3A] mb-3">
                        Pilgrims vs Total Fare
                    </h3>

                    <ResponsiveContainer width="100%" height={300} className="">
                        <BarChart data={stats.fareVsPilgrim}>
                            <XAxis dataKey="agency" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="pilgrims" fill="#2563EB" />
                            <Bar dataKey="fare" fill="#F59E0B" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default HajjHome;

/* ===== SMALL CARD COMPONENT ===== */
const StatCard = ({ title, value }) => (
    <div className="bg-white border border-[#D1FAE5] rounded-xl p-4">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-[#003E3A]">{value}</p>
    </div>
);
