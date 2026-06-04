import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ViewHajjReservation from "../../Component/Reservation/ViewReservation";
import EditHajjReservation from "../../Component/Reservation/EditHajjReservation";
import useAxios from "../../Hook/useAxios";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import ErrorPage from "../../Component/Share/ErrorPage";

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



    // handle print
    const handlePrint = () => {
        const printWindow = window.open("", "_blank");

        const tableRows = rowData
            .map((item, index) => {
                const segments = item.flight?.segments
                    ?.map(
                        (s) =>
                            `${s.from}-${s.to} (${s.date})`
                    )
                    .join("<br>");

                return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.agency?.name || ""}</td>
                    <td>${item.agency?.hl || ""}</td>
                    <td>${item.agency?.pnr || ""}</td>
                    <td>${item.agency?.trackingNo || ""}</td>
                    <td>${segments}</td>
                    <td>${item.flight?.pilgrims || 0}</td>
                    <td>${item.fare?.totalFare || 0}</td>
                    <td>${item.callerName || ""}</td>
                </tr>
            `;
            })
            .join("");

        printWindow.document.write(`
        <html>
        <head>
            <title>Reservation Report</title>

            <style>
                @page {
                    size: A4 landscape;
                    margin: 10mm;
                }

                body {
                    font-family: Arial, sans-serif;
                    padding: 10px;
                }

                h2 {
                    text-align: center;
                    margin-bottom: 5px;
                }

                .info {
                    margin-bottom: 15px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 12px;
                }

                th,
                td {
                    border: 1px solid #000;
                    padding: 6px;
                    text-align: center;
                }

                th {
                    background: #f0f0f0;
                }
            </style>
        </head>

        <body>
            <h2>HAJJ RESERVATION REPORT</h2>

            <div class="info">
                <strong>Total Reservation:</strong> ${rowData.length}
                <br/>
                <strong>Print Date:</strong> ${new Date().toLocaleString()}
            </div>

            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Agency</th>
                        <th>HL</th>
                        <th>PNR</th>
                        <th>Tracking</th>
                        <th>Flight Route</th>
                        <th>Pilgrims</th>
                        <th>Total Fare</th>
                        <th>Caller</th>
                    </tr>
                </thead>

                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </body>
        </html>
    `);

        printWindow.document.close();

        setTimeout(() => {
            printWindow.print();
        }, 500);
    };


    /* =========================
       COLUMNS
    ========================= */
    const columns = [
        { headerName: "Agency", field: "agency.name", width: 160 },
        { headerName: "HL", field: "agency.hl", width: 130 },
        { headerName: "Tracking", field: "agency.trackingNo", width: 160 },
        { headerName: "Payorder", field: "agency.payorderNo", width: 160 },
        { headerName: "PNR", field: "agency.pnr", width: 130 },

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
            width: 110,
            valueFormatter: (params) => {
                const num = Number(params.value);
                return isNaN(num) ? "" : num;
            }
        },


        {
            headerName: "Total Fare",
            field: "fare.totalFare",
            width: 130
        },
        {
            headerName: "Caller",
            field: "callerName",
        },
        {
            headerName: "creation_date",
            cellDataType: 'text',
            field: "createdAt",
            valueFormatter: (params) => {
                const formatedDate = format(params.value, 'dd-MMMM-yy hh:mm a');
                return (formatedDate)
            },
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
                    Hajj Reservations | {rowData?.length}
                </h2>
                <div>
                    <button
                        onClick={handlePrint}
                        className="btn btn-primary btn-sm mr-2"
                    >
                        Print
                    </button>
                    <Link to="/flynas/add-reservation" className="btn btn-sm text-white btn-success">Add Reservation</Link>
                </div>
            </div>
            {/* DATA GRID */}
            <div className="ag-theme-alpine w-full h-[90vh] text-center ">
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
                        floatingFilter: true
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
        // <div>
        //     <ErrorPage></ErrorPage>
        // </div>
    );
};

export default Reservation;
