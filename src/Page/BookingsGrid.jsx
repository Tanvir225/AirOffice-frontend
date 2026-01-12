import { useEffect, useState } from "react";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { format } from "date-fns";
import PaymentPatchForm from "../Component/PaymentPatchForm";
import BookingView from "../Component/BookingView";
import { Link } from "react-router-dom";
import EditBooking from "../Component/EditBooking";
import useAxios from "../Hook/useAxios";
import Swal from 'sweetalert2'



ModuleRegistry.registerModules([AllCommunityModule]);

const BookingsGrid = () => {
    const [rowData, setRowData] = useState([]);
    const [editBooking, setEditBooking] = useState(null);
    const axios = useAxios();
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [viewBooking, setViewBooking] = useState(null);
    const [activeTab, setActiveTab] = useState("pending");

    /* ================= FETCH BOOKINGS ================= */

    const fetchBookings = async () => {
        setLoading(true);
        axios.get("/bookings").then(res => {
            setRowData(res.data);
            setLoading(false);
        }
        ).catch(err => {
            console.error("Error fetching bookings:", err);
            setLoading(false);
        });
        // const res = await axios.get("http://localhost:5000/api/bookings");
        // setRowData(res.data);
        // setLoading(false);
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    /* ================= FILTER LOGIC ================= */

    const filteredBookings = rowData.filter((b) => {
        const due = Number(b.payment?.dueAmount || 0);

        if (activeTab === "pending") return due > 0;
        if (activeTab === "confirm") return due === 0;

        return false;
    });

    const pendingCount = rowData.filter(
        (b) => Number(b.payment?.dueAmount || 0) > 0
    ).length;

    const confirmCount = rowData.filter(
        (b) => Number(b.payment?.dueAmount || 0) === 0
    ).length;

    /* ================= ACTION HANDLERS ================= */

    const handleView = (data) => setViewBooking(data);

    const handleEdit = (data) => {
        setEditBooking(data);
    };


    const handlePayment = (data) => {
        const freshBooking = rowData.find(b => b._id === data._id);
        setSelectedBooking(freshBooking);
    };


    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/bookings/${id}`);

                // 🔥 instant UI update
                setRowData(prev => prev.filter(b => b._id !== id));

                Swal.fire("Deleted!", "Booking has been deleted.", "success");
            } catch {
                Swal.fire("Error", "Failed to delete booking", "error");
            }
        }
    };

    /* ================= ACTION CELL ================= */

    const ActionRenderer = (props) => {
        const data = props.data;
        const due = Number(data.payment?.dueAmount || 0);

        return (
            <div className="flex gap-1 justify-center items-center mt-1">
                <button
                    className="btn btn-xs btn-primary"
                    onClick={() => handleView(data)}
                >
                    View
                </button>

                <button
                    className="btn btn-xs btn-secondary"
                    onClick={() => handleEdit(data)}
                >
                    Edit
                </button>


                <button
                    className="btn btn-xs btn-info"
                    disabled={due === 0}
                    onClick={() => handlePayment(data)}
                >
                    Payment
                </button>

                <button
                    className="btn btn-xs btn-error"
                    onClick={() => handleDelete(data._id)}
                >
                    Delete
                </button>
            </div>
        );
    };

    /* ================= COLUMNS ================= */

    const columnDefs = [
        { headerName: "Agency", field: "agency.name" },
        { headerName: "Phone", field: "agency.phone" },
        { headerName: "Contact", field: "agency.contactPerson" },
        { headerName: "PNR", field: "flight.PNR" },
        {
            headerName: "Route",
            valueGetter: (p) =>
                p.data.flight?.segments
                    ?.map((s) => `${s.from}-${s.to}`)
                    .join(" | "),
        },
        {
            headerName: "Dates",
            valueGetter: (p) =>
                p.data.flight?.segments
                    ?.map((s) => format(s.date, "dd MMM yy"))
                    .join(" | "),
        },
        { headerName: "PAX", field: "flight.passengers" },
        { headerName: "Capacity", field: "flight.capacity" },
        { headerName: "Total Fare", field: "fare.totalFare" },
        { headerName: "Paid", field: "payment.paidAmount" },
        { headerName: "Due", field: "payment.dueAmount" },
        {
            headerName: "Status",
            valueGetter: (p) =>
                Number(p.data.payment?.dueAmount || 0) === 0
                    ? "CONFIRM"
                    : "PENDING",
            cellStyle: (p) => ({
                fontWeight: "bold",
                color: p.value === "CONFIRM" ? "green" : "orange",
            }),
        },
        {
            headerName: "Actions",
            cellRenderer: ActionRenderer,
            width: 220,
        },
    ];

    /* ================= UI ================= */

    // LOADING STATE
    if (loading) {
        return (<div className="flex justify-center items-center h-screen">
            <span className="loading loading-infinity loading-xl text-3xl"></span>
        </div>);
    }

    return (
        <div className="p-5 h-screen overflow-y-auto">
            <h2 className="text-[#003E3A] text-xl font-semibold mb-4">
                Bookings Management | {rowData.length} Records
            </h2>

            {/* TABS */}
            <div className="flex justify-between">
                <div className="flex gap-2 mb-3">
                    <button
                        onClick={() => setActiveTab("pending")}
                        className={`btn btn-sm ${activeTab === "pending"
                            ? "btn-warning"
                            : "btn-outline"
                            }`}
                    >
                        Pending ({pendingCount})
                    </button>

                    <button
                        onClick={() => setActiveTab("confirm")}
                        className={`btn btn-sm ${activeTab === "confirm"
                            ? "btn-success"
                            : "btn-outline"
                            }`}
                    >
                        Confirm ({confirmCount})
                    </button>
                </div>
                <div>
                    <Link to={'/flynas/add-booking'} className="btn bg-[#00b7ac] text-white hover:bg-neutral btn-sm">Add Booking</Link >
                </div>
            </div>

            {/* GRID */}
            <div
                className="ag-theme-alpine w-full overflow-y-auto"
                style={{ height: "85vh" }}
            >
                <AgGridReact
                    rowData={filteredBookings}
                    columnDefs={columnDefs}
                    pagination
                    paginationPageSize={20}
                    animateRows
                    defaultColDef={{
                        sortable: true,
                        filter: true,
                        resizable: true,
                    }}
                />
            </div>

            {/* MODALS */}
            {selectedBooking && (
                <PaymentPatchForm
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                    onSuccess={fetchBookings}
                />
            )}

            {viewBooking && (
                <BookingView
                    booking={viewBooking}
                    onClose={() => setViewBooking(null)}
                />
            )}

            {editBooking && (
                <EditBooking
                    bookingData={editBooking}
                    onClose={() => setEditBooking(null)}
                    onSuccess={fetchBookings}
                />
            )}


            {loading && (
                <p className="text-center mt-3">Loading bookings...</p>
            )}
        </div>
    );
};

export default BookingsGrid;
