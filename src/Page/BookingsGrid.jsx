import { useEffect, useState } from "react";
import axios from "axios";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { format } from "date-fns";
import PaymentPatchForm from "../Component/PaymentPatchForm";
import BookingView from "../Component/BookingView";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const BookingsGrid = () => {
    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [viewBooking, setViewBooking] = useState(null);

    /* ================= FETCH BOOKINGS ================= */

    const fetchBookings = async () => {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/bookings");
        setRowData(res.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    /* ================= ACTION HANDLERS ================= */

    const handleView = (data) => {
        setViewBooking(data);
    };

    const handleEdit = (data) => {
        console.log("EDIT", data);
        alert(`Edit booking ${data._id}`);
    };

    const handlePayment = (data) => {
        setSelectedBooking(data);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this booking?")) return;

        await axios.delete(`http://localhost:5000/api/bookings/${id}`);
        fetchBookings();
    };

    /* ================= ACTION CELL ================= */

    const ActionRenderer = (props) => {
        const data = props.data;

        return (
            <div className="flex gap-1 items-center justify-center my-1">
                <button
                    className="btn btn-sm btn-primary text-white p-2"
                    onClick={() => handleView(data)}
                >
                    View
                </button>

                <button
                    className="btn btn-sm btn-secondary text-white p-2"
                    onClick={() => handleEdit(data)}
                >
                    Edit
                </button>

                <button
                    className="btn btn-sm btn-info text-white p-2"
                    onClick={() => handlePayment(data)}
                >
                    Payment
                </button>

                <button
                    className="btn btn-sm btn-error text-white p-2"
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
        { headerName: "Contact Person", field: "agency.contactPerson" },
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
                    ?.map((s) => `${format(s.date, 'dd MMM yy')}`)


        },
        {
            headerName: "Passengers",
            field: "flight.passengers",

        },
        {
            headerName: "Capacity",
            field: "flight.capacity",

        },
        {
            headerName: "Total Fare",
            field: "fare.totalFare",

        },
        {
            headerName: "Paid",
            field: "payment.paidAmount",

        },
        {
            headerName: "Due",
            field: "payment.dueAmount",

        },
        {
            headerName: "Status",
            field: "payment.status",

        },
        {
            headerName: "Actions",
            cellRenderer: ActionRenderer,
            width: 250

        }
    ];

    /* ================= GRID ================= */

    return (
        <div className="p-5">
            <h2 className="text-[#003E3A] text-xl font-semibold mb-3">
                All Bookings : {rowData.length}
            </h2>

            <div
                className="ag-theme-alpine w-full"
                style={{ height: "90vh", width: "100%" }}
            >
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    pagination={true}
                    paginationPageSize={20}
                    animateRows={true}
                    defaultColDef={{
                        sortable: true,
                        filter: true,
                        resizable: true
                    }}
                    overlayLoadingTemplate={
                        '<span class="ag-overlay-loading-center">Loading...</span>'
                    }
                    loadingOverlayComponentParams={{
                        loadingMessage: "Loading bookings..."
                    }}
                />
            </div>
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


            {loading && <p className="text-center mt-3">Loading...</p>}
        </div>
    );
};

export default BookingsGrid;
