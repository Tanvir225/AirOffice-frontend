import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Plane,
    CreditCard,
    Wallet,
    FileText
} from "lucide-react";

const Sidebar = () => {
    const menu = [
        { name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
        { name: "Bookings", path: "/bookings", icon: <Plane size={18} /> },
        { name: "Payments", path: "/payment", icon: <CreditCard size={18} /> },
        { name: "Topup Ledger", path: "/topup", icon: <Wallet size={18} /> },
        { name: "Flight Info", path: "/flight-info", icon: <Plane size={18} /> }

        
    ];

    return (
        <aside className="h-full bg-[#003E3A] text-white rounded-lg p-4">
            {/* LOGO / TITLE */}
            <div className="mb-6 text-center">
                <h1 className="text-lg font-bold tracking-wide">
                    Flynas Office
                </h1>
                <p className="text-xs text-gray-300">
                    Reservation System
                </p>
            </div>

            {/* MENU */}
            <nav className="space-y-2">
                {menu.map((item, i) => (
                    <NavLink
                        key={i}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-md transition
                            ${isActive
                                ? "bg-[#F4B400] text-black font-semibold"
                                : "hover:bg-[#005E56]"}`
                        }
                    >
                        {item.icon}
                        <span className="text-sm">{item.name}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
