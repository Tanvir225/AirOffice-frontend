import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Plane,
    CreditCard,
    Wallet,
    HamburgerIcon
} from "lucide-react";

const Sidebar = () => {
    const menu = [
        { name: "Dashboard", path: "/flynas/home", icon: <LayoutDashboard size={18} /> },
        { name: "Bookings", path: "/flynas/bookings", icon: <Plane size={18} /> },
        { name: "Payments", path: "/flynas/payment", icon: <CreditCard size={18} /> },
        { name: "Topup Ledger", path: "/flynas/topup", icon: <Wallet size={18} /> },
        { name: "Flight Info", path: "/flynas/flight-info", icon: <Plane size={18} /> }

    ];

    return (
        <aside className="h-screen bg-[#003E3A] text-white rounded-lg p-4">
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

                <div className="dropdown w-full text-white">
                    <div tabIndex={0} role="" className="w-full btn btn-sm">Hajj Portal</div>
                    <ul tabIndex="-1" className="dropdown-content space-y-2 py-5 menu w-full rounded-box z-1  p-2 shadow-sm">
                        <NavLink to="/flynas/hajj-home" className="hover:underline">Home</NavLink>
                        <NavLink to="/flynas/hajj-reservation" className="hover:underline">Reservation</NavLink>
                        <NavLink to="/flynas/hajj-payorder" className="hover:underline">Pay Order</NavLink>
                    </ul>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
