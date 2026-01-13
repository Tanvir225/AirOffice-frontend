import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ViewHajjReservation from "../../Component/Reservation/ViewReservation";
import EditHajjReservation from "../../Component/Reservation/EditHajjReservation";
import useAxios from "../../Hook/useAxios";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Link } from "react-router-dom";

ModuleRegistry.registerModules([AllCommunityModule]);

const Reservation = () => {
    const axios = useAxios();

    const [rowData, setRowData] = useState([]);
    const [viewData, setViewData] = useState(null);
    const [editData, setEditData] = useState(null);

    /* =========================
       FETCH
    ========================= */
    const fetchReservations = async () => {
        const res = await axios.get("hajj/reservations");
        setRowData(res.data || []);
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    /* =========================
       DELETE
    ========================= */
    const handleDelete = (id) => {
        Swal.fire({
            title: "Delete reservation?",
            text: "This cannot be undone",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`hajj/reservations/${id}`);
                    fetchReservations();
                    Swal.fire("Deleted!", "Reservation removed", "success");
                } catch (error) {
                    Swal.fire("Error!", "Failed to delete reservation", "error");
                }
            }
        });
    };


    /* =========================
       COLUMNS
    ========================= */
    const columns = [
        { headerName: "Agency", field: "agency.name", width: 130 },
        { headerName: "HL", field: "agency.hl", width: 130 },
        { headerName: "Tracking", field: "agency.trackingNo", width: 130 },
        { headerName: "Payorder", field: "agency.payorderNo", width: 130 },
        { headerName: "PNR", field: "agency.pnr" , width: 100 },

        {
            headerName: "Segments",
            width: 180,
            valueGetter: (params) =>
                params.data.flight?.segments
                    ?.map(
                        s => `${s.from} → ${s.to} (${s.date})`
                    )
                    .join("\n"),
            cellStyle: { whiteSpace: "pre-line" }
        },

        {
            headerName: "Pilgrims",
            field: "flight.pilgrims",
            width: 110
        },

        {
            headerName: "Total Fare",
            field: "fare.totalFare",
            width: 130
        },

        {
            headerName: "Actions",
            width: 160,
            cellRenderer: (params) => (
                <div className="flex gap-1 my-2">
                    <button
                        className="btn btn-xs btn-info"
                        onClick={() => setViewData(params.data)}
                    >
                        View
                    </button>

                    <button
                        className="btn btn-xs btn-warning"
                        onClick={() => setEditData(params.data)}
                    >
                        Edit
                    </button>

                    <button
                        className="btn btn-xs btn-error"
                        onClick={() => handleDelete(params.data._id)}
                    >
                        Delete
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="p-3 h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-semibold mb-2">
                    Hajj Reservations
                </h2>
                <Link to="/flynas/add-reservation" className="btn btn-sm text-white btn-success">Add Reservation</Link>
            </div>
            {/* DATA GRID */}
            <div className="ag-theme-alpine w-full h-[90vh] text-center">
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columns}
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

            {/* VIEW MODAL */}
            {viewData && (
                <ViewHajjReservation
                    data={viewData}
                    onClose={() => setViewData(null)}
                />
            )}

            {/* EDIT MODAL */}
            {editData && (
                <EditHajjReservation
                    data={editData}
                    onClose={() => setEditData(null)}
                    onSuccess={fetchReservations}
                />
            )}
        </div>
    );
};

export default Reservation;
