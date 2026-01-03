import { useEffect, useMemo, useState } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
ModuleRegistry.registerModules([AllCommunityModule]);

const FlightInfo = () => {
    const [rowData, setRowData] = useState([]);
    const [search, setSearch] = useState("");

    const processFlightData = (bookings) => {
        const map = {};

        bookings.forEach(booking => {
            const passengers = Number(booking.flight.passengers);
            const capacity = Number(booking.flight.capacity);

            booking.flight.segments.forEach(segment => {
                const key = `${segment.date}-${segment.from}-${segment.to}-${segment.flightNo}`;

                if (!map[key]) {
                    map[key] = {
                        date: segment.date,
                        from: segment.from.toUpperCase(),
                        to: segment.to.toUpperCase(),
                        route: `${segment.from.toUpperCase()} → ${segment.to.toUpperCase()}`,
                        flightNo: segment.flightNo,
                        booked: 0,
                        capacity
                    };
                }

                map[key].booked += passengers;
            });
        });

        const formatted = Object.values(map).map(f => ({
            ...f,
            remaining: f.capacity - f.booked
        }));

        setRowData(formatted);
    };

    useEffect(() => {
        fetch("http://localhost:5000/api/bookings")
            .then(res => res.json())
            .then(data => processFlightData(data));
    }, []);



    const columnDefs = useMemo(() => [
        { headerName: "Date", field: "date", filter: true },
        { headerName: "From", field: "from", filter: true },
        { headerName: "To", field: "to", filter: true },
        { headerName: "Route", field: "route", filter: true },
        { headerName: "Flight No", field: "flightNo", filter: true },
        {
            headerName: "Booked",
            field: "booked",
            filter: "agNumberColumnFilter",
            cellStyle: { fontWeight: "bold", color: "#2563eb" }
        },
        {
            headerName: "Capacity",
            field: "capacity",
            filter: "agNumberColumnFilter"
        },
        {
            headerName: "Remaining",
            field: "remaining",
            filter: "agNumberColumnFilter",
            cellStyle: params => ({
                fontWeight: "bold",
                color: params.value <= 0 ? "#dc2626" : "#16a34a"
            })
        }
    ], []);

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        resizable: true,
        floatingFilter: true
    }), []);

    return (
        <div className="bg-base-100 p-5 rounded-lg shadow ">
            <h2 className="text-xl font-bold mb-4">✈️ Flight Information</h2>

            {/* Global Search */}
            <input
                type="text"
                placeholder="Search anything..."
                className="input input-bordered w-full max-w-sm mb-4"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div
                className="ag-theme-alpine text-center"
                style={{ height: "500px", width: "100%" }}
            >
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationPageSize={10}
                    quickFilterText={search}
                />
            </div>
        </div>
    );
};

export default FlightInfo;
