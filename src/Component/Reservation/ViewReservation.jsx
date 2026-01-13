const ViewHajjReservation = ({ data, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-lg rounded-xl p-5">

                <h3 className="font-semibold mb-3">
                    Hajj Reservation Details
                </h3>

                <p><strong>Agency:</strong> {data.agency?.name}</p>
                <p><strong>HL:</strong> {data.agency?.hl}</p>
                <p><strong>Tracking:</strong> {data.agency?.trackingNo}</p>
                <p><strong>Payorder:</strong> {data.agency?.payorderNo}</p>
                <p><strong>PNR:</strong> {data.agency?.pnr}</p>

                <hr className="my-2" />

                <strong>Segments:</strong>
                <ul className="list-disc pl-5">
                    {data.flight?.segments?.map((s, i) => (
                        <li key={i}>
                            {s.from} → {s.to} ({s.date}) [{s.flightNo}]
                        </li>
                    ))}
                </ul>

                <p className="mt-2">
                    <strong>Pilgrims:</strong> {data.flight?.pilgrims}
                </p>

                <p>
                    <strong>Total Fare:</strong> {data.fare?.totalFare.toLocaleString()} BDT
                </p>

                <div className="pt-4">
                    <button
                        className="btn btn-warning w-full"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ViewHajjReservation;
